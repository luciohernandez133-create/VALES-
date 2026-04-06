import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { google } from "googleapis";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(cors());

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Error handling middleware for JSON parsing errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
      console.error('JSON Parsing Error:', err.message);
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    if (err.type === 'entity.too.large') {
      console.error('Payload Too Large:', err.message);
      return res.status(413).json({ error: 'Payload too large' });
    }
    next(err);
  });

  // Google Sheets Auth
  // Note: User needs to provide GOOGLE_SERVICE_ACCOUNT_KEY (JSON string) 
  // and GOOGLE_SPREADSHEET_ID in their environment variables.
  const getSheetsClient = async () => {
    try {
      const keyString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      if (!keyString) {
        console.error("GOOGLE_SERVICE_ACCOUNT_KEY is missing in environment variables.");
        return null;
      }

      const key = JSON.parse(keyString);
      
      // Fix for private key newlines if they are escaped as \\n
      if (key.private_key) {
        key.private_key = key.private_key.replace(/\\n/g, "\n");
      }

      const auth = google.auth.fromJSON(key);
      if (!auth) {
        console.error("Failed to create auth client from JSON.");
        return null;
      }

      if ('scopes' in auth) {
        (auth as any).scopes = ["https://www.googleapis.com/auth/spreadsheets"];
      }

      // Explicitly authorize to catch errors early
      await (auth as any).authorize();

      return google.sheets({ version: "v4", auth: auth as any });
    } catch (error: any) {
      console.error("Error initializing Google Sheets client:", error.message);
      return null;
    }
  };

  // API Route to update budget in Google Sheets
  app.post("/api/budget/update", async (req, res) => {
    const { adjustments } = req.body; // Array of { paquete, concepto, ubicacion, material, cantidad }
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      return res.status(500).json({ error: "GOOGLE_SPREADSHEET_ID not configured" });
    }

    const sheets = await getSheetsClient();
    if (!sheets) {
      return res.status(500).json({ error: "Google Sheets client not initialized" });
    }

    try {
      // 1. Get spreadsheet metadata to find all available sheet titles
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      });
      const availableSheets = spreadsheet.data.sheets?.map(s => s.properties?.title || "") || [];
      console.log("All available sheets in spreadsheet:", availableSheets);
      
      // Filter to only include the "Presupuesto" sheet as requested by the user
      // We use a more robust check (trimming and including) to avoid issues with hidden spaces
      const relevantSheetTitles = availableSheets.filter(title => {
        const t = title.trim().toUpperCase();
        return t === "PRESUPUESTO" || t.includes("PRESUPUESTO");
      });
      
      if (relevantSheetTitles.length === 0) {
        // Fallback to any sheet if "Presupuesto" is not found, but log it
        console.error('CRITICAL: Sheet "Presupuesto" NOT found. Available sheets were:', availableSheets);
        return res.status(404).json({ 
          error: `No se encontró la hoja "Presupuesto" en el archivo. Las hojas disponibles son: ${availableSheets.join(", ")}`,
          availableSheets 
        });
      }

      console.log("Targeting sheet(s):", relevantSheetTitles);

      // 2. Fetch all relevant sheets in one batch call
      const batchResponse = await sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges: relevantSheetTitles.map(title => `'${title}'!A:Z`),
        valueRenderOption: "UNFORMATTED_VALUE",
      });

      const sheetDataMap: Record<string, any[][]> = {};
      batchResponse.data.valueRanges?.forEach((vr, index) => {
        // Use the title from our relevantSheetTitles list to ensure mapping is correct
        const title = relevantSheetTitles[index];
        sheetDataMap[title] = vr.values || [];
      });

      const normalizeText = (text: any) => {
        if (text === null || text === undefined) return "";
        return text.toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove accents
          .replace(/[^A-Z0-9]/gi, "") // Remove everything except letters and numbers
          .toUpperCase();
      };

      const fuzzyNormalize = (text: any) => {
        if (text === null || text === undefined) return "";
        return text.toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, " ") // Collapse multiple spaces to one
          .trim()
          .toUpperCase();
      };

      const getNumbers = (text: any) => {
        if (text === null || text === undefined) return [];
        return text.toString().match(/\d+/g) || [];
      };

      const locationsMatch = (loc1: string, loc2: string) => {
        const n1 = normalizeText(loc1);
        const n2 = normalizeText(loc2);
        if (n1 === n2 && n1 !== "") return true;

        const nums1 = getNumbers(loc1);
        const nums2 = getNumbers(loc2);
        if (nums1.length > 0 && nums1.length === nums2.length) {
          return nums1.every((v, i) => v === nums2[i]);
        }
        return false;
      };

      const allUpdates = [];
      const allNotFound = [];
      const adjustmentResults = [];

      // Pre-scan sheets to map locations to sheet titles
      const sheetLocationMap: Record<string, Set<string>> = {};
      console.log("Pre-scanning sheets for locations in relevant sheets:", relevantSheetTitles);

      for (const title of relevantSheetTitles) {
        const rows = sheetDataMap[title];
        if (!rows || rows.length === 0) {
          console.log(`Sheet "${title}" is empty or has no data.`);
          continue;
        }
        
        // Find Ubicación column for this sheet
        let colUbicacion = -1;
        // Search in first 50 rows for headers (some sheets have large headers)
        for (let i = 0; i < Math.min(rows.length, 50); i++) {
          const row = rows[i] || [];
          colUbicacion = row.findIndex(col => {
            if (!col) return false;
            const colStr = fuzzyNormalize(col);
            return ['Ubicación', 'Ubicacion', 'UBICACION', 'UBICACIÓN', 'Area', 'AREA', 'Área', 'ÁREA', 'Zona', 'Lugar'].some(name => {
              const normName = fuzzyNormalize(name);
              return colStr === normName || colStr.includes(normName) || normName.includes(colStr);
            });
          });
          if (colUbicacion !== -1) break;
        }
        
        if (colUbicacion !== -1) {
          const locations = new Set<string>();
          for (let i = 0; i < rows.length; i++) {
            const loc = rows[i][colUbicacion];
            if (loc) {
              locations.add(normalizeText(loc));
            }
          }
          sheetLocationMap[title] = locations;
          console.log(`Sheet "${title}" has ${locations.size} unique locations.`);
        } else {
          console.log(`Ubicación column NOT found in sheet "${title}".`);
        }
      }

      for (const adj of adjustments) {
        let found = false;
        const adjPaqueteNorm = normalizeText(adj.paquete);
        const adjConceptoNorm = normalizeText(adj.concepto);
        const adjUbicacionNorm = normalizeText(adj.ubicacion);
        const adjMaterialNorm = normalizeText(adj.material);

        console.log(`\n--- Processing Adjustment ---`);
        console.log(`Material: ${adj.material}`);
        console.log(`Ubicación: ${adj.ubicacion} (Norm: ${adjUbicacionNorm})`);
        console.log(`Paquete: ${adj.paquete} (Norm: ${adjPaqueteNorm})`);
        console.log(`Concepto: ${adj.concepto} (Norm: ${adjConceptoNorm})`);

        // Prioritize sheets based on:
        // 1. Sheet contains the exact Ubicación value in its rows
        // 2. Sheet title matches Ubicación
        // 3. Sheet title matches Paquete
        // 4. Sheet title matches Concepto
        
        const prioritizedSheets = relevantSheetTitles.filter(title => {
          const tNorm = normalizeText(title);
          const hasLocInRows = sheetLocationMap[title]?.has(adjUbicacionNorm);
          
          const isMatch = hasLocInRows || 
                 (adjUbicacionNorm && tNorm.includes(adjUbicacionNorm)) || 
                 (adjPaqueteNorm && tNorm.includes(adjPaqueteNorm)) ||
                 (adjConceptoNorm && tNorm.includes(adjConceptoNorm));
          
          return isMatch;
        });

        // Sort prioritized sheets: Ubicación matches first, then Concepto, then Paquete
        // Since there is only one sheet "Presupuesto", this sorting is mostly for robustness
        prioritizedSheets.sort((a, b) => {
          const aNorm = normalizeText(a);
          const bNorm = normalizeText(b);
          
          // 0. Exact Ubicación in rows (Top Priority)
          const aHasLoc = sheetLocationMap[a]?.has(adjUbicacionNorm);
          const bHasLoc = sheetLocationMap[b]?.has(adjUbicacionNorm);
          if (aHasLoc && !bHasLoc) return -1;
          if (!aHasLoc && bHasLoc) return 1;

          return bNorm.length - aNorm.length;
        });

        // Create the full search list: prioritized first, then all others
        const otherSheets = relevantSheetTitles.filter(t => !prioritizedSheets.includes(t));
        const sheetsToSearch = [...prioritizedSheets, ...otherSheets];
        console.log(`Sheets to search (in order): ${sheetsToSearch.join(", ")}`);

        let searchedSheetsAcrossPasses: string[] = [];
        let bestMatch: any = null;
        const findInPass = (passNum: number) => {
          for (const sheetTitle of sheetsToSearch) {
            if (!searchedSheetsAcrossPasses.includes(sheetTitle)) {
              searchedSheetsAcrossPasses.push(sheetTitle);
            }
            const rows = sheetDataMap[sheetTitle];
            if (!rows || rows.length === 0) continue;

            // Find headers for this sheet
            let hRowIdx = -1;
            let cConcepto = -1;
            let cUbicacion = -1;
            let cMaterial = -1;
            let cSalidas = -1;
            let cPaquete = -1;
            let cPpto = -1;
            let cSaldoFinal = -1;

            for (let i = 0; i < Math.min(rows.length, 30); i++) {
              const row = rows[i] || [];
              const getColIndex = (possibleNames: string[]) => {
                return row.findIndex(col => {
                  if (!col) return false;
                  const colStr = fuzzyNormalize(col);
                  return possibleNames.some(name => {
                    const normName = fuzzyNormalize(name);
                    return colStr === normName || colStr.includes(normName) || normName.includes(colStr);
                  });
                });
              };

              const cc = getColIndex(['Concepto', 'CONCEPTO', 'Partida', 'PARTIDA', 'Concepto/Partida']);
              const cu = getColIndex(['Ubicación', 'Ubicacion', 'UBICACION', 'UBICACIÓN', 'Area', 'AREA', 'Área', 'ÁREA', 'Zona', 'Lugar']);
              const cm = getColIndex(['Material', 'MATERIAL', 'Descripcion', 'Descripción', 'DESCRIPCION', 'DESCRIPCIÓN', 'Insumo', 'INSUMO', 'Articulo']);
              const cs = getColIndex(['Salidas', 'Salida', 'SALIDAS', 'SALIDA', 'Surtido', 'SURTIDO', 'Entregado', 'ENTREGADO', 'Consumo']);
              const cp = getColIndex(['Paquete', 'PAQUETE', 'Lote', 'LOTE', 'Etapa', 'ETAPA']);
              const cpp = getColIndex(['PPTO', 'PRESUPUESTO', 'CANTIDAD PPTO', 'CANT. PPTO', 'Presupuestado']);
              let cSaldo = getColIndex(['SALDO', 'Saldo', 'SALDO TOTAL', 'RESTANTE', 'Diferencia']);
              
              // User specifically mentioned column G (index 6)
              if (cSaldo === -1 && row.length > 6) {
                const colG = row[6];
                if (colG && fuzzyNormalize(colG).includes('SALDO')) {
                  cSaldo = 6;
                }
              }
              
              let foundCount = 0;
              if (cc !== -1) foundCount++;
              if (cu !== -1) foundCount++;
              if (cm !== -1) foundCount++;
              if (cs !== -1) foundCount++;
              if (cp !== -1) foundCount++;
              if (cpp !== -1) foundCount++;
              if (cSaldo !== -1) foundCount++;

              if (foundCount >= 2 && cm !== -1 && cs !== -1) {
                hRowIdx = i;
                cConcepto = cc;
                cUbicacion = cu;
                cMaterial = cm;
                cSalidas = cs;
                cPaquete = cp;
                cPpto = cpp;
                cSaldoFinal = cSaldo;
                break;
              }
            }

            if (hRowIdx === -1 || cSalidas === -1) continue;
            
            const cSaldo = cSaldoFinal;

            for (let i = hRowIdx + 1; i < rows.length; i++) {
              const row = rows[i];
              if (!row || !row[cMaterial]) continue;

              const rMaterial = normalizeText(row[cMaterial]);
              const rConcepto = cConcepto !== -1 ? normalizeText(row[cConcepto]) : "";
              const rUbicacionRaw = cUbicacion !== -1 ? String(row[cUbicacion]) : "";
              const rPaquete = cPaquete !== -1 ? normalizeText(row[cPaquete]) : "";

              let isMatch = false;
              const isLocMatch = cUbicacion !== -1 && locationsMatch(adj.ubicacion, rUbicacionRaw);
              const isConMatch = rConcepto === adjConceptoNorm;
              const isMatMatch = rMaterial === adjMaterialNorm;
              const isPaqMatch = cPaquete === -1 || rPaquete === adjPaqueteNorm;

              if (passNum === 1) {
                isMatch = isMatMatch && isLocMatch && isConMatch && isPaqMatch;
              } else if (passNum === 2) {
                isMatch = isMatMatch && isLocMatch && isConMatch;
              } else if (passNum === 3) {
                isMatch = isMatMatch && isLocMatch;
              } else if (passNum === 4) {
                isMatch = isMatMatch && isConMatch;
              } else if (passNum === 5) {
                isMatch = isMatMatch;
              }

              if (isMatch) {
                const cellValue = row[cSalidas];
                let currentSalida = 0;
                if (typeof cellValue === 'number') {
                  currentSalida = cellValue;
                } else if (cellValue) {
                  const currentSalidaStr = String(cellValue).replace(/[^0-9.-]+/g, "");
                  currentSalida = parseFloat(currentSalidaStr);
                }
                const validCurrentSalida = isNaN(currentSalida) ? 0 : currentSalida;

                // Budget check
                let ppto = Infinity;
                if (cPpto !== -1) {
                  const pptoVal = row[cPpto];
                  if (typeof pptoVal === 'number') {
                    ppto = pptoVal;
                  } else if (pptoVal) {
                    const pptoStr = String(pptoVal).replace(/[^0-9.-]+/g, "");
                    ppto = parseFloat(pptoStr);
                  }
                  if (isNaN(ppto)) ppto = Infinity;
                }

                // Saldo check (User specifically mentioned column G/Saldo)
                let currentSaldo = Infinity;
                if (cSaldo !== -1) {
                  const saldoVal = row[cSaldo];
                  if (typeof saldoVal === 'number') {
                    currentSaldo = saldoVal;
                  } else if (saldoVal) {
                    const saldoStr = String(saldoVal).replace(/[^0-9.-]+/g, "");
                    currentSaldo = parseFloat(saldoStr);
                  }
                  if (isNaN(currentSaldo)) currentSaldo = Infinity;
                }

                // If Saldo is available, use it. Otherwise fallback to PPTO - Salidas
                const available = cSaldo !== -1 && currentSaldo !== Infinity ? currentSaldo : (ppto - validCurrentSalida);
                
                // Split logic:
                // If available <= 0, everything is out of budget.
                // If available > 0, part is in budget, part might be out.
                let inBudget = 0;
                let outBudget = 0;

                if (available <= 0) {
                  inBudget = 0;
                  outBudget = adj.cantidad;
                } else if (available >= adj.cantidad) {
                  inBudget = adj.cantidad;
                  outBudget = 0;
                } else {
                  inBudget = available;
                  outBudget = adj.cantidad - available;
                }

                const newSalida = validCurrentSalida + adj.cantidad;

                return { 
                  sheetTitle, 
                  rowIndex: i, 
                  colSalidas: cSalidas, 
                  validCurrentSalida, 
                  newSalida,
                  ppto,
                  available,
                  inBudget,
                  outBudget,
                  currentSaldo: currentSaldo !== Infinity ? currentSaldo : available
                };
              }
            }
          }
          return null;
        };

        for (let p = 1; p <= 5; p++) {
          bestMatch = findInPass(p);
          if (bestMatch) break;
        }

        if (bestMatch) {
          const { sheetTitle, rowIndex, colSalidas, validCurrentSalida, newSalida } = bestMatch;
          
          const colToLetter = (col: number) => {
            let temp, letter = '';
            while (col >= 0) {
              temp = col % 26;
              letter = String.fromCharCode(temp + 65) + letter;
              col = Math.floor((col - temp) / 26) - 1;
            }
            return letter;
          };

          const salidasLetter = colToLetter(colSalidas);
          const cellRange = `'${sheetTitle}'!${salidasLetter}${rowIndex + 1}`;

          allUpdates.push({
            range: cellRange,
            values: [[newSalida]],
          });

          adjustmentResults.push({
            material: adj.material,
            paquete: adj.paquete,
            sheetUsed: sheetTitle,
            range: `${salidasLetter}${rowIndex + 1}`,
            oldValue: validCurrentSalida,
            newValue: newSalida,
            ppto: bestMatch.ppto,
            available: bestMatch.available,
            inBudget: bestMatch.inBudget,
            outBudget: bestMatch.outBudget,
            found: true
          });
          found = true;
        }

        if (!found) {
          allNotFound.push({...adj, reason: 'No se encontró el material con los criterios de Ubicación/Concepto en ninguna hoja.', searchedSheets: searchedSheetsAcrossPasses});
          adjustmentResults.push({
            material: adj.material,
            paquete: adj.paquete,
            found: false,
            searchedSheets: searchedSheetsAcrossPasses
          });
        }
      }

      if (allUpdates.length > 0) {
        console.log(`Updating spreadsheet: ${spreadsheetId} (${spreadsheet.data.properties?.title})`);
        console.log("Updates to send:", JSON.stringify(allUpdates, null, 2));

        const updateResponse = await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId,
          requestBody: {
            data: allUpdates,
            valueInputOption: "USER_ENTERED",
          },
        });

        console.log("Batch update response:", JSON.stringify(updateResponse.data, null, 2));
      }

      res.json({ 
        success: true, 
        updatedItems: allUpdates.length, 
        notFound: allNotFound,
        updatedRanges: allUpdates.map(u => u.range),
        results: adjustmentResults
      });
    } catch (error: any) {
      console.error("Error updating Google Sheet:", error.message);
      try {
        res.status(500).json({ error: error.message || "Error interno del servidor" });
      } catch (e) {
        res.status(500).send("Error interno del servidor");
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
