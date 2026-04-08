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
  paquete?: string;
}

export const VOUCHER_TEMPLATES: VoucherTemplate[] = [
  {
    id: "template-F,G,H-1-3alf32pe",
    concepto: "INSTALACION CHAROLAS",
    subConcepto: "INSTALACION CHAROLAS",
    paquete: "F,G,H",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL BOTE PVC C/TR S/BAJA 50, TUBOS FLEX." },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 2 X45 PVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 2 X90 PVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 4 X 45 PVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 4X90 CON SAL TRACERA DE 2" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO TANGIT 475 GR" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPON DE 4 DIAM. PVC SANITARIO (FUERA DE PPTO)" },
      { unidad: "ML", cantidad: 6, descripcion: "TUBO PVC NORMA DE 4 X 6ML" },
      { unidad: "ML", cantidad: 6, descripcion: "TUBO SANITARIO DE PVC DE 50 MM DE DIAMETRO" },
      { unidad: "PZA", cantidad: 2, descripcion: "YEE DE 4 X 2 X 4 PVC" },
    ]
  },
  {
    id: "template-F,G,H-2-jfwsxx26",
    concepto: "INSTALACION TINACO PLANTA BAJA",
    subConcepto: "INSTALACION TINACO PLANTA BAJA",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 6, descripcion: "CINTA TEFLON DE 3/4 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO 1/2 X 45 CPVC (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC DE 1/2 X 90 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 1 X 90 CPVC (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONECTOR CAFRI DE 1 CPVC (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONECTOR CAFRI 1/2 CPVC (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 6, descripcion: "COPLE CPVC DE 1/2 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "COPLE DE 1 DE CPVC (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO CPVC 475 GR (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "REDUCCION DE 1 X 3/4 CPCV (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "TINACO NEGRO CAP. 450 LTS." },
      { unidad: "ML", cantidad: 15.25, descripcion: "TUBO CPVC DE 1 PULG DE DIAM. (FUERA DE PPTO)" },
      { unidad: "ML", cantidad: 27.45, descripcion: "TUBO CPVC DE 1/2 DIAM x 3.05 MTS (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 1.5, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3.05 MTS (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "TUERCA UNION DE 1 DIAM. CPVC (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "TUERCA UNION DE 1/2 DIAM. CPVC (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-F,G,H-3-grl6gqqa",
    concepto: "CUADRO MEDICION HIDRAULICO",
    subConcepto: "CUADRO MEDICION HIDRAULICO",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "ABRAZADERA SIN FIN REFORZADA DE 3/4\"" },
      { unidad: "PZA", cantidad: 1, descripcion: "CINTA TEFLON DE 1/2" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 20, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TAPON DE 1/2 DIAM CPVC (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE 1/2 CPVC" },
      { unidad: "ML", cantidad: 21, descripcion: "TUBO CPVC DE 1/2 DIAM x 3.05 MTS (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "VALVULA DE COMPUERTA CPVC DE 1/2 DIAM (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CONECTOR CAFRE DE 1/2 DIAM. CPVC" },
    ]
  },
  {
    id: "template-F,G,H-4-g9558c9x",
    concepto: "INSTALACIÓN CLIMA CIMENTACION",
    subConcepto: "INSTALACIÓN CLIMA CIMENTACION",
    paquete: "F,G,H",
    items: [
      { unidad: "KG", cantidad: 0.25, descripcion: "ALAMBRE GALVANIZADO CAL 14" },
      { unidad: "PZA", cantidad: 4, descripcion: "CHALUPA GALV. 2 X 4" },
      { unidad: "PZA", cantidad: 12, descripcion: "CODO CPVC 3/4 X 90 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "COPLE CPVC DE 3/4" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO PVC SANITARIO DE 3 X 45 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "LIJA ESMERIL" },
      { unidad: "PZA", cantidad: 41, descripcion: "POLIDUCTO NARANJA DE 19 MM DIAM (3/4)" },
      { unidad: "ML", cantidad: 4, descripcion: "TAPON CAPA DE 3 DIAM. PVC (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE CPVC DE 3/4" },
      { unidad: "PZA", cantidad: 19, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3.05 MTS (FUERA DE PPTO)" },
      { unidad: "ML", cantidad: 18, descripcion: "TUBO PVC 3 DIAM. (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-F,G,H-5-22idbkw7",
    concepto: "INST. LLAVES DE MATERIAL FUERA DE PPTO EMPOTRAR PB",
    subConcepto: "INST. LLAVES DE MATERIAL FUERA DE PPTO EMPOTRAR PB",
    paquete: "F,G,H",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "CINTA TEFLON DE 1/2 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC 1/2 X 45 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 8, descripcion: "CONECTOR CAFRE DE 1/2 DIAM. CPVC (FUERA DE PPTO)" },
      { unidad: "JGO", cantidad: 2, descripcion: "LLAVE DE EMPOTRAR ROSCABLE P/REGADERA (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-F,G,H-6-mkzsclas",
    concepto: "AMUEBLADOS PB",
    subConcepto: "AMUEBLADOS PB",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "ADAPTADOR DE HULE PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "ADAPTADOR DE HULE PARA LAVABO" },
      { unidad: "PZA", cantidad: 14, descripcion: "APAGADOR SENCILLO" },
      { unidad: "KG", cantidad: 8, descripcion: "CEMENTO BLANCO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL PARA LAVABO" },
      { unidad: "PZA", cantidad: 6, descripcion: "CINTA TEFLON DE 1/2 (FUERA DE PPTO 2 PZA)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CINTA TEFLON DE 3/4 (FUERA DE PPTO 2 PZA)" },
      { unidad: "PZA", cantidad: 8, descripcion: "CONECTOR CAFRE DE 1/2 DIAM. CPVC (FUERA DE PPTO 4 PZA)" },
      { unidad: "PZA", cantidad: 6, descripcion: "CONECTOR CAFRI 1/2 CPVC (FUERA DE PPTO 4 PZA)" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONTACTO POLARIZADO DOBLE C/TAPA" },
      { unidad: "PZA", cantidad: 18, descripcion: "CONTACTO SENCILLO POLARIZADO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONTRACANASTA PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONTRACANASTA PARA LAVABO" },
      { unidad: "PZA", cantidad: 14, descripcion: "FOCO LED BOMBILLA DE 9 WATTS" },
      { unidad: "PZA", cantidad: 2, descripcion: "FREGADERO DE ACERO INOX. IZQUIERDO Y DERECHO" },
    ]
  },
  {
    id: "template-F,G,H-7-568gxmdm",
    concepto: "AMUEBLADOS PB",
    subConcepto: "AMUEBLADOS PB",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA PILOTO" },
      { unidad: "PZA", cantidad: 2, descripcion: "RECEPTACULO DUPLEX POLARIZADO TIPO AMERICANO CON TAPA (FUERA DE PPTO 2 PZA)" },
      { unidad: "PZA", cantidad: 2, descripcion: "REGADERA DE PLASTIO CROM. C / BRAZO Y CHAPETON" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "SELLADOR ACRILASTIC" },
      { unidad: "PZA", cantidad: 1.5, descripcion: "SILICON TRASPARENTE (FUERA DE PPTO 1 PZA)" },
      { unidad: "PZA", cantidad: 14, descripcion: "SOCKET BAQUELITA" },
      { unidad: "PZA", cantidad: 14, descripcion: "TAPA GALV. 3 X 3" },
      { unidad: "PZA", cantidad: 16, descripcion: "TAQUETES DE PLASTICO DE 1/4 (FUERA DE PPTO 8 PZA)" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPA GALV. 4 X 4 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "MANGUERA PARA FREGADERO DE 1/2 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CUBRETALADRO DE ACERO INOXIDABLE (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "LLAVE NARIZ DE PLASTICO DE 1/2 (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-F,G,H-8-hcxi2tc2",
    concepto: "AMUEBLADOS PA",
    subConcepto: "AMUEBLADOS PA",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "PASTILLA TERMICA DE 1 X 15" },
      { unidad: "PZA", cantidad: 6, descripcion: "PASTILLA TERMICA DE 1 X 20" },
      { unidad: "PZA", cantidad: 2, descripcion: "JUNTA PROEL" },
      { unidad: "PZA", cantidad: 6, descripcion: "LLAVE ANGULAR (FUERA DE PPTO 2 PZA)" },
      { unidad: "PZA", cantidad: 2, descripcion: "LLAVE INDIVIDUAL PARA LAVABO ACABADO CROMO" },
      { unidad: "PZA", cantidad: 4, descripcion: "LLAVE NARIZ DE PLASTICO DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "LLAVE PARA FREGADERO" },
      { unidad: "PZA", cantidad: 2, descripcion: "MANGUERA PARA LAVABO DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "MANGUERA PARA WC DE 1/2" },
      { unidad: "PAQUETE", cantidad: 2, descripcion: "MUEBLES SANITARIOS COLOR BLANCO,TAZA Y LAVABO" },
      { unidad: "PZA", cantidad: 40, descripcion: "PIJA GALVANIZADA 8 X 3/4" },
      { unidad: "PZA", cantidad: 12, descripcion: "PIJA GALVANIZADA CABEZA COMBINADA 10 X 1 1/2 (FUERA DE PPTO 4 PZA)" },
      { unidad: "PZA", cantidad: 12, descripcion: "PIJAS PARA LAVABO (FUERA DE PPTO 4 PZA)" },
      { unidad: "PZA", cantidad: 28, descripcion: "PLACA 1 VENTANA" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA 2 VENTANA" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA PARA INTERPERIE PARA RECEPTACULO DUPLEX" },
    ]
  },
  {
    id: "template-F,G,H-9-a7kdwela",
    concepto: "(COLOR NEGRO) (COLOR VERDE) (COLOR BLANCO) (COLOR BLANCO) (COLOR NEGRO) CABLEADO PLANTA BAJA",
    subConcepto: "(COLOR NEGRO) (COLOR VERDE) (COLOR BLANCO) (COLOR BLANCO) (COLOR NEGRO) CABLEADO PLANTA BAJA",
    paquete: "F,G,H",
    items: [
      { unidad: "ML", cantidad: 172, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12" },
      { unidad: "ML", cantidad: 115, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12" },
      { unidad: "ML", cantidad: 159, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12 (FUERA DE PPTO 36 ML)" },
      { unidad: "ML", cantidad: 90, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 14" },
      { unidad: "ML", cantidad: 160, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 14" },
      { unidad: "PZA", cantidad: 4, descripcion: "CINTA DE AISLAR" },
    ]
  },
  {
    id: "template-F,G,H-10-2jdt05m2",
    concepto: "(COLOR NEGRO) (COLOR VERDE) MURETES CABLEADO PLANTA BAJA",
    subConcepto: "(COLOR NEGRO) (COLOR VERDE) MURETES CABLEADO PLANTA BAJA",
    paquete: "F,G,H",
    items: [
      { unidad: "ML", cantidad: 67, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 8" },
      { unidad: "ML", cantidad: 34, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 10" },
    ]
  },
  {
    id: "template-F,G,H-11-2u5ddj6f",
    concepto: "MURETES MATERIAL ELECTRICO 1 LOTE",
    subConcepto: "MURETES MATERIAL ELECTRICO 1 LOTE",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "VARILLA COPPERWELD DE 5/8 DIAM. X 1.50 M" },
      { unidad: "PZA", cantidad: 4, descripcion: "QUINTA TERMINAL REFORZADA" },
      { unidad: "PZA", cantidad: 4, descripcion: "INTERRUPTOR TERMOMAGNETICO 2X30 AMP." },
      { unidad: "PZA", cantidad: 4, descripcion: "CONECTOR MECANICO PARA VARILLA COPPERWELD DE 5/8 DIAM." },
    ]
  },
  {
    id: "template-F,G,H-12-zvk23m9z",
    concepto: "BOQUILLAS MURO PLANTA BAJA",
    subConcepto: "BOQUILLAS MURO PLANTA BAJA",
    paquete: "F,G,H",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON (FUERA DE PPTO)" },
      { unidad: "M2", cantidad: 0.08, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE .40X.20 M) (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-F,G,H-13-6prnjx1k",
    concepto: "MASILLA MURO INTERIOR PLANTA BAJA",
    subConcepto: "MASILLA MURO INTERIOR PLANTA BAJA",
    paquete: "F,G,H",
    items: [
      { unidad: "SACO", cantidad: 9, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 14, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.49, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE 0.70X 0.70 M)" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-F,G,H-14-vaqhe4vv",
    concepto: "MASILLA INTERIOR PLANTA ALTA",
    subConcepto: "MASILLA INTERIOR PLANTA ALTA",
    paquete: "F,G,H",
    items: [
      { unidad: "SACO", cantidad: 9, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 14, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.49, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE 0.70X 0.70 M)" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-F,G,H-15-3mpxgj2z",
    concepto: "MASILLA EXTERIOR PLANTA BAJA",
    subConcepto: "MASILLA EXTERIOR PLANTA BAJA",
    paquete: "F,G,H",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 5, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.16, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE 0.40X 0.40 M) (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-F,G,H-16-711vvx26",
    concepto: "CUADRO INTERIOR DERECHO",
    subConcepto: "CUADRO INTERIOR DERECHO",
    paquete: "F,G,H",
    items: [
      { unidad: "SACO", cantidad: 2, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON" },
    ]
  },
  {
    id: "template-F,G,H-17-apx0s8m4",
    concepto: "\"MATERIAL FUERA DE PRESUPUESTO\" HUELLAS ACCESO, FIRME Y ENTORTADO",
    subConcepto: "\"MATERIAL FUERA DE PRESUPUESTO\" HUELLAS ACCESO, FIRME Y ENTORTADO",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 0.5, descripcion: "HILO PARA PESCA DE 1MM-100MT" },
      { unidad: "KG", cantidad: 0.25, descripcion: "CLAVO DE 2 1/2 PARA CONCRETO" },
    ]
  },
  {
    id: "template-F,G,H-18-y2ytekqg",
    concepto: "TAPA JUNTAS EN AZOTEA (1 LOTE)",
    subConcepto: "TAPA JUNTAS EN AZOTEA (1 LOTE)",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 0.5, descripcion: "BROCHA DE 3 PULG" },
      { unidad: "PZA", cantidad: 2.75, descripcion: "CINTA ADHESIVA IMPERMEABLE" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "GAS BUTANO" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 0.116 IMPERMEABILIZANTE PASA BARRERA DE VAPOR" },
    ]
  },
  {
    id: "template-F,G,H-19-nlxfs9g3",
    concepto: "AZULEJO BAÑO PLANTA ALTA (2 VIV.)",
    subConcepto: "AZULEJO BAÑO PLANTA ALTA (2 VIV.)",
    paquete: "F,G,H",
    items: [
      { unidad: "KG", cantidad: 2, descripcion: "CEMENTO BLANCO" },
      { unidad: "SACO", cantidad: 15, descripcion: "PEGAAZULEJO (SACO 20 KG) (FUERA DE PPTO 2 SACOS)" },
      { unidad: "KG", cantidad: 0.5, descripcion: "ESTOPA BLANCA (FUERA DE PPTO 0.35 KG)" },
      { unidad: "M2", cantidad: 13.96, descripcion: "AZULEJO ROMA HUESO 20.1 X 30.2 (1.82M2/CAJA)( 7 CAJAS MAS 20 PZAS)" },
      { unidad: "M2", cantidad: 2.24, descripcion: "PISO ANTIDERRAPANTE RUBIK BEIGE 20X20 CM ( 1 CAJAS MAS 18 PZAS )" },
    ]
  },
  {
    id: "template-F,G,H-20-2mph3bo6",
    concepto: "TAPAS DE REGISTRO PATIO 2 VIV.",
    subConcepto: "TAPAS DE REGISTRO PATIO 2 VIV.",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "COLADERA UNIVERSAL 10 CM" },
    ]
  },
  {
    id: "template-F,G,H-21-lvpdnawb",
    concepto: "PINTURA INTERIOR PLANTA BAJA (2 VIV.)",
    subConcepto: "PINTURA INTERIOR PLANTA BAJA (2 VIV.)",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 1, descripcion: "BROCHA DE 3 PULG" },
      { unidad: "PZA", cantidad: 1, descripcion: "BROCHA DE CERDA 4" },
      { unidad: "PZA", cantidad: 4, descripcion: "RODILLO PARA PINTAR DE FELPA (FUERA DE PPTO 2 PZA)" },
      { unidad: "LT", cantidad: 6, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 8 PINTURA VINILICA BLANCO INTERIOR (FUERA DE PPTO 0.5 CUBETA)" },
    ]
  },
  {
    id: "template-F,G,H-22-4wusg5cw",
    concepto: "PINTURA EXTERIOR PLANTA BAJA (2 VIV.)",
    subConcepto: "PINTURA EXTERIOR PLANTA BAJA (2 VIV.)",
    paquete: "F,G,H",
    items: [
      { unidad: "LT", cantidad: 1.5, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 2 PINTURA BLANCO EXTERIOR" },
    ]
  },
  {
    id: "template-F,G,H-23-rycs48b4",
    concepto: "PINTURA INTERIOR PLANTA ALTA (2 VIV.)",
    subConcepto: "PINTURA INTERIOR PLANTA ALTA (2 VIV.)",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 1, descripcion: "BROCHA DE 3 PULG" },
      { unidad: "PZA", cantidad: 1, descripcion: "BROCHA DE CERDA 4" },
      { unidad: "PZA", cantidad: 4, descripcion: "RODILLO PARA PINTAR DE FELPA (FUERA DE PPTO 2 PZA)" },
      { unidad: "LT", cantidad: 2, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 9 PINTURA VINILICA BLANCO INTERIOR (FUERA DE PPTO 1.5 CUBETA)" },
    ]
  },
  {
    id: "template-F,G,H-24-hsg12sx4",
    concepto: "PINTURA EN PRETIL",
    subConcepto: "PINTURA EN PRETIL",
    paquete: "F,G,H",
    items: [
      { unidad: "LT", cantidad: 2, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 1 PINTURA BLANCO EXTERIOR" },
    ]
  },
  {
    id: "template-F,G,H-25-2q2nw2zw",
    concepto: "IMPERMEABILIZANTE AZOTEA (1 LOTE)",
    subConcepto: "IMPERMEABILIZANTE AZOTEA (1 LOTE)",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 1, descripcion: "RODILLO PARA PINTAR DE FELPA" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 4 IMPERMEABILIZANTE FIBRATADO ACRILICO 3 AÑOS" },
      { unidad: "PZA", cantidad: 0.33, descripcion: "BROCHA DE 4 (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-F,G,H-26-fbagmyzm",
    concepto: "PUERTAS PLANTA BAJA",
    subConcepto: "PUERTAS PLANTA BAJA",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CERRADURA PARA ACCESO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CERRADURA PARA BAÑO" },
      { unidad: "PZA", cantidad: 6, descripcion: "CERRADURA PARA RECAMARA" },
      { unidad: "PZA", cantidad: 2, descripcion: "MARCO ALUM BLANCO UNIVERSAL 70 X 210 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 6, descripcion: "MARCO ALUM BLANCO UNIVERSAL 80 X 210 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "MARCO ALUMINIO BLANCO UNIVERSAL 90 X 210 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 92, descripcion: "PIJA AGLOMERADA (NEGRA) 8 X 3/4 (CABEZA PLANA DE ESTRELLA) (FUERA DE PPTO 56 PZA)" },
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
    id: "template-F,G,H-27-mjrzz1o3",
    concepto: "TAQUETES DE PLASTICO DE 1/4 X 1 1/2\" (FUERA DE PPTO 8 PZA) TORNILLO GALVANIZADO DE 10 X 1 1/2 (CABEZA PLANA DE ESTRELLA) SELLADOR ACRILASTIC PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.97 X 1.147 MTRS (ACCESO) VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO OX DE 1.17X1.17 MTRS (REC 1) VIDIRO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.67X2.06 MTRS (REC 2) VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.77X0.37 MTRS(BAÑO) VIDRIO CLARO 3MM FIJO INFERIOR C/BROCHE CENTRAL PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO OX DE 0.74X1.17 MTRS VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL DESCRIPCION PUERTAS PLANTA ALTA",
    subConcepto: "TAQUETES DE PLASTICO DE 1/4 X 1 1/2\" (FUERA DE PPTO 8 PZA) TORNILLO GALVANIZADO DE 10 X 1 1/2 (CABEZA PLANA DE ESTRELLA) SELLADOR ACRILASTIC PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.97 X 1.147 MTRS (ACCESO) VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO OX DE 1.17X1.17 MTRS (REC 1) VIDIRO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.67X2.06 MTRS (REC 2) VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO XO DE 0.77X0.37 MTRS(BAÑO) VIDRIO CLARO 3MM FIJO INFERIOR C/BROCHE CENTRAL PZA 2 VENTANA IZQ Y DER HIBRIDA BLANCO OX DE 0.74X1.17 MTRS VIDRIO CLARO 3MM SIN MOSQUITERO BROCHE CENTRAL DESCRIPCION PUERTAS PLANTA ALTA",
    paquete: "F,G,H",
    items: [
      { unidad: "PZA", cantidad: 48, descripcion: "(FUERA DE PPTO 8 PZA)" },
    ]
  },
  {
    id: "template-F,G,H-28-ttgnxhyi",
    concepto: "\"MATERIAL FUERA DE PRESUPUESTO\" LECHADA EN PISO PLANTA BAJA Y ALTA (4 VIV.)",
    subConcepto: "\"MATERIAL FUERA DE PRESUPUESTO\" LECHADA EN PISO PLANTA BAJA Y ALTA (4 VIV.)",
    paquete: "F,G,H",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 8, descripcion: "ADEBON" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "BROCHA DE CERDA 4 (FUERA DE PPTO)" },
    ]
  },
  {
    id: "template-P,Q,K,J-1-tfg65m3k",
    concepto: "CIMENTACION",
    subConcepto: "CIMENTACION",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "POLINES 4 X 4 X 8 PIE" },
      { unidad: "PZA", cantidad: 5, descripcion: "BARROTE 2 X 4 X 8 PIES" },
    ]
  },
  {
    id: "template-P,Q,K,J-2-qcwhdw8l",
    concepto: "MALLA MURO PB",
    subConcepto: "MALLA MURO PB",
    paquete: "P,Q,K,J",
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
    id: "template-P,Q,K,J-3-pqe03nnd",
    concepto: "LOSA DE ENTREPISO ACERO",
    subConcepto: "LOSA DE ENTREPISO ACERO",
    paquete: "P,Q,K,J",
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
    id: "template-P,Q,K,J-4-lwngb7zh",
    concepto: "MALLA MURO PA",
    subConcepto: "MALLA MURO PA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "KG", cantidad: 3, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "M2", cantidad: 26, descripcion: "MALLA ELECTROSOLDADA 6X6 10/10" },
      { unidad: "PZA", cantidad: 60, descripcion: "DISCO SEPARADOR RTP-05-175M" },
    ]
  },
  {
    id: "template-P,Q,K,J-5-ycu3os68",
    concepto: "MALLA LOSA DE AZOTEA",
    subConcepto: "MALLA LOSA DE AZOTEA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "KG", cantidad: 2, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "M2", cantidad: 25, descripcion: "MALLA ELECTROSOLDADA 6X6 10/10" },
      { unidad: "PZA", cantidad: 20, descripcion: "SILLETA MALLA (SM-300)" },
    ]
  },
  {
    id: "template-P,Q,K,J-6-4ukr1l8k",
    concepto: "CIMBRA MOLDE PB",
    subConcepto: "CIMBRA MOLDE PB",
    paquete: "P,Q,K,J",
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
    id: "template-P,Q,K,J-7-3rz54bzp",
    concepto: "DESCRIPCION CIMBRA MOLDE PRETIL",
    subConcepto: "DESCRIPCION CIMBRA MOLDE PRETIL",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "LT", cantidad: 15, descripcion: "DESMOLDANTE LIQUIDO, PROTECTOR DE CIMBRAS" },
      { unidad: "KG", cantidad: 5, descripcion: "ALAMBRE RECOCIDO" },
      { unidad: "M2", cantidad: 2, descripcion: "BAJO ALFOMBRA POLI PAD BLANCO" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA DE POLIESTIRENO DE 3 CM DE ESPESOR" },
    ]
  },
  {
    id: "template-P,Q,K,J-8-62k4aei6",
    concepto: "CIMBRA MOLDE ESCALERA",
    subConcepto: "CIMBRA MOLDE ESCALERA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 2, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4.5, descripcion: "ADEBON" },
    ]
  },
  {
    id: "template-P,Q,K,J-9-hpk574zq",
    concepto: "MASILLA EN BARDA",
    subConcepto: "MASILLA EN BARDA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 4, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON" },
      { unidad: "PZA", cantidad: 0.25, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
    ]
  },
  {
    id: "template-P,Q,K,J-10-w3k5gcgt",
    concepto: "INST. SANITARIA DESCRIPCION INST. HIDRAULICO CIMENTACION",
    subConcepto: "INST. SANITARIA DESCRIPCION INST. HIDRAULICO CIMENTACION",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CODO CPVC 1 X 45" },
      { unidad: "PZA", cantidad: 16, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC DE 3/4 X 90" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 1 X 90 CPVC" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO CPVC 475 GR" },
      { unidad: "PZA", cantidad: 6, descripcion: "REDUCCION DE 1 X 3/4 CPCV" },
      { unidad: "PZA", cantidad: 16, descripcion: "REDUCCION DE 3/4 A 1/2 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPON DE 1 DIAM. CPVC" },
      { unidad: "PZA", cantidad: 12, descripcion: "TAPON DE 1/2 DIAM CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPON DE 3/4 DIAM CPVC" },
      { unidad: "PZA", cantidad: 12, descripcion: "TAPON MACHO DE CPVC DE 1/2 ROSCABLE (FUERA DE PPTO 4 PZA)" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE CPVC DE 1" },
      { unidad: "PZA", cantidad: 8, descripcion: "TEE CPVC DE 3/4" },
      { unidad: "ML", cantidad: 9.15, descripcion: "TUBO CPVC DE 1 PULG DE DIAM." },
      { unidad: "ML", cantidad: 36.4, descripcion: "TUBO CPVC DE 1/2 DIAM x 3.05 MTS" },
      { unidad: "ML", cantidad: 18.3, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3,05" },
    ]
  },
  {
    id: "template-P,Q,K,J-11-qkmt6199",
    concepto: "INST. ELECTRICO CIMENTACION",
    subConcepto: "INST. ELECTRICO CIMENTACION",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 3, descripcion: "TUBO CONDUIT LIGERO DE 1 1/4 DIAM." },
      { unidad: "PZA", cantidad: 4, descripcion: "CURVA CONDUIT LIGERO DE 1 1/4 DIAM." },
    ]
  },
  {
    id: "template-P,Q,K,J-12-29sl7tyf",
    concepto: "INST. SANITARIA MURO PB",
    subConcepto: "INST. SANITARIA MURO PB",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 8, descripcion: "CODO DE 2 X90 PVC" },
      { unidad: "PZA", cantidad: 6, descripcion: "COPLE PVC SANIT 2 DIAM" },
      { unidad: "PZA", cantidad: 2, descripcion: "COPLE PVC SANITARIO DE 3" },
      { unidad: "ML", cantidad: 1, descripcion: "LIJA ESMERIL" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO TANGIT 475 GR" },
      { unidad: "ML", cantidad: 6, descripcion: "TUBO PVC 3 DIAM." },
      { unidad: "ML", cantidad: 24, descripcion: "TUBO SANITARIO DE PVC DE 50 MM DE DIAMETRO" },
      { unidad: "PZA", cantidad: 8, descripcion: "YEE PVC SANIT 2 X 2 X 2 DIAM" },
    ]
  },
  {
    id: "template-P,Q,K,J-13-68rjn9gi",
    concepto: "INST. HIDRAULICA MURO PB",
    subConcepto: "INST. HIDRAULICA MURO PB",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CODO CPVC 1 X 45" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 16, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO CPVC DE 3/4 X 90" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE OREJA CPVC 1/2" },
      { unidad: "PZA", cantidad: 10, descripcion: "COPLE CPVC DE 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "COPLE DE 3/4 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "REDUCCION DE 3/4 A 1/2 CPVC" },
      { unidad: "ML", cantidad: 6.1, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3.05 MTS" },
    ]
  },
  {
    id: "template-P,Q,K,J-14-3fyk0v2l",
    concepto: "MATERIAL PARA REPARACIONES",
    subConcepto: "MATERIAL PARA REPARACIONES",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "KG", cantidad: 2, descripcion: "ALAMBRE GALVANIZADO CAL 14" },
      { unidad: "PZA", cantidad: 6, descripcion: "CAJA GALV. DE 4" },
      { unidad: "PZA", cantidad: 2, descripcion: "CENTRO DE CARGA QO 8" },
      { unidad: "PZA", cantidad: 36, descripcion: "CHALUPA GALV. 2 X 4" },
      { unidad: "PZA", cantidad: 1, descripcion: "PLACA DE POLIESTIRENO DE 3 CM. DE ESPESOR" },
      { unidad: "ML", cantidad: 16, descripcion: "POLIDUCTO NARANJA DE 1 DIAM." },
      { unidad: "ML", cantidad: 50, descripcion: "POLIDUCTO NARANJA DE 13MM (1/2)" },
    ]
  },
  {
    id: "template-P,Q,K,J-15-jmov50su",
    concepto: "INST. ELECTRICA LOSA ENTREPISO \"MATERIAL FUERA DE PRESUPUESTO\" INST. ELECTRICA MURO PB Y ENTREPISO",
    subConcepto: "INST. ELECTRICA LOSA ENTREPISO \"MATERIAL FUERA DE PRESUPUESTO\" INST. ELECTRICA MURO PB Y ENTREPISO",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "TAPA DE CENTRO DE CARGA QO 8" },
    ]
  },
  {
    id: "template-P,Q,K,J-16-v29bnhvt",
    concepto: "MATERIAL PARA INSTALACIONES",
    subConcepto: "MATERIAL PARA INSTALACIONES",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 8, descripcion: "CODO DE 2 X90 PVC" },
      { unidad: "PZA", cantidad: 10, descripcion: "COPLE PVC SANIT 2 DIAM" },
      { unidad: "ML", cantidad: 1, descripcion: "LIJA ESMERIL" },
      { unidad: "ML", cantidad: 36, descripcion: "TUBO SANITARIO DE PVC DE 50 MM DE DIAMETRO" },
      { unidad: "PZA", cantidad: 8, descripcion: "YEE PVC SANIT 2 X 2 X 2 DIAM" },
    ]
  },
  {
    id: "template-P,Q,K,J-17-k9ui6zwh",
    concepto: "INST. HIDRAULICA MUROS PA",
    subConcepto: "INST. HIDRAULICA MUROS PA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
    ]
  },
  {
    id: "template-P,Q,K,J-18-sbzrghad",
    concepto: "INST. ELECTRICA MURO PA",
    subConcepto: "INST. ELECTRICA MURO PA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "KG", cantidad: 0.25, descripcion: "ALAMBRE GALVANIZADO CAL 14 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CHALUPA GALV. 2 X 4" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC 3/4 X 90" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO PVC SANITARIO DE 3 X 45 (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "COPLE CPVC DE 3/4" },
      { unidad: "PZA", cantidad: 4, descripcion: "COPLE PVC SANITARIO DE 3" },
      { unidad: "ML", cantidad: 0.5, descripcion: "LIJA ESMERIL" },
      { unidad: "ML", cantidad: 41, descripcion: "POLIDUCTO NARANJA DE 19 MM DIAM (3/4)" },
      { unidad: "PZA", cantidad: 8, descripcion: "TAPON CAPA DE 3 DIAM. PVC" },
      { unidad: "ML", cantidad: 19, descripcion: "TUBO CPVC DE 3/4 DE DIAM X 3.05 MTS" },
      { unidad: "ML", cantidad: 18, descripcion: "TUBO PVC 3 DIAM." },
    ]
  },
  {
    id: "template-P,Q,K,J-19-o60npx1o",
    concepto: "LOSA DE AZOTEA SANITARIO, ELECTRICO HIDRAULICO",
    subConcepto: "LOSA DE AZOTEA SANITARIO, ELECTRICO HIDRAULICO",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 14, descripcion: "CAJA CGALV. 3 X 3" },
    ]
  },
  {
    id: "template-P,Q,K,J-20-2y6eamuu",
    concepto: "ELABORACION",
    subConcepto: "ELABORACION",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "PZA", cantidad: 2, descripcion: "CESPOL BOTE PVC C/TR S/BAJA 50, TUBOS FLEX." },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 2 X45 PVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 2 X90 PVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO DE 4 X 45 PVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 4X90 CON SAL TRACERA DE 2" },
      { unidad: "PZA", cantidad: 1, descripcion: "PEGAMENTO TANGIT 475 GR (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 2, descripcion: "TAPON DE 4 DIAM. PVC SANITARIO" },
      { unidad: "ML", cantidad: 6, descripcion: "TUBO PVC NORMA DE 4 X 6ML" },
      { unidad: "ML", cantidad: 6, descripcion: "TUBO SANITARIO DE PVC DE 50 MM DE DIAMETRO" },
      { unidad: "PZA", cantidad: 2, descripcion: "YEE DE 4 X 2 X 4 PVC" },
    ]
  },
  {
    id: "template-P,Q,K,J-21-yk910jpo",
    concepto: "INSTALACION TINACO PLANTA BAJA",
    subConcepto: "INSTALACION TINACO PLANTA BAJA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 6, descripcion: "CINTA TEFLON DE 3/4" },
      { unidad: "PZA", cantidad: 2, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO DE 1 X 90 CPVC" },
      { unidad: "PZA", cantidad: 2, descripcion: "CONECTOR CAFRI DE 1 CPVC" },
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
    id: "template-P,Q,K,J-22-8d4w5dol",
    concepto: "INSTALACION TINACO",
    subConcepto: "INSTALACION TINACO",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 4, descripcion: "ABRAZADERA SIN FIN REFORZADA DE 3/4\"" },
      { unidad: "PZA", cantidad: 1, descripcion: "CINTA TEFLON DE 1/2" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 20, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TAPON DE 1/2 DIAM CPVC" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE 1/2 CPVC" },
      { unidad: "ML", cantidad: 21, descripcion: "TUBO CPVC DE 1/2 DIAM x 3.05 MTS" },
      { unidad: "PZA", cantidad: 4, descripcion: "VALVULA DE COMPUERTA CPVC DE 1/2 DIAM" },
      { unidad: "PZA", cantidad: 4, descripcion: "CONECTOR CAFRE DE 1/2 DIAM. CPVC" },
    ]
  },
  {
    id: "template-P,Q,K,J-23-iu3uv81a",
    concepto: "MATERIAL PATIO HIDRAULICO",
    subConcepto: "MATERIAL PATIO HIDRAULICO",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "PZA", cantidad: 2, descripcion: "CINTA TEFLON DE 1/2" },
      { unidad: "PZA", cantidad: 8, descripcion: "CODO CPVC 1/2 X 45" },
      { unidad: "PZA", cantidad: 4, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 8, descripcion: "CONECTOR CAFRE DE 1/2 DIAM. CPVC" },
      { unidad: "JGO", cantidad: 2, descripcion: "LLAVE DE EMPOTRAR ROSCABLE P/REGADERA" },
    ]
  },
  {
    id: "template-P,Q,K,J-24-vyvlcdit",
    concepto: "INST. LLAVES DE EMPOTRAR PA INFONAVIT BICENTENARIO DIAMANTE II INFO-ACCESORIADO DE VIVIENDAS PB 26 BIC INF DIAM DESCRIPCION ACCESORIADOS PB",
    subConcepto: "INST. LLAVES DE EMPOTRAR PA INFONAVIT BICENTENARIO DIAMANTE II INFO-ACCESORIADO DE VIVIENDAS PB 26 BIC INF DIAM DESCRIPCION ACCESORIADOS PB",
    paquete: "P,Q,K,J",
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
    id: "template-P,Q,K,J-25-fkn1pk7l",
    concepto: "ACCESORIADOS PB INFONAVIT BICENTENARIO DIAMANTE II INFO-EQUIPAMIENTO DE VIVIENDAS PB 26 BIC INF DIAM",
    subConcepto: "ACCESORIADOS PB INFONAVIT BICENTENARIO DIAMANTE II INFO-EQUIPAMIENTO DE VIVIENDAS PB 26 BIC INF DIAM",
    paquete: "P,Q,K,J",
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
      { unidad: "PZA", cantidad: 16, descripcion: "TAQUETES DE PLASTICO DE 1/4 (FUERA DE PPTO 3 PZA)" },
    ]
  },
  {
    id: "template-P,Q,K,J-26-o1glp6vz",
    concepto: "ACCESORIADOS PA",
    subConcepto: "ACCESORIADOS PA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 14, descripcion: "FOCO LED BOMBILLA DE 9 WATTS" },
      { unidad: "PZA", cantidad: 2, descripcion: "PASTILLA TERMICA DE 1 X 15" },
      { unidad: "PZA", cantidad: 6, descripcion: "PASTILLA TERMICA DE 1 X 20" },
      { unidad: "PZA", cantidad: 40, descripcion: "PIJA GALVANIZADA 8 X 3/4" },
      { unidad: "PZA", cantidad: 12, descripcion: "PIJA GALVANIZADA CABEZA COMBINADA 10 X 1 1/2" },
      { unidad: "PZA", cantidad: 2, descripcion: "PLACA PARA INTERPERIE PARA RECEPTACULO DUPLEX" },
      { unidad: "PZA", cantidad: 2, descripcion: "RECEPTACULO DUPLEX POLARIZADO TIPO AMERICANO" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "SELLADOR ACRILASTIC" },
      { unidad: "PZA", cantidad: 1.5, descripcion: "SILICON TRASPARENTE" },
    ]
  },
  {
    id: "template-P,Q,K,J-27-ldldt541",
    concepto: "AMUEBLADOS PA",
    subConcepto: "AMUEBLADOS PA",
    paquete: "P,Q,K,J",
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
      { unidad: "PZA", cantidad: 16, descripcion: "TAQUETES DE PLASTICO DE 1/4 (FUERA DE PPTO 3 PZA)" },
      { unidad: "PZA", cantidad: 4, descripcion: "CUBRETALADRO DE ACERO INOXIDABLE" },
    ]
  },
  {
    id: "template-P,Q,K,J-28-jvwot9dj",
    concepto: "(COLOR NEGRO) (COLOR VERDE) 26 BIC INF DIAM (COLOR NEGRO) DESCRIPCION",
    subConcepto: "(COLOR NEGRO) (COLOR VERDE) 26 BIC INF DIAM (COLOR NEGRO) DESCRIPCION",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "ML", cantidad: 148, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12" },
      { unidad: "ML", cantidad: 148, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12" },
      { unidad: "ML", cantidad: 148, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 12" },
      { unidad: "ML", cantidad: 80, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 14" },
      { unidad: "ML", cantidad: 160, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 14" },
      { unidad: "PZA", cantidad: 4, descripcion: "CINTA DE AISLAR" },
    ]
  },
  {
    id: "template-P,Q,K,J-29-llrqzzmu",
    concepto: "(COLOR NEGRO) DIAMANTE II INFO-CABLEADO DE MURETES DE PB 26 BIC INF DIAM INFO-CABLEADO DE MURETES DE PA 26 BIC INF DIAM (COLOR BLANCO) (COLOR VERDE) MURETES CABLEADO PLANTA ALTA",
    subConcepto: "(COLOR NEGRO) DIAMANTE II INFO-CABLEADO DE MURETES DE PB 26 BIC INF DIAM INFO-CABLEADO DE MURETES DE PA 26 BIC INF DIAM (COLOR BLANCO) (COLOR VERDE) MURETES CABLEADO PLANTA ALTA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "ML", cantidad: 67, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 8" },
      { unidad: "ML", cantidad: 34, descripcion: "CABLE CCA BIMETALICO ALUMINIO COBRE ANTIFLAMA PVC THWLS 10" },
    ]
  },
  {
    id: "template-P,Q,K,J-30-8mn8b7rs",
    concepto: "MURETES MATERIAL DIAMANTE II INFO-COLOCACION DE MURETES ELECTRICO 1 LOTE INFONAVIT BICENTENARIO DIAMANTE II INFO-INSTALACIONES CIMENTACION 26 BIC INF DIAM",
    subConcepto: "MURETES MATERIAL DIAMANTE II INFO-COLOCACION DE MURETES ELECTRICO 1 LOTE INFONAVIT BICENTENARIO DIAMANTE II INFO-INSTALACIONES CIMENTACION 26 BIC INF DIAM",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CINTA TEFLON DE 3/4" },
      { unidad: "PZA", cantidad: 24, descripcion: "CODO CPVC DE 1/2 X 90" },
      { unidad: "PZA", cantidad: 4, descripcion: "CONECTOR CAFRI 1/2 CPVC" },
      { unidad: "PZA", cantidad: 8, descripcion: "TAPON DE 1 DIAM. CPVC" },
      { unidad: "PZA", cantidad: 24, descripcion: "TAPON DE 1/2 DIAM CPVC" },
      { unidad: "PZA", cantidad: 8, descripcion: "TAPON MACHO DE PVC DE 1/2 ROSCABLE (FUERA DE PPTO)" },
      { unidad: "PZA", cantidad: 4, descripcion: "TEE 1/2 CPVC" },
    ]
  },
  {
    id: "template-P,Q,K,J-31-km8y7i1q",
    concepto: "MURETES INFONAVIT BICENTENARIO DIAMANTE II INFO-COLOCACION DE MURETES 26 BIC INF DIAM PRUEBA DE BAJATE PLUVIAL PB Y PA",
    subConcepto: "MURETES INFONAVIT BICENTENARIO DIAMANTE II INFO-COLOCACION DE MURETES 26 BIC INF DIAM PRUEBA DE BAJATE PLUVIAL PB Y PA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "MURETE DE CONCRETO PARA MEDICION DE DOS SERVICIOS" },
    ]
  },
  {
    id: "template-P,Q,K,J-32-zpfwfic0",
    concepto: "BOQUILLAS MURO PLANTA ALTA AUTORIZÓ: ING. ALEJANDRO HIDALGO L.",
    subConcepto: "BOQUILLAS MURO PLANTA ALTA AUTORIZÓ: ING. ALEJANDRO HIDALGO L.",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.08, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE .40X.20 M)" },
    ]
  },
  {
    id: "template-P,Q,K,J-33-5lljqlvi",
    concepto: "MASILLA MURO INTERIOR PLANTA BAJA SEGUNDO VALE",
    subConcepto: "MASILLA MURO INTERIOR PLANTA BAJA SEGUNDO VALE",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 9, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 14, descripcion: "ADEBON" },
    ]
  },
  {
    id: "template-P,Q,K,J-34-qqh65ozb",
    concepto: "MASILLA INTERIOR PLANTA ALTA SEGUNDO VALE",
    subConcepto: "MASILLA INTERIOR PLANTA ALTA SEGUNDO VALE",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 9, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 14, descripcion: "ADEBON" },
    ]
  },
  {
    id: "template-P,Q,K,J-35-tlq198ny",
    concepto: "MASILLA EXTERIOR PLANTA ALTA",
    subConcepto: "MASILLA EXTERIOR PLANTA ALTA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 5, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.16, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE 0.40X 0.40 M)" },
    ]
  },
  {
    id: "template-P,Q,K,J-36-8jmy585k",
    concepto: "CUADRO INTERIOR IZQUIERDO",
    subConcepto: "CUADRO INTERIOR IZQUIERDO",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 2, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 4, descripcion: "ADEBON" },
    ]
  },
  {
    id: "template-P,Q,K,J-37-3fuu8l7f",
    concepto: "MASILLA EN ESCALERA (LATERALES)",
    subConcepto: "MASILLA EN ESCALERA (LATERALES)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 3, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 8.5, descripcion: "ADEBON" },
      { unidad: "M2", cantidad: 0.08, descripcion: "ESPONJA DE 2 PULG DE ESPESOR ( 1 PEDAZO DE .40X.20 M)" },
    ]
  },
  {
    id: "template-P,Q,K,J-38-s4hc1mo7",
    concepto: "TAPA JUNTAS EN AZOTEA (1 LOTE)",
    subConcepto: "TAPA JUNTAS EN AZOTEA (1 LOTE)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 0.5, descripcion: "HILO PARA PESCA DE 1MM-100MT" },
      { unidad: "KG", cantidad: 0.25, descripcion: "CLAVO DE 2 1/2 PARA CONCRETO" },
    ]
  },
  {
    id: "template-P,Q,K,J-39-cicie3j7",
    concepto: "AZULEJO BAÑO PLANTA BAJA (2 VIV.)",
    subConcepto: "AZULEJO BAÑO PLANTA BAJA (2 VIV.)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 0.5, descripcion: "BROCHA DE 3 PULG" },
      { unidad: "PZA", cantidad: 2.75, descripcion: "CINTA ADHESIVA IMPERMEABLE" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "GAS BUTANO" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 0.116 IMPERMEABILIZANTE PASA BARRERA DE VAPOR" },
    ]
  },
  {
    id: "template-P,Q,K,J-40-7iejsgk4",
    concepto: "(MATERIAL FUERA DE PRESUPUESTO) ZOCLO EN FREGADERO Y LAVABO (1 LOTE)",
    subConcepto: "(MATERIAL FUERA DE PRESUPUESTO) ZOCLO EN FREGADERO Y LAVABO (1 LOTE)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "KG", cantidad: 2, descripcion: "CEMENTO BLANCO" },
      { unidad: "SACO", cantidad: 15, descripcion: "PEGAAZULEJO (SACO 20 KG)" },
      { unidad: "KG", cantidad: 0.5, descripcion: "ESTOPA BLANCA" },
      { unidad: "M2", cantidad: 13.96, descripcion: "AZULEJO ROMA HUESO 20.1 X 30.2 (1.82M2/CAJA)( 7 CAJAS MAS 20 PZAS)" },
      { unidad: "M2", cantidad: 2.24, descripcion: "PISO ANTIDERRAPANTE RUBIK BEIGE 20X20 CM ( 1 CAJAS MAS 18 PZAS )" },
    ]
  },
  {
    id: "template-P,Q,K,J-41-7dtqfnpv",
    concepto: "(MATERIAL FUERA DE PRESUPUESTO) COLOCACION MENSULAS PB Y PA (4 VIV.)",
    subConcepto: "(MATERIAL FUERA DE PRESUPUESTO) COLOCACION MENSULAS PB Y PA (4 VIV.)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "COLADERA UNIVERSAL 10 CM" },
    ]
  },
  {
    id: "template-P,Q,K,J-42-sltqhff2",
    concepto: "\"MATERIAL FUERA DE PRESUPUESTO\" PINTURA INTERIOR PLANTA BAJA (2 VIV.)",
    subConcepto: "\"MATERIAL FUERA DE PRESUPUESTO\" PINTURA INTERIOR PLANTA BAJA (2 VIV.)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 1, descripcion: "BROCHA DE 3 PULG" },
      { unidad: "PZA", cantidad: 1, descripcion: "BROCHA DE CERDA 4" },
      { unidad: "PZA", cantidad: 4, descripcion: "RODILLO PARA PINTAR DE FELPA" },
      { unidad: "LT", cantidad: 6, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 8 PINTURA VINILICA BLANCO INTERIOR" },
    ]
  },
  {
    id: "template-P,Q,K,J-43-qb9ght4e",
    concepto: "PINTURA INTERIOR PLANTA ALTA (2 VIV.)",
    subConcepto: "PINTURA INTERIOR PLANTA ALTA (2 VIV.)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "LT", cantidad: 1.5, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 2 PINTURA BLANCO EXTERIOR" },
    ]
  },
  {
    id: "template-P,Q,K,J-44-pyq1o2qx",
    concepto: "PINTURA EXTERIOR PLANTA ALTA (2 VIV.)",
    subConcepto: "PINTURA EXTERIOR PLANTA ALTA (2 VIV.)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 0.5 PINTURA COLOR ROJO CODIGO IT 152-4" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 0.5 PINTURA COLOR GRIS CODIGO IT 141-7" },
      { unidad: "PZA", cantidad: 1, descripcion: "RODILLO PARA PINTAR DE FELPA" },
    ]
  },
  {
    id: "template-P,Q,K,J-45-86d1itfw",
    concepto: "IMPERMEABILIZANTE AZOTEA (1 LOTE)",
    subConcepto: "IMPERMEABILIZANTE AZOTEA (1 LOTE)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "RODILLO PARA PINTAR DE FELPA" },
      { unidad: "LT", cantidad: 1.5, descripcion: "SELLADOR 5 X 1" },
      { unidad: "CUBETA", cantidad: 19, descripcion: "LTS 3 PINTURA BLANCO EXTERIOR" },
    ]
  },
  {
    id: "template-P,Q,K,J-46-oy0z41gv",
    concepto: "LIMPIEZA FINA PB Y PA (4 VIV.)",
    subConcepto: "LIMPIEZA FINA PB Y PA (4 VIV.)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PAQUETE", cantidad: 4, descripcion: "ACCESORIOS DE BAÑO (TOALLEROS,JABONERAS,ETC.)" },
      { unidad: "KG", cantidad: 6, descripcion: "CEMENTO BLANCO" },
    ]
  },
  {
    id: "template-P,Q,K,J-47-lfyc79nq",
    concepto: "PUERTAS PLANTA ALTA",
    subConcepto: "PUERTAS PLANTA ALTA",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "PZA", cantidad: 2, descripcion: "CERRADURA PARA ACCESO" },
      { unidad: "PZA", cantidad: 2, descripcion: "CERRADURA PARA BAÑO" },
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
    id: "template-P,Q,K,J-48-im7m7av4",
    concepto: "\"MATERIAL FUERA DE PRESUPUESTO\" LECHADA EN PISO PLANTA BAJA Y ALTA (4 VIV.)",
    subConcepto: "\"MATERIAL FUERA DE PRESUPUESTO\" LECHADA EN PISO PLANTA BAJA Y ALTA (4 VIV.)",
    paquete: "P,Q,K,J",
    items: [
      { unidad: "SACO", cantidad: 0.5, descripcion: "CEMENTO GRIS SACO DE 50 KG" },
      { unidad: "LT", cantidad: 8, descripcion: "ADEBON" },
      { unidad: "PZA", cantidad: 0.5, descripcion: "BROCHA DE CERDA 4" },
    ]
  },
];
