export interface VoucherItem {
  unidad: string;
  cantidad: number;
  descripcion: string;
}

export interface VoucherTemplate {
  id: string;
  concepto: string;
  subConcepto: string;
  items: VoucherItem[];
}

export const VOUCHER_TEMPLATES: VoucherTemplate[] = [
  {
    id: "hidraulica-pb-1",
    concepto: "INFO-INSTALACIONES MUROS PB",
    subConcepto: "INST. HIDRAULICA MURO PB",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CODO CPVC 1 X 45" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 20, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC DE 3/4 X 90" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 1 X 90 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE OREJA CPVC 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 10, descripcion: "COPLE CPVC DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "COPLE DE 3/4 CPVC" },
      { unidad: "PZA", cantidad: 6, descripcion: "REDUCCION DE 1 X 3/4 CPCV" },
      { unidad: "PZA", cantidad: 16, descripcion: "REDUCCION DE 3/4 A 1/2 CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE 1/2 CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE CPVC DE 1" },
      { unidad: "PZA", cantidad: 8, descripcion: "TEE CPVC DE 3/4" },
      { unidad: "ML", cantidad: 18.3, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3.05 MTS" },
    ]
  },
  {
    id: "hidraulica-pb-2",
    concepto: "INFO-INSTALACIONES MUROS PB",
    subConcepto: "INST. HIDRAULICA MURO PB",
    items: [
      { unidad: "ML", cantidad: 18.3, descripcion: "TUBO CPVC DE 1 PULG DE DIAM." },
      { unidad: "ML", cantidad: 24.4, descripcion: "TUBO CPVC DE 1/2 DIAM x 3.05 MTS" },
      { unidad: "PZA", cantidad: 4, descripcion: "COPLE DE 1 DE CPVC" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO CPVC 475 GR" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPON DE 1 DIAM. CPVC" },
      { unidad: "PZA", cantidad: 12, descripcion: "DISCO SEPARADOR RTP-05-175M" },
    ]
  },
  {
    id: "reparaciones-pb",
    concepto: "INFO-INSTALACIONES MUROS PB",
    subConcepto: "MATERIAL PARA REPARACIONES",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
    ]
  },
  {
    id: "electrica-pb-entrepiso",
    concepto: "INFO-INSTALACIONES MUROS PB",
    subConcepto: "INST. ELECTRICA MURO PB Y ENTREPISO",
    items: [
      { unidad: "KG", cantidad: 2, descripcion: "ALAMBRE GALVANIZADO CAL 16" },
      { unidad: "PZA", cantidad: 14, descripcion: "CAJA CGALV. 3 X 3" },
      { unidad: "PZA", cantidad: 6, descripcion: "CAJA GALV. DE 4" },
      { unidad: "PZA", cantidad: 2, descripcion: "CENTRO DE CARGA QO 8" },
      { unidad: "PZA", cantidad: 36, descripcion: "CHALUPA GALV. 2 X 4" },
      { unidad: "KG", cantidad: 0.25, descripcion: "CLAVO PARA MADERA DE 2 1/2" },
      { unidad: "PZA", cantidad: 1, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
      { unidad: "ML", cantidad: 16, descripcion: "POLIDUCTO NARANJA DE 1 DIAM." },
      { unidad: "ML", cantidad: 150, descripcion: "POLIDUCTO NARANJA DE 13MM (1/2)" },
      { unidad: "ML", cantidad: 50, descripcion: "POLIDUCTO NARANJA DE 19 MM DIAM" },
    ]
  },
  {
    id: "hilo-rafia-pb",
    concepto: "INFO-INSTALACIONES MUROS PB",
    subConcepto: "MATERIAL PARA INSTALACIONES",
    items: [
      { unidad: "PZA", cantidad: 0.34, descripcion: "ROLLO DE HILO RAFIA" },
    ]
  },
  {
    id: "sanitaria-pa-entrepiso",
    concepto: "INFO-INSTALACIONES EN MUROS PA",
    subConcepto: "INST. SANITARIA PA Y ENTREPISO",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL BOTE PVC C/TR S/BAJA 50, TUBOS FLEX." },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO DE 2 X90 PVC" },
      { unidad: "PZA", cantidad: 10, descripcion: "COPLE PVC SANIT 2 DIAM" },
      { unidad: "ML", cantidad: 1, descripcion: "LIJA ESMERIL" },
      { unidad: "ML", cantidad: 47.75, descripcion: "TUBO SANITARIO DE PVC DE 50 MM DE DIAMETRO" },
      { unidad: "PZA", cantidad: 8, descripcion: "YEE PVC SANIT 2 X 2 X 2 DIAM" },
    ]
  },
  {
    id: "hidraulica-pa-entrepiso",
    concepto: "INFO-INSTALACIONES EN MUROS PA",
    subConcepto: "INST. HIDRAULICA PA Y ENTREPISO",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE OREJA CPVC 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "COPLE DE 1 DE CPVC" },
      { unidad: "PZA", cantidad: 12, descripcion: "DISCO SEPARADOR RTP-05-175M" },
      { unidad: "PZA", cantidad: 2, descripcion: "REDUCCION DE 3/4 A 1/2 CPVC" },
    ]
  },
  {
    id: "reparaciones-pa",
    concepto: "INFO-INSTALACIONES EN MUROS PA",
    subConcepto: "MATERIAL PARA REPARACIONES",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
    ]
  },
  {
    id: "electrica-muro-pa",
    concepto: "INFO-INSTALACIONES EN MUROS PA",
    subConcepto: "INST. ELECTRICA MURO PA",
    items: [
      { unidad: "KG", cantidad: 2, descripcion: "ALAMBRE GALVANIZADO CAL 16 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 14, descripcion: "CAJA CGALV. 3 X 3" },
      { unidad: "PZA", cantidad: 8, descripcion: "CA護A GALV. DE 4" },
      { unidad: "ML", cantidad: 2, descripcion: "CENTRO DE CARGA QO 8" },
      { unidad: "PZA", cantidad: 36, descripcion: "CHALUPA GALV. 2 X 4" },
      { unidad: "KG", cantidad: 0.25, descripcion: "CLAVO PARA MADERA DE 2 1/2" },
      { unidad: "ML", cantidad: 100, descripcion: "POLIDUCTO NARANJA DE 13MM (1/2)" },
      { unidad: "ML", cantidad: 30, descripcion: "POLIDUCTO NARANJA DE 19 MM DIAM" },
    ]
  },
  {
    id: "losa-azotea-san-elec-hid",
    concepto: "INFO-INSTALACIONES EN L. AZOTEA",
    subConcepto: "LOSA DE AZOTEA SANITARIO, ELECTRICO HIDRAULICO",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "TEE CPVC DE 1" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 6, descripcion: "COPLE DE 1 DE CPVC" },
      { unidad: "PZA", cantidad: 6, descripcion: "COPLE CPVC DE 1/2" },
      { unidad: "PZA", cantidad: 4, descripcion: "COPLE 3/4 CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TAPON DE 1 DIAM. CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TAPON DE 1/2 DIAM CPVC" },
      { unidad: "ML", cantidad: 12.2, descripcion: "TUBO CPVC DE 1 PULG DE DIAM." },
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "PZA", cantidad: 10, descripcion: "CODO DE 2 X90 PVC" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO PVC SANITARIO DE 3 X 45" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE PVC 3 X 90" },
      { unidad: "PZA", cantidad: 2, descripcion: "TEE PVC 3 X 3 X 3" },
      { unidad: "PZA", cantidad: 2, descripcion: "CAJA GALV. DE 4" },
    ]
  },
  {
    id: "registros-sanitarios-b",
    concepto: "INFO-ELABORACION DE REGISTROS SANITARIOS B",
    subConcepto: "ELABORACION REGISTROS SANITARIOS",
    items: [
      { unidad: "SACO", cantidad: 4, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "PZA", cantidad: 150, descripcion: "BLOCK 10X20X40 CMS LIGERO" },
    ]
  },
  {
    id: "chalora-sanitaria-pb",
    concepto: "INFO-CHALORA SANITARIA DE VIVIENDAS PB",
    subConcepto: "INSTALACION CHAROLAS SANITARIAS",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL BOTE PVC C/TR S/BAJA 50, TUBOS FLEX." },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 2 X45 PVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 2 X90 PVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 4 X 45 PVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 4X90 CON SAL TRACERA DE 2" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO PVC SANITARIO DE 4 X 90" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO TANGIT 475 GR (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPON DE 4 DIAM. PVC SANITARIO" },
      { unidad: "ML", cantidad: 12.2, descripcion: "TUBO PVC NORMA DE 4 X 6ML" },
      { unidad: "ML", cantidad: 12, descripcion: "TUBO SANITARIO DE PVC DE 50 MM DE DIAMETRO" },
      { unidad: "PZA", cantidad: 2, descripcion: "YEE DE 4 X 2 X 4 PVC" },
    ]
  },
  {
    id: "tinaco-pb",
    concepto: "INFO-INST TINACO DE VIVIENDAS PB",
    subConcepto: "INSTALACION TINACO PLANTA BAJA",
    items: [
      { unidad: "PZA", cantidad: 6, descripcion: "CINTA TEFLON DE 3/4" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 1 X 90 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONECTOR CPVC CAFRE DE 3/4" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 6, descripcion: "COPLE CPVC DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "COPLE DE 1 DE CPVC" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO CPVC 475 GR" },
      { unidad: "PZA", cantidad: 2, descripcion: "REDUCCION DE 1 X 3/4 CPCV" },
      { unidad: "PZA", cantidad: 2, descripcion: "TINACO NEGRO CAP. 450 LTS." },
      { unidad: "ML", cantidad: 15.25, descripcion: "TUBO CPVC DE 1 PULG DE DIAM." },
      { unidad: "ML", cantidad: 27.45, descripcion: "TUBO CPVC DE 1/2 DIAM x 3.05 MTS" },
      { unidad: "ML", cantidad: 1.5, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3.05 MTS" },
      { unidad: "PZA", cantidad: 2, descripcion: "TUERCA UNION DE 1 DIAM. CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "TUERCA UNION DE 1/2 DIAM. CPVC" },
    ]
  },
  {
    id: "tinaco-pa",
    concepto: "INFO-INST TINACO DE VIVIENDAS PA",
    subConcepto: "INSTALACION TINACO PLANTA ALTA",
    items: [
      { unidad: "PZA", cantidad: 6, descripcion: "CINTA TEFLON DE 3/4" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO 1/2 X 45 CPVC" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 1 X 90 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "CONECTOR CAFRI DE 1 DIAM CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONECTOR CPVC CAFRE DE 3/4" },
      { unidad: "PZA", cantidad: 6, descripcion: "COPLE CPVC DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "COPLE DE 1 DE CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "REDUCCION DE 1 X 3/4 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "TINACO NEGRO CAP. 450 LTS." },
      { unidad: "ML", cantidad: 15.25, descripcion: "TUBO CPVC DE 1 PULG DE DIAM." },
      { unidad: "ML", cantidad: 27.45, descripcion: "TUBO CPVC DE 1/2 DIAM x 3.05 MTS" },
      { unidad: "ML", cantidad: 1.5, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3.05 MTS" },
      { unidad: "PZA", cantidad: 2, descripcion: "TUERCA UNION DE 1 DIAM. CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "TUERCA UNION DE 1/2 DIAM. CPVC" },
    ]
  },
  {
    id: "cuadro-medicion-pb",
    concepto: "INFO-CUADRO AGUA Y BAJANTE AGUAS DE VIVIENDAS PB",
    subConcepto: "CUADRO MEDICION HIDRAULICO",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "ABRAZADERA SIN FIN REFORZADA DE 3/4\"" },
      { unidad: "PZA", cantidad: 1, descripcion: "CINTA TEFLON DE 1/2" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 20, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "LLAVE NARIZ DE PLASTICO DE 1/2" },
      { unidad: "PZA", cantidad: 4, descripcion: "TAPON DE 1/2 DIAM CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE 1/2 CPVC" },
      { unidad: "ML", cantidad: 21, descripcion: "TUBO CPVC DE 1/2 DIAM x 3.05 MTS" },
      { unidad: "PZA", cantidad: 4, descripcion: "VALVULA DE COMPUERTA CPVC DE 1/2 DIAM" },
    ]
  },
  {
    id: "material-patio-hidraulico",
    concepto: "INFO-MATERIAL HIDRAULICO EN PATIO",
    subConcepto: "MATERIAL PATIO HIDRAULICO",
    items: [
      { unidad: "PZA", cantidad: 6, descripcion: "ABRAZADERA SIN FIN REFORZADA DE 3/4\"" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO 1/2 X 45 CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO PVC SANITARIO DE 3 X 45" },
      { unidad: "PZA", cantidad: 20, descripcion: "POLIDUCTO NARANJA DE 1 DIAM." },
      { unidad: "ML", cantidad: 28, descripcion: "POLIDUCTO NEGRO HID.C-80 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPON CAPA DE 3 DIAM. PVC" },
      { unidad: "ML", cantidad: 18, descripcion: "TUBO PVC 3 DIAM." },
    ]
  },
  {
    id: "clima-cimentacion",
    concepto: "INFO-MATERIAL INSTALACION CLIMA PB Y PA",
    subConcepto: "INSTALACI\u00D3N CLIMA CIMENTACION",
    items: [
      { unidad: "KG", cantidad: 0.25, descripcion: "ALAMBRE GALVANIZADO CAL 16" },
      { unidad: "PZA", cantidad: 4, descripcion: "CHALUPA GALV. 2 X 4" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO CPVC 3/4 X 45" },
      { unidad: "PZA", cantidad: 12, descripcion: "CODO CPVC 3/4 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO PVC SANITARIO DE 3 X 45" },
      { unidad: "PZA", cantidad: 4, descripcion: "COPLE CPVC DE 3/4" },
      { unidad: "PZA", cantidad: 4, descripcion: "COPLE PVC SANITARIO DE 3" },
      { unidad: "ML", cantidad: 0.5, descripcion: "LIJA ESMERIL" },
      { unidad: "ML", cantidad: 41, descripcion: "POLIDUCTO NARANJA DE 19 MM DIAM (3/4)" },
      { unidad: "PZA", cantidad: 4, descripcion: "TAPON CAPA DE 3 DIAM. PVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE CPVC DE 3/4" },
      { unidad: "ML", cantidad: 19, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3.05 MTS" },
      { unidad: "ML", cantidad: 18, descripcion: "TUBO PVC 3 DIAM." },
    ]
  },
  {
    id: "clima-muros-pb",
    concepto: "INFO-MATERIAL INSTALACION CLIMA PB Y PA",
    subConcepto: "INSTALACI\u00D3N CLIMA MUROS PB",
    items: [
      { unidad: "KG", cantidad: 0.25, descripcion: "ALAMBRE GALVANIZADO CAL 16" },
      { unidad: "PZA", cantidad: 4, descripcion: "CHALUPA GALV. 2 X 4" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO CPVC 3/4 X 45" },
      { unidad: "PZA", cantidad: 12, descripcion: "CODO CPVC 3/4 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO PVC SANITARIO DE 3 X 45" },
      { unidad: "PZA", cantidad: 4, descripcion: "COPLE CPVC DE 3/4" },
      { unidad: "PZA", cantidad: 4, descripcion: "COPLE PVC SANITARIO DE 3" },
      { unidad: "ML", cantidad: 0.5, descripcion: "LIJA ESMERIL" },
      { unidad: "ML", cantidad: 41, descripcion: "POLIDUCTO NARANJA DE 19 MM DIAM (3/4)" },
      { unidad: "PZA", cantidad: 4, descripcion: "TAPON CAPA DE 3 DIAM. PVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE CPVC DE 3/4" },
      { unidad: "ML", cantidad: 19, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3.05 MTS" },
      { unidad: "ML", cantidad: 18, descripcion: "TUBO PVC 3 DIAM." },
    ]
  },
  {
    id: "llaves-empotrar-pb",
    concepto: "INFO-LLAVE DE EMPOTRAR DE VIVIENDAS PB",
    subConcepto: "INST. LLAVES DE EMPOTRAR PB",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "PZA", cantidad: 2, descripcion: "CINTA TEFLON DE 1/2" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 8, descripcion: "CONECTOR CAFRE DE 1/2 DIAM. CPVC" },
      { unidad: "JGO", cantidad: 2, descripcion: "LLAVE DE EMPOTRAR ROSCABLE P/REGADERA" },
    ]
  },
  {
    id: "llaves-empotrar-pa",
    concepto: "INFO-LLAVE DE EMPOTRAR DE VIVIENDAS PA",
    subConcepto: "INST. LLAVES DE EMPOTRAR PA",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "PZA", cantidad: 2, descripcion: "CINTA TEFLON DE 1/2" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 8, descripcion: "CONECTOR CAFRE DE 1/2 DIAM. CPVC" },
      { unidad: "JGO", cantidad: 2, descripcion: "LLAVE DE EMPOTRAR ROSCABLE P/REGADERA" },
    ]
  },
  {
    id: "accesoriados-pb-1",
    concepto: "INFO-ACCESORIADO DE VIVIENDAS PB",
    subConcepto: "ACCESORIADOS PB",
    items: [
      { unidad: "PZA", cantidad: 14, descripcion: "APAGADOR SENCILLO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONTACTO POLARIZADO DOBLE C/TAPA" },
      { unidad: "PZA", cantidad: 18, descripcion: "CONTACTO SENCILLO POLARIZADO" },
      { unidad: "PZA", cantidad: 28, descripcion: "PLACA 1 VENTANA" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA 2 VENTANA" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA PILOTO" },
      { unidad: "PZA", cantidad: 14, descripcion: "SOCKET BAQUELITA" },
      { unidad: "PZA", cantidad: 14, descripcion: "TAPA GALV. 3 X 3" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPA GALV. 4 X 4" },
    ]
  },
  {
    id: "accesoriados-pb-2",
    concepto: "INFO-ACCESORIADO DE VIVIENDAS PB",
    subConcepto: "ACCESORIADOS PB",
    items: [
      { unidad: "PZA", cantidad: 14, descripcion: "FOCO LED BOMBILLA DE 9 WATTS" },
      { unidad: "PZA", cantidad: 2, descripcion: "PASTILLA TERMICA DE 1 X 15" },
      { unidad: "PZA", cantidad: 6, descripcion: "PASTILLA TERMICA DE 1 X 20" },
      { unidad: "PZA", cantidad: 45, descripcion: "PIJA GALVANIZADA 8 X 3/4" },
      { unidad: "PZA", cantidad: 23, descripcion: "PIJA GALVANIZADA CABEZA COMBINADA 10 X 1 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA PARA INTERPERIE PARA RECEPTACULO DUPLEX" },
      { unidad: "PZA", cantidad: 2, descripcion: "RECEPTACULO DUPLEX POLARIZADO TIPO AMERICANO" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "SELLADOR ACRILASTIC" },
      { unidad: "PZA", cantidad: 1.5, descripcion: "SILICON TRASPARENTE" },
    ]
  },
  {
    id: "amueblados-pb-1",
    concepto: "INFO-EQUIPAMIENTO DE VIVIENDAS PB",
    subConcepto: "AMUEBLADOS PB",
    items: [
      { unidad: "KG", cantidad: 8, descripcion: "CEMENTO BLANCO" },
      { unidad: "PZA", cantidad: 6, descripcion: "CINTA TEFLON DE 1/2" },
      { unidad: "PZA", cantidad: 4, descripcion: "CINTA TEFLON DE 3/4" },
      { unidad: "PZA", cantidad: 8, descripcion: "CONECTOR CAFRE DE 1/2 DIAM. CPVC" },
      { unidad: "PZA", cantidad: 6, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "LLAVE INDIVIDUAL PARA LAVABO ACABADO CROMO" },
      { unidad: "PZA", cantidad: 4, descripcion: "LLAVE NARIZ DE PLASTICO DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "LLAVE PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "MANGUERA PARA WC DE 1/2" },
      { unidad: "PAQUETE", cantidad: 2, descripcion: "MUEBLES SANITARIOS COLOR BLANCO,TAZA Y LAVABO" },
      { unidad: "PZA", cantidad: 12, descripcion: "PIJAS PARA LAVABO" },
      { unidad: "PZA", cantidad: 2, descripcion: "REGADERA DE PLASTIO CROM. C / BRAZO Y CHAPETON" },
      { unidad: "PZA", cantidad: 15, descripcion: "TAQUETES DE PLASTICO DE 1/4 (FUERA DE PPTO 3 PZA)" },
    ]
  },
  {
    id: "amueblados-pb-2",
    concepto: "INFO-EQUIPAMIENTO DE VIVIENDAS PB",
    subConcepto: "AMUEBLADOS PB",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "ADAPTADOR DE HULE PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "ADAPTADOR DE HULE PARA LAVABO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL PARA LAVABO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONTRACANASTA PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONTRACANASTA PARA LAVABO" },
      { unidad: "PZA", cantidad: 1, descripcion: "FREGADERO DE ACERO INOX. DERECHO" },
      { unidad: "PZA", cantidad: 1, descripcion: "FREGADERO DE ACERO INOX. IZQUIERDO" },
      { unidad: "PZA", cantidad: 2, descripcion: "JUNTA PROEL" },
      { unidad: "PZA", cantidad: 6, descripcion: "LLAVE ANGULAR" },
      { unidad: "PZA", cantidad: 2, descripcion: "MANGUERA PARA FREGADERO DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "MANGUERA PARA LAVABO DE 1/2" },
      { unidad: "PZA", cantidad: 4, descripcion: "CUBRETALADRO DE ACERO INOXIDABLE" },
    ]
  },
  {
    id: "accesoriados-pa-1",
    concepto: "INFO-ACCESORIADO DE VIVIENDAS PA",
    subConcepto: "ACCESORIADOS PA",
    items: [
      { unidad: "PZA", cantidad: 14, descripcion: "APAGADOR SENCILLO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONTACTO POLARIZADO DOBLE C/TAPA" },
      { unidad: "PZA", cantidad: 18, descripcion: "CONTACTO SENCILLO POLARIZADO" },
      { unidad: "PZA", cantidad: 28, descripcion: "PLACA 1 VENTANA" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA 2 VENTANA" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA PILOTO" },
      { unidad: "PZA", cantidad: 14, descripcion: "SOCKET BAQUELITA" },
      { unidad: "PZA", cantidad: 14, descripcion: "TAPA GALV. 3 X 3" },
      { unidad: "PZA", cantidad: 4, descripcion: "TAPA GALV. 4 X 4" },
    ]
  },
  {
    id: "accesoriados-pa-2",
    concepto: "INFO-ACCESORIADO DE VIVIENDAS PA",
    subConcepto: "ACCESORIADOS PA",
    items: [
      { unidad: "PZA", cantidad: 14, descripcion: "FOCO LED BOMBILLA DE 9 WATTS" },
      { unidad: "PZA", cantidad: 2, descripcion: "PASTILLA TERMICA DE 1 X 15" },
      { unidad: "PZA", cantidad: 6, descripcion: "PASTILLA TERMICA DE 1 X 20" },
      { unidad: "PZA", cantidad: 45, descripcion: "PIJA GALVANIZADA 8 X 3/4" },
      { unidad: "PZA", cantidad: 23, descripcion: "PIJA GALVANIZADA CABEZA COMBINADA 10 X 1 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA PARA INTERPERIE PARA RECEPTACULO DUPLEX" },
      { unidad: "PZA", cantidad: 2, descripcion: "RECEPTACULO DUPLEX POLARIZADO TIPO AMERICANO" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "SELLADOR ACRILASTIC" },
      { unidad: "PZA", cantidad: 1.5, descripcion: "SILICON TRASPARENTE" },
    ]
  },
  {
    id: "amueblados-pa-1",
    concepto: "INFO-EQUIPAMIENTO DE VIVIENDAS PA",
    subConcepto: "AMUEBLADOS PA",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "ADAPTADOR DE HULE PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "ADAPTADOR DE HULE PARA LAVABO" },
      { unidad: "KG", cantidad: 8, descripcion: "CEMENTO BLANCO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL PARA LAVABO" },
      { unidad: "PZA", cantidad: 6, descripcion: "CINTA TEFLON DE 1/2" },
      { unidad: "PZA", cantidad: 4, descripcion: "CINTA TEFLON DE 3/4" },
      { unidad: "PZA", cantidad: 8, descripcion: "CONECTOR CAFRE DE 1/2 DIAM. CPVC" },
      { unidad: "PZA", cantidad: 6, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONTRACANASTA PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONTRACANASTA PARA LAVABO" },
      { unidad: "PZA", cantidad: 1, descripcion: "FREGADERO DE ACERO INOX. DERECHO" },
      { unidad: "PZA", cantidad: 1, descripcion: "FREGADERO DE ACERO INOX. IZQUIERDO" },
    ]
  },
  {
    id: "amueblados-pa-2",
    concepto: "INFO-EQUIPAMIENTO DE VIVIENDAS PA",
    subConcepto: "AMUEBLADOS PA",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "JUNTA PROEL" },
      { unidad: "PZA", cantidad: 6, descripcion: "LLAVE ANGULAR" },
      { unidad: "PZA", cantidad: 2, descripcion: "LLAVE INDIVIDUAL PARA LAVABO ACABADO CROMO" },
      { unidad: "PZA", cantidad: 4, descripcion: "LLAVE NARIZ DE PLASTICO DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "LLAVE PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "MANGUERA PARA FREGADERO DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "MANGUERA PARA LAVABO DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "MANGUERA PARA WC DE 1/2" },
      { unidad: "PAQUETE", cantidad: 2, descripcion: "MUEBLES SANITARIOS COLOR BLANCO,TAZA Y LAVABO" },
      { unidad: "PZA", cantidad: 12, descripcion: "PIJAS PARA LAVABO" },
      { unidad: "PZA", cantidad: 2, descripcion: "REGADERA DE PLASTIO CROM. C / BRAZO Y CHAPETON" },
      { unidad: "PZA", cantidad: 15, descripcion: "TAQUETES DE PLASTICO DE 1/4 (FUERA DE PPTO 3 PZA)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CUBRETALADRO DE ACERO INOXIDABLE" },
    ]
  },
  {
    id: "cableado-pb",
    concepto: "INFO-CABLEADO EN VIVIENDAS PB",
    subConcepto: "CABLEADO PLANTA BAJA",
    items: [
      { unidad: "ML", cantidad: 172, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12 (COLOR NEGRO)" },
      { unidad: "ML", cantidad: 115, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12 (COLOR VERDE)" },
      { unidad: "ML", cantidad: 159, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12 (COLOR BLANCO)" },
      { unidad: "ML", cantidad: 90, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 14 (COLOR BLANCO)" },
      { unidad: "ML", cantidad: 100, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 14 (COLOR NEGRO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CINTA DE AISLAR" },
    ]
  },
  {
    id: "cableado-pa",
    concepto: "INFO-CABLEADO EN VIVIENDAS PA",
    subConcepto: "CABLEADO PLANTA ALTA",
    items: [
      { unidad: "ML", cantidad: 172, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12 (COLOR NEGRO)" },
      { unidad: "ML", cantidad: 115, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12 (COLOR VERDE)" },
      { unidad: "ML", cantidad: 159, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12 (COLOR BLANCO)" },
      { unidad: "ML", cantidad: 90, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 14 (COLOR BLANCO)" },
      { unidad: "ML", cantidad: 100, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 14 (COLOR NEGRO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CINTA DE AISLAR" },
    ]
  },
  {
    id: "muretes-pb",
    concepto: "INFO-CABLEADO DE MURETES DE PB",
    subConcepto: "MURETES CABLEADO PLANTA BAJA",
    items: [
      { unidad: "ML", cantidad: 67, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 8 (COLOR NEGRO)" },
      { unidad: "ML", cantidad: 34, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 10 (COLOR VERDE)" },
    ]
  },
  {
    id: "muretes-pa",
    concepto: "INFO-CABLEADO DE MURETES DE PA",
    subConcepto: "MURETES CABLEADO PLANTA ALTA",
    items: [
      { unidad: "ML", cantidad: 67, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 8 (COLOR BLANCO)" },
      { unidad: "ML", cantidad: 34, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 10 (COLOR VERDE)" },
    ]
  },
  {
    id: "colocacion-muretes-1",
    concepto: "INFO-COLOCACION DE MURETES",
    subConcepto: "MURETES MATERIAL ELECTRICO 1 LOTE",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "VARILLA COPPERWELD DE 5/8 DIAM. X 1.50 M" },
      { unidad: "PZA", cantidad: 4, descripcion: "QUINTA TERMINAL REFORZADA" },
      { unidad: "PZA", cantidad: 4, descripcion: "INTERRUPTOR TERMOMAGNETICO 2X30 AMP." },
      { unidad: "PZA", cantidad: 4, descripcion: "CONECTOR MECANICO PARA VARILLA COPPERWELD DE 5/8 DIAM." },
    ]
  },
  {
    id: "colocacion-muretes-2",
    concepto: "INFO-COLOCACION DE MURETES",
    subConcepto: "MURETES",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "MURETE DE CONCRETO PARA MEDICION DE DOS SERVICIOS" },
    ]
  },
  {
    id: "emboquillado-pb",
    concepto: "INFO-EMBOQUILLADO EN MUROS PB",
    subConcepto: "BOQUILLAS MURO PLANTA BAJA",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.08, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE .40X.20 M)" },
    ]
  },
  {
    id: "emboquillado-pa",
    concepto: "INFO-EMBOQUILLADO EN MUROS PA",
    subConcepto: "BOQUILLAS MURO PLANTA ALTA",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.08, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE .40X.20 M)" },
    ]
  },
  {
    id: "enmasillado-pb-1",
    concepto: "INFO-ENMASILLADO EN MURO INTERIOR PB 01",
    subConcepto: "MASILLA MURO INTERIOR PLANTA BAJA",
    items: [
      { unidad: "SACO", cantidad: 9, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 14, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.49, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE 0.70X 0.70 M)" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
    ]
  },
  {
    id: "enmasillado-pb-2",
    concepto: "INFO-ENMASILLADO EN MURO INTERIOR PB 01",
    subConcepto: "MASILLA MURO INTERIOR PLANTA BAJA SEGUNDO VALE",
    items: [
      { unidad: "SACO", cantidad: 9, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 14, descripcion: "ADEBON" },
    ]
  },
  {
    id: "enmasillado-pa-1",
    concepto: "INFO-ENMASILLADO EN MURO INT PA 01",
    subConcepto: "MASILLA INTERIOR PLANTA ALTA",
    items: [
      { unidad: "SACO", cantidad: 9, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 14, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.49, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE 0.70X 0.70 M)" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
    ]
  },
  {
    id: "enmasillado-pa-2",
    concepto: "INFO-ENMASILLADO EN MURO INT PA 01",
    subConcepto: "MASILLA INTERIOR PLANTA ALTA SEGUNDO VALE",
    items: [
      { unidad: "SACO", cantidad: 9, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 14, descripcion: "ADEBON" },
    ]
  },
  {
    id: "enmasillado-ext-pb",
    concepto: "INFO-ENMASILLADO EN MURO EXT PB",
    subConcepto: "MASILLA EXTERIOR PLANTA BAJA",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 5, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.16, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE 0.40X 0.40 M)" },
    ]
  },
  {
    id: "enmasillado-ext-pa",
    concepto: "INFO-ENMASILLADO EN MURO EXT PA",
    subConcepto: "MASILLA EXTERIOR PLANTA ALTA",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 5, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.16, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE 0.40X 0.40 M)" },
    ]
  },
  {
    id: "enmasillado-losa-pb",
    concepto: "INFO-ENMASILLADO EN LOSA PB 01",
    subConcepto: "CUADRO INTERIOR DERECHO",
    items: [
      { unidad: "SACO", cantidad: 2, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON" },
    ]
  },
  {
    id: "enmasillado-losa-pa",
    concepto: "INFO-ENMASILLADO EN LOSA PA 01",
    subConcepto: "CUADRO INTERIOR IZQUIERDO",
    items: [
      { unidad: "SACO", cantidad: 2, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON" },
    ]
  },
  {
    id: "enmasillado-pretil",
    concepto: "INFO-ENMASILLADO EN PRETIL",
    subConcepto: "CHAFLAN , BOQUILLAS Y MASILLAS EN PRETILES",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 8.5, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.08, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE .40X.20 M)" },
    ]
  },
  {
    id: "enmasillado-escalera-laterales",
    concepto: "INFO-ENMASILLADO EN ESCALERA",
    subConcepto: "MASILLA EN ESCALERA (LATERALES)",
    items: [
      { unidad: "SACO", cantidad: 2, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4.5, descripcion: "ADEBON (FUERA DE PPTO 2.5 LT)" },
    ]
  },
  {
    id: "firme-acceso-huellas",
    concepto: "INFO-FIRME ACCESO HUELLAS",
    subConcepto: "HUELLAS ACCESO, FIRME Y ENTORTADO",
    items: [
      { unidad: "PZA", cantidad: 0.5, descripcion: "HILO PARA PESCA DE 1MM-100MT" },
      { unidad: "KG", cantidad: 0.25, descripcion: "CLAVO DE 2 1/2 PARA CONCRETO" },
    ]
  },
  {
    id: "chalora-sanitaria-pa",
    concepto: "INFO-CHALORA SANITARIA DE VIVIENDAS PA",
    subConcepto: "CHAROLAS DE BA\u00D1O PARA 4 LOTES",
    items: [
      { unidad: "CUBETA 19 LTS", cantidad: 0.32, descripcion: "IMPERMEABILIZANTE PASA BARRERA DE VAPOR" },
      { unidad: "PZA", cantidad: 0.33, descripcion: "ESCOBA DE PLASTICO" },
    ]
  },
  {
    id: "cinta-impermeable",
    concepto: "INFO-CINTA IMPERMEABLE",
    subConcepto: "TAPA JUNTAS EN AZOTEA (1 LOTE)",
    items: [
      { unidad: "PZA", cantidad: 0.5, descripcion: "BROCHA DE 3 PULG" },
      { unidad: "PZA", cantidad: 2.75, descripcion: "CINTA ADHESIVA IMPERMEABLE" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "GAS BUTANO" },
      { unidad: "CUBETA 19 LTS", cantidad: 0.116, descripcion: "IMPERMEABILIZANTE PASA BARRERA DE VAPOR" },
    ]
  },
  {
    id: "azulejo-ba\u00D1o-pb",
    concepto: "INFO-AZULEJO EN BA\u00D1O EN PB",
    subConcepto: "AZULEJO BA\u00D1O PLANTA BAJA (2 VIV.)",
    items: [
      { unidad: "KG", cantidad: 2, descripcion: "CEMENTO BLANCO" },
      { unidad: "SACO", cantidad: 15, descripcion: "PEGAAZULEJO (SACO 20 KG)" },
      { unidad: "KG", cantidad: 0.5, descripcion: "ESTOPA BLANCA" },
      { unidad: "M2", cantidad: 13.96, descripcion: "AZULEJO ROMA HUESO 20.1 X 30.2 (1.82M2/CAJA)( 7 CAJAS MAS 20 PZAS)" },
      { unidad: "M2", cantidad: 2.24, descripcion: "PISO ANTIDERRAPANTE RUBIK BEIGE 20X20 CM ( 1 CAJAS MAS 18 PZAS )" },
    ]
  },
  {
    id: "azulejo-ba\u00D1o-pa",
    concepto: "INFO-AZULEJO EN BA\u00D1O EN PA",
    subConcepto: "AZULEJO BA\u00D1O PLANTA ALTA (2 VIV.)",
    items: [
      { unidad: "KG", cantidad: 2, descripcion: "CEMENTO BLANCO" },
      { unidad: "SACO", cantidad: 15, descripcion: "PEGAAZULEJO (SACO 20 KG)" },
      { unidad: "KG", cantidad: 0.5, descripcion: "ESTOPA BLANCA" },
      { unidad: "M2", cantidad: 13.96, descripcion: "AZULEJO ROMA HUESO 20.1 X 30.2 (1.82M2/CAJA)( 7 CAJAS MAS 20 PZAS)" },
      { unidad: "M2", cantidad: 2.24, descripcion: "PISO ANTIDERRAPANTE RUBIK BEIGE 20X20 CM ( 1 CAJAS MAS 18 PZAS )" },
    ]
  },
  {
    id: "zoclo-fregadero-lavabo",
    concepto: "INFO-ZOCLO EN FREGADERO Y LAVABO",
    subConcepto: "ZOCLO EN FREGADERO Y LAVABO (1 LOTE)",
    items: [
      { unidad: "M2", cantidad: 0.728, descripcion: "AZULEJO ROMA HUESO 20.1 X 30.2 (1.82M2/CAJA)( 12 PZAS)" },
      { unidad: "SACO", cantidad: 1, descripcion: "PEGAAZULEJO (SACO 20 KG)" },
    ]
  },
  {
    id: "registros-sanitarios-a",
    concepto: "INFO-ELABORACION DE REGISTROS SANITARIOS A",
    subConcepto: "TAPAS DE REGISTRO PATIO 2 VIV.",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "COLADERA UNIVERSAL 10 CM" },
    ]
  },
  {
    id: "colocacion-mensulas",
    concepto: "INFO-COLOCACION DE MENSULAS",
    subConcepto: "COLOCACION MENSULAS PB Y PA (4 VIV.)",
    items: [
      { unidad: "PAR", cantidad: 4, descripcion: "MENSULAS PARA FREGADERO ( 8 PZAS )" },
      { unidad: "PZA", cantidad: 16, descripcion: "PIJA GALVANIZADA CABEZA COMBINADA 10 X 1 1/2" },
      { unidad: "PZA", cantidad: 16, descripcion: "TAQUETES DE PLASTICO DE 1/4" },
    ]
  },
  {
    id: "pintura-interior-pb-1mano-v2",
    concepto: "INFO-PINTURA INTERIOR PB 1MANO",
    subConcepto: "PINTURA INTERIOR PLANTA BAJA (2 VIV.)",
    items: [
      { unidad: "KG", cantidad: 4.5, descripcion: "POLIETILENO CAL. 600" },
    ]
  },
  {
    id: "pintura-exterior-pb-1mano",
    concepto: "INFO-PINTRA EXTERIOR PB 1MANO",
    subConcepto: "PINTURA EXTERIOR PLANTA BAJA (2 VIV.)",
    items: [
      { unidad: "LT", cantidad: 1.5, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA 19 LTS", cantidad: 2, descripcion: "PINTURA BLANCO EXTERIOR" },
    ]
  },
  {
    id: "pintura-exterior-pb-2mano",
    concepto: "INFO-PINTRA EXTERIOR PB 2MANO",
    subConcepto: "PINTURA EXTERIOR PLANTA BAJA (2 VIV.)",
    items: [
      { unidad: "CUBETA 19 LTS", cantidad: 0.5, descripcion: "PINTURA COLOR ROJO CODIGO IT 152-4" },
      { unidad: "CUBETA 19 LTS", cantidad: 0.5, descripcion: "PINTURA COLOR GRIS CODIGO IT 141-7" },
      { unidad: "PZA", cantidad: 1, descripcion: "RODILLO PARA PINTAR DE FELPA" },
    ]
  },
  {
    id: "pintura-interior-pa-1mano",
    concepto: "INFO-PINTURA INTERIOR PA 1MANO",
    subConcepto: "PINTURA INTERIOR PLANTA ALTA (2 VIV.)",
    items: [
      { unidad: "PZA", cantidad: 1, descripcion: "BROCHA DE 3 PULG" },
      { unidad: "PZA", cantidad: 1, descripcion: "BROCHA DE CERDA 4" },
      { unidad: "PZA", cantidad: 4, descripcion: "RODILLO PARA PINTAR DE FELPA" },
      { unidad: "LT", cantidad: 2, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA 19 LTS", cantidad: 9, descripcion: "PINTURA VINILICA BLANCO INTERIOR" },
    ]
  },
  {
    id: "pintura-exterior-pa-1mano",
    concepto: "INFO-PINTRA EXTERIOR PA 1MANO",
    subConcepto: "PINTURA EXTERIOR PLANTA ALTA (2 VIV.)",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "RODILLO PARA PINTAR DE FELPA" },
      { unidad: "LT", cantidad: 1.5, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA 19 LTS", cantidad: 3, descripcion: "PINTURA BLANCO EXTERIOR" },
    ]
  },
  {
    id: "pintura-pretil",
    concepto: "INFO-PINTURA PRETIL",
    subConcepto: "PINTURA EN PRETIL",
    items: [
      { unidad: "LT", cantidad: 2, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA 19 LTS", cantidad: 1, descripcion: "PINTURA BLANCO EXTERIOR" },
    ]
  },
  {
    id: "equipamiento-pb-accesorios",
    concepto: "INFO-EQUIPAMIENTO DE VIVIENDAS PB",
    subConcepto: "ACCESORIOS DE BA\u00D1O PB Y PA (4 VIV.)",
    items: [
      { unidad: "PAQUETE", cantidad: 4, descripcion: "ACCESORIOS DE BA\u00D1O (TOALLEROS,JABONERAS,ETC.)" },
      { unidad: "KG", cantidad: 6, descripcion: "CEMENTO BLANCO" },
    ]
  },
  {
    id: "impermeabilizante-azotea",
    concepto: "INFO-IMPERMEABILIZANTE",
    subConcepto: "IMPERMEABILIZANTE AZOTEA (1 LOTE)",
    items: [
      { unidad: "PZA", cantidad: 1, descripcion: "RODILLO PARA PINTAR DE FELPA" },
      { unidad: "CUBETA 19 LTS", cantidad: 4, descripcion: "IMPERMEABILIZANTE FIBRATADO ACRILICO 3 A\u00D1OS" },
      { unidad: "PZA", cantidad: 0.33, descripcion: "BROCHA DE CERDA 4" },
    ]
  },
  {
    id: "limpieza-fina",
    concepto: "INFO-LIMPIEZA INTERIOR PB",
    subConcepto: "LIMPIEZA FINA PB Y PA (4 VIV.)",
    items: [
      { unidad: "LT", cantidad: 2, descripcion: "ACIDO MURIATICO" },
      { unidad: "PZA", cantidad: 1, descripcion: "BROCHAS DE 2 1/2" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "ESCOBA DE PLASTICO" },
      { unidad: "PZA", cantidad: 0.33, descripcion: "ESCURRIDOR" },
      { unidad: "PZA", cantidad: 1, descripcion: "ESPATULA DE 2 1/2" },
      { unidad: "ML", cantidad: 0.5, descripcion: "FRANELA" },
      { unidad: "PAR", cantidad: 0.14, descripcion: "GUANTES DOMESTICOS" },
      { unidad: "KG", cantidad: 0.14, descripcion: "JABON EN POLVO" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "LIJA DE AGUA DE 220" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "MECHUDO" },
      { unidad: "KG", cantidad: 2, descripcion: "POLIETILENO CAL. 600" },
    ]
  },
  {
    id: "colocacion-puertas-pb",
    concepto: "INFO-COLOCACION DE PUERTAS PB",
    subConcepto: "PUERTAS PLANTA BAJA",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CERRADURA PARA ACCESO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CERRADURA PARA BA\u00D1O" },
      { unidad: "PZA", cantidad: 6, descripcion: "CERRADURA PARA RECAMARA" },
      { unidad: "PZA", cantidad: 2, descripcion: "MARCO ALUM BLANCO UNIVERSAL 70 X 210" },
      { unidad: "PZA", cantidad: 6, descripcion: "MARCO ALUM BLANCO UNIVERSAL 80 X 210" },
      { unidad: "PZA", cantidad: 2, descripcion: "MARCO ALUMINIO BLANCO UNIVERSAL 90 X 210" },
      { unidad: "PZA", cantidad: 92, descripcion: "PIJA AGLOMERADA (NEGRA) 8 X 3/4 (CABEZA PLANA DE ESTRELLA)" },
      { unidad: "PZA", cantidad: 42, descripcion: "PIJA GALVANIZADA 8 X 3/4 (CABEZA DE GOTA)" },
      { unidad: "PZA", cantidad: 2, descripcion: "PUERTA ACERO NEW WHITEL LISA DE 0.90 X 2.10 M (ACCESO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "PUERTA DE TAMBOR ARENA 70 X 210 CM" },
      { unidad: "PZA", cantidad: 6, descripcion: "PUERTA DE TAMBOR DE ARENA 80 X 210 CM" },
      { unidad: "PZA", cantidad: 24, descripcion: "REMACHES NATURAL NO. 54" },
      { unidad: "PZA", cantidad: 5, descripcion: "SELLADOR ACRILASTIC" },
      { unidad: "PZA", cantidad: 62, descripcion: "TAQUETES DE PLASTICO DE 1/4" },
      { unidad: "PZA", cantidad: 62, descripcion: "TORNILLO GALV. PARA MADERA DE 10 X 2" },
    ]
  },
  {
    id: "colocacion-puertas-pa",
    concepto: "INFO-COLOCACION DE PUERTAS PA",
    subConcepto: "PUERTAS PLANTA ALTA",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CERRADURA PARA ACCESO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CERRADURA PARA BA\u00D1O" },
      { unidad: "PZA", cantidad: 6, descripcion: "CERRADURA PARA RECAMARA" },
      { unidad: "PZA", cantidad: 2, descripcion: "MARCO ALUM BLANCO UNIVERSAL 70 X 210" },
      { unidad: "PZA", cantidad: 6, descripcion: "MARCO ALUM BLANCO UNIVERSAL 80 X 210" },
      { unidad: "PZA", cantidad: 2, descripcion: "MARCO ALUMINIO BLANCO UNIVERSAL 90 X 210" },
      { unidad: "PZA", cantidad: 92, descripcion: "PIJA AGLOMERADA (NEGRA) 8 X 3/4 (CABEZA PLANA DE ESTRELLA)" },
      { unidad: "PZA", cantidad: 42, descripcion: "PIJA GALVANIZADA 8 X 3/4 (CABEZA DE GOTA)" },
      { unidad: "PZA", cantidad: 2, descripcion: "PUERTA ACERO NEW WHITEL LISA DE 0.90 X 2.10 M (ACCESO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "PUERTA DE TAMBOR ARENA 70 X 210 CM" },
      { unidad: "PZA", cantidad: 6, descripcion: "PUERTA DE TAMBOR DE ARENA 80 X 210 CM" },
      { unidad: "PZA", cantidad: 24, descripcion: "REMACHES NATURAL NO. 54" },
      { unidad: "PZA", cantidad: 6, descripcion: "SELLADOR ACRILASTIC" },
      { unidad: "PZA", cantidad: 62, descripcion: "TAQUETES DE PLASTICO DE 1/4" },
      { unidad: "PZA", cantidad: 62, descripcion: "TORNILLO GALV. PARA MADERA DE 10 X 2" },
    ]
  },
  {
    id: "colocacion-ventanas-pb",
    concepto: "INFO-COLOCACION DE VENTANAS PB",
    subConcepto: "VENTANAS PLANTA BAJA",
    items: [
      { unidad: "PZA", cantidad: 48, descripcion: "TAQUETES DE PLASTICO DE 1/4 X 1 1/2\"" },
      { unidad: "PZA", cantidad: 48, descripcion: "TORNILLO GALVANIZADO DE 10 X 1 1/2 (CABEZA PLANA DE ESTRELLA)" },
      { unidad: "PZA", cantidad: 6, descripcion: "SELLADOR ACRILASTIC" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.97 X 1.147 MTRS (ACCESO) VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO OX DE 1.17X1.17 MTRS (REC 1) VIDIRO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.67X2.06 MTRS (REC 2) VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.77X0.37 MTRS(BA\u00D1O) VIDRIO CLARO 3MM FIJO INFERIOR C/BROCHE CENTRAL" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO OX DE 0.74X1.17 MTRS VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL" },
    ]
  },
  {
    id: "colocacion-ventanas-pa",
    concepto: "INFO-COLOCACION DE VENTANAS PA",
    subConcepto: "VENTANAS PLANTA ALTA",
    items: [
      { unidad: "PZA", cantidad: 48, descripcion: "TAQUETES DE PLASTICO DE 1/4 X 1 1/2\"" },
      { unidad: "PZA", cantidad: 48, descripcion: "TORNILLO GALVANIZADO DE 10 X 1 1/2 (CABEZA PLANA DE ESTRELLA)" },
      { unidad: "PZA", cantidad: 6, descripcion: "SELLADOR ACRILASTIC" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.97 X 1.147 MTRS (ACCESO) VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO OX DE 1.17X1.17 MTRS (REC 1) VIDIRO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.67X2.06 MTRS (REC 2) VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.77X0.37 MTRS(BA\u00D1O) VIDRIO CLARO 3MM FIJO INFERIOR C/BROCHE CENTRAL" },
      { unidad: "PZA", cantidad: 2, descripcion: "VENTANA IZQ Y DER HIBRIDA BLANCO OX DE 0.74X1.17 MTRS VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL" },
    ]
  },
  {
    id: "lechada-piso-pb-pa",
    concepto: "INFO-ENMASILLADO EN MURO INTERIOR PB 01",
    subConcepto: "LECHADA EN PISO PLANTA BAJA Y ALTA (4 VIV.)",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 8, descripcion: "ADEBON" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "BROCHA DE CERDA 4 (FUERA DE PPTO)" },
    ]
  },
  {
    id: "acero-cimentacion-v2",
    concepto: "INFO-CIMENTACION ARMADO HABILITADO Y COLADO",
    subConcepto: "ACERO CIMENTACION",
    items: [
      { unidad: "KG", cantidad: 100, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "KG", cantidad: 140, descripcion: "ALAMBRON 1/4" },
      { unidad: "SACO", cantidad: 1, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "KG", cantidad: 0.3, descripcion: "CLAVO PARA MADERA DE 2 1/2" },
      { unidad: "KG", cantidad: 0.5, descripcion: "CLAVO PARA MADERA DE 4" },
      { unidad: "PZA", cantidad: 1, descripcion: "DISCO DE CORTE DE METAL DE 14 X 14 X 1/8 X 1" },
      { unidad: "PZA", cantidad: 2, descripcion: "HILO DE PESCA DE 1 MM-100 MT" },
      { unidad: "PZA", cantidad: 3, descripcion: "PLACA DE POLIESTIRENO DE 3 CM DE ESPESOR" },
      { unidad: "KG", cantidad: 34, descripcion: "POLIETILENO CAL 600" },
      { unidad: "PZA", cantidad: 3, descripcion: "TUBO ALCANTARILLADO ESTRUCTURAL DE 6 X 6 ML" },
    ]
  },
  {
    id: "cimentacion-segundo-vale-v2",
    concepto: "INFO-CIMENTACION ARMADO HABILITADO Y COLADO",
    subConcepto: "CIMENTACION SEGUNDO VALE",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "POLINES 4 X 4 X 8 PIE" },
      { unidad: "PZA", cantidad: 5, descripcion: "BARROTE 2 X 4 X 8 PIES" },
    ]
  },
  {
    id: "malla-muro-pb-v2",
    concepto: "INFO-HABILITADO DE ACERO MURO PLANTA BAJA",
    subConcepto: "MALLA MURO PB",
    items: [
      { unidad: "KG", cantidad: 12, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "KG", cantidad: 5, descripcion: "ALAMBRON 1/4" },
      { unidad: "PZA", cantidad: 40, descripcion: "DISCO SEPARADOR DS-200 (13 CMS)" },
      { unidad: "PZA", cantidad: 476, descripcion: "DISCO SEPARADOR RTP-05-175M" },
      { unidad: "M2", cantidad: 300, descripcion: "MALLA ELECTROSOLDADA 6X6 10/10" },
    ]
  },
  {
    id: "barda-acero-v2",
    concepto: "INFO-HABILITADO DE ACERO CIMBRA Y COLADO DE BARDA MEDI",
    subConcepto: "BARDA (ACERO)",
    items: [
      { unidad: "PZA", cantidad: 1.5, descripcion: "ARMEX 15X30X4 X 6ML" },
      { unidad: "KG", cantidad: 3, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "M2", cantidad: 0.65, descripcion: "BAJO ALFOMBRA POLI PAD BLANCO" },
      { unidad: "LT", cantidad: 10, descripcion: "DESMOLDANTE LIQUIDO, PROTECTOR DE CIMBRAS" },
      { unidad: "PZA", cantidad: 22, descripcion: "DISCO SEPARADOR DS-200 (13 CMS)" },
      { unidad: "M2", cantidad: 4.5, descripcion: "MALLA ELECTROSOLDADA 66-44 (2.83 KG/M2)" },
      { unidad: "M2", cantidad: 12, descripcion: "MALLA ELECTROSOLDADA 6X6 10/10" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
      { unidad: "KG", cantidad: 2, descripcion: "POLIETILENO CAL. 600" },
    ]
  },
  {
    id: "losa-entrepiso-acero-v2",
    concepto: "INFO-HABILITADO DE ACERO DE LOSA DE ENTREPISO",
    subConcepto: "LOSA DE ENTREPISO ACERO",
    items: [
      { unidad: "KG", cantidad: 30, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "KG", cantidad: 35, descripcion: "ALAMBRON 1/4" },
      { unidad: "PZA", cantidad: 1, descripcion: "DISCO PARA CORTE DE METAL DE 14 X 14 X 1/8" },
      { unidad: "M2", cantidad: 150, descripcion: "MALLA ELECTROSOLDADA 66-44 (2.83 KG/M2)" },
      { unidad: "PZA", cantidad: 40, descripcion: "SILLETA MALLA (SM-300)" },
      { unidad: "PZA", cantidad: 100, descripcion: "SILLETA SM 100" },
    ]
  },
  {
    id: "acero-escalera-v2",
    concepto: "INFO-HABILITADO DE ACERO CIMBRA Y COLADO DE ESCALERA",
    subConcepto: "ACERO ESCALERA",
    items: [
      { unidad: "KG", cantidad: 15, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "KG", cantidad: 10, descripcion: "ALAMBRON 1/4" },
      { unidad: "M2", cantidad: 21, descripcion: "MALLA ELECTROSOLDADA 6X6 10/10" },
      { unidad: "KG", cantidad: 3, descripcion: "POLIETILENO CAL 600" },
      { unidad: "PZA", cantidad: 7, descripcion: "SILLETA MALLA (SM 300)" },
      { unidad: "PZA", cantidad: 9, descripcion: "SILLETA SM- 100" },
    ]
  },
  {
    id: "malla-muro-pa-v2",
    concepto: "INFO-HABILITADO DE ACERO DE MURO DE PLANTA ALTA",
    subConcepto: "MALLA MURO PA",
    items: [
      { unidad: "KG", cantidad: 12, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "KG", cantidad: 5, descripcion: "ALAMBRON 1/4" },
      { unidad: "PZA", cantidad: 40, descripcion: "DISCO SEPARADOR DS-200 (13 CMS)" },
      { unidad: "PZA", cantidad: 476, descripcion: "DISCO SEPARADOR RTP-05-175M" },
      { unidad: "M2", cantidad: 300, descripcion: "MALLA ELECTROSOLDADA 6X6 10/10" },
    ]
  },
  {
    id: "losa-azotea-pretil-v2",
    concepto: "INFO-HABILITADO DE ACERO DE PRETIL",
    subConcepto: "LOSA DE AZOTEA CON PRETIL",
    items: [
      { unidad: "KG", cantidad: 3, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "M2", cantidad: 26, descripcion: "MALLA ELECTROSOLDADA 6X6 10/10" },
      { unidad: "PZA", cantidad: 60, descripcion: "DISCO SEPARADOR RTP-05-175M" },
    ]
  },
  {
    id: "malla-losa-azotea-v2",
    concepto: "INFO-HABILITADO DE ACERO DE LOSA DE AZOTEA",
    subConcepto: "MALLA LOSA DE AZOTEA",
    items: [
      { unidad: "KG", cantidad: 20, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "KG", cantidad: 14, descripcion: "ALAMBRON 1/4" },
      { unidad: "M2", cantidad: 150, descripcion: "MALLA ELECTROSOLDADA 66-44 (2.83 KG/M2)" },
      { unidad: "PZA", cantidad: 40, descripcion: "SILLETA MALLA (SM-300)" },
      { unidad: "PZA", cantidad: 100, descripcion: "SILLETA SM- 100" },
    ]
  },
  {
    id: "acero-base-tinaco-v2",
    concepto: "INFO-HABILITADO DE ACERO CIMBRA Y COLADO DE BASE TINAC",
    subConcepto: "ACERO BASE TINACO",
    items: [
      { unidad: "KG", cantidad: 2, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "M2", cantidad: 25, descripcion: "MALLA ELECTROSOLDADA 6X6 10/10" },
      { unidad: "PZA", cantidad: 20, descripcion: "SILLETA MALLA (SM-300)" },
    ]
  },
  {
    id: "cimbra-molde-pb-v2",
    concepto: "INFO-CIMBRA Y COLADO DE MUROS Y LOSA DE ENTRE PISO",
    subConcepto: "CIMBRA MOLDE PB",
    items: [
      { unidad: "KG", cantidad: 5, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "M2", cantidad: 14, descripcion: "BAJO ALFOMBRA POLI PAD BLANCO" },
      { unidad: "SACO", cantidad: 1, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "KG", cantidad: 0.5, descripcion: "CLAVO DE 2 /1/2 PARA CONCRETO" },
      { unidad: "LT", cantidad: 60, descripcion: "DESMOLDANTE LIQUIDO, PROTECTOR DE CIMBRAS" },
      { unidad: "PZA", cantidad: 8, descripcion: "PLACA DE POLIESTIRENO DE 3 CM DE ESPESOR" },
    ]
  },
  {
    id: "cimbra-molde-pa-v2",
    concepto: "INFO-CIMBRA Y COLADO DE MUROS Y LOSA DE AZOTEA",
    subConcepto: "CIMBRA MOLDE PA",
    items: [
      { unidad: "KG", cantidad: 10, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "M2", cantidad: 14, descripcion: "BAJO ALFOMBRA POLI PAD BLANCO" },
      { unidad: "SACO", cantidad: 1, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "KG", cantidad: 0.5, descripcion: "CLAVO DE 2 1/2 PARA CONCRETO" },
      { unidad: "LT", cantidad: 70, descripcion: "DESMOLDANTE LIQUIDO, PROTECTOR DE CIMBRAS" },
      { unidad: "PZA", cantidad: 8, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
    ]
  },
  {
    id: "molde-base-tinaco",
    concepto: "INFO-MOLDE BASE DE TINACO",
    subConcepto: "CIMBRA MOLDE BASE TINACO",
    items: [
      { unidad: "LT", cantidad: 5, descripcion: "DESMOLDANTE LIQUIDO, PROTECTOR DE CIMBRAS" },
      { unidad: "M2", cantidad: 1, descripcion: "BAJO ALFOMBRA POLI PAD BLANCO" },
    ]
  },
  {
    id: "cimbra-pretil",
    concepto: "INFO-CIMBRA DE PRETIL",
    subConcepto: "CIMBRA MOLDE PRETIL",
    items: [
      { unidad: "LT", cantidad: 15, descripcion: "DESMOLDANTE LIQUIDO, PROTECTOR DE CIMBRAS" },
      { unidad: "KG", cantidad: 5, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "M2", cantidad: 2, descripcion: "BAJO ALFOMBRA POLI PAD BLANCO" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA DE POLIESTIRENO DE 3 CM DE ESPESOR" },
    ]
  },
  {
    id: "molde-escalera",
    concepto: "INFO-MOLDE DE ESCALERA",
    subConcepto: "CIMBRA MOLDE ESCALERA",
    items: [
      { unidad: "M2", cantidad: 0.5, descripcion: "BAJO ALFOMBRA POLI PAD BLANCO" },
      { unidad: "LT", cantidad: 10, descripcion: "DESMOLDANTE LIQUIDO, PROTECTOR DE CIMBRAS" },
      { unidad: "PZA", cantidad: 0.08, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
    ]
  },
  {
    id: "enmasillado-escalones",
    concepto: "INFO-ENMASILLADO EN ESCALONES ESCALERA",
    subConcepto: "MASILLA EN ESCALERA (ESCALONES)",
    items: [
      { unidad: "SACO", cantidad: 2, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 2, descripcion: "ADEBON" },
    ]
  },
  {
    id: "masilla-barda",
    concepto: "INFO-MASILLA EN BARDA",
    subConcepto: "MASILLA EN BARDA",
    items: [
      { unidad: "SACO", cantidad: 2, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 2, descripcion: "ADEBON" },
      { unidad: "PZA", cantidad: 0.25, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
      { unidad: "M2", cantidad: 0.06, descripcion: "ESPONJA DE 2 PULG DE ESPESOR (CORTAR 0.20 X 0.30 MTRS)" },
    ]
  },
  {
    id: "masilla-base-tinaco",
    concepto: "INFO-MASILLA EN BASE DE TINACO",
    subConcepto: "MASILLA EN BASE TINACO AZOTEA",
    items: [
      { unidad: "SACO", cantidad: 4, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON" },
      { unidad: "PZA", cantidad: 0.25, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
    ]
  },
  {
    id: "inst-sanitaria-cimentacion-v2",
    concepto: "INFO-INSTALACIONES CIMENTACION",
    subConcepto: "INST. SANITARIA CIMENTACION",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "CESPOL BOTE PVC C/TR S/BAJA 50, TUBOS FLEX." },
      { unidad: "PZA", cantidad: 6, descripcion: "CODO DE 2 X45 PVC" },
      { unidad: "PZA", cantidad: 20, descripcion: "CODO DE 2 X90 PVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 4X90 CON SAL TRACERA DE 2" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE PVC 3 X 90" },
      { unidad: "ML", cantidad: 1, descripcion: "LIJA ESMERIL" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO TANGIT 475 GR" },
      { unidad: "PZA", cantidad: 8, descripcion: "TAPON DE 4 DIAM. PVC SANITARIO (FUERA DE PPTO 4 PZA)" },
      { unidad: "PZA", cantidad: 10, descripcion: "TAPON CAPA DE 2 DIAM. PVC" },
      { unidad: "ML", cantidad: 12, descripcion: "TUBO PVC 3 DIAM." },
      { unidad: "ML", cantidad: 6.1, descripcion: "TUBO PVC NORMA DE 4 X 6ML" },
      { unidad: "ML", cantidad: 36.6, descripcion: "TUBO SANITARIO DE PVC DE 50 MM DE DIAMETRO" },
      { unidad: "PZA", cantidad: 2, descripcion: "YEE DE 4 X 2 X 4 PVC" },
      { unidad: "PZA", cantidad: 6, descripcion: "YEE PVC SANIT 2 X 2 X 2 DIAM" },
    ]
  },
  {
    id: "inst-hidraulico-cimentacion-v2",
    concepto: "INFO-INSTALACIONES CIMENTACION",
    subConcepto: "INST. HIDRAULICO CIMENTACION",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CODO CPVC 1 X 45" },
      { unidad: "PZA", cantidad: 12, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC DE 3/4 X 90" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 1 X 90 CPVC" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO CPVC 475 GR" },
      { unidad: "PZA", cantidad: 6, descripcion: "REDUCCION DE 1 X 3/4 CPCV" },
      { unidad: "PZA", cantidad: 16, descripcion: "REDUCCION DE 3/4 A 1/2 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPON DE 1 DIAM. CPVC" },
      { unidad: "PZA", cantidad: 12, descripcion: "TAPON DE 1/2 DIAM CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPON DE 3/4 DIAM CPVC" },
      { unidad: "PZA", cantidad: 12, descripcion: "TAPON MACHO DE CPVC DE 1/2 ROSCABLE (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE CPVC DE 1" },
      { unidad: "PZA", cantidad: 8, descripcion: "TEE CPVC DE 3/4" },
      { unidad: "ML", cantidad: 9.15, descripcion: "TUBO CPVC DE 1 PULG DE DIAM." },
      { unidad: "ML", cantidad: 36.4, descripcion: "TUBO CPVC DE 1/2 DIAM x 3.05 MTS" },
      { unidad: "ML", cantidad: 18.3, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3,05" },
    ]
  },
  {
    id: "inst-electrico-cimentacion-v2",
    concepto: "INFO-INSTALACIONES CIMENTACION",
    subConcepto: "INST. ELECTRICO CIMENTACION",
    items: [
      { unidad: "ML", cantidad: 75, descripcion: "POLIDUCTO NARANJA DE 13MM (1/2)" },
      { unidad: "ML", cantidad: 45, descripcion: "POLIDUCTO NARANJA DE 19 MM DIAM" },
      { unidad: "ML", cantidad: 22, descripcion: "POLIDUCTO NARANJA DE 1 DIAM. (FUERA DE PPTO)" },
      { unidad: "KG", cantidad: 1, descripcion: "ALAMBRE RECOCIDO" },
    ]
  },
  {
    id: "inst-gas-cimentacion-v2",
    concepto: "INFO-INSTALACIONES CIMENTACION",
    subConcepto: "INST. GAS CIMENTACION",
    items: [
      { unidad: "PZA", cantidad: 3, descripcion: "TUBO CONDUIT LIGERO DE 1 1/4 DIAM." },
      { unidad: "PZA", cantidad: 4, descripcion: "CURVA CONDUIT LIGERO DE 1 1/4 DIAM." },
    ]
  },
  {
    id: "inst-sanitaria-muro-pb-v2",
    concepto: "INFO-INSTALACIONES MUROS PB",
    subConcepto: "INST. SANITARIA MURO PB",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL BOTE PVC C/TR S/BAJA 50, TUBOS FLEX." },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO DE 2 X90 PVC" },
      { unidad: "PZA", cantidad: 6, descripcion: "COPLE PVC SANIT 2 DIAM" },
      { unidad: "PZA", cantidad: 2, descripcion: "COPLE PVC SANITARIO DE 3" },
      { unidad: "PZA", cantidad: 4, descripcion: "CURVA CONDUIT LIGERO DE 1 1/4 DIAM." },
      { unidad: "ML", cantidad: 1, descripcion: "LIJA ESMERIL" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO TANGIT 475 GR" },
      { unidad: "PZA", cantidad: 2, descripcion: "TEE PVC DE 2 X 2 X 2" },
      { unidad: "PZA", cantidad: 3, descripcion: "TUBO CONDUIT LIGERO DE 1 1/4 DIAM." },
      { unidad: "ML", cantidad: 6.1, descripcion: "TUBO PVC 3 DIAM." },
      { unidad: "ML", cantidad: 24.4, descripcion: "TUBO SANITARIO DE PVC DE 50 MM DE DIAMETRO" },
      { unidad: "PZA", cantidad: 8, descripcion: "YEE PVC SANIT 2 X 2 X 2 DIAM" },
    ]
  },
];
