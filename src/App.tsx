import React, { useState, useRef, useEffect } from 'react';
import { VOUCHER_TEMPLATES, VoucherTemplate, VoucherItem } from './data/templates';
import { Download, Search, FileText, Plus, Trash2, FileSpreadsheet, Upload, Settings, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as pdfjs from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VoucherHeader {
  obra: string;
  prototipo: string;
  paquete: string;
  fecha: string;
  ubicacion: string;
  destajista: string;
  folio: string;
  elaboro: string;
  autorizo: string;
  concepto: string;
  fueraPresupuesto: boolean;
}

interface VoucherData {
  id: string;
  templateId: string;
  header: VoucherHeader;
  items: VoucherItem[];
}

export default function App() {
  const [vouchers, setVouchers] = useState<VoucherData[]>([
    {
      id: 'initial',
      templateId: 'cimentacion-acero',
      header: {
        obra: 'INFONAVIT BICENTENARIO',
        prototipo: 'BIC INF DIAM F',
        paquete: '25 BIC INF DIAM F',
        fecha: new Date().toLocaleDateString('es-MX'),
        ubicacion: 'MANZANA 1 LOTE 1',
        destajista: 'JUAN PEREZ',
        folio: 'F01',
        elaboro: 'ING. LUCIO HERNANDEZ',
        autorizo: 'ARQ. RESIDENTE',
        concepto: 'INFO-CIMENTACION ARMADO HABILITADO Y COLADO',
        fueraPresupuesto: false,
      },
      items: [
        { unidad: 'SACO', cantidad: 0.5, descripcion: 'CEMENTO GRIS SACO DE 50 KG' },
        { unidad: 'LT', cantidad: 8, descripcion: 'ADEBON' },
        { unidad: 'PZA', cantidad: 0.5, descripcion: 'BROCHA DE CERDA 4 (FUERA DE PPTO)' },
      ],
    }
  ]);
  
  const [customTemplates, setCustomTemplates] = useState<VoucherTemplate[]>([]);
  const [activeVoucherId, setActiveVoucherId] = useState<string>(vouchers[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [showFolioConfig, setShowFolioConfig] = useState(false);
  const [showListManager, setShowListManager] = useState(false);
  const [editingList, setEditingList] = useState<'destajistas' | 'elaboro' | 'autorizo' | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const [destajistas, setDestajistas] = useState<string[]>(() => {
    const saved = localStorage.getItem('destajistas');
    return saved ? JSON.parse(saved) : [
      "EMMANUEL ZARRAZAGA GAMAS",
      "FELIPE REYES JIMENEZ",
      "CECILIO FUENTE DE LA CRUZ",
      "FRANCISCO ZARRAZAGA CONTRERAS",
      "MARTIN GOMEZ CARRILLO",
      "MIGUEL ANGEL QUIROGA JIMENEZ",
      "ROGER ROSADO JIMENEZ",
      "BEYBI RUTH DE LA CRUZ GOMEZ",
      "JOSE EDUARDO HERNANDEZ ESCALANTE",
      "FRANCISCO JAVIER ZARRAZAGA GAMAS",
      "JUAN ENRIQUE VERA HERNANDEZ",
      "ENEVER MAY REYES",
      "ELIAZAR CRUZ CRUZ",
      "JOSE A. OVANDO RICARDEZ",
      "ELIZANDRO DE LA CRUZ MAY",
      "FRANCISCO MACIEL MAGAÑA",
      "ALBERTO CRUZ HERNANDEZ",
      "ROMEL PEREZ HERNANDEZ",
      "DANIEL MARQUEZ GIL",
      "VICTOR ALFONSO RODRIGUEZ VALDEZ",
      "LUIS ALBERTO MAY PEREZ",
      "VICTOR MANUEL CASTILLO TORRES",
      "JOSE HEBER FUENTES DE LA CRUZ"
    ];
  });

  const [elaboroList, setElaboroList] = useState<string[]>(() => {
    const saved = localStorage.getItem('elaboroList');
    return saved ? JSON.parse(saved) : [
      "ING. LUCIO HERNANDEZ DOMINGUEZ",
      "ING. ANTONY EMANUEL CALDERON CRUZ",
      "ING. ARAMANDO LOPEZ ARRAZOLA",
      "ING. ALEJANDRO HIDALGO LOPEZ"
    ];
  });

  const [autorizoList, setAutorizoList] = useState<string[]>(() => {
    const saved = localStorage.getItem('autorizoList');
    return saved ? JSON.parse(saved) : [
      "ING. ORLANDO CORDOVA GARCIA",
      "ING. DARVELIO ALVARO MAYO",
      "ING. MANUEL MORALES CADENAS",
      "ING. ALFONSO REYES HERNANDEZ REYES",
      "ARQ. JUAN ANTONIO CERINO CRUZ",
      "ING. JOSE ACOSTA RODRIGUEZ",
      "ING. JORGE ARTURO CRUZ GARCIA"
    ];
  });

  useEffect(() => {
    localStorage.setItem('destajistas', JSON.stringify(destajistas));
  }, [destajistas]);

  useEffect(() => {
    localStorage.setItem('elaboroList', JSON.stringify(elaboroList));
  }, [elaboroList]);

  useEffect(() => {
    localStorage.setItem('autorizoList', JSON.stringify(autorizoList));
  }, [autorizoList]);

  const handleAddItem = () => {
    if (!newItemName.trim() || !editingList) return;
    const upperName = newItemName.trim().toUpperCase();
    
    if (editingList === 'destajistas') {
      if (!destajistas.includes(upperName)) setDestajistas([...destajistas, upperName]);
    } else if (editingList === 'elaboro') {
      if (!elaboroList.includes(upperName)) setElaboroList([...elaboroList, upperName]);
    } else if (editingList === 'autorizo') {
      if (!autorizoList.includes(upperName)) setAutorizoList([...autorizoList, upperName]);
    }
    setNewItemName('');
  };

  const handleRemoveItem = (index: number) => {
    if (!editingList) return;
    if (editingList === 'destajistas') {
      setDestajistas(destajistas.filter((_, i) => i !== index));
    } else if (editingList === 'elaboro') {
      setElaboroList(elaboroList.filter((_, i) => i !== index));
    } else if (editingList === 'autorizo') {
      setAutorizoList(autorizoList.filter((_, i) => i !== index));
    }
  };
  const [folioCounters, setFolioCounters] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('folioCounters');
    return saved ? JSON.parse(saved) : {
      'F': 1, 'H': 1, 'I': 1, 'P': 1, 'O': 1, 'G': 1, 'K': 1, 'Q': 1, 'J': 1
    };
  });

  useEffect(() => {
    localStorage.setItem('folioCounters', JSON.stringify(folioCounters));
  }, [folioCounters]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);
  const conceptRef = useRef<HTMLTextAreaElement>(null);

  const PACKAGES = [
    "25 BIC INF DIAM F",
    "25 BIC INF DIAM H",
    "25 BIC INF DIAM I",
    "26 BIC INF DIAM P",
    "25 BIC INF DIAM O",
    "25 BIC INF DIAM G",
    "25 BIC INF DIAM K",
    "26 BIC INF DIAM Q",
    "26 BIC INF DIAM J"
  ];

  const isGeneratingPDF = pdfProgress !== null;

  const activeVoucher = vouchers.find(v => v.id === activeVoucherId) || vouchers[0];
  const voucherRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (conceptRef.current) {
      conceptRef.current.style.height = 'auto';
      conceptRef.current.style.height = conceptRef.current.scrollHeight + 'px';
    }
  }, [activeVoucher.header.concepto]);

  const generateFolio = (paquete: string) => {
    const lastChar = paquete.trim().slice(-1).toUpperCase();
    const counter = folioCounters[lastChar] || 1;
    const folio = `${lastChar}${counter.toString().padStart(2, '0')}`;
    
    // Update counter for next time
    setFolioCounters(prev => ({
      ...prev,
      [lastChar]: counter + 1
    }));
    
    return folio;
  };

  const handleAddVoucher = (template?: VoucherTemplate) => {
    const newId = crypto.randomUUID();
    const targetTemplate = template || allTemplates[0];
    
    let initialFolio = '';
    let initialPrototipo = activeVoucher.header.prototipo;
    
    if (targetTemplate.subConcepto && targetTemplate.subConcepto !== 'NUEVO VALE EDITABLE') {
      const letter = targetTemplate.subConcepto.trim().slice(-1).toUpperCase();
      initialPrototipo = `BIC INF DIAM ${letter}`;
      
      if (targetTemplate.subConcepto.includes('BIC INF DIAM')) {
        initialFolio = generateFolio(targetTemplate.subConcepto);
      }
    }

    const newVoucher: VoucherData = {
      id: newId,
      templateId: targetTemplate.id,
      header: { 
        ...activeVoucher.header, 
        obra: 'INFONAVIT BICENTENARIO',
        prototipo: initialPrototipo,
        folio: initialFolio,
        paquete: targetTemplate.id === 'empty' ? '' : targetTemplate.subConcepto,
        concepto: targetTemplate.id === 'empty' ? '' : targetTemplate.concepto,
        fueraPresupuesto: false
      },
      items: [...targetTemplate.items],
    };
    setVouchers([...vouchers, newVoucher]);
    setActiveVoucherId(newId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as any[];

      if (data.length > 0) {
        const newVouchers: VoucherData[] = [];
        // Group by Folio or some unique ID if possible, or just create one per row if it's a list of items
        // For this app, let's assume each row is a voucher or we group them
        
        const grouped = data.reduce((acc, row) => {
          const key = row.Folio || row.folio || 'S/F';
          if (!acc[key]) acc[key] = [];
          acc[key].push(row);
          return acc;
        }, {} as Record<string, any[]>);

        Object.keys(grouped).forEach(folio => {
          const rows = grouped[folio];
          const first = rows[0];
          newVouchers.push({
            id: crypto.randomUUID(),
            templateId: allTemplates[0].id,
            header: {
              obra: first.Obra || first.obra || '',
              prototipo: first.Prototipo || first.prototipo || '',
              paquete: first.Paquete || first.paquete || '',
              fecha: first.Fecha || first.fecha || new Date().toLocaleDateString('es-MX'),
              ubicacion: first.Ubicacion || first.ubicacion || '',
              destajista: first.Destajista || first.destajista || '',
              folio: folio === 'S/F' ? '' : folio,
              elaboro: first.Elaboro || first.elaboro || '',
              autorizo: first.Autorizo || first.autorizo || '',
              concepto: first.Concepto || first.concepto || '',
              fueraPresupuesto: false,
            },
            items: rows.map(r => ({
              unidad: r.Unidad || r.unidad || '',
              cantidad: r.Cantidad || r.cantidad || 0,
              descripcion: r.Descripcion || r.descripcion || '',
            }))
          });
        });

        setVouchers(newVouchers);
        setActiveVoucherId(newVouchers[0].id);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleRemoveVoucher = (id: string) => {
    if (vouchers.length === 1) return;
    const newVouchers = vouchers.filter(v => v.id !== id);
    setVouchers(newVouchers);
    if (activeVoucherId === id) {
      setActiveVoucherId(newVouchers[0].id);
    }
  };

  const updateActiveVoucher = (updates: Partial<VoucherData>) => {
    setVouchers(vouchers.map(v => v.id === activeVoucherId ? { ...v, ...updates } : v));
  };

  const updateItem = (index: number, field: keyof VoucherItem, value: string | number) => {
    const newItems = [...activeVoucher.items];
    newItems[index] = { ...newItems[index], [field]: value } as VoucherItem;
    updateActiveVoucher({ items: newItems });
  };

  const addItem = () => {
    updateActiveVoucher({ 
      items: [...activeVoucher.items, { unidad: 'PZA', cantidad: 1, descripcion: '' }] 
    });
  };

  const removeItem = (index: number) => {
    updateActiveVoucher({ 
      items: activeVoucher.items.filter((_, i) => i !== index) 
    });
  };

  const handleTemplateChange = (templateId: string) => {
    const template = allTemplates.find(t => t.id === templateId);
    if (template) {
      updateActiveVoucher({ 
        templateId, 
        header: { ...activeVoucher.header, concepto: template.concepto },
        items: template.items 
      });
    }
  };

  const handlePdfTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const newTemplates: VoucherTemplate[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item: any) => item.str).join(' ');

        // Basic parsing logic for the user's PDF format
        // Looking for "CONCEPTO:" and then items
        const conceptoMatch = text.match(/CONCEPTO:\s*(.*?)(?=\s*OBRA:|$)/i);
        if (conceptoMatch) {
          const concepto = conceptoMatch[1].trim();
          const items: VoucherItem[] = [];
          
          // Try to find items in the text
          // Format usually: UNIDAD CANTIDAD DESCRIPCION
          // We look for patterns like "SACO 0.5 CEMENTO..."
          // Updated regex to be more flexible with units and quantities
          const itemRegex = /(SACO|LT|PZA|KG|M3|M2|ML|TON|M)\s+(\d+(?:\.\d+)?)\s+([A-Z0-9\s\-\.\(\)\/]+?)(?=\s+(?:SACO|LT|PZA|KG|M3|M2|ML|TON|M)\s+\d|$)/gi;
          let match;
          while ((match = itemRegex.exec(text)) !== null) {
            items.push({
              unidad: match[1].toUpperCase(),
              cantidad: parseFloat(match[2]),
              descripcion: match[3].trim()
            });
          }

          if (items.length > 0) {
            newTemplates.push({
              id: `pdf-import-${crypto.randomUUID()}`,
              concepto: concepto,
              subConcepto: concepto.split('-')[0].trim(),
              items: items
            });
          }
        }
      }

      if (newTemplates.length > 0) {
        setCustomTemplates(prev => [...prev, ...newTemplates]);
        alert(`Se importaron ${newTemplates.length} plantillas exitosamente.`);
      } else {
        alert('No se encontraron plantillas válidas en el PDF. Asegúrate de que el formato sea el correcto.');
      }
    } catch (error) {
      console.error('Error al procesar el PDF:', error);
      alert('Error al procesar el PDF. Asegúrate de que sea un archivo válido.');
    } finally {
      // Reset input
      event.target.value = '';
    }
  };

  const handleDownloadAllPDF = async () => {
    if (isGeneratingPDF || vouchers.length === 0) return;
    
    try {
      setPdfProgress({ current: 0, total: vouchers.length });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
      });

      for (let i = 0; i < vouchers.length; i += 2) {
        if (i > 0) {
          pdf.addPage('letter', 'portrait');
        }

        // Process first voucher (Top)
        const v1 = vouchers[i];
        const el1 = voucherRefs.current[v1.id];
        if (el1) {
          setPdfProgress({ current: i + 1, total: vouchers.length });
          const canvas1 = await html2canvas(el1, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#ffffff',
            logging: false,
            width: 816,
            height: 528,
            scrollX: 0,
            scrollY: 0,
            onclone: (clonedDoc) => {
              const el = clonedDoc.getElementById(`voucher-${v1.id}`);
              if (el) {
                el.style.transform = 'none';
                el.style.scale = '1';
                el.style.position = 'relative';
                el.style.left = '0';
                el.style.top = '0';
                el.style.display = 'flex';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                el.style.width = '816px';
                el.style.height = '528px';
                
                const allDivs = el.getElementsByTagName('div');
                for (let j = 0; j < allDivs.length; j++) {
                  (allDivs[j] as HTMLElement).style.transform = 'none';
                }
              }
            }
          });
          const img1 = canvas1.toDataURL('image/png', 0.8);
          pdf.addImage(img1, 'PNG', 0, 0, 612, 396, undefined, 'FAST');
        }

        // Process second voucher (Bottom)
        if (i + 1 < vouchers.length) {
          const v2 = vouchers[i + 1];
          const el2 = voucherRefs.current[v2.id];
          if (el2) {
            setPdfProgress({ current: i + 2, total: vouchers.length });
            const canvas2 = await html2canvas(el2, { 
              scale: 2, 
              useCORS: true, 
              backgroundColor: '#ffffff',
              logging: false,
              width: 816,
              height: 528,
              scrollX: 0,
              scrollY: 0,
              onclone: (clonedDoc) => {
                const el = clonedDoc.getElementById(`voucher-${v2.id}`);
                if (el) {
                  el.style.transform = 'none';
                  el.style.scale = '1';
                  el.style.position = 'relative';
                  el.style.left = '0';
                  el.style.top = '0';
                  el.style.display = 'flex';
                  el.style.visibility = 'visible';
                  el.style.opacity = '1';
                  el.style.width = '816px';
                  el.style.height = '528px';
                  
                  const allDivs = el.getElementsByTagName('div');
                  for (let j = 0; j < allDivs.length; j++) {
                    (allDivs[j] as HTMLElement).style.transform = 'none';
                  }
                }
              }
            });
            const img2 = canvas2.toDataURL('image/png', 0.8);
            pdf.addImage(img2, 'PNG', 0, 396, 612, 396, undefined, 'FAST');
            
            pdf.setLineDashPattern([5, 5], 0);
            pdf.setDrawColor(200, 200, 200);
            pdf.line(0, 396, 612, 396);
          }
        }
      }

      pdf.save(`Vales_Salida_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar PDF. Asegúrate de que los vales estén visibles.");
    } finally {
      setPdfProgress(null);
    }
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();

    vouchers.forEach((v, idx) => {
      // Create a more structured data array for Excel
      const data = [
        ['CONSTRUVIVIENDA TECNOLOGICA S.A. DE C.V.'],
        ['HUIMANGUILLO TABASCO'],
        ['VALE DE SALIDA DE ALMACEN', '', '', '', '', 'FOLIO:', v.header.folio],
        [],
        ['OBRA:', v.header.obra, '', 'PROTOTIPO:', v.header.prototipo, '', 'CONCEPTO:', v.header.concepto],
        ['PAQUETE:', v.header.paquete, '', 'UBICACIÓN:', v.header.ubicacion],
        ['FECHA:', v.header.fecha],
        ['DESTAJISTA:', v.header.destajista],
        [],
        ['CLASIF.', 'UNIDAD', 'CANTIDAD', 'DESCRIPCION', 'P.U', 'IMPORTE'],
      ];

      v.items.forEach(item => {
        data.push(['', item.unidad, item.cantidad, item.descripcion, '', '']);
      });

      // Fill empty rows to maintain format (total 15 rows for items)
      const currentItemsCount = v.items.length;
      const targetItemsCount = 15;
      for (let i = currentItemsCount; i < targetItemsCount; i++) {
        data.push(['', '', '', '', '', '']);
      }

      if (v.header.fueraPresupuesto) {
        data.push(['', '', '', '"MATERIAL FUERA DE PRESUPUESTO"']);
      }
      data.push([]);
      data.push(['ELABORÓ:', v.header.elaboro, '', '', 'AUTORIZÓ:', v.header.autorizo]);

      const ws = XLSX.utils.aoa_to_sheet(data);
      
      // Merge cells for headers
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Title
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // Location
        { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Vale Title
      ];

      // Column widths
      ws['!cols'] = [
        { wch: 10 }, // CLASIF
        { wch: 10 }, // UNIDAD
        { wch: 12 }, // CANTIDAD
        { wch: 60 }, // DESCRIPCION
        { wch: 10 }, // P.U
        { wch: 12 }  // IMPORTE
      ];

      XLSX.utils.book_append_sheet(wb, ws, `Vale ${idx + 1}`);
    });

    XLSX.writeFile(wb, `Vales_Export_${new Date().getTime()}.xlsx`);
  };

  const handleRefreshFolios = () => {
    // Reset counters locally for this operation if needed, 
    // but usually we want to continue from current global counters
    const tempCounters = { ...folioCounters };
    
    const updatedVouchers = vouchers.map(v => {
      if (v.header.paquete && v.header.paquete.includes('BIC INF DIAM')) {
        const lastChar = v.header.paquete.trim().slice(-1).toUpperCase();
        const counter = tempCounters[lastChar] || 1;
        const newFolio = `${lastChar}${counter.toString().padStart(2, '0')}`;
        tempCounters[lastChar] = counter + 1;
        return { ...v, header: { ...v.header, folio: newFolio } };
      }
      return v;
    });
    
    setVouchers(updatedVouchers);
    setFolioCounters(tempCounters);
    alert("Folios actualizados secuencialmente por paquete.");
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate if it's a single template or an array
        const newTemplates = Array.isArray(data) ? data : [data];
        
        // Basic validation of structure
        const validTemplates = newTemplates.filter(t => t.concepto && t.subConcepto && Array.isArray(t.items));
        
        if (validTemplates.length > 0) {
          setCustomTemplates(prev => [...prev, ...validTemplates]);
          alert(`${validTemplates.length} plantillas añadidas correctamente.`);
        } else {
          alert("El archivo no contiene plantillas válidas.");
        }
      } catch (error) {
        console.error("Error parsing template file:", error);
        alert("Error al leer el archivo de plantillas. Asegúrate de que sea un JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  const allTemplates = [
    { id: 'empty', concepto: 'PLANTILLA VACÍA', subConcepto: 'NUEVO VALE EDITABLE', items: [] },
    ...VOUCHER_TEMPLATES,
    ...customTemplates
  ];

  const filteredTemplates = allTemplates.filter(t => 
    t.concepto.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subConcepto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-6 font-sans text-stone-900">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        
        {/* Folio Configuration Modal */}
        {showFolioConfig && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2 text-stone-700">
                  <Settings size={20} className="text-emerald-600" />
                  <h2 className="font-bold">Configuración de Folios</h2>
                </div>
                <button onClick={() => setShowFolioConfig(false)} className="text-stone-400 hover:text-stone-600 transition-all">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <p className="text-xs text-stone-500 mb-4">
                  Ajusta el número de inicio para cada letra de paquete. Los folios se generan como <span className="font-mono font-bold">[LETRA][NÚMERO]</span>.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(folioCounters).sort().map(([letter, count]) => (
                    <div key={letter} className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Paquete {letter}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-stone-400">{letter}</span>
                        <input 
                          type="number" 
                          value={count}
                          onChange={(e) => setFolioCounters(prev => ({ ...prev, [letter]: parseInt(e.target.value) || 1 }))}
                          className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                          min="1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end">
                <button 
                  onClick={() => setShowFolioConfig(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List Manager Modal */}
        {showListManager && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings size={24} />
                  <h2 className="text-xl font-bold">Gestión de Listas</h2>
                </div>
                <button onClick={() => { setShowListManager(false); setEditingList(null); }} className="hover:bg-white/20 p-2 rounded-full transition-all">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setEditingList('destajistas')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center space-y-2",
                      editingList === 'destajistas' ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-stone-100 hover:border-emerald-200"
                    )}
                  >
                    <div className="font-bold">Destajistas</div>
                    <div className="text-xs opacity-60">{destajistas.length} nombres</div>
                  </button>
                  <button 
                    onClick={() => setEditingList('elaboro')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center space-y-2",
                      editingList === 'elaboro' ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-stone-100 hover:border-emerald-200"
                    )}
                  >
                    <div className="font-bold">Elaboró</div>
                    <div className="text-xs opacity-60">{elaboroList.length} nombres</div>
                  </button>
                  <button 
                    onClick={() => setEditingList('autorizo')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center space-y-2",
                      editingList === 'autorizo' ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-stone-100 hover:border-emerald-200"
                    )}
                  >
                    <div className="font-bold">Autorizó</div>
                    <div className="text-xs opacity-60">{autorizoList.length} nombres</div>
                  </button>
                </div>

                {editingList && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-200">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Agregar nuevo nombre..."
                        className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                      />
                      <button 
                        onClick={handleAddItem}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                      >
                        Agregar
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingList === 'destajistas' ? destajistas : editingList === 'elaboro' ? elaboroList : autorizoList).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100 group">
                          <span className="text-sm font-medium">{item}</span>
                          <button 
                            onClick={() => handleRemoveItem(idx)}
                            className="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end">
                <button 
                  onClick={() => { setShowListManager(false); setEditingList(null); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Top Panel / Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Gestor de Vales</h1>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Construvivenda Tecnológica</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowListManager(true)}
                className="p-2 text-stone-500 hover:bg-stone-100 rounded-xl transition-all"
                title="Gestión de Listas (Destajistas, etc.)"
              >
                <FileText size={20} />
              </button>
              <button 
                onClick={() => setShowFolioConfig(true)}
                className="p-2 text-stone-500 hover:bg-stone-100 rounded-xl transition-all"
                title="Configuración de Folios"
              >
                <Settings size={20} />
              </button>
              <input 
                type="file" 
                ref={templateInputRef} 
                onChange={handleTemplateUpload} 
                className="hidden" 
                accept=".json"
              />
              <button 
                onClick={() => templateInputRef.current?.click()}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-emerald-100"
                title="Subir archivo JSON con nuevas plantillas"
              >
                <Plus size={18} />
                <span>Subir Plantillas</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".xlsx, .xls, .csv"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-600 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                <Upload size={18} />
                <span>Importar</span>
              </button>
              <button 
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-600 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                <FileSpreadsheet size={18} />
                <span>Excel</span>
              </button>
              <button 
                onClick={handleRefreshFolios}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-600 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                title="Re-asignar folios secuencialmente"
              >
                <RefreshCw size={18} />
                <span>Folios</span>
              </button>
              <button 
                onClick={handleDownloadAllPDF}
                disabled={isGeneratingPDF}
                className={cn(
                  "flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-200",
                  isGeneratingPDF && "opacity-70 cursor-not-allowed"
                )}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Procesando {pdfProgress?.current}/{pdfProgress?.total}...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Descargar PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-6 border-t border-stone-100">
            {/* Form Area */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest">Detalles del Vale</h3>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-stone-400 uppercase">Plantilla:</label>
                    <select 
                      value={activeVoucher.templateId}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      {allTemplates.map(t => (
                        <option key={t.id} value={t.id}>{t.concepto}</option>
                      ))}
                    </select>
                  </div>
                </div>
              {/* Vales Activos Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
                  <span>Vales Activos ({vouchers.length})</span>
                  <button onClick={() => handleAddVoucher()} className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg transition-colors">
                    <Plus size={14} /> Nuevo Vale
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {vouchers.map((v, idx) => (
                    <div key={v.id} className="relative group flex-shrink-0">
                      <button
                        onClick={() => setActiveVoucherId(v.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-bold transition-all border-2",
                          activeVoucherId === v.id 
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" 
                            : "bg-stone-50 border-transparent text-stone-500 hover:bg-stone-100"
                        )}
                      >
                        Vale {idx + 1} {v.header.folio ? `(#${v.header.folio})` : ''}
                      </button>
                      {vouchers.length > 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRemoveVoucher(v.id); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor Form */}
              <div className="bg-stone-50/50 rounded-2xl p-5 border border-stone-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                <h2 className="text-xs font-bold text-stone-600 uppercase tracking-widest">Datos del Vale Seleccionado</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Obra</label>
                  <input 
                    type="text" 
                    value={activeVoucher.header.obra}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, obra: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Prototipo</label>
                  <input 
                    type="text" 
                    value={activeVoucher.header.prototipo}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, prototipo: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Paquete</label>
                  <select 
                    value={activeVoucher.header.paquete}
                    onChange={e => {
                      const newPaquete = e.target.value;
                      let newFolio = activeVoucher.header.folio;
                      let newPrototipo = activeVoucher.header.prototipo;

                      if (newPaquete) {
                        const letter = newPaquete.trim().slice(-1).toUpperCase();
                        newPrototipo = `BIC INF DIAM ${letter}`;
                        
                        // Only generate new folio if current one is empty or doesn't match the package letter
                        if (newPaquete.includes('BIC INF DIAM') && (!newFolio || !newFolio.startsWith(letter))) {
                          newFolio = generateFolio(newPaquete);
                        }
                      }

                      updateActiveVoucher({ 
                        header: { 
                          ...activeVoucher.header, 
                          paquete: newPaquete,
                          folio: newFolio,
                          prototipo: newPrototipo
                        } 
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="">Seleccionar Paquete...</option>
                    {PACKAGES.map(pkg => (
                      <option key={pkg} value={pkg}>{pkg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Ubicación</label>
                  <input 
                    type="text" 
                    value={activeVoucher.header.ubicacion}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, ubicacion: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Fecha</label>
                  <input 
                    type="text" 
                    value={activeVoucher.header.fecha}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, fecha: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Folio</label>
                  <input 
                    type="text" 
                    value={activeVoucher.header.folio}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, folio: e.target.value } })}
                    placeholder="Auto-generado"
                    className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Concepto</label>
                  <textarea 
                    ref={conceptRef}
                    rows={1}
                    value={activeVoucher.header.concepto}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, concepto: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none overflow-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Destajista</label>
                  <select 
                    value={activeVoucher.header.destajista}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, destajista: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="">Seleccionar Destajista...</option>
                    {destajistas.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Elaboró</label>
                  <select 
                    value={activeVoucher.header.elaboro}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, elaboro: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="">Seleccionar Elaboró...</option>
                    {elaboroList.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Autorizó</label>
                  <select 
                    value={activeVoucher.header.autorizo}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, autorizo: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="">Seleccionar Autorizó...</option>
                    {autorizoList.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3 flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={activeVoucher.header.fueraPresupuesto}
                      onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, fueraPresupuesto: e.target.checked } })}
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-sm font-bold text-stone-600 uppercase tracking-tight">Material Fuera de Presupuesto</span>
                  </label>
                </div>

                {activeVoucher.templateId === 'empty' && (
                  <div className="md:col-span-3 lg:col-span-4 mt-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                        <h3 className="text-xs font-bold text-stone-600 uppercase tracking-widest">Partidas del Vale</h3>
                      </div>
                      <button 
                        onClick={addItem}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
                      >
                        <Plus size={14} />
                        Añadir Partida
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {activeVoucher.items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-white p-3 rounded-xl border border-stone-100 shadow-sm group transition-all hover:border-emerald-200">
                          <div className="col-span-2 space-y-1">
                            <label className="text-[8px] font-bold text-stone-400 uppercase">Unidad</label>
                            <input 
                              type="text" 
                              value={item.unidad}
                              onChange={e => updateItem(idx, 'unidad', e.target.value.toUpperCase())}
                              placeholder="PZA"
                              className="w-full px-2 py-1.5 bg-stone-50 border border-stone-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <label className="text-[8px] font-bold text-stone-400 uppercase">Cant.</label>
                            <input 
                              type="number" 
                              value={item.cantidad}
                              onChange={e => updateItem(idx, 'cantidad', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 bg-stone-50 border border-stone-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                          </div>
                          <div className="col-span-7 space-y-1">
                            <label className="text-[8px] font-bold text-stone-400 uppercase">Descripción</label>
                            <input 
                              type="text" 
                              value={item.descripcion}
                              onChange={e => updateItem(idx, 'descripcion', e.target.value.toUpperCase())}
                              placeholder="DESCRIPCIÓN DEL MATERIAL..."
                              className="w-full px-2 py-1.5 bg-stone-50 border border-stone-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                          </div>
                          <div className="col-span-1 flex justify-center pb-1">
                            <button 
                              onClick={() => removeItem(idx)}
                              className="text-stone-300 hover:text-red-500 transition-colors p-1"
                              title="Eliminar partida"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {activeVoucher.items.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                          <p className="text-stone-400 text-[10px] uppercase font-bold mb-2">No hay partidas en este vale</p>
                          <button 
                            onClick={addItem}
                            className="text-emerald-600 hover:text-emerald-700 text-[10px] font-bold uppercase underline underline-offset-4"
                          >
                            Haz clic aquí para añadir la primera
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto scrollbar-hide" id="preview-area-container">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex flex-col items-center gap-4">
              {/* We render all vouchers but only the active one is "visible" in the UI preview, 
                  however they all need to be in the DOM for html2canvas to work easily during "Download All" */}
              {vouchers.map((v) => {
                const template = allTemplates.find(t => t.id === v.templateId) || allTemplates[0];
                const isActive = v.id === activeVoucherId;
                
                return (
                  <div 
                    key={v.id}
                    id={`voucher-${v.id}`}
                    ref={el => voucherRefs.current[v.id] = el}
                    className={cn(
                      "bg-white p-5 border border-stone-300 shadow-xl text-[10px] leading-tight text-black origin-top transition-all",
                      // Half-letter horizontal: 8.5 x 5.5. 
                      // 8.5" = 816px, 5.5" = 528px
                      "w-[816px] h-[528px] flex flex-col", 
                      isActive ? "relative scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] xl:scale-[0.75] 2xl:scale-100" : "fixed -left-[9999px] top-0 opacity-100" 
                    )}
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    {/* Header */}
                    <div className="text-center border-b border-stone-300 pb-0.5 mb-1 relative">
                      <h2 className="text-sm font-bold">CONSTRUVIVIENDA TECNOLOGICA S.A. DE C.V.</h2>
                      <p className="text-[7px] uppercase tracking-widest">HUIMANGUILLO TABASCO</p>
                      <h3 className="text-[9px] font-bold mt-0.5 border-y border-stone-300 py-0.5">VALE DE SALIDA DE ALMACEN</h3>
                      <div className="absolute top-0 right-0 text-right">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[8px]">FOLIO:</span>
                          <span className="text-red-600 font-bold text-sm min-w-[40px] border-b border-stone-300">{v.header.folio}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-x-3 mb-1.5">
                      <div className="col-span-8 space-y-1">
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-16 text-[9px] pb-0.5">OBRA:</span>
                          <span className="border-b border-stone-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.obra}</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-16 text-[9px] pb-0.5">PAQUETE:</span>
                          <span className="border-b border-stone-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.paquete}</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-16 text-[9px] pb-0.5">FECHA:</span>
                          <span className="border-b border-stone-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.fecha}</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-16 text-[8px] pb-0.5">DESTAJISTA:</span>
                          <span className="border-b border-stone-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.destajista}</span>
                        </div>
                      </div>

                      <div className="col-span-4 space-y-1">
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-20 text-[9px] pb-0.5">PROTOTIPO:</span>
                          <span className="border-b border-stone-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.prototipo}</span>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-20 text-[9px] pb-0.5">UBICACIÓN:</span>
                          <span className="border-b border-stone-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.ubicacion}</span>
                        </div>
                        <div className="mt-1 border border-stone-300 p-1 h-10 flex flex-col">
                          <span className="font-bold text-[7px] uppercase text-stone-400">CONCEPTO:</span>
                          <span className="font-bold text-[8px] leading-tight flex-1 overflow-hidden">{v.header.concepto}</span>
                        </div>
                      </div>
                    </div>
                                      {/* Table */}
                    <div className="flex-1 overflow-hidden">
                      <table className="w-full border-collapse border border-stone-200 mb-1">
                        <thead>
                          <tr className="bg-stone-50">
                            <th className="border border-stone-50 px-1 py-0.5 w-12 text-[8px]">CLASIF.</th>
                            <th className="border border-stone-50 px-1 py-0.5 w-12 text-[8px]">UNIDAD</th>
                            <th className="border border-stone-50 px-1 py-0.5 w-16 text-[8px]">CANTIDAD</th>
                            <th className="border border-stone-50 px-1 py-0.5 text-left text-[8px]">DESCRIPCION</th>
                            <th className="border border-stone-50 px-1 py-0.5 w-16 text-[8px]">P.U</th>
                            <th className="border border-stone-50 px-1 py-0.5 w-20 text-[8px]">IMPORTE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {v.items.map((item, idx) => (
                            <tr key={idx} className="h-4">
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0.5 text-center text-[8px]">{item.unidad}</td>
                              <td className="border border-stone-50 px-1 py-0.5 text-center font-bold text-[9px]">{item.cantidad}</td>
                              <td className="border border-stone-50 px-1 py-0.5 uppercase text-[8px] leading-none whitespace-nowrap overflow-hidden">{item.descripcion}</td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                            </tr>
                          ))}
                          
                          {/* Special Note Row */}
                          {v.header.fueraPresupuesto && (
                            <tr className="h-4">
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0.5 text-center font-bold italic text-[8px]">"MATERIAL FUERA DE PRESUPUESTO"</td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                            </tr>
                          )}

                          {/* Empty rows to maintain height - Increased capacity */}
                          {Array.from({ length: Math.max(0, (v.header.fueraPresupuesto ? 14 : 15) - v.items.length) }).map((_, idx) => (
                            <tr key={`empty-${idx}`} className="h-4">
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                              <td className="border border-stone-50 px-1 py-0"></td>
                            </tr>
                          ))}

                          {/* Bottom Right Note in Table */}
                          <tr className="h-10">
                            <td className="border border-stone-50" colSpan={4}></td>
                            <td className="border border-stone-50" colSpan={2} align="center">
                              <div className="text-[7px] font-bold uppercase leading-tight px-1 whitespace-pre-wrap">
                                {template.subConcepto}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="grid grid-cols-2 gap-12 px-12 mt-1">
                      <div className="text-center">
                        <div className="h-6 flex items-end justify-center uppercase font-bold text-[8px] mb-0.5">{v.header.elaboro}</div>
                        <div className="border-t border-stone-300 pt-0.5 font-bold uppercase text-[7px]">ELABORÓ:</div>
                      </div>
                      <div className="text-center">
                        <div className="h-6 flex items-end justify-center uppercase font-bold text-[8px] mb-0.5">{v.header.autorizo}</div>
                        <div className="border-t border-stone-300 pt-0.5 font-bold uppercase text-[7px]">AUTORIZÓ:</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm max-w-4xl w-full">
              <h4 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Modo Media Carta Horizontal (8.5" x 5.5")
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-xs text-stone-500 space-y-2">
                  <p>
                    El diseño está optimizado para <strong>Media Carta Horizontal</strong>. Al descargar el PDF, se generará una hoja tamaño Carta (8.5" x 11") con dos vales apilados, listos para cortar.
                  </p>
                  <ul className="space-y-1 list-disc pl-4">
                    <li>Cada vale mantiene su propia información de folio y materiales.</li>
                    <li>La leyenda inferior derecha cambia automáticamente según la plantilla seleccionada.</li>
                    <li>"Descargar PDF" procesará todos los vales activos (2 por página).</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-stone-200">
                    <FileText size={24} className="text-emerald-600" />
                  </div>
                  <div className="text-[10px] text-stone-400 leading-tight">
                    <span className="font-bold text-stone-600 block mb-1">TIP DE IMPRESIÓN:</span>
                    Asegúrate de que la escala de impresión esté al 100% para mantener las dimensiones exactas de la plantilla.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
