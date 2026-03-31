import React, { useState, useRef, useEffect, useMemo } from 'react';
import { VOUCHER_TEMPLATES, VoucherTemplate, VoucherItem } from './data/templates';
import { Download, Search, FileText, Plus, Trash2, FileSpreadsheet, Upload, Settings, RefreshCw, AlertTriangle, LayoutDashboard, Filter, Calendar, ListChecks, Menu, Home, Users, UserPlus, LogOut, Save, Package, X, Edit2, Moon, Sun } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as pdfjs from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { db, auth } from './firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, getDoc, getDocs, writeBatch } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Capturista';
  createdAt: string;
  password?: string;
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
  createdAt?: string;
  createdBy?: string;
}

interface Budget {
  id: string;
  paquete: string;
  ubicacion: string;
  concepto: string;
  material: string;
  unidad: string;
  cantidadPresupuesto: number;
  salidas: number;
  saldoTotal: number;
  createdAt: string;
}

const LOCATION_DATA: Record<string, { mza: number, lotes: number[] }[]> = {
  'E': [
    { mza: 98, lotes: Array.from({ length: 14 }, (_, i) => i + 1) },
    { mza: 99, lotes: Array.from({ length: 14 }, (_, i) => i + 1) },
  ],
  'F': [
    { mza: 100, lotes: Array.from({ length: 14 }, (_, i) => i + 1) },
    { mza: 101, lotes: Array.from({ length: 5 }, (_, i) => i + 1) },
    { mza: 102, lotes: Array.from({ length: 6 }, (_, i) => i + 1) },
  ],
  'G': [
    { mza: 102, lotes: Array.from({ length: 4 }, (_, i) => i + 7) },
    { mza: 93, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 94, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 95, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
  ],
  'H': [
    { mza: 88, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 89, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 96, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
  ],
  'I': [
    { mza: 90, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 91, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 92, lotes: [1, 2, 3, 4, 5, 9] },
  ],
  'J': [
    { mza: 83, lotes: Array.from({ length: 9 }, (_, i) => i + 1) },
    { mza: 84, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 85, lotes: Array.from({ length: 12 }, (_, i) => i + 1) },
    { mza: 86, lotes: Array.from({ length: 12 }, (_, i) => i + 1) },
  ],
  'K': [
    { mza: 103, lotes: Array.from({ length: 26 }, (_, i) => i + 1) },
  ],
  'O': [
    { mza: 46, lotes: Array.from({ length: 7 }, (_, i) => i + 3) },
    { mza: 49, lotes: Array.from({ length: 8 }, (_, i) => i + 1) },
    { mza: 50, lotes: Array.from({ length: 8 }, (_, i) => i + 1) },
    { mza: 51, lotes: [1, 2, 3, 4, 10, 11, 12, 13] },
  ],
  'P': [
    { mza: 47, lotes: Array.from({ length: 8 }, (_, i) => i + 1) },
    { mza: 48, lotes: Array.from({ length: 8 }, (_, i) => i + 1) },
    { mza: 54, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 55, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 56, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
  ],
  'Q': [
    { mza: 52, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 53, lotes: Array.from({ length: 10 }, (_, i) => i + 1) },
    { mza: 60, lotes: Array.from({ length: 12 }, (_, i) => i + 1) },
    { mza: 61, lotes: Array.from({ length: 12 }, (_, i) => i + 1) },
  ]
};

const getVoucherIncompleteReason = (voucher: VoucherData): string | null => {
  const { header, items } = voucher;
  if (!header.obra?.trim()) return "Falta la obra.";
  if (!header.prototipo?.trim()) return "Falta el prototipo.";
  if (!header.paquete?.trim()) return "Falta el paquete.";
  if (!header.fecha?.trim()) return "Falta la fecha.";
  if (!header.ubicacion?.trim()) return "Falta la ubicación.";
  if (!header.destajista?.trim()) return "Falta el destajista.";
  if (!header.elaboro?.trim()) return "Falta quién elaboró.";
  if (!header.autorizo?.trim()) return "Falta quién autorizó.";
  if (!header.concepto?.trim()) return "Falta el concepto.";
  
  if (items.length === 0) return "El vale debe tener al menos una partida.";
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.unidad?.trim()) return `Falta la unidad en la partida ${i + 1}.`;
    if (!item.cantidad || item.cantidad <= 0) return `La cantidad debe ser mayor a 0 en la partida ${i + 1}.`;
    if (!item.descripcion?.trim()) return `Falta la descripción en la partida ${i + 1}.`;
  }
  
  return null;
};

export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [vouchers, setVouchers] = useState<VoucherData[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showOnlyExceeded, setShowOnlyExceeded] = useState(false);
  const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState(false);
  const [isDeletingBudget, setIsDeletingBudget] = useState(false);
  const [isUploadingBudget, setIsUploadingBudget] = useState(false);
  const [isUploadingTemplates, setIsUploadingTemplates] = useState(false);
  const [filterPaquete, setFilterPaquete] = useState('');
  const [filterUbicacion, setFilterUbicacion] = useState('');
  const [filterConcepto, setFilterConcepto] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('');
  const [filterUnidad, setFilterUnidad] = useState('');
  const [customTemplates, setCustomTemplates] = useState<VoucherTemplate[]>([]);
  const [activeVoucherId, setActiveVoucherId] = useState<string>('initial');
  const [draftVoucher, setDraftVoucher] = useState<VoucherData | null>(null);
  const [isDraftDirty, setIsDraftDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<'inicio' | 'captura' | 'reportes' | 'configuracion' | 'usuarios' | 'inventario'>('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // User Management State
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  
  const [loginError, setLoginError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<AppUser> & { password?: string }>({ role: 'Capturista', name: '', email: '', password: '' });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => {}
  });

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: ''
  });

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    destajista: '',
    concepto: '',
    material: '',
    paquete: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showListManager, setShowListManager] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<VoucherTemplate | null>(null);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [showPrintInfo, setShowPrintInfo] = useState(false);
  const [editingList, setEditingList] = useState<'destajistas' | 'elaboro' | 'autorizo' | 'ubicaciones' | 'paquetes'>('destajistas');
  const [newItemName, setNewItemName] = useState('');
  const [customLocations, setCustomLocations] = useState<Record<string, string[]>>({});
  const [selectedPackageForUbicaciones, setSelectedPackageForUbicaciones] = useState<string>('J');

  const [packagesList, setPackagesList] = useState<string[]>([
    "25 BIC INF DIAM E",
    "25 BIC INF DIAM F",
    "25 BIC INF DIAM H",
    "25 BIC INF DIAM I",
    "26 BIC INF DIAM P",
    "25 BIC INF DIAM O",
    "25 BIC INF DIAM G",
    "25 BIC INF DIAM K",
    "26 BIC INF DIAM Q",
    "26 BIC INF DIAM J"
  ]);

  const [destajistas, setDestajistas] = useState<string[]>([
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
  ]);

  const [elaboroList, setElaboroList] = useState<string[]>([
      "ING. LUCIO HERNANDEZ DOMINGUEZ",
      "ING. ANTONY EMANUEL CALDERON CRUZ",
      "ING. ARAMANDO LOPEZ ARRAZOLA",
      "ING. ALEJANDRO HIDALGO LOPEZ"
  ]);

  const [autorizoList, setAutorizoList] = useState<string[]>([
      "ING. ORLANDO CORDOVA GARCIA",
      "ING. DARVELIO ALVARO MAYO",
      "ING. MANUEL MORALES CADENAS",
      "ING. ALFONSO REYES HERNANDEZ REYES",
      "ARQ. JUAN ANTONIO CERINO CRUZ",
      "ING. JOSE ACOSTA RODRIGUEZ",
      "ING. JORGE ARTURO CRUZ GARCIA"
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          const userEmail = user.email.toLowerCase().trim();
          const userDoc = await getDoc(doc(db, 'users', userEmail));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as AppUser);
          } else if (userEmail === 'luciohernandez133@gmail.com' || userEmail === 'admin@construvivienda.local' || userEmail === 'administracion@construvivienda.local' || userEmail === 'admin_tsunami@construvivienda.local' || userEmail === 'admin_tsunami2@construvivienda.local' || userEmail === 'admin_tsunami3@construvivienda.local') {
            const newAdmin: AppUser = {
              id: userEmail,
              name: user.displayName || (userEmail.includes('administracion') || userEmail.includes('admin_tsunami') ? 'Administración' : 'Administrador Principal'),
              email: userEmail,
              role: 'Administrador',
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', userEmail), newAdmin);
            setCurrentUser(newAdmin);
          } else {
            setCurrentUser(null);
            await signOut(auth);
            setLoginError('Tu cuenta no está registrada en el sistema. Contacta al administrador.');
          }
        } catch (error) {
          console.error("Error checking user:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !currentUser) return;

    const unsubVouchers = onSnapshot(collection(db, 'vouchers'), (snapshot) => {
      const v = snapshot.docs.map(doc => {
        const data = doc.data() as VoucherData;
        return {
          ...data,
          items: data.items.filter(item => item.descripcion !== 'MATERIAL FUERA DE PPTO')
        };
      });
      setVouchers(v);
      setIsDataLoaded(true);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'vouchers'));

    const unsubTemplates = onSnapshot(collection(db, 'customTemplates'), (snapshot) => {
      console.log("Templates snapshot size:", snapshot.size);
      const t = snapshot.docs.map(doc => {
        const data = doc.data() as VoucherTemplate;
        return {
          ...data,
          items: data.items.filter(item => item.descripcion !== 'MATERIAL FUERA DE PPTO')
        };
      });
      console.log("Fetched custom templates:", t);
      setCustomTemplates(t);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'customTemplates'));

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setAppUsers(snapshot.docs.map(doc => doc.data() as AppUser));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));

    const unsubBudgets = onSnapshot(collection(db, 'budgets'), (snapshot) => {
      setBudgets(snapshot.docs.map(doc => doc.data() as Budget));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'budgets'));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'lists'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.destajistas) setDestajistas(data.destajistas);
        if (data.elaboroList) setElaboroList(data.elaboroList);
        if (data.autorizoList) setAutorizoList(data.autorizoList);
        if (data.customLocations) setCustomLocations(data.customLocations);
        if (data.packagesList) setPackagesList(data.packagesList);
      } else if (currentUser.role === 'Administrador') {
        // Initialize settings if admin
        setDoc(doc(db, 'settings', 'lists'), {
          destajistas,
          elaboroList,
          autorizoList,
          customLocations: {},
          packagesList
        }).catch(e => console.error("Error initializing settings", e));
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/lists'));

    return () => {
      unsubVouchers();
      unsubTemplates();
      unsubUsers();
      unsubBudgets();
      unsubSettings();
    };
  }, [isAuthReady, currentUser]);

  const handleAddItem = async () => {
    if (!newItemName.trim() || !editingList) return;
    const upperName = newItemName.trim().toUpperCase();
    
    let newDestajistas = [...destajistas];
    let newElaboro = [...elaboroList];
    let newAutorizo = [...autorizoList];
    let newPackages = [...packagesList];
    let newCustomLocations = { ...customLocations };

    if (editingList === 'destajistas') {
      if (!destajistas.includes(upperName)) newDestajistas.push(upperName);
    } else if (editingList === 'elaboro') {
      if (!elaboroList.includes(upperName)) newElaboro.push(upperName);
    } else if (editingList === 'autorizo') {
      if (!autorizoList.includes(upperName)) newAutorizo.push(upperName);
    } else if (editingList === 'paquetes') {
      if (!packagesList.includes(upperName)) newPackages.push(upperName);
    } else if (editingList === 'ubicaciones') {
      const currentLocs = newCustomLocations[selectedPackageForUbicaciones] || [];
      if (!currentLocs.includes(upperName)) {
        newCustomLocations[selectedPackageForUbicaciones] = [...currentLocs, upperName];
      }
    }
    
    try {
      await setDoc(doc(db, 'settings', 'lists'), {
        destajistas: newDestajistas,
        elaboroList: newElaboro,
        autorizoList: newAutorizo,
        packagesList: newPackages,
        customLocations: newCustomLocations
      }, { merge: true });
      setNewItemName('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/lists');
    }
  };

  const handleRemoveItem = async (index: number) => {
    if (!editingList) return;
    
    let newDestajistas = [...destajistas];
    let newElaboro = [...elaboroList];
    let newAutorizo = [...autorizoList];
    let newPackages = [...packagesList];
    let newCustomLocations = { ...customLocations };

    if (editingList === 'destajistas') {
      newDestajistas = destajistas.filter((_, i) => i !== index);
    } else if (editingList === 'elaboro') {
      newElaboro = elaboroList.filter((_, i) => i !== index);
    } else if (editingList === 'autorizo') {
      newAutorizo = autorizoList.filter((_, i) => i !== index);
    } else if (editingList === 'paquetes') {
      newPackages = packagesList.filter((_, i) => i !== index);
    } else if (editingList === 'ubicaciones') {
      const currentLocs = [...(newCustomLocations[selectedPackageForUbicaciones] || [])];
      const updatedLocs = currentLocs.filter((_, i) => i !== index);
      newCustomLocations[selectedPackageForUbicaciones] = updatedLocs;
    }

    try {
      await setDoc(doc(db, 'settings', 'lists'), {
        destajistas: newDestajistas,
        elaboroList: newElaboro,
        autorizoList: newAutorizo,
        packagesList: newPackages,
        customLocations: newCustomLocations
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/lists');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta plantilla?')) return;
    try {
      await deleteDoc(doc(db, 'customTemplates', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `customTemplates/${id}`);
    }
  };

  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    
    try {
      await setDoc(doc(db, 'customTemplates', editingTemplate.id), editingTemplate);
      setEditingTemplate(null);
      alert('Plantilla actualizada exitosamente.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `customTemplates/${editingTemplate.id}`);
    }
  };

  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState({ oldPackage: '', newPackage: '' });
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const handleBulkUpdatePackages = async () => {
    if (!bulkUpdateData.oldPackage || !bulkUpdateData.newPackage) return;
    if (!confirm(`¿Estás seguro de cambiar el paquete "${bulkUpdateData.oldPackage}" por "${bulkUpdateData.newPackage}" en TODAS las plantillas?`)) return;
    
    setIsBulkUpdating(true);
    try {
      const templatesToUpdate = customTemplates.filter(t => t.paquete === bulkUpdateData.oldPackage);
      if (templatesToUpdate.length === 0) {
        alert('No se encontraron plantillas con ese paquete.');
        return;
      }

      const batch = writeBatch(db);
      templatesToUpdate.forEach(t => {
        batch.update(doc(db, 'customTemplates', t.id), { paquete: bulkUpdateData.newPackage });
      });
      await batch.commit();
      alert(`Se actualizaron ${templatesToUpdate.length} plantillas.`);
      setShowBulkUpdateModal(false);
      setBulkUpdateData({ oldPackage: '', newPackage: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'customTemplates/bulkUpdate');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);
  const conceptRef = useRef<HTMLTextAreaElement>(null);

  const getLocationsForPackage = (paquete: string) => {
    const letter = paquete.trim().slice(-1).toUpperCase();
    const data = LOCATION_DATA[letter];
    const custom = customLocations[letter] || [];
    
    const locations: string[] = [];
    if (data) {
      data.forEach(item => {
        item.lotes.forEach(lote => {
          locations.push(`(${item.mza}/${lote})`);
        });
      });
    }
    
    // Add custom locations and remove duplicates
    return Array.from(new Set([...locations, ...custom]));
  };

  const isGeneratingPDF = pdfProgress !== null;

  const activeVoucher = draftVoucher || vouchers.find(v => v.id === activeVoucherId) || vouchers[0];
  const voucherRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!isDraftDirty) {
      const selected = vouchers.find(v => v.id === activeVoucherId);
      if (selected) {
        setDraftVoucher(selected);
      } else if (vouchers.length > 0) {
        setDraftVoucher(vouchers[0]);
        setActiveVoucherId(vouchers[0].id);
      } else {
        setDraftVoucher(null);
      }
    }
  }, [activeVoucherId, vouchers, isDraftDirty]);

  const handleSelectVoucher = (id: string, skipConfirm = false) => {
    if (isDraftDirty && !skipConfirm) {
      setConfirmModal({
        isOpen: true,
        message: 'Tienes cambios sin guardar. ¿Deseas descartarlos?',
        onConfirm: () => {
          handleSelectVoucher(id, true);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      });
      return;
    }
    setIsDraftDirty(false);
    setActiveVoucherId(id);
  };

  const saveVoucher = async (skipConfirm = false) => {
    if (!draftVoucher) return;
    
    const incompleteReason = getVoucherIncompleteReason(draftVoucher);
    if (incompleteReason) {
      setAlertModal({ isOpen: true, message: `No se puede guardar el vale. Está incompleto:\n${incompleteReason}` });
      return;
    }

    if (isDuplicateVoucher) {
      setAlertModal({ isOpen: true, message: 'No se puede guardar: Ya existe un vale con este paquete, ubicación y concepto.' });
      return;
    }
    
    try {
      const budgetUpdates = new Map<string, number>();
      const missingBudgetItems: VoucherItem[] = [];
      
      const originalVoucher = vouchers.find(v => v.id === draftVoucher.id);
      if (originalVoucher) {
        originalVoucher.items.forEach(item => {
          const budget = budgets.find(b => 
            b.paquete === originalVoucher.header.paquete &&
            b.ubicacion === originalVoucher.header.ubicacion &&
            b.concepto === originalVoucher.header.concepto &&
            b.material === item.descripcion
          );
          if (budget) {
            budgetUpdates.set(budget.id, (budgetUpdates.get(budget.id) || 0) - item.cantidad);
          }
        });
      }

      draftVoucher.items.forEach(item => {
        const budget = budgets.find(b => 
          b.paquete === draftVoucher.header.paquete &&
          b.ubicacion === draftVoucher.header.ubicacion &&
          b.concepto === draftVoucher.header.concepto &&
          b.material === item.descripcion
        );
        if (budget) {
          budgetUpdates.set(budget.id, (budgetUpdates.get(budget.id) || 0) + item.cantidad);
        } else {
          missingBudgetItems.push(item);
        }
      });

      const warnings: string[] = [];
      for (const [budgetId, salidasChange] of budgetUpdates.entries()) {
        if (salidasChange > 0) {
          const budget = budgets.find(b => b.id === budgetId)!;
          const newSaldo = budget.saldoTotal - salidasChange;
          if (newSaldo < 0) {
            warnings.push(`- ${budget.material}: Te pasas por ${Math.abs(newSaldo).toFixed(2)} ${budget.unidad}`);
          }
        }
      }

      let finalVoucher = { 
        ...draftVoucher,
        createdAt: draftVoucher.createdAt || new Date().toISOString(),
        createdBy: draftVoucher.createdBy || currentUser?.email || 'unknown',
        items: draftVoucher.items.filter(item => item.descripcion !== 'MATERIAL FUERA DE PPTO')
      };

      if (warnings.length > 0 && !skipConfirm) {
        const msg = `FUERA DE PPTO\n\nLos siguientes materiales sobrepasan el presupuesto:\n${warnings.join('\n')}\n\n¿Deseas continuar y capturar el vale de todas formas?`;
        setConfirmModal({
          isOpen: true,
          message: msg,
          onConfirm: () => {
            saveVoucher(true);
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
          }
        });
        return;
      }

      if (warnings.length > 0) {
        finalVoucher = {
          ...finalVoucher,
          header: { ...finalVoucher.header, fueraPresupuesto: true }
        };
      } else {
        finalVoucher = {
          ...finalVoucher,
          header: { ...finalVoucher.header, fueraPresupuesto: false }
        };
      }

      // Update Google Sheets Budget (External)
      try {
        const adjustments: any[] = [];
        const originalVoucher = vouchers.find(v => v.id === draftVoucher.id);
        
        // 1. Subtract original items (if editing)
        if (originalVoucher) {
          originalVoucher.items.forEach(item => {
            adjustments.push({
              paquete: originalVoucher.header.paquete,
              concepto: originalVoucher.header.concepto,
              ubicacion: originalVoucher.header.ubicacion,
              material: item.descripcion,
              cantidad: -item.cantidad // Negative to subtract
            });
          });
        }
        
        // 2. Add new items
        finalVoucher.items.forEach(item => {
          adjustments.push({
            paquete: finalVoucher.header.paquete,
            concepto: finalVoucher.header.concepto,
            ubicacion: finalVoucher.header.ubicacion,
            material: item.descripcion,
            cantidad: item.cantidad // Positive to add
          });
        });

        let responseData: any = null;
        if (adjustments.length > 0) {
          const response = await fetch("/api/budget/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adjustments })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al sincronizar con Google Sheets");
          }
          responseData = await response.json();
        }

        // Process results to split voucher if needed
        const offset = originalVoucher ? originalVoucher.items.length : 0;
        const additionResults = responseData?.results?.slice(offset) || [];
        
        const inBudgetItems: VoucherItem[] = [];
        const outBudgetItems: VoucherItem[] = [...missingBudgetItems];
        let hasOutBudget = missingBudgetItems.length > 0;

        finalVoucher.items.forEach((item, index) => {
          if (missingBudgetItems.includes(item)) {
            return;
          }
          
          const result = additionResults[index];
          if (result && result.found) {
            if (result.inBudget > 0) {
              const cleanDesc = item.descripcion.replace(" - MATERIAL FUERA DE PPTO", "");
              inBudgetItems.push({
                ...item,
                descripcion: cleanDesc,
                cantidad: result.inBudget
              });
            }
            if (result.outBudget > 0) {
              hasOutBudget = true;
              const cleanDesc = item.descripcion.replace(" - MATERIAL FUERA DE PPTO", "");
              // Add the material row
              outBudgetItems.push({
                ...item,
                descripcion: cleanDesc,
                cantidad: result.outBudget
              });
            }
          } else {
            // If not found or no result, keep as is in the first voucher
            inBudgetItems.push(item);
          }
        });

        const batch = writeBatch(db);
        
        // Voucher 1 (In Budget)
        let voucher1 = { ...finalVoucher, items: inBudgetItems };
        if (inBudgetItems.length > 0) {
          batch.set(doc(db, 'vouchers', voucher1.id), voucher1);
        } else if (originalVoucher) {
          // If we were editing and now it's empty (all moved to voucher 2), delete original?
          // Actually, let's just keep it with 0 items or delete it.
          // User said "DEJANDO UNICAMENTE EN EL PRIMER VALE LO QUE ESTA AUN EN PRESUPUESTO"
          // If nothing is in budget, we might not need the first voucher.
          // But usually, it's better to keep the ID if possible.
          batch.delete(doc(db, 'vouchers', voucher1.id));
        }

        // Voucher 2 (Out of Budget)
        let voucher2: any = null;
        if (hasOutBudget) {
          const newId = doc(collection(db, 'vouchers')).id;
          // Generate a new folio for the second voucher
          const baseFolio = finalVoucher.header.folio;
          const secondFolio = `${baseFolio}-B`;
          
          voucher2 = {
            ...finalVoucher,
            id: newId,
            header: {
              ...finalVoucher.header,
              folio: secondFolio,
              fueraPresupuesto: true
            },
            items: outBudgetItems
          };
          batch.set(doc(db, 'vouchers', newId), voucher2);
        }

        // Local budget updates (Firestore)
        for (const [budgetId, salidasChange] of budgetUpdates.entries()) {
          if (salidasChange !== 0) {
            const budget = budgets.find(b => b.id === budgetId)!;
            const newSalidas = budget.salidas + salidasChange;
            const newSaldo = budget.cantidadPresupuesto - newSalidas;
            batch.update(doc(db, 'budgets', budgetId), {
              salidas: newSalidas,
              saldoTotal: newSaldo
            });
          }
        }

        await batch.commit();
        
        // Update UI state
        if (inBudgetItems.length > 0) {
          setDraftVoucher(voucher1);
        } else if (voucher2) {
          setDraftVoucher(voucher2);
        }
        setIsDraftDirty(false);

        // Success message
        let successMsg = "Vale guardado correctamente y sincronizado con Google Sheets.";
        if (hasOutBudget) {
          successMsg += `\n\nSE CREÓ UN SEGUNDO VALE (${voucher2.header.folio}) PARA EL MATERIAL FUERA DE PRESUPUESTO.`;
        }
        if (missingBudgetItems.length > 0) {
          successMsg += `\n\nEL MATERIAL NO SE ENCUENTRA PRESUPUESTADO.`;
        }

        if (responseData?.notFound && responseData.notFound.length > 0) {
          const missingItems = responseData.notFound.map((item: any) => 
            `- ${item.material}`
          ).join('\n');
          successMsg += `\n\nAlgunos materiales no se encontraron en Google Sheets:\n${missingItems}`;
        }

        const details = responseData?.results?.map((r: any) => 
          `- ${r.material} -> Fila: ${r.range || 'N/A'} (Nuevo: ${r.newValue || 'N/A'})`
        ).join("\n") || 'Sin detalles de celdas.';
        
        setAlertModal({ 
          isOpen: true, 
          message: `${successMsg}\n\nDetalles de actualización:\n${details}` 
        });

      } catch (err: any) {
        console.error("Failed to sync with Google Sheets:", err);
        setAlertModal({ 
          isOpen: true, 
          message: `Error al guardar: ${err.message}` 
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'vouchers');
    }
  };

  useEffect(() => {
    if (conceptRef.current && activeVoucher) {
      conceptRef.current.style.height = 'auto';
      conceptRef.current.style.height = conceptRef.current.scrollHeight + 'px';
    }
  }, [activeVoucher?.header.concepto]);

  const handleAddVoucher = async (template?: VoucherTemplate, force: boolean = false) => {
    if (activeVoucher && !force) {
      const incompleteReason = getVoucherIncompleteReason(activeVoucher);
      if (incompleteReason) {
        setAlertModal({ isOpen: true, message: `No puedes crear un nuevo vale hasta completar el actual:\n${incompleteReason}` });
        return;
      }
    }

    if (isDraftDirty && !force) {
      setConfirmModal({
        isOpen: true,
        message: 'Tienes cambios sin guardar. ¿Deseas descartarlos?',
        onConfirm: () => {
          handleAddVoucher(template, true);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      });
      return;
    }

    const newId = crypto.randomUUID();
    const targetTemplate = template || allTemplates[0];
    
    let initialFolio = '';
    let initialPrototipo = activeVoucher?.header.prototipo || '';
    
    if (targetTemplate.subConcepto && targetTemplate.subConcepto !== 'NUEVO VALE EDITABLE') {
      const letter = targetTemplate.subConcepto.trim().slice(-1).toUpperCase();
      initialPrototipo = `BIC INF DIAM ${letter}`;
    }

    const newVoucher: VoucherData = {
      id: newId,
      templateId: targetTemplate.id,
      header: { 
        ...(activeVoucher?.header || {
          obra: 'INFONAVIT BICENTENARIO',
          paquete: '',
          fecha: new Date().toLocaleDateString('es-MX'),
          ubicacion: '',
          destajista: '',
          folio: '',
          elaboro: '',
          autorizo: '',
          fueraPresupuesto: false,
        }), 
        obra: 'INFONAVIT BICENTENARIO',
        prototipo: initialPrototipo,
        folio: initialFolio,
        paquete: targetTemplate.id === 'empty' ? '' : targetTemplate.subConcepto,
        concepto: targetTemplate.id === 'empty' ? '' : targetTemplate.concepto,
        fueraPresupuesto: false,
        subConcepto: targetTemplate.id === 'empty' ? '' : ''
      },
      items: targetTemplate.items.filter(item => item.descripcion !== 'MATERIAL FUERA DE PPTO'),
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.email || 'unknown'
    };
    
    setDraftVoucher(newVoucher);
    setIsDraftDirty(true);
    setActiveVoucherId(newId);
  };

  const handleDeleteBudget = async () => {
    try {
      setIsDeletingBudget(true);
      // Delete existing budgets in chunks with a small delay to avoid rate limits
      // Reduced batch size and increased delay for better stability
      const BATCH_SIZE = 200;
      const DELAY_MS = 500;
      
      for (let i = 0; i < budgets.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        const chunk = budgets.slice(i, i + BATCH_SIZE);
        chunk.forEach(b => {
          batch.delete(doc(db, 'budgets', b.id));
        });
        await batch.commit();
        // Small delay between batches to respect rate limits
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
      setShowDeleteBudgetModal(false);
      alert('Existencias eliminadas correctamente.');
    } catch (error: any) {
      console.error("Error deleting budget:", error);
      if (error.message?.includes('quota') || error.message?.includes('exhausted')) {
        alert('Error: Has alcanzado el límite de escritura de Firebase o la cuota diaria. Intenta de nuevo más tarde o reduce el tamaño del archivo.');
      } else {
        alert('Error al eliminar las existencias.');
      }
    } finally {
      setIsDeletingBudget(false);
    }
  };

  const handleBudgetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBudget(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        let data: any[] = [];
        for (const wsname of wb.SheetNames) {
          const ws = wb.Sheets[wsname];
          const sheetData = XLSX.utils.sheet_to_json(ws) as any[];
          data = data.concat(sheetData);
        }

        if (data.length > 0) {
          const BATCH_SIZE = 200;
          const DELAY_MS = 500;

          // 1. Delete existing budgets first
          for (let i = 0; i < budgets.length; i += BATCH_SIZE) {
            const batch = writeBatch(db);
            const chunk = budgets.slice(i, i + BATCH_SIZE);
            chunk.forEach(b => {
              batch.delete(doc(db, 'budgets', b.id));
            });
            await batch.commit();
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
          }
          
          // 2. Add new budgets in chunks
          for (let i = 0; i < data.length; i += BATCH_SIZE) {
            const batch = writeBatch(db);
            const chunk = data.slice(i, i + BATCH_SIZE);
            
            chunk.forEach(row => {
              const id = crypto.randomUUID();
              const budgetRef = doc(db, 'budgets', id);
              
              // Normalize keys to handle different Excel headers
              const getVal = (keys: string[]) => {
                for (const k of keys) {
                  if (row[k] !== undefined) return row[k];
                }
                return '';
              };
              
              const getNum = (keys: string[]) => {
                const val = getVal(keys);
                const parsed = parseFloat(val);
                return isNaN(parsed) ? 0 : parsed;
              };

              const cantidadPresupuesto = getNum(['Cantidad en presupuesto', 'Cantidad', 'Presupuesto', 'CANTIDAD', 'PRESUPUESTO', 'Existencia', 'EXISTENCIA', 'Existencias', 'EXISTENCIAS']);
              const salidas = getNum(['Salidas', 'Salida', 'SALIDAS', 'SALIDA']);
              const saldoTotal = getNum(['Saldo total', 'Saldo', 'SALDO', 'SALDO TOTAL', 'Existencia actual', 'EXISTENCIA ACTUAL']) || (cantidadPresupuesto - salidas);

              const budgetItem: Budget = {
                id,
                paquete: String(getVal(['Paquete', 'PAQUETE'])),
                ubicacion: String(getVal(['Ubicación', 'Ubicacion', 'UBICACION', 'UBICACIÓN'])),
                concepto: String(getVal(['Concepto', 'CONCEPTO'])),
                material: String(getVal(['Material', 'MATERIAL', 'Descripcion', 'Descripción', 'DESCRIPCION', 'DESCRIPCIÓN'])),
                unidad: String(getVal(['Unidad', 'UNIDAD', 'U.M.', 'UM', 'U.M'])),
                cantidadPresupuesto,
                salidas,
                saldoTotal,
                createdAt: new Date().toISOString()
              };
              
              batch.set(budgetRef, budgetItem);
            });
            await batch.commit();
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
          }

          alert('Presupuesto cargado exitosamente');
        }
      } catch (error: any) {
        console.error("Error uploading budget:", error);
        if (error.message?.includes('quota') || error.message?.includes('exhausted')) {
          alert('Error: Has alcanzado el límite de escritura de Firebase. Intenta de nuevo más tarde.');
        } else {
          alert('Error al cargar el presupuesto. Asegúrate de que el formato sea correcto.');
        }
      } finally {
        setIsUploadingBudget(false);
      }
    };
    reader.readAsBinaryString(file);
    // Reset input
    e.target.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!currentUser) {
      alert("Debes iniciar sesión para cargar vales.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        let data: any[] = [];
        for (const wsname of wb.SheetNames) {
          const ws = wb.Sheets[wsname];
          const sheetData = XLSX.utils.sheet_to_json(ws) as any[];
          data = data.concat(sheetData);
        }

        if (data.length > 0) {
          const newVouchers: VoucherData[] = [];
          
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
              })).filter(item => item.descripcion !== 'MATERIAL FUERA DE PPTO'),
              createdAt: new Date().toISOString(),
              createdBy: currentUser?.email || 'unknown'
            });
          });

          // Upload vouchers in chunks with delays to avoid rate limits
          const BATCH_SIZE = 200;
          const DELAY_MS = 500;

          for (let i = 0; i < newVouchers.length; i += BATCH_SIZE) {
            const batch = writeBatch(db);
            const chunk = newVouchers.slice(i, i + BATCH_SIZE);
            
            chunk.forEach(v => {
              batch.set(doc(db, 'vouchers', v.id), v);
            });
            
            await batch.commit();
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
          }
          
          if (newVouchers.length > 0) {
            setActiveVoucherId(newVouchers[0].id);
            alert('Vales cargados exitosamente');
          }
        }
      } catch (error: any) {
        handleFirestoreError(error, OperationType.WRITE, 'vouchers/upload');
      }
    };
    reader.readAsBinaryString(file);
    // Reset input
    e.target.value = '';
  };

  const handleRemoveVoucher = async (id: string, skipConfirm = false) => {
    if (!skipConfirm) {
      setConfirmModal({
        isOpen: true,
        message: '¿Estás seguro de eliminar este vale? Esta acción no se puede deshacer y devolverá el material al presupuesto.',
        onConfirm: () => {
          handleRemoveVoucher(id, true);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      });
      return;
    }

    try {
      const voucherToDelete = vouchers.find(v => v.id === id);
      if (voucherToDelete) {
        const batch = writeBatch(db);
        batch.delete(doc(db, 'vouchers', id));

        // Revert budget (Internal)
        const budgetUpdates = new Map<string, number>();
        voucherToDelete.items.forEach(item => {
          const budget = budgets.find(b => 
            b.paquete === voucherToDelete.header.paquete &&
            b.ubicacion === voucherToDelete.header.ubicacion &&
            b.concepto === voucherToDelete.header.concepto &&
            b.material === item.descripcion
          );
          if (budget) {
            budgetUpdates.set(budget.id, (budgetUpdates.get(budget.id) || 0) - item.cantidad);
          }
        });

        for (const [budgetId, salidasChange] of budgetUpdates.entries()) {
          if (salidasChange !== 0) {
            const budget = budgets.find(b => b.id === budgetId)!;
            const newSalidas = budget.salidas + salidasChange; // salidasChange is negative
            const newSaldo = budget.cantidadPresupuesto - newSalidas;
            batch.update(doc(db, 'budgets', budgetId), {
              salidas: newSalidas,
              saldoTotal: newSaldo
            });
          }
        }

        await batch.commit();

        let hasNotFound = false;

        // Update Google Sheets Budget (External)
        try {
          const adjustments = voucherToDelete.items.map(item => ({
            paquete: voucherToDelete.header.paquete,
            concepto: voucherToDelete.header.concepto,
            ubicacion: voucherToDelete.header.ubicacion,
            material: item.descripcion,
            cantidad: -item.cantidad // Negative to "return" to budget
          }));

          if (adjustments.length > 0) {
            const response = await fetch("/api/budget/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ adjustments })
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              console.warn("Google Sheets Sync Warning:", errorData.error);
              setAlertModal({ 
                isOpen: true, 
                message: `Vale eliminado en la base de datos, pero hubo un problema al actualizar Google Sheets:\n${errorData.error}` 
              });
              return;
            }

            const responseData = await response.json();
            if (responseData.notFound && responseData.notFound.length > 0) {
              hasNotFound = true;
              const missingItems = responseData.notFound.map((item: any) => 
                `- ${item.material} (Paquete: ${item.paquete})\n  Hojas buscadas: ${item.searchedSheets?.join(", ") || "Ninguna"}`
              ).join('\n');
              setAlertModal({
                isOpen: true,
                message: `Vale eliminado en la base de datos, pero algunos materiales no se encontraron en Google Sheets:\n\n${missingItems}\n\nVerifica que Concepto, Ubicación y Material coincidan exactamente.`
              });
            }

            const details = responseData.results?.map((r: any) => 
              `- ${r.material} -> Hoja: ${r.sheetUsed} (${r.range})`
            ).join("\n") || responseData.updatedRanges?.join(', ') || 'ninguno';

            if (!hasNotFound) {
              setAlertModal({ 
                isOpen: true, 
                message: `Vale eliminado correctamente y sincronizado con Google Sheets.\n\nCeldas actualizadas:\n${details}` 
              });
            }
          }
        } catch (err: any) {
          console.error("Failed to sync with Google Sheets:", err);
          setAlertModal({ 
            isOpen: true, 
            message: `Vale eliminado en la base de datos, pero falló la conexión con Google Sheets:\n${err.message}` 
          });
        }
      }
      if (activeVoucher?.id === id) {
        const nextVoucher = vouchers.find(v => v.id !== id);
        if (nextVoucher) {
          setActiveVoucherId(nextVoucher.id);
          setDraftVoucher(null);
          setIsDraftDirty(false);
        } else {
          setDraftVoucher(null);
          setIsDraftDirty(false);
          handleAddVoucher(undefined, true);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'vouchers');
    }
  };

  const updateActiveVoucher = (updates: Partial<VoucherData>) => {
    if (!activeVoucher) return;
    setDraftVoucher({ ...activeVoucher, ...updates } as VoucherData);
    setIsDraftDirty(true);
  };

  const updateItem = (index: number, field: keyof VoucherItem, value: string | number) => {
    if (!activeVoucher) return;
    const newItems = [...activeVoucher.items];
    newItems[index] = { ...newItems[index], [field]: value } as VoucherItem;
    updateActiveVoucher({ items: newItems });
  };

  const addItem = () => {
    if (!activeVoucher) return;
    updateActiveVoucher({ 
      items: [...activeVoucher.items, { unidad: 'PZA', cantidad: 1, descripcion: '' }] 
    });
  };

  const removeItem = (index: number) => {
    if (!activeVoucher) return;
    updateActiveVoucher({ 
      items: activeVoucher.items.filter((_, i) => i !== index) 
    });
  };

  const handleTemplateChange = (value: string) => {
    const template = allTemplates.find(t => t.subConcepto === value || t.concepto === value || t.id === value);
    if (template && activeVoucher) {
      updateActiveVoucher({ 
        templateId: template.id, 
        header: { ...activeVoucher.header, concepto: template.concepto, subConcepto: template.id === 'empty' ? '' : '' },
        items: template.items 
      });
    } else if (activeVoucher) {
      updateActiveVoucher({
        templateId: 'empty',
        header: { ...activeVoucher.header, concepto: value, subConcepto: '' }
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
        const batch = writeBatch(db);
        newTemplates.forEach(t => {
          batch.set(doc(db, 'customTemplates', t.id), t);
        });
        await batch.commit().catch(error => {
          handleFirestoreError(error, OperationType.CREATE, 'customTemplates');
        });
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

  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    if (dateStr.includes('-')) return new Date(dateStr + 'T00:00:00');
    const parts = dateStr.split('/');
    if (parts.length === 3) return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    return null;
  };

  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      let match = true;
      if (filters.destajista && v.header.destajista !== filters.destajista) match = false;
      if (filters.paquete && v.header.paquete !== filters.paquete) match = false;
      if (filters.concepto && !v.header.concepto.toLowerCase().includes(filters.concepto.toLowerCase())) match = false;
      if (filters.material && !v.items.some(i => i.descripcion.toLowerCase().includes(filters.material.toLowerCase()))) match = false;
      
      if (filters.dateFrom || filters.dateTo) {
        const vDate = parseDate(v.header.fecha);
        if (vDate) {
          if (filters.dateFrom && vDate < new Date(filters.dateFrom + 'T00:00:00')) match = false;
          if (filters.dateTo && vDate > new Date(filters.dateTo + 'T23:59:59')) match = false;
        }
      }
      return match;
    });
  }, [vouchers, filters]);

  const handleDownloadAllPDF = async (vouchersToExport: VoucherData[] = vouchers) => {
    const completeVouchers = vouchersToExport.filter(v => getVoucherIncompleteReason(v) === null);
    if (isGeneratingPDF || completeVouchers.length === 0) {
      if (!isGeneratingPDF && vouchersToExport.length > 0) {
        alert('No hay vales completos para exportar.');
      }
      return;
    }
    
    try {
      setPdfProgress({ current: 0, total: completeVouchers.length });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
      });

      // Group vouchers by package
      const groupedVouchers: Record<string, typeof completeVouchers> = {};
      completeVouchers.forEach(v => {
        const pkg = v.header.paquete || 'Sin Paquete';
        if (!groupedVouchers[pkg]) groupedVouchers[pkg] = [];
        groupedVouchers[pkg].push(v);
      });

      // Sort vouchers within each package by autorizo
      Object.keys(groupedVouchers).forEach(pkg => {
        groupedVouchers[pkg].sort((a, b) => {
          const autA = a.header.autorizo || '';
          const autB = b.header.autorizo || '';
          return autA.localeCompare(autB);
        });
      });

      let isFirstPage = true;
      let processedCount = 0;

      const drawVoucher = (v: typeof vouchers[0], startY: number) => {
          // Title
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('CONSTRUVIVIENDA TECNOLOGICA S.A. DE C.V.', 306, startY + 20, { align: 'center' });
          
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.text('HUIMANGUILLO TABASCO', 306, startY + 32, { align: 'center' });
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text('VALE DE SALIDA DE ALMACEN', 306, startY + 48, { align: 'center' });
          
          // Folio
          pdf.setFontSize(9);
          pdf.text('FOLIO:', 480, startY + 48);
          pdf.setTextColor(255, 0, 0);
          pdf.text(v.header.folio || '', 520, startY + 48);
          pdf.setTextColor(0, 0, 0);
          
          // Header details
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          
          // Left column
          pdf.text('OBRA:', 40, startY + 70);
          pdf.setFont('helvetica', 'normal');
          pdf.text(v.header.obra || '', 80, startY + 70);
          pdf.line(80, startY + 72, 300, startY + 72);
          
          pdf.setFont('helvetica', 'bold');
          pdf.text('PAQUETE:', 40, startY + 85);
          pdf.setFont('helvetica', 'normal');
          pdf.text(v.header.paquete || '', 90, startY + 85);
          pdf.line(90, startY + 87, 300, startY + 87);
          
          pdf.setFont('helvetica', 'bold');
          pdf.text('FECHA:', 40, startY + 100);
          pdf.setFont('helvetica', 'normal');
          pdf.text(v.header.fecha || '', 80, startY + 100);
          pdf.line(80, startY + 102, 300, startY + 102);
          
          pdf.setFont('helvetica', 'bold');
          pdf.text('DESTAJISTA:', 40, startY + 115);
          pdf.setFont('helvetica', 'normal');
          pdf.text(v.header.destajista || '', 100, startY + 115);
          pdf.line(100, startY + 117, 300, startY + 117);
          
          // Right column
          pdf.setFont('helvetica', 'bold');
          pdf.text('PROTOTIPO:', 320, startY + 70);
          pdf.setFont('helvetica', 'normal');
          pdf.text(v.header.prototipo || '', 380, startY + 70);
          pdf.line(380, startY + 72, 570, startY + 72);
          
          pdf.setFont('helvetica', 'bold');
          pdf.text('UBICACIÓN:', 320, startY + 85);
          pdf.setFont('helvetica', 'normal');
          pdf.text(v.header.ubicacion || '', 380, startY + 85);
          pdf.line(380, startY + 87, 570, startY + 87);
          
          pdf.setFont('helvetica', 'bold');
          pdf.text('CONCEPTO:', 320, startY + 100);
          pdf.setFont('helvetica', 'normal');
          const conceptoLines = pdf.splitTextToSize(v.header.concepto || '', 190);
          pdf.text(conceptoLines, 380, startY + 100);
          pdf.line(380, startY + 102, 570, startY + 102);

          // Table
          const tableData = v.items.map(item => [
            item.clasificacion,
            item.unidad,
            item.cantidad,
            item.descripcion,
            item.precioUnitario,
            item.importe
          ]);

          // Ensure 14 rows
          while (tableData.length < 14) {
            tableData.push(['', '', '', '', '', '']);
          }

          autoTable(pdf, {
            startY: startY + 130,
            head: [['CLASIF.', 'UNIDAD', 'CANTIDAD', 'DESCRIPCION', 'P.U', 'IMPORTE']],
            body: tableData,
            theme: 'grid',
            styles: {
              fontSize: 7,
              cellPadding: 2,
              lineColor: [200, 200, 200],
              lineWidth: 0.5,
              textColor: [0, 0, 0],
              font: 'helvetica'
            },
            headStyles: {
              fillColor: [245, 245, 245],
              textColor: [0, 0, 0],
              fontStyle: 'bold',
              halign: 'center'
            },
            columnStyles: {
              0: { cellWidth: 40, halign: 'center' },
              1: { cellWidth: 40, halign: 'center' },
              2: { cellWidth: 50, halign: 'center' },
              3: { cellWidth: 'auto' },
              4: { cellWidth: 50, halign: 'right' },
              5: { cellWidth: 60, halign: 'right' }
            },
            margin: { left: 40, right: 40 }
          });

          const finalY = (pdf as any).lastAutoTable.finalY;

          // Signatures
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          
          const sigY = finalY + 30;
          
          pdf.text('ELABORO', 130, sigY, { align: 'center' });
          pdf.line(60, sigY + 20, 200, sigY + 20);
          pdf.setFont('helvetica', 'normal');
          pdf.text(v.header.elaboro || '', 130, sigY + 30, { align: 'center' });
          
          pdf.setFont('helvetica', 'bold');
          pdf.text('RECIBE', 306, sigY, { align: 'center' });
          pdf.line(236, sigY + 20, 376, sigY + 20);
          
          pdf.text('AUTORIZO', 482, sigY, { align: 'center' });
          pdf.line(412, sigY + 20, 552, sigY + 20);
          pdf.setFont('helvetica', 'normal');
          pdf.text(v.header.autorizo || '', 482, sigY + 30, { align: 'center' });

          if (v.header.fueraPresupuesto) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            // Draw it starting at column E (indented from the beginning of the description)
            // Column 3 (Description) starts at 170. Column E is roughly at 210.
            pdf.text('MATERIAL FUERA DE PPTO', 210, startY + 245, { align: 'left' });
          }
        };

      for (const [pkg, pkgVouchers] of Object.entries(groupedVouchers)) {
        for (let i = 0; i < pkgVouchers.length; i += 2) {
          if (!isFirstPage) {
            pdf.addPage('letter', 'portrait');
          }
          isFirstPage = false;

          // Process first voucher (Top)
          processedCount++;
          setPdfProgress({ current: processedCount, total: vouchersToExport.length });
          drawVoucher(pkgVouchers[i], 0);

          // Process second voucher (Bottom)
          if (i + 1 < pkgVouchers.length) {
            processedCount++;
            setPdfProgress({ current: processedCount, total: vouchersToExport.length });
            drawVoucher(pkgVouchers[i + 1], 396);
            
            // Draw dashed line between vouchers
            pdf.setLineDashPattern([5, 5], 0);
            pdf.setDrawColor(200, 200, 200);
            pdf.line(0, 396, 612, 396);
            pdf.setLineDashPattern([], 0); // Reset dash
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

  const handleDownloadExcel = async (vouchersToExport: VoucherData[] = vouchers) => {
    const completeVouchers = vouchersToExport.filter(v => getVoucherIncompleteReason(v) === null);
    if (completeVouchers.length === 0) {
      alert('No hay vales completos para exportar.');
      return;
    }
    const workbook = new ExcelJS.Workbook();
    
    // Group vouchers by package
    const groupedVouchers: Record<string, typeof completeVouchers> = {};
    completeVouchers.forEach(v => {
      const pkg = v.header.paquete || 'Sin Paquete';
      if (!groupedVouchers[pkg]) {
        groupedVouchers[pkg] = [];
      }
      groupedVouchers[pkg].push(v);
    });

    // Sort vouchers within each package by autorizo
    Object.keys(groupedVouchers).forEach(pkg => {
      groupedVouchers[pkg].sort((a, b) => {
        const autA = a.header.autorizo || '';
        const autB = b.header.autorizo || '';
        return autA.localeCompare(autB);
      });
    });

    for (const [pkgName, pkgVouchers] of Object.entries(groupedVouchers)) {
      // Create a valid sheet name (max 31 chars, no invalid chars)
      const sheetName = pkgName.replace(/[\\/?*[\]]/g, '').substring(0, 31);
      const worksheet = workbook.addWorksheet(sheetName);

      // Set column widths
      worksheet.columns = [
        { width: 12 }, // A: CLASIF
        { width: 12 }, // B: UNIDAD
        { width: 12 }, // C: CANTIDAD
        { width: 12 }, // D: DESCRIPCION 1
        { width: 12 }, // E: DESCRIPCION 2
        { width: 12 }, // F: DESCRIPCION 3
        { width: 12 }, // G: DESCRIPCION 4
        { width: 12 }, // H: DESCRIPCION 5
        { width: 12 }, // I: P.U
        { width: 12 }, // J: IMPORTE
      ];

      let currentRow = 1;
      const borderThin = { style: 'thin' as const };
      const borderDouble = { style: 'double' as const };

      pkgVouchers.forEach((v, idx) => {
        const startRow = currentRow;

        // Row 1: Title
        worksheet.mergeCells(`A${startRow}:J${startRow}`);
        const titleCell = worksheet.getCell(`A${startRow}`);
        titleCell.value = 'CONSTRUVIVIENDA TECNOLOGICA S.A. DE C.V.';
        titleCell.font = { bold: true, size: 14 };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.border = { top: borderDouble, left: borderDouble, right: borderDouble };
        
        // Row 2: Location
        worksheet.mergeCells(`A${startRow + 1}:J${startRow + 1}`);
        const locCell = worksheet.getCell(`A${startRow + 1}`);
        locCell.value = 'HUIMANGUILLO TABASCO';
        locCell.font = { size: 10 };
        locCell.alignment = { horizontal: 'center', vertical: 'middle' };
        locCell.border = { left: borderDouble, right: borderDouble };

        // Row 3: Vale Title & Folio
        worksheet.mergeCells(`D${startRow + 2}:G${startRow + 2}`);
        const valeTitleCell = worksheet.getCell(`D${startRow + 2}`);
        valeTitleCell.value = 'VALE DE SALIDA DE ALMACEN';
        valeTitleCell.font = { bold: true, size: 12 };
        valeTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        // Apply borders to row 3
        for (let c = 1; c <= 10; c++) {
          const col = String.fromCharCode(64 + c);
          const cell = worksheet.getCell(`${col}${startRow + 2}`);
          cell.border = { 
            left: c === 1 ? borderDouble : undefined,
            right: c === 10 ? borderDouble : undefined,
            bottom: undefined // Removed thin bottom border as requested
          };
        }
        
        const folioLabelCell = worksheet.getCell(`I${startRow + 2}`);
        folioLabelCell.value = 'FOLIO:';
        folioLabelCell.font = { bold: true, size: 11 };
        folioLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };
        folioLabelCell.border = {}; // Ensure no border for FOLIO label
        
        const folioValueCell = worksheet.getCell(`J${startRow + 2}`);
        folioValueCell.value = v.header.folio;
        folioValueCell.font = { bold: true, size: 11, color: { argb: 'FFFF0000' } }; // Red text
        folioValueCell.alignment = { horizontal: 'center', vertical: 'middle' };
        // User requested right, left and top to be "en blanco" (empty)
        // We keep the right as double to not break the outer border of the voucher
        folioValueCell.border = { bottom: borderThin, right: borderDouble };

        // Row 4: Obra, Prototipo
        const obraLabel = worksheet.getCell(`B${startRow + 3}`);
        obraLabel.value = 'OBRA:';
        obraLabel.font = { name: 'Calibri', bold: true, size: 11 };
        obraLabel.alignment = { horizontal: 'right', vertical: 'middle' };
        
        worksheet.mergeCells(`C${startRow + 3}:D${startRow + 3}`);
        const obraValue = worksheet.getCell(`C${startRow + 3}`);
        obraValue.value = v.header.obra;
        obraValue.font = { name: 'Calibri', size: 11 };
        obraValue.border = { top: borderThin, bottom: borderThin };
        
        const protoLabel = worksheet.getCell(`E${startRow + 3}`);
        protoLabel.value = 'PROTOTIPO:';
        protoLabel.font = { name: 'Calibri', bold: true, size: 11 };
        protoLabel.alignment = { horizontal: 'right', vertical: 'middle' };
        
        worksheet.mergeCells(`F${startRow + 3}:G${startRow + 3}`);
        const protoValue = worksheet.getCell(`F${startRow + 3}`);
        protoValue.value = v.header.prototipo;
        protoValue.font = { name: 'Calibri', size: 11 };
        protoValue.border = { top: borderThin, bottom: borderThin };

        // Row 5: Paquete, Concepto
        const paqLabel = worksheet.getCell(`B${startRow + 4}`);
        paqLabel.value = 'PAQUETE:';
        paqLabel.font = { name: 'Calibri', bold: true, size: 11 };
        paqLabel.alignment = { horizontal: 'right', vertical: 'middle' };
        
        worksheet.mergeCells(`C${startRow + 4}:D${startRow + 4}`);
        const paqValue = worksheet.getCell(`C${startRow + 4}`);
        paqValue.value = v.header.paquete;
        paqValue.font = { name: 'Calibri', size: 11 };
        paqValue.border = { bottom: borderThin };

        const conceptoLabel = worksheet.getCell(`H${startRow + 4}`);
        conceptoLabel.value = 'CONCEPTO:';
        conceptoLabel.font = { bold: true, size: 11 };
        conceptoLabel.alignment = { horizontal: 'right', vertical: 'middle' };

        worksheet.mergeCells(`I${startRow + 3}:J${startRow + 6}`);
        const conceptoValue = worksheet.getCell(`I${startRow + 3}`);
        conceptoValue.value = v.header.concepto;
        conceptoValue.font = { size: 11 };
        conceptoValue.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        // Ensure the orange box has all its borders (remarcados)
        // Right border is double to match the voucher boundary
        conceptoValue.border = { top: borderThin, left: borderThin, right: borderDouble, bottom: borderThin };

        // Row 6: Fecha, Ubicación
        const fechaLabel = worksheet.getCell(`B${startRow + 5}`);
        fechaLabel.value = 'FECHA:';
        fechaLabel.font = { name: 'Calibri', bold: true, size: 11 };
        fechaLabel.alignment = { horizontal: 'right', vertical: 'middle' };
        
        worksheet.mergeCells(`C${startRow + 5}:D${startRow + 5}`);
        const fechaValue = worksheet.getCell(`C${startRow + 5}`);
        fechaValue.value = v.header.fecha;
        fechaValue.font = { name: 'Calibri', size: 11 };
        fechaValue.border = { bottom: borderThin };

        const ubiLabel = worksheet.getCell(`E${startRow + 5}`);
        ubiLabel.value = 'UBICACIÓN:';
        ubiLabel.font = { name: 'Calibri', bold: true, size: 11 };
        ubiLabel.alignment = { horizontal: 'right', vertical: 'middle' };
        
        worksheet.mergeCells(`F${startRow + 5}:G${startRow + 5}`);
        const ubiValue = worksheet.getCell(`F${startRow + 5}`);
        ubiValue.value = v.header.ubicacion;
        ubiValue.font = { name: 'Calibri', size: 11 };
        ubiValue.alignment = { horizontal: 'center', vertical: 'middle' };
        ubiValue.border = { bottom: borderThin };

        // Row 7: Destajista
        const destLabel = worksheet.getCell(`B${startRow + 6}`);
        destLabel.value = 'DESTAJISTA:';
        destLabel.font = { name: 'Calibri', bold: true, size: 11 };
        destLabel.alignment = { horizontal: 'right', vertical: 'middle' };
        
        worksheet.mergeCells(`C${startRow + 6}:G${startRow + 6}`);
        const destValue = worksheet.getCell(`C${startRow + 6}`);
        destValue.value = v.header.destajista;
        destValue.font = { name: 'Calibri', size: 11 };
        destValue.border = { bottom: borderThin };

        // Outer borders for the header section A4:H7
        for (let r = startRow + 3; r <= startRow + 6; r++) {
          worksheet.getCell(`A${r}`).border = { left: borderDouble };
          worksheet.getCell(`J${r}`).border = { right: borderDouble };
        }
        worksheet.getCell(`A${startRow + 6}`).border = { left: borderDouble, bottom: borderThin };
        for (let c = 2; c <= 9; c++) {
          const col = String.fromCharCode(64 + c);
          const cell = worksheet.getCell(`${col}${startRow + 6}`);
          cell.border = { ...cell.border, bottom: borderThin };
        }
        worksheet.getCell(`J${startRow + 6}`).border = { right: borderDouble, bottom: borderThin };

        // Row 8: Table Headers
        const headers = ['CLASIF.', 'UNIDAD', 'CANTIDAD', 'DESCRIPCION', 'P.U', 'IMPORTE'];
        const headerCols = ['A', 'B', 'C', 'D', 'I', 'J'];
        worksheet.mergeCells(`D${startRow + 7}:H${startRow + 7}`);
        
        headers.forEach((h, i) => {
          const cell = worksheet.getCell(`${headerCols[i]}${startRow + 7}`);
          cell.value = h;
          cell.font = { bold: true, size: 11 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Apply grid borders to headers
        for (let c = 1; c <= 10; c++) {
          const col = String.fromCharCode(64 + c);
          const cell = worksheet.getCell(`${col}${startRow + 7}`);
          cell.border = { 
            top: borderThin, 
            left: c === 1 ? borderDouble : borderThin, 
            right: c === 10 ? borderDouble : borderThin, 
            bottom: borderThin 
          };
        }

        // Items
        let itemRow = startRow + 8;
        const targetItemsCount = 16;
        
        for (let i = 0; i < targetItemsCount; i++) {
          const isLegendRow = v.header.fueraPresupuesto && i === 7;

          if (isLegendRow) {
            worksheet.mergeCells(`E${itemRow}:H${itemRow}`);
            const cellE = worksheet.getCell(`E${itemRow}`);
            cellE.value = 'MATERIAL FUERA DE PPTO';
            cellE.font = { bold: true, size: 11 };
            cellE.alignment = { horizontal: 'left', vertical: 'middle' };
          } else {
            worksheet.mergeCells(`D${itemRow}:H${itemRow}`);
            
            if (i < v.items.length) {
              const item = v.items[i];
              const cellB = worksheet.getCell(`B${itemRow}`);
              cellB.value = item.unidad;
              cellB.font = { size: 11 };
              cellB.alignment = { horizontal: 'center', vertical: 'middle' };
              
              const cellC = worksheet.getCell(`C${itemRow}`);
              cellC.value = item.cantidad;
              cellC.font = { size: 11 };
              cellC.alignment = { horizontal: 'center', vertical: 'middle' };
              
              const cellD = worksheet.getCell(`D${itemRow}`);
              cellD.value = item.descripcion;
              cellD.font = { 
                size: 11,
                bold: item.descripcion === 'MATERIAL FUERA DE PPTO'
              };
              cellD.alignment = { horizontal: 'left', vertical: 'middle' };
            }
          }
          
          // Apply grid borders to item row
          for (let c = 1; c <= 10; c++) {
            const col = String.fromCharCode(64 + c);
            worksheet.getCell(`${col}${itemRow}`).border = { 
              top: borderThin, 
              left: c === 1 ? borderDouble : borderThin, 
              right: c === 10 ? borderDouble : borderThin, 
              bottom: borderThin 
            };
          }
          
          itemRow++;
        }

        // Subconcepto
        const template = allTemplates.find(t => t.id === v.templateId) || allTemplates[0];
        const subRow = itemRow - 3; // Combine with two superior ones (total 3 rows)
        worksheet.mergeCells(`I${subRow}:J${itemRow - 1}`);
        const subConceptoCell = worksheet.getCell(`I${subRow}`);
        subConceptoCell.value = template.subConcepto;
        subConceptoCell.font = { bold: true, size: 11 };
        subConceptoCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        subConceptoCell.border = { top: borderThin, left: borderThin, right: borderDouble, bottom: borderThin };
        subConceptoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };

        // Signatures
        const sigRow = itemRow;
        worksheet.mergeCells(`B${sigRow}:D${sigRow}`);
        const elabLabel = worksheet.getCell(`B${sigRow}`);
        elabLabel.value = 'ELABORÓ:';
        elabLabel.font = { size: 11 };
        elabLabel.alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.mergeCells(`G${sigRow}:I${sigRow}`);
        const autLabel = worksheet.getCell(`G${sigRow}`);
        autLabel.value = 'AUTORIZÓ:';
        autLabel.font = { size: 11 };
        autLabel.alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.mergeCells(`B${sigRow + 2}:D${sigRow + 2}`);
        const elabValue = worksheet.getCell(`B${sigRow + 2}`);
        elabValue.value = v.header.elaboro;
        elabValue.font = { size: 11 };
        elabValue.alignment = { horizontal: 'center', vertical: 'middle' };
        elabValue.border = { top: borderThin };

        worksheet.mergeCells(`G${sigRow + 2}:I${sigRow + 2}`);
        const autValue = worksheet.getCell(`G${sigRow + 2}`);
        autValue.value = v.header.autorizo;
        autValue.font = { size: 11 };
        autValue.alignment = { horizontal: 'center', vertical: 'middle' };
        autValue.border = { top: borderThin };

        // Add outer borders for the signature section
        for (let r = itemRow; r <= sigRow + 2; r++) {
          worksheet.getCell(`A${r}`).border = { ...worksheet.getCell(`A${r}`).border, left: borderDouble };
          worksheet.getCell(`J${r}`).border = { ...worksheet.getCell(`J${r}`).border, right: borderDouble };
        }
        for (let c = 1; c <= 10; c++) {
          const col = String.fromCharCode(64 + c);
          const cell = worksheet.getCell(`${col}${sigRow + 2}`);
          cell.border = { ...cell.border, bottom: borderDouble };
        }

        // Add some spacing before the next voucher
        currentRow = sigRow + 3;
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Vales_Export_${new Date().getTime()}.xlsx`);
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingTemplates(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        if (data.length === 0) {
          alert("El archivo está vacío.");
          setIsUploadingTemplates(false);
          return;
        }

        // Group items by Concepto + SubConcepto
        const grouped: Record<string, any> = {};
        
        data.forEach(row => {
          const concepto = String(row.Concepto || row.concepto || 'SIN CONCEPTO').trim();
          const subConcepto = String(row.SubConcepto || row.subConcepto || row.Subconcepto || 'SIN SUBCONCEPTO').trim();
          const paquete = String(row.Paquete || row.paquete || '').trim();
          const prototipo = String(row.Prototipo || row.prototipo || '').trim();
          
          const material = String(row.Material || row.material || row.Descripcion || row.descripcion || '').trim();
          if (material && material !== 'MATERIAL FUERA DE PPTO') {
            const key = `${concepto}|${subConcepto}`;
            if (!grouped[key]) {
              grouped[key] = {
                concepto,
                subConcepto,
                paquete,
                prototipo,
                items: []
              };
            }
            
            grouped[key].items.push({
              descripcion: material,
              unidad: String(row.Unidad || row.unidad || ''),
              cantidad: parseFloat(row.Cantidad || row.cantidad || 0) || 0
            });
          }
        });

        const templatesToUpload = Object.values(grouped).filter(t => t.items.length > 0);

        if (templatesToUpload.length > 0) {
          const batch = writeBatch(db);
          templatesToUpload.forEach((t: any) => {
            const id = `custom-${crypto.randomUUID()}`;
            batch.set(doc(db, 'customTemplates', id), { ...t, id });
          });
          batch.commit().then(() => {
            alert(`${templatesToUpload.length} plantillas añadidas correctamente.`);
            setIsUploadingTemplates(false);
          }).catch(error => {
            handleFirestoreError(error, OperationType.CREATE, 'customTemplates');
            setIsUploadingTemplates(false);
          });
        } else {
          alert("No se encontraron plantillas válidas en el archivo. Asegúrate de que las columnas tengan los nombres correctos (Concepto, SubConcepto, Material, Unidad, Cantidad).");
          setIsUploadingTemplates(false);
        }
      } catch (error) {
        console.error("Error parsing template file:", error);
        alert("Error al leer el archivo de Excel. Asegúrate de que sea un archivo válido.");
        setIsUploadingTemplates(false);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const allTemplates = [
    { id: 'empty', concepto: 'PLANTILLA VACÍA', subConcepto: 'NUEVO VALE EDITABLE', items: [] },
    ...VOUCHER_TEMPLATES,
    ...customTemplates
  ];
  console.log("All templates:", allTemplates);

  const filteredTemplates = allTemplates.filter(t => 
    t.concepto.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subConcepto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isDuplicateVoucher = useMemo(() => {
    if (!activeVoucher || !activeVoucher.header.paquete || !activeVoucher.header.ubicacion || !activeVoucher.templateId) return false;
    
    return vouchers.some(v => 
      v.id !== activeVoucher.id && 
      v.header.paquete === activeVoucher.header.paquete && 
      v.header.ubicacion === activeVoucher.header.ubicacion && 
      v.templateId === activeVoucher.templateId
    );
  }, [activeVoucher?.header.paquete, activeVoucher?.header.ubicacion, activeVoucher?.templateId, activeVoucher?.id, vouchers]);

  const displayVouchers = useMemo(() => {
    const list = [...vouchers];
    if (draftVoucher) {
      const idx = list.findIndex(v => v.id === draftVoucher.id);
      if (idx >= 0) {
        list[idx] = draftVoucher;
      } else {
        list.push(draftVoucher);
      }
    }
    return list;
  }, [vouchers, draftVoucher]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor ingresa usuario y contraseña');
      return;
    }
    
    const normalizedEmail = loginEmail.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
    const trimmedPassword = loginPassword.trim();
    
    let emailToUse = normalizedEmail.includes('@') ? normalizedEmail : `${normalizedEmail}@construvivienda.local`;
    let passwordToUse = loginPassword;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToUse)) {
      setLoginError('El usuario o correo no es válido.');
      return;
    }
    
    // Hardcoded bypass for the specific user request
    if (normalizedEmail === 'administracion' || normalizedEmail === 'administracion@construvivienda.local') {
      if (trimmedPassword === 'tsunami123') {
        // Force a fresh admin account if they use the default password, 
        // in case they got locked out of the previous one.
        emailToUse = 'admin_tsunami3@construvivienda.local';
      } else {
        // Map to the known admin account if they use a custom password
        emailToUse = 'admin_tsunami2@construvivienda.local';
      }
    }
    
    try {
      await signInWithEmailAndPassword(auth, emailToUse, passwordToUse);
    } catch (error: any) {
      const isAdminEmail = emailToUse === 'administracion@construvivienda.local' || 
                           emailToUse === 'admin@construvivienda.local' || 
                           emailToUse === 'admin_tsunami@construvivienda.local' || 
                           emailToUse === 'admin_tsunami2@construvivienda.local' ||
                           emailToUse === 'admin_tsunami3@construvivienda.local';
      
      if (!isAdminEmail) {
        console.error("Login error:", error);
      }

      if (isAdminEmail) {
        try {
          const { createUserWithEmailAndPassword } = await import('firebase/auth');
          await createUserWithEmailAndPassword(auth, emailToUse, passwordToUse);
          return;
        } catch (e: any) {
          if (e.code !== 'auth/email-already-in-use') {
            console.error("Auto-create error:", e);
          }
          if (e.code === 'auth/operation-not-allowed') {
            setLoginError('Error: El inicio de sesión con Usuario/Contraseña no está activado en Firebase. Debes activarlo en la consola.');
            return;
          }
          if (e.code === 'auth/weak-password') {
            setLoginError('Error: La contraseña debe tener al menos 6 caracteres.');
            return;
          }
          if (e.code === 'auth/email-already-in-use') {
            setLoginError(`Error de credenciales (${error.code}). Si cambiaste la contraseña, usa la nueva. Si no, contacta soporte.`);
            return;
          }
          setLoginError(`Error al crear usuario: ${e.message}`);
          return;
        }
      }
      if (error.code === 'auth/network-request-failed') {
        setLoginError('Error de red. Por favor revisa tu conexión a internet o desactiva tu bloqueador de anuncios (AdBlock, Brave Shields) que podría estar bloqueando el inicio de sesión.');
        return;
      }
      setLoginError(`Usuario o contraseña incorrectos (${error.code}). Si eres nuevo, pide al administrador que te cree una cuenta.`);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-zinc-900/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6">
              <img src="https://i.imgur.com/3q1q3Q1.png" alt="Logo" className="w-12 h-12 object-contain filter brightness-0 invert" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter" style={{ fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 0 #059669' }}>
              CONSTRU<span className="text-zinc-600">VIVIENDA</span>
            </h1>
            <p className="text-zinc-500 font-bold tracking-[0.2em] text-sm mt-2">SISTEMA DE VALES</p>
          </div>

          <form onSubmit={handleLogin} className="bg-zinc-800/90 backdrop-blur-md border border-zinc-700 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>
            
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-bold mb-6 text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Usuario</label>
                <input 
                  type="text" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                  placeholder="Ej. admin"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Contraseña</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-8 bg-black hover:bg-zinc-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(0,0,0,0.5)] uppercase tracking-wider"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isDataLoaded) {
    return (
      <div className="h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-black rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-black/50 mb-6 animate-pulse">
          <FileText size={40} className="text-white" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mb-4"></div>
        <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[var(--color-app-bg)] font-sans text-[var(--color-text-primary)] flex overflow-hidden">
      {/* Sidebar */}
      {activeTab !== 'inicio' && (
        <div className={cn(
          "flex flex-col bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)] transition-all duration-300 z-20 shadow-xl shrink-0",
          isSidebarOpen ? "w-64" : "w-20"
        )}>
          {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          <div 
            className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300 cursor-pointer hover:opacity-80", !isSidebarOpen && "w-0 opacity-0")}
            onClick={() => setActiveTab('inicio')}
          >
            <div className="bg-black p-2 rounded-lg shadow-lg shrink-0">
              <img src="https://i.imgur.com/3q1q3Q1.png" alt="Logo" className="w-6 h-6 object-contain filter brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight whitespace-nowrap text-sm">ConstruVivienda</span>
              <span className="text-[10px] opacity-60 uppercase tracking-widest whitespace-nowrap">Sistema de Vales</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-[var(--color-sidebar-hover)] text-[var(--color-sidebar-text)] transition-colors shrink-0"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('inicio')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
              activeTab === 'inicio' 
                ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text-active)] font-bold shadow-md" 
                : "hover:bg-[var(--color-sidebar-hover)] text-[var(--color-sidebar-text)]"
            )}
          >
            <Home size={20} className="shrink-0" />
            <span className={cn("whitespace-nowrap transition-all duration-300 text-sm", !isSidebarOpen && "hidden")}>Inicio</span>
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                Inicio
              </div>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('captura')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
              activeTab === 'captura' 
                ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text-active)] font-bold shadow-md" 
                : "hover:bg-[var(--color-sidebar-hover)] text-[var(--color-sidebar-text)]"
            )}
          >
            <LayoutDashboard size={20} className="shrink-0" />
            <span className={cn("whitespace-nowrap transition-all duration-300 text-sm", !isSidebarOpen && "hidden")}>Captura de Vales</span>
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                Captura de Vales
              </div>
            )}
          </button>
          
          {currentUser?.role === 'Administrador' && (
            <button 
              onClick={() => setActiveTab('configuracion')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                activeTab === 'configuracion' 
                  ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text-active)] font-bold shadow-md" 
                  : "hover:bg-[var(--color-sidebar-hover)] text-[var(--color-sidebar-text)]"
              )}
            >
              <Settings size={20} className="shrink-0" />
              <span className={cn("whitespace-nowrap transition-all duration-300 text-sm", !isSidebarOpen && "hidden")}>Ajustes y Plantillas</span>
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  Ajustes y Plantillas
                </div>
              )}
            </button>
          )}
          
          <button 
            onClick={() => setActiveTab('reportes')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
              activeTab === 'reportes' 
                ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text-active)] font-bold shadow-md" 
                : "hover:bg-[var(--color-sidebar-hover)] text-[var(--color-sidebar-text)]"
            )}
          >
            <FileText size={20} className="shrink-0" />
            <span className={cn("whitespace-nowrap transition-all duration-300 text-sm", !isSidebarOpen && "hidden")}>Reportes y Búsqueda</span>
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                Reportes y Búsqueda
              </div>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('inventario')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
              activeTab === 'inventario' 
                ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text-active)] font-bold shadow-md" 
                : "hover:bg-[var(--color-sidebar-hover)] text-[var(--color-sidebar-text)]"
            )}
          >
            <Package size={20} className="shrink-0" />
            <span className={cn("whitespace-nowrap transition-all duration-300 text-sm", !isSidebarOpen && "hidden")}>Inventario / Presupuesto</span>
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                Inventario / Presupuesto
              </div>
            )}
          </button>

          {currentUser?.role === 'Administrador' && (
            <button 
              onClick={() => setActiveTab('usuarios')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                activeTab === 'usuarios' 
                  ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text-active)] font-bold shadow-md" 
                  : "hover:bg-[var(--color-sidebar-hover)] text-[var(--color-sidebar-text)]"
              )}
            >
              <Users size={20} className="shrink-0" />
              <span className={cn("whitespace-nowrap transition-all duration-300 text-sm", !isSidebarOpen && "hidden")}>Usuarios</span>
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  Usuarios
                </div>
              )}
            </button>
          )}
        </div>
        
        {/* User Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold shrink-0">
              {currentUser?.name.substring(0, 2).toUpperCase()}
            </div>
            <div className={cn("flex flex-col overflow-hidden transition-all duration-300 flex-1", !isSidebarOpen && "w-0 opacity-0")}>
              <span className="text-sm font-bold whitespace-nowrap truncate">{currentUser?.name}</span>
              <span className="text-[10px] opacity-60 whitespace-nowrap truncate">{currentUser?.role}</span>
            </div>
            {isSidebarOpen && (
              <button 
                onClick={() => signOut(auth)}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Inicio Tab */}
        {activeTab === 'inicio' && (
          <div className="flex-1 overflow-y-auto bg-[var(--color-app-bg)] relative">
             
             <div className="relative z-10 p-6 md:p-10 h-full flex flex-col max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-[var(--color-line)] pb-6">
                   <div>
                     <h2 className="text-[var(--color-text-secondary)] font-medium tracking-wide text-sm md:text-base mb-1">System Status: Online</h2>
                     <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-text-primary)] tracking-tight">
                       CONSTRUVIVIENDA
                     </h1>
                   </div>
                   
                   {/* Profile / Quick Stats */}
                   <div className="flex items-center gap-4 bg-[var(--color-sidebar-bg)] p-3 rounded-xl border-2 border-[var(--color-line)] shadow-sm">
                      <div className="w-12 h-12 bg-[var(--color-line)] rounded-full flex items-center justify-center text-xl font-bold text-[var(--color-text-primary)]">
                        {currentUser?.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="pr-4">
                        <h3 className="text-[var(--color-text-primary)] font-semibold text-sm">{currentUser?.name}</h3>
                        <p className="text-[var(--color-text-secondary)] text-xs">LEVEL: {currentUser?.role}</p>
                      </div>
                      <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                        title="Modo Oscuro"
                      >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                      </button>
                      <button 
                        onClick={() => signOut(auth)}
                        className="p-2 ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors border-l border-[var(--color-line)]"
                        title="Cerrar Sesión"
                      >
                        <LogOut size={20} />
                      </button>
                   </div>
                </div>

                {/* Main Layout */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  
                  {/* Left Column - Data Access */}
                  <div className="space-y-6">
                    <h3 className="text-[var(--color-text-primary)] font-semibold text-xl md:text-2xl tracking-tight border-l-2 border-[var(--color-accent-cyan)] pl-4">
                      Data Access
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Captura Card */}
                      <button 
                        onClick={() => setActiveTab('captura')}
                        className="h-48 sm:h-64 bg-[var(--color-sidebar-bg)] rounded-xl border-2 border-[var(--color-line)] shadow-md hover:border-[var(--color-accent-cyan)] hover:shadow-lg transition-all duration-300 text-left p-6 flex flex-col justify-between"
                      >
                        <LayoutDashboard className="text-[var(--color-accent-cyan)]" size={32} />
                        <div>
                          <h4 className="text-[var(--color-text-primary)] font-semibold text-xl">Captura</h4>
                          <p className="text-[var(--color-text-secondary)] text-xs mt-1">System: Input</p>
                        </div>
                      </button>

                      {/* Reportes Card */}
                      <button 
                        onClick={() => setActiveTab('reportes')}
                        className="h-48 sm:h-64 bg-[var(--color-sidebar-bg)] rounded-xl border-2 border-[var(--color-line)] shadow-md hover:border-[var(--color-accent-cyan)] hover:shadow-lg transition-all duration-300 text-left p-6 flex flex-col justify-between"
                      >
                        <FileSpreadsheet className="text-[var(--color-accent-cyan)]" size={32} />
                        <div>
                          <h4 className="text-[var(--color-text-primary)] font-semibold text-xl">Reportes</h4>
                          <p className="text-[var(--color-text-secondary)] text-xs mt-1">System: Analysis</p>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Right Column - Placeholder */}
                  <div className="hidden lg:flex justify-center items-center">
                    <div className="w-64 h-64 border border-[var(--color-line)] rounded-full flex items-center justify-center">
                    </div>
                  </div>
                </div>

                {/* Center Spacer for Background Character/Focus */}
                <div className="hidden lg:block w-32 xl:w-64"></div>

                {/* Right Column - Gestión */}
                <div className="space-y-6">
                  <h3 className="text-[var(--color-text-primary)] font-semibold text-xl md:text-2xl tracking-tight text-right">
                    Gestión y Configuración
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Ajustes Card */}
                    {currentUser?.role === 'Administrador' && (
                      <button 
                        onClick={() => setActiveTab('configuracion')}
                        className="h-48 sm:h-64 bg-[var(--color-sidebar-bg)] rounded-xl border-2 border-[var(--color-line)] shadow-md hover:border-[var(--color-accent-cyan)] hover:shadow-lg transition-all duration-300 text-left p-6 flex flex-col justify-between"
                      >
                        <Settings className="text-[var(--color-text-secondary)]" size={32} />
                        <div>
                          <h4 className="text-[var(--color-text-primary)] font-semibold text-xl">Ajustes</h4>
                          <p className="text-[var(--color-text-secondary)] text-xs mt-1">System: Config</p>
                        </div>
                      </button>
                    )}

                    {/* Usuarios Card */}
                    {currentUser?.role === 'Administrador' && (
                      <button 
                        onClick={() => setActiveTab('usuarios')}
                        className="h-48 sm:h-64 bg-[var(--color-sidebar-bg)] rounded-xl border-2 border-[var(--color-line)] shadow-md hover:border-[var(--color-accent-cyan)] hover:shadow-lg transition-all duration-300 text-left p-6 flex flex-col justify-between"
                      >
                        <Users className="text-[var(--color-text-secondary)]" size={32} />
                        <div>
                          <h4 className="text-[var(--color-text-primary)] font-semibold text-xl">Usuarios</h4>
                          <p className="text-[var(--color-text-secondary)] text-xs mt-1">System: Access</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* List Manager Modal */}
        {/* Modal para Editar Plantilla */}
        {editingTemplate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[var(--color-sidebar-bg)] rounded-3xl w-full max-w-2xl shadow-2xl border-2 border-[var(--color-line)] animate-in zoom-in-95 duration-200 my-8">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-xl font-bold">Editar Plantilla</h2>
                <button onClick={() => setEditingTemplate(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdateTemplate} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Paquete</label>
                    <select 
                      value={editingTemplate.paquete}
                      onChange={e => setEditingTemplate({ ...editingTemplate, paquete: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                    >
                      {packagesList.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Prototipo</label>
                    <input 
                      type="text"
                      value={editingTemplate.prototipo}
                      onChange={e => setEditingTemplate({ ...editingTemplate, prototipo: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Concepto</label>
                  <input 
                    type="text"
                    value={editingTemplate.concepto}
                    onChange={e => setEditingTemplate({ ...editingTemplate, concepto: e.target.value.toUpperCase(), subConcepto: e.target.value.split('-')[0].trim().toUpperCase() })}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Materiales / Items</label>
                    <button 
                      type="button"
                      onClick={() => setEditingTemplate({ ...editingTemplate, items: [...editingTemplate.items, { descripcion: '', unidad: '', cantidad: 0, precio: 0, total: 0 }] })}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      + Agregar Item
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {editingTemplate.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-start bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                        <div className="col-span-6">
                          <input 
                            placeholder="Descripción"
                            value={item.descripcion}
                            onChange={e => {
                              const newItems = [...editingTemplate.items];
                              newItems[idx].descripcion = e.target.value.toUpperCase();
                              setEditingTemplate({ ...editingTemplate, items: newItems });
                            }}
                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
                          />
                        </div>
                        <div className="col-span-2">
                          <input 
                            placeholder="Unidad"
                            value={item.unidad}
                            onChange={e => {
                              const newItems = [...editingTemplate.items];
                              newItems[idx].unidad = e.target.value.toUpperCase();
                              setEditingTemplate({ ...editingTemplate, items: newItems });
                            }}
                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
                          />
                        </div>
                        <div className="col-span-3">
                          <input 
                            type="number"
                            placeholder="Cant."
                            value={item.cantidad}
                            onChange={e => {
                              const newItems = [...editingTemplate.items];
                              newItems[idx].cantidad = parseFloat(e.target.value) || 0;
                              setEditingTemplate({ ...editingTemplate, items: newItems });
                            }}
                            className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-black"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button 
                            type="button"
                            onClick={() => {
                              const newItems = editingTemplate.items.filter((_, i) => i !== idx);
                              setEditingTemplate({ ...editingTemplate, items: newItems });
                            }}
                            className="text-zinc-400 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingTemplate(null)}
                    className="flex-1 px-6 py-3 border border-zinc-200 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para Actualización Masiva de Paquetes */}
        {showBulkUpdateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[var(--color-sidebar-bg)] rounded-3xl w-full max-w-md shadow-2xl border-2 border-[var(--color-line)] animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-xl font-bold">Actualización Masiva</h2>
                <button onClick={() => setShowBulkUpdateModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Paquete Actual</label>
                    <select 
                      value={bulkUpdateData.oldPackage}
                      onChange={e => setBulkUpdateData({ ...bulkUpdateData, oldPackage: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Seleccionar paquete...</option>
                      {Array.from(new Set(customTemplates.map(t => t.paquete))).sort().map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Nuevo Paquete</label>
                    <select 
                      value={bulkUpdateData.newPackage}
                      onChange={e => setBulkUpdateData({ ...bulkUpdateData, newPackage: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Seleccionar nuevo paquete...</option>
                      {packagesList.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowBulkUpdateModal(false)}
                    className="flex-1 px-6 py-3 border border-zinc-200 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleBulkUpdatePackages}
                    disabled={isBulkUpdating || !bulkUpdateData.oldPackage || !bulkUpdateData.newPackage}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all disabled:opacity-50"
                  >
                    {isBulkUpdating ? 'Actualizando...' : 'Actualizar Todo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showListManager && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--color-sidebar-bg)] rounded-3xl shadow-2xl border-2 border-[var(--color-line)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 bg-black text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings size={24} />
                  <h2 className="text-xl font-bold">Gestión de Listas</h2>
                </div>
                <button onClick={() => { setShowListManager(false); setEditingList(null); }} className="hover:bg-white/20 p-2 rounded-full transition-all">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <button 
                    onClick={() => setEditingList('destajistas')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center space-y-2",
                      editingList === 'destajistas' ? "border-black bg-zinc-100 text-zinc-800" : "border-zinc-100 hover:border-zinc-300"
                    )}
                  >
                    <div className="font-bold">Destajistas</div>
                    <div className="text-xs opacity-60">{destajistas.length} nombres</div>
                  </button>
                  <button 
                    onClick={() => setEditingList('elaboro')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center space-y-2",
                      editingList === 'elaboro' ? "border-black bg-zinc-100 text-zinc-800" : "border-zinc-100 hover:border-zinc-300"
                    )}
                  >
                    <div className="font-bold">Elaboró</div>
                    <div className="text-xs opacity-60">{elaboroList.length} nombres</div>
                  </button>
                  <button 
                    onClick={() => setEditingList('autorizo')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center space-y-2",
                      editingList === 'autorizo' ? "border-black bg-zinc-100 text-zinc-800" : "border-zinc-100 hover:border-zinc-300"
                    )}
                  >
                    <div className="font-bold">Autorizó</div>
                    <div className="text-xs opacity-60">{autorizoList.length} nombres</div>
                  </button>
                  <button 
                    onClick={() => setEditingList('paquetes')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center space-y-2",
                      editingList === 'paquetes' ? "border-black bg-zinc-100 text-zinc-800" : "border-zinc-100 hover:border-zinc-300"
                    )}
                  >
                    <div className="font-bold">Paquetes</div>
                    <div className="text-xs opacity-60">{packagesList.length} registrados</div>
                  </button>
                  <button 
                    onClick={() => setEditingList('ubicaciones')}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center space-y-2",
                      editingList === 'ubicaciones' ? "border-black bg-zinc-100 text-zinc-800" : "border-zinc-100 hover:border-zinc-300"
                    )}
                  >
                    <div className="font-bold">Ubicaciones</div>
                    <div className="text-xs opacity-60">Personalizadas</div>
                  </button>
                </div>

                {editingList && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-200">
                    {editingList === 'ubicaciones' && (
                      <div className="flex flex-col gap-2 p-4 bg-zinc-100 rounded-2xl border border-zinc-200">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Paquete Seleccionado</label>
                        <div className="flex flex-wrap gap-2">
                          {packagesList.map(pkg => {
                            const letter = pkg.trim().slice(-1).toUpperCase();
                            return (
                              <button
                                key={pkg}
                                onClick={() => setSelectedPackageForUbicaciones(letter)}
                                title={pkg}
                                className={cn(
                                  "w-10 h-10 rounded-lg font-bold transition-all border-2",
                                  selectedPackageForUbicaciones === letter 
                                    ? "bg-black text-white border-black" 
                                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                                )}
                              >
                                {letter}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder={editingList === 'ubicaciones' ? "Ej: (83/1)" : editingList === 'paquetes' ? "Ej: 26 BIC INF DIAM J" : "Agregar nuevo nombre..."}
                        className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                      />
                      <button 
                        onClick={handleAddItem}
                        className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                      >
                        Agregar
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingList === 'destajistas' 
                        ? destajistas 
                        : editingList === 'elaboro' 
                        ? elaboroList 
                        : editingList === 'autorizo' 
                        ? autorizoList 
                        : editingList === 'paquetes'
                        ? packagesList
                        : (customLocations[selectedPackageForUbicaciones] || [])
                      ).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100 group">
                          <span className="text-sm font-medium">{item}</span>
                          <button 
                            onClick={() => handleRemoveItem(idx)}
                            className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end">
                <button 
                  onClick={() => { setShowListManager(false); setEditingList(null); }}
                  className="bg-black hover:bg-zinc-800 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content Grid */}
        {activeTab === 'captura' && (
          <div className="flex-1 overflow-hidden bg-[var(--color-app-bg)]">
            {activeVoucher ? (
              <div className="grid grid-cols-1 xl:grid-cols-[600px_1fr] h-full w-full items-start">
              {/* Form Area */}
              <div className="bg-[var(--color-sidebar-bg)] p-3 md:p-4 space-y-4 border-r-2 border-[var(--color-accent-cyan)] h-full overflow-y-auto scrollbar-hide">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="text-sm font-bold text-[var(--color-accent-cyan)] uppercase tracking-widest whitespace-nowrap">Detalles del Vale</h3>
                    <div className="flex items-center gap-2 flex-1 md:justify-end w-full">
                      <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase whitespace-nowrap">Selección Rápida:</label>
                      <input 
                        type="text"
                        list="templates-list"
                        value={activeVoucher.templateId === 'empty' ? activeVoucher.header.concepto : (allTemplates.find(t => t.id === activeVoucher.templateId)?.subConcepto || activeVoucher.header.concepto)}
                        onChange={(e) => handleTemplateChange(e.target.value.toUpperCase())}
                        placeholder="Buscar o escribir subconcepto..."
                        className="px-3 py-2 bg-[var(--color-app-bg)] border-2 border-[var(--color-accent-cyan)] rounded-sm text-xs text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-accent-cyan)] outline-none transition-all flex-1 min-w-[200px] max-w-full"
                      />
                      <datalist id="templates-list">
                        {allTemplates.map(t => (
                          <option key={t.id} value={t.subConcepto || t.concepto} />
                        ))}
                      </datalist>
                    </div>
                  </div>

              {/* Vales Activos Tabs - Ocultos por solicitud, solo botones de acción */}
              <div className="flex justify-end mt-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleRemoveVoucher(activeVoucher.id)}
                    className="text-red-500 hover:text-red-400 flex items-center gap-1 bg-[var(--color-app-bg)] border border-red-500 px-3 py-1.5 rounded-sm transition-colors font-bold text-xs uppercase tracking-widest"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                  <button 
                    onClick={saveVoucher} 
                    disabled={!isDraftDirty || isDuplicateVoucher}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-sm transition-colors font-bold text-xs uppercase tracking-widest",
                      isDraftDirty && !isDuplicateVoucher
                        ? "bg-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan)]/80 text-black shadow-md shadow-[var(--color-accent-cyan)]/20" 
                        : "bg-[var(--color-sidebar-hover)] text-[var(--color-text-secondary)] cursor-not-allowed"
                    )}
                  >
                    <Save size={14} /> Guardar
                  </button>
                  <button onClick={() => handleAddVoucher()} className="text-[var(--color-text-primary)] hover:text-[var(--color-accent-cyan)] flex items-center gap-1 bg-[var(--color-app-bg)] border border-[var(--color-accent-cyan)] px-3 py-1.5 rounded-sm transition-colors font-bold text-xs uppercase tracking-widest">
                    <Plus size={14} /> Nuevo Vale
                  </button>
                </div>
              </div>

              {/* Editor Form */}
              <div className="bg-[var(--color-sidebar-bg)] rounded-xl p-6 border-2 border-[var(--color-line)] shadow-md mt-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-[var(--color-accent-cyan)] rounded-full"></div>
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">Datos del Vale</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase">Paquete</label>
                  <select 
                    value={activeVoucher.header.paquete}
                    onChange={e => {
                      const newPaquete = e.target.value;
                      let newPrototipo = activeVoucher.header.prototipo;

                      if (newPaquete) {
                        const letter = newPaquete.trim().slice(-1).toUpperCase();
                        newPrototipo = `BIC INF DIAM ${letter}`;
                      }

                      updateActiveVoucher({ 
                        header: { 
                          ...activeVoucher.header, 
                          paquete: newPaquete,
                          prototipo: newPrototipo,
                          ubicacion: '' // Reset location when package changes
                        } 
                      });
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-[var(--color-line)] rounded-md text-sm text-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-accent-cyan)] outline-none transition-all"
                  >
                    <option value="">Seleccionar...</option>
                    {packagesList.map(pkg => (
                      <option key={pkg} value={pkg}>{pkg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase">Ubicación</label>
                  <input 
                    type="text" 
                    list="ubicacion-list"
                    value={activeVoucher.header.ubicacion}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, ubicacion: e.target.value.toUpperCase() } })}
                    placeholder="Buscar..."
                    className="w-full px-4 py-2.5 bg-white border border-[var(--color-line)] rounded-md text-sm text-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-accent-cyan)] outline-none transition-all"
                  />
                  <datalist id="ubicacion-list">
                    {getLocationsForPackage(activeVoucher.header.paquete).map(loc => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                  {isDuplicateVoucher && (
                    <div className="flex items-start gap-1.5 mt-1 text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span className="text-xs font-medium leading-tight">
                        Ya existe un vale con este paquete, ubicación y concepto.
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase">Fecha</label>
                  <input 
                    type="text" 
                    value={activeVoucher.header.fecha}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, fecha: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-white border border-[var(--color-line)] rounded-md text-sm text-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-accent-cyan)] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase">Folio</label>
                  <input 
                    type="text" 
                    value={activeVoucher.header.folio}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, folio: e.target.value } })}
                    placeholder="Folio..."
                    className="w-full px-4 py-2.5 bg-white border border-[var(--color-line)] rounded-md text-sm text-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-accent-cyan)] outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase">Concepto</label>
                  <textarea 
                    ref={conceptRef}
                    rows={1}
                    value={activeVoucher.header.concepto}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, concepto: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-white border border-[var(--color-line)] rounded-md text-sm focus:ring-1 focus:ring-[var(--color-accent-cyan)] outline-none transition-all resize-none overflow-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase">Destajista</label>
                  <input 
                    type="text"
                    list="destajistas-list"
                    value={activeVoucher.header.destajista}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, destajista: e.target.value.toUpperCase() } })}
                    placeholder="Buscar..."
                    className="w-full px-4 py-2.5 bg-white border border-[var(--color-line)] rounded-md text-sm focus:ring-1 focus:ring-[var(--color-accent-cyan)] outline-none transition-all"
                  />
                  <datalist id="destajistas-list">
                    {destajistas.map(name => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase">Elaboró</label>
                  <input 
                    type="text"
                    list="elaboro-list"
                    value={activeVoucher.header.elaboro}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, elaboro: e.target.value.toUpperCase() } })}
                    placeholder="Buscar..."
                    className="w-full px-4 py-2.5 bg-white border border-[var(--color-line)] rounded-md text-sm focus:ring-1 focus:ring-[var(--color-accent-cyan)] outline-none transition-all"
                  />
                  <datalist id="elaboro-list">
                    {elaboroList.map(name => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Autorizó</label>
                  <input 
                    type="text"
                    list="autorizo-list"
                    value={activeVoucher.header.autorizo}
                    onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, autorizo: e.target.value.toUpperCase() } })}
                    placeholder="Buscar o escribir autorizó..."
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                  <datalist id="autorizo-list">
                    {autorizoList.map(name => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
                <div className="md:col-span-3 flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={activeVoucher.header.fueraPresupuesto}
                      onChange={e => updateActiveVoucher({ header: { ...activeVoucher.header, fueraPresupuesto: e.target.checked } })}
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    <span className="ml-3 text-sm font-bold text-zinc-600 uppercase tracking-tight">Material Fuera de Presupuesto</span>
                  </label>
                </div>

                <div className="md:col-span-3 lg:col-span-4 mt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-zinc-800 rounded-full"></div>
                      <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Partidas del Vale</h3>
                    </div>
                    <button 
                      onClick={addItem}
                      className="flex items-center gap-1 bg-black hover:bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
                    >
                      <Plus size={14} />
                      Añadir Partida
                    </button>
                  </div>
                    <div className="grid grid-cols-1 gap-2">
                      <datalist id="material-descriptions">
                        {Array.from(new Set(allTemplates.flatMap(t => t.items.map(i => i.descripcion)))).sort().map((desc, idx) => (
                          <option key={idx} value={desc} />
                        ))}
                      </datalist>
                      {activeVoucher.items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-zinc-50 p-3 rounded-xl border border-zinc-100 shadow-sm group transition-all hover:border-zinc-300">
                          <div className="col-span-2 space-y-1">
                            <label className="text-[8px] font-bold text-zinc-400 uppercase">Unidad</label>
                            <input 
                              type="text" 
                              value={item.unidad}
                              onChange={e => updateItem(idx, 'unidad', e.target.value.toUpperCase())}
                              placeholder="PZA"
                              className="w-full px-2 py-1.5 bg-white border border-zinc-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-black transition-all"
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <label className="text-[8px] font-bold text-zinc-400 uppercase">Cant.</label>
                            <input 
                              type="number" 
                              value={item.cantidad}
                              onChange={e => updateItem(idx, 'cantidad', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 bg-white border border-zinc-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-black transition-all"
                            />
                          </div>
                          <div className="col-span-7 space-y-1">
                            <label className="text-[8px] font-bold text-zinc-400 uppercase">Descripción</label>
                            <input 
                              type="text" 
                              value={item.descripcion}
                              onChange={e => updateItem(idx, 'descripcion', e.target.value.toUpperCase())}
                              placeholder="DESCRIPCIÓN DEL MATERIAL..."
                              list="material-descriptions"
                              className="w-full px-2 py-1.5 bg-white border border-zinc-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-black transition-all"
                            />
                          </div>
                          <div className="col-span-1 flex justify-center pb-1">
                            <button 
                              onClick={() => removeItem(idx)}
                              className="text-zinc-300 hover:text-red-500 transition-colors p-1"
                              title="Eliminar partida"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {activeVoucher.items.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                          <p className="text-zinc-400 text-[10px] uppercase font-bold mb-2">No hay partidas en este vale</p>
                          <button 
                            onClick={addItem}
                            className="text-black hover:text-zinc-800 text-[10px] font-bold uppercase underline underline-offset-4"
                          >
                            Haz clic aquí para añadir la primera
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            </div>
              
              {/* Print Info Toggle */}
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={() => setShowPrintInfo(!showPrintInfo)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm"
                  >
                    <FileText size={14} className={showPrintInfo ? "text-zinc-600" : ""} />
                    {showPrintInfo ? "Ocultar Info de Impresión" : "Ver Info de Impresión (Media Carta)"}
                  </button>
                </div>

                {showPrintInfo && (
                  <div className="bg-[var(--color-sidebar-bg)] rounded-xl p-4 border-2 border-[var(--color-line)] shadow-md w-full mt-4">
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-zinc-800 rounded-full"></span>
                      Modo Media Carta Horizontal (8.5" x 5.5")
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="text-xs text-zinc-500 space-y-2">
                        <p>
                          El diseño está optimizado para <strong>Media Carta Horizontal</strong>. Al descargar el PDF, se generará una hoja tamaño Carta (8.5" x 11") con dos vales apilados, listos para cortar.
                        </p>
                        <ul className="space-y-1 list-disc pl-4">
                          <li>Cada vale mantiene su propia información de folio y materiales.</li>
                          <li>La leyenda inferior derecha cambia automáticamente según la plantilla seleccionada.</li>
                          <li>"Descargar PDF" procesará todos los vales activos (2 por página).</li>
                        </ul>
                      </div>
                      <div className="bg-[var(--color-app-bg)] p-3 rounded-xl border-2 border-[var(--color-line)] flex items-center gap-4">
                        <div className="bg-[var(--color-sidebar-bg)] p-2 rounded-lg shadow-sm border border-[var(--color-line)]">
                          <FileText size={24} className="text-[var(--color-text-primary)]" />
                        </div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] leading-tight">
                          <span className="font-bold text-[var(--color-text-primary)] block mb-1">TIP DE IMPRESIÓN:</span>
                          Asegúrate de que la escala de impresión esté al 100% para mantener las dimensiones exactas de la plantilla.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Preview (Sticky) */}
            <div className="p-3 md:p-4 space-y-4 h-full overflow-y-auto scrollbar-hide bg-transparent">
              <div className="flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-bold text-[var(--color-text-primary)] uppercase tracking-widest">Vista Previa Real</h3>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--color-text-secondary)] uppercase">
                    <span className="w-1.5 h-1.5 bg-[var(--color-accent-cyan)] rounded-full animate-pulse"></span>
                    En vivo
                  </div>
                </div>
                
                <div className="w-full overflow-y-auto flex flex-col items-center bg-[var(--color-sidebar-bg)] rounded-xl p-2 md:p-4 border-2 border-[var(--color-line)] shadow-inner max-h-[calc(100vh-12rem)] gap-6" id="preview-area-container">
                  {displayVouchers.sort((a, b) => (a.id === activeVoucher?.id ? -1 : b.id === activeVoucher?.id ? 1 : 0)).map((v) => {
                    const template = allTemplates.find(t => t.id === v.templateId) || allTemplates[0];
                    const isActive = v.id === activeVoucher?.id;
                    
                    return (
                      <div 
                        key={v.id}
                        id={`voucher-${v.id}`}
                        ref={el => voucherRefs.current[v.id] = el}
                        className={cn(
                          "bg-white p-3 md:p-5 border shadow-xl text-[10px] leading-tight text-black transition-all w-full aspect-[8.5/5.5] max-w-4xl flex flex-col shrink-0 relative",
                          isActive ? "border-black ring-4 ring-black/20" : "border-zinc-300 opacity-70 hover:opacity-100 cursor-pointer" 
                        )}
                        style={{ fontFamily: 'Arial, sans-serif' }}
                        onClick={() => { if (!isActive) setActiveVoucherId(v.id); }}
                      >
                        {isActive && (
                          <div className="absolute -top-3 -left-3 bg-zinc-800 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            EN VIVO
                          </div>
                        )}
                  {/* Header */}
                    <div className="text-center border-b border-zinc-300 pb-0.5 mb-1 relative">
                      <h2 className="text-sm font-bold">CONSTRUVIVIENDA TECNOLOGICA S.A. DE C.V.</h2>
                      <p className="text-[7px] uppercase tracking-widest">HUIMANGUILLO TABASCO</p>
                      <h3 className="text-[9px] font-bold mt-0.5 border-y border-zinc-300 py-0.5">VALE DE SALIDA DE ALMACEN</h3>
                      <div className="absolute top-0 right-0 text-right">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[8px]">FOLIO:</span>
                          {isActive ? (
                            <input 
                              value={v.header.folio}
                              onChange={e => updateActiveVoucher({ header: { ...v.header, folio: e.target.value.toUpperCase() } })}
                              className="text-red-600 font-bold text-sm min-w-[40px] border-b border-zinc-300 bg-transparent outline-none focus:border-black focus:bg-zinc-100 text-right w-16"
                            />
                          ) : (
                            <span className="text-red-600 font-bold text-sm min-w-[40px] border-b border-zinc-300">{v.header.folio}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-x-3 mb-1.5">
                      <div className="col-span-8 space-y-1">
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-16 text-[9px] pb-0.5">OBRA:</span>
                          {isActive ? (
                            <input 
                              value={v.header.obra}
                              onChange={e => updateActiveVoucher({ header: { ...v.header, obra: e.target.value.toUpperCase() } })}
                              className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px] bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                            />
                          ) : (
                            <span className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.obra}</span>
                          )}
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-16 text-[9px] pb-0.5">PAQUETE:</span>
                          {isActive ? (
                            <input 
                              value={v.header.paquete}
                              onChange={e => updateActiveVoucher({ header: { ...v.header, paquete: e.target.value.toUpperCase() } })}
                              className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px] bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                            />
                          ) : (
                            <span className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.paquete}</span>
                          )}
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-16 text-[9px] pb-0.5">FECHA:</span>
                          {isActive ? (
                            <input 
                              value={v.header.fecha}
                              onChange={e => updateActiveVoucher({ header: { ...v.header, fecha: e.target.value } })}
                              className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px] bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                            />
                          ) : (
                            <span className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.fecha}</span>
                          )}
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-16 text-[8px] pb-0.5">DESTAJISTA:</span>
                          {isActive ? (
                            <input 
                              value={v.header.destajista}
                              onChange={e => updateActiveVoucher({ header: { ...v.header, destajista: e.target.value.toUpperCase() } })}
                              className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px] bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                            />
                          ) : (
                            <span className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.destajista}</span>
                          )}
                        </div>
                      </div>

                      <div className="col-span-4 space-y-1">
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-20 text-[9px] pb-0.5">PROTOTIPO:</span>
                          {isActive ? (
                            <input 
                              value={v.header.prototipo}
                              onChange={e => updateActiveVoucher({ header: { ...v.header, prototipo: e.target.value.toUpperCase() } })}
                              className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px] bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                            />
                          ) : (
                            <span className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.prototipo}</span>
                          )}
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="font-bold w-20 text-[9px] pb-0.5">UBICACIÓN:</span>
                          {isActive ? (
                            <input 
                              value={v.header.ubicacion}
                              onChange={e => updateActiveVoucher({ header: { ...v.header, ubicacion: e.target.value.toUpperCase() } })}
                              className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px] bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                            />
                          ) : (
                            <span className="border-b border-zinc-300 flex-1 px-1 text-[9px] pb-0.5 min-h-[14px]">{v.header.ubicacion}</span>
                          )}
                        </div>
                        <div className="mt-1 border border-zinc-300 p-1 h-10 flex flex-col">
                          <span className="font-bold text-[7px] uppercase text-zinc-400">CONCEPTO:</span>
                          {isActive ? (
                            <input 
                              value={v.header.concepto}
                              onChange={e => updateActiveVoucher({ header: { ...v.header, concepto: e.target.value.toUpperCase() } })}
                              className="font-bold text-[8px] leading-tight flex-1 bg-transparent outline-none focus:border-black focus:bg-zinc-100 w-full"
                            />
                          ) : (
                            <span className="font-bold text-[8px] leading-tight flex-1 overflow-hidden">{v.header.concepto}</span>
                          )}
                        </div>
                      </div>
                    </div>
                                      {/* Table */}
                    <div className="flex-1 overflow-hidden">
                      <table className="w-full border-collapse border border-zinc-200 mb-1">
                        <thead>
                          <tr className="bg-zinc-50">
                            <th className="border-x border-zinc-50 px-1 py-0.5 w-12 text-[8px]">CLASIF.</th>
                            <th className="border-x border-zinc-50 px-1 py-0.5 w-12 text-[8px]">UNIDAD</th>
                            <th className="border-x border-zinc-50 px-1 py-0.5 w-16 text-[8px]">CANTIDAD</th>
                            <th className="border-x border-zinc-50 px-1 py-0.5 text-left text-[8px]">DESCRIPCION</th>
                            <th className="border-x border-zinc-50 px-1 py-0.5 w-16 text-[8px]">P.U</th>
                            <th className="border-x border-zinc-50 px-1 py-0.5 w-20 text-[8px]">IMPORTE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {v.items.map((item, idx) => (
                            <tr key={idx} className="h-4">
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0.5 text-center text-[8px]">
                                {isActive ? (
                                  <input 
                                    value={item.unidad}
                                    onChange={e => {
                                      const newItems = [...v.items];
                                      newItems[idx] = { ...item, unidad: e.target.value.toUpperCase() };
                                      updateActiveVoucher({ items: newItems });
                                    }}
                                    className="w-full text-center bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                                  />
                                ) : item.unidad}
                              </td>
                              <td className="border-x border-zinc-50 px-1 py-0.5 text-center font-bold text-[9px]">
                                {isActive ? (
                                  <input 
                                    value={item.cantidad}
                                    onChange={e => {
                                      const newItems = [...v.items];
                                      newItems[idx] = { ...item, cantidad: e.target.value };
                                      updateActiveVoucher({ items: newItems });
                                    }}
                                    className="w-full text-center font-bold bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                                  />
                                ) : item.cantidad}
                              </td>
                              <td className="border-x border-zinc-50 px-1 py-0.5 uppercase text-[8px] leading-none whitespace-nowrap overflow-hidden">
                                {isActive ? (
                                  <input 
                                    value={item.descripcion}
                                    onChange={e => {
                                      const newItems = [...v.items];
                                      newItems[idx] = { ...item, descripcion: e.target.value.toUpperCase() };
                                      updateActiveVoucher({ items: newItems });
                                    }}
                                    className="w-full uppercase bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                                  />
                                ) : item.descripcion}
                              </td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                            </tr>
                          ))}
                          
                          {/* Special Note Row */}
                          {v.header.fueraPresupuesto && (
                            <tr className="h-4">
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0.5 text-center font-bold italic text-[8px]">"MATERIAL FUERA DE PRESUPUESTO"</td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                            </tr>
                          )}

                          {/* Empty rows to maintain height - Increased capacity */}
                          {Array.from({ length: Math.max(0, (v.header.fueraPresupuesto ? 14 : 15) - v.items.length) }).map((_, idx) => (
                            <tr key={`empty-${idx}`} className="h-4">
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                              <td className="border-x border-zinc-50 px-1 py-0"></td>
                            </tr>
                          ))}

                          {/* Bottom Right Note in Table */}
                          <tr className="h-10">
                            <td className="border-x border-zinc-50" colSpan={4}></td>
                            <td className="border-x border-zinc-50" colSpan={2} align="center">
                              <div className="text-[7px] font-bold uppercase leading-tight px-1 whitespace-pre-wrap">
                                {isActive && template.id === 'empty' ? (
                                  <input 
                                    value={v.header.subConcepto !== undefined ? v.header.subConcepto : template.subConcepto}
                                    onChange={e => updateActiveVoucher({ header: { ...v.header, subConcepto: e.target.value.toUpperCase() } })}
                                    className="w-full text-center bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                                    placeholder="SUBCONCEPTO"
                                  />
                                ) : (
                                  v.header.subConcepto || template.subConcepto
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="grid grid-cols-2 gap-12 px-12 mt-1">
                      <div className="text-center">
                        {isActive ? (
                          <input 
                            value={v.header.elaboro}
                            onChange={e => updateActiveVoucher({ header: { ...v.header, elaboro: e.target.value.toUpperCase() } })}
                            className="h-6 w-full text-center uppercase font-bold text-[8px] mb-0.5 bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                          />
                        ) : (
                          <div className="h-6 flex items-end justify-center uppercase font-bold text-[8px] mb-0.5">{v.header.elaboro}</div>
                        )}
                        <div className="border-t border-zinc-300 pt-0.5 font-bold uppercase text-[7px]">ELABORÓ:</div>
                      </div>
                      <div className="text-center">
                        {isActive ? (
                          <input 
                            value={v.header.autorizo}
                            onChange={e => updateActiveVoucher({ header: { ...v.header, autorizo: e.target.value.toUpperCase() } })}
                            className="h-6 w-full text-center uppercase font-bold text-[8px] mb-0.5 bg-transparent outline-none focus:border-black focus:bg-zinc-100"
                          />
                        ) : (
                          <div className="h-6 flex items-end justify-center uppercase font-bold text-[8px] mb-0.5">{v.header.autorizo}</div>
                        )}
                        <div className="border-t border-zinc-300 pt-0.5 font-bold uppercase text-[7px]">AUTORIZÓ:</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex-1 flex items-center justify-center p-8 text-center bg-zinc-50 h-full">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-zinc-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-800">No hay vales activos</h3>
          <p className="text-zinc-500 text-sm">Crea un nuevo vale para comenzar a capturar información.</p>
          <button
            onClick={() => handleAddVoucher()}
            className="mt-6 bg-black hover:bg-zinc-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-black/20 flex items-center gap-2 mx-auto"
          >
            <Plus size={18} />
            Nuevo Vale
          </button>
        </div>
      </div>
    )}
  </div>
)}

  {/* Configuraciones Tab */}
        {activeTab === 'configuracion' && (
          <div className="flex-1 overflow-y-auto p-6 bg-transparent">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-[var(--color-sidebar-bg)] rounded-2xl shadow-md border-2 border-[var(--color-line)] p-6">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <ListChecks className="text-black" />
                  Gestión de Listas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => { setEditingList('destajistas'); setShowListManager(true); }}
                    className="p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100 transition-all text-left"
                  >
                    <div className="font-bold text-zinc-700">Destajistas</div>
                    <div className="text-xs text-zinc-500 mt-1">{destajistas.length} registrados</div>
                  </button>
                  <button 
                    onClick={() => { setEditingList('elaboro'); setShowListManager(true); }}
                    className="p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100 transition-all text-left"
                  >
                    <div className="font-bold text-zinc-700">Elaboró</div>
                    <div className="text-xs text-zinc-500 mt-1">{elaboroList.length} registrados</div>
                  </button>
                  <button 
                    onClick={() => { setEditingList('autorizo'); setShowListManager(true); }}
                    className="p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100 transition-all text-left"
                  >
                    <div className="font-bold text-zinc-700">Autorizó</div>
                    <div className="text-xs text-zinc-500 mt-1">{autorizoList.length} registrados</div>
                  </button>
                  <button 
                    onClick={() => { setEditingList('paquetes'); setShowListManager(true); }}
                    className="p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100 transition-all text-left"
                  >
                    <div className="font-bold text-zinc-700">Paquetes</div>
                    <div className="text-xs text-zinc-500 mt-1">{packagesList.length} registrados</div>
                  </button>
                  <button 
                    onClick={() => { setEditingList('ubicaciones'); setShowListManager(true); }}
                    className="p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100 transition-all text-left"
                  >
                    <div className="font-bold text-zinc-700">Ubicaciones</div>
                    <div className="text-xs text-zinc-500 mt-1">Gestionar por paquete</div>
                  </button>
                </div>
              </div>

              <div className="bg-[var(--color-sidebar-bg)] rounded-2xl shadow-md border-2 border-[var(--color-line)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <FileText className="text-black" />
                    Plantillas y Datos
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowBulkUpdateModal(true)}
                      className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-zinc-200"
                    >
                      <RefreshCw size={14} />
                      Actualización Masiva
                    </button>
                    <button 
                      onClick={() => templateInputRef.current?.click()}
                      disabled={isUploadingTemplates}
                      className={cn(
                        "flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-zinc-300",
                        isUploadingTemplates && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isUploadingTemplates ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Cargando...
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          Subir Excel
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <input 
                      type="file" 
                      ref={templateInputRef} 
                      onChange={handleTemplateUpload} 
                      className="hidden" 
                      accept=".xlsx, .xls, .csv"
                    />
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept=".xlsx, .xls, .csv"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-zinc-200"
                    >
                      <FileSpreadsheet size={18} />
                      Importar Datos Excel
                    </button>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-zinc-100">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Plantillas Personalizadas ({customTemplates.length})</h3>
                    {customTemplates.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customTemplates.map((template) => (
                          <div key={template.id} className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4 space-y-3 relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                onClick={() => setEditingTemplate(template)}
                                className="text-zinc-400 hover:text-black transition-all"
                                title="Editar plantilla"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="text-zinc-400 hover:text-red-500 transition-all"
                                title="Eliminar plantilla"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-zinc-400 uppercase">{template.paquete || 'Sin Paquete'}</div>
                              <div className="font-bold text-zinc-800 line-clamp-1">{template.subConcepto}</div>
                              <div className="text-xs text-zinc-500 line-clamp-2 mt-1">{template.concepto}</div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                              <div className="text-[10px] font-bold text-zinc-400 uppercase">{template.prototipo || 'Sin Prototipo'}</div>
                              <div className="text-[10px] font-bold text-zinc-600">{template.items.length} Conceptos</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                        <FileText className="mx-auto text-zinc-300 mb-2" size={32} />
                        <p className="text-zinc-500 text-sm">No hay plantillas personalizadas cargadas.</p>
                        <p className="text-zinc-400 text-xs mt-1">Usa el botón "Subir Excel" para añadir nuevas.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista de Vales Tab */}
        {activeTab === 'reportes' && (
          <div className="flex-1 overflow-hidden flex flex-col bg-[var(--color-app-bg)]">
            <div className="p-4 md:p-6 border-b-2 border-[var(--color-line)] bg-[var(--color-sidebar-bg)] shrink-0">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
                    <Filter className="text-black" />
                    Filtros de Búsqueda
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setFilters(f => ({ ...f, dateFrom: today, dateTo: today }));
                      }}
                      className="text-[10px] font-bold uppercase px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors"
                    >
                      Hoy
                    </button>
                    <button 
                      onClick={() => {
                        const today = new Date();
                        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
                        const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                        setFilters(f => ({ 
                          ...f, 
                          dateFrom: firstDay.toISOString().split('T')[0], 
                          dateTo: lastDay.toISOString().split('T')[0] 
                        }));
                      }}
                      className="text-[10px] font-bold uppercase px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors"
                    >
                      Esta Semana
                    </button>
                    <button 
                      onClick={() => {
                        const today = new Date();
                        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                        setFilters(f => ({ 
                          ...f, 
                          dateFrom: firstDay.toISOString().split('T')[0], 
                          dateTo: lastDay.toISOString().split('T')[0] 
                        }));
                      }}
                      className="text-[10px] font-bold uppercase px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors"
                    >
                      Este Mes
                    </button>
                    <button 
                      onClick={() => setFilters(f => ({ ...f, dateFrom: '', dateTo: '' }))}
                      className="text-[10px] font-bold uppercase px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors"
                    >
                      Todas las Fechas
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownloadExcel(filteredVouchers)}
                    className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-zinc-200"
                  >
                    <FileSpreadsheet size={18} />
                    Exportar Excel
                  </button>
                  <button 
                    onClick={() => handleDownloadAllPDF(filteredVouchers)}
                    disabled={isGeneratingPDF || filteredVouchers.length === 0}
                    className={cn(
                      "flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md",
                      (isGeneratingPDF || filteredVouchers.length === 0) && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Procesando...</span>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Fecha Inicio</label>
                  <input 
                    type="date" 
                    value={filters.dateFrom}
                    onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Fecha Fin</label>
                  <input 
                    type="date" 
                    value={filters.dateTo}
                    onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Destajista</label>
                  <input 
                    type="text" 
                    value={filters.destajista}
                    onChange={e => setFilters(f => ({ ...f, destajista: e.target.value }))}
                    placeholder="Buscar destajista..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Concepto</label>
                  <input 
                    type="text" 
                    value={filters.concepto}
                    onChange={e => setFilters(f => ({ ...f, concepto: e.target.value }))}
                    placeholder="Buscar concepto..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Material</label>
                  <input 
                    type="text" 
                    value={filters.material}
                    onChange={e => setFilters(f => ({ ...f, material: e.target.value }))}
                    placeholder="Buscar material..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Paquete</label>
                  <select 
                    value={filters.paquete}
                    onChange={e => setFilters(f => ({ ...f, paquete: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Todos los paquetes</option>
                    {packagesList.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent">
              <div className="bg-[var(--color-sidebar-bg)] rounded-2xl shadow-md border-2 border-[var(--color-line)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Folio</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Destajista</th>
                        <th className="px-4 py-3">Paquete</th>
                        <th className="px-4 py-3">Ubicación</th>
                        <th className="px-4 py-3">Concepto</th>
                        <th className="px-4 py-3 text-right">Partidas</th>
                        <th className="px-4 py-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredVouchers.length > 0 ? (
                        filteredVouchers.map(v => {
                          const template = allTemplates.find(t => t.id === v.templateId) || allTemplates[0];
                          return (
                            <tr key={v.id} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold">{v.header.folio || '-'}</td>
                              <td className="px-4 py-3">{v.header.fecha}</td>
                              <td className="px-4 py-3">{v.header.destajista}</td>
                              <td className="px-4 py-3">{v.header.paquete}</td>
                              <td className="px-4 py-3">{v.header.ubicacion}</td>
                              <td className="px-4 py-3">{template.concepto}</td>
                              <td className="px-4 py-3 text-right font-bold">{v.items.length}</td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleRemoveVoucher(v.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                                  title="Eliminar vale"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                            No se encontraron vales que coincidan con los filtros.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-4 text-sm text-zinc-500 font-bold text-right">
                Total de vales mostrados: {filteredVouchers.length}
              </div>
            </div>
          </div>
        )}
        {/* Inventario Tab */}
        {activeTab === 'inventario' && (
          <div className="flex-1 overflow-hidden flex flex-col bg-[var(--color-app-bg)]">
            <div className="p-4 md:p-6 border-b-2 border-[var(--color-line)] bg-[var(--color-sidebar-bg)] shrink-0 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
                  <Package className="text-black" />
                  Inventario y Presupuesto
                </h2>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mr-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded border-zinc-300 text-black focus:ring-black"
                      checked={showOnlyExceeded}
                      onChange={(e) => setShowOnlyExceeded(e.target.checked)}
                    />
                    Solo mostrar excedidos
                  </label>
                  <button 
                    onClick={() => setShowDeleteBudgetModal(true)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-red-200"
                  >
                    <Trash2 size={18} />
                    Eliminar Existencias
                  </button>
                  <label className={cn(
                    "bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer",
                    isUploadingBudget && "opacity-50 cursor-not-allowed"
                  )}>
                    {isUploadingBudget ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Cargar Existencias/Presupuesto (Excel)
                      </>
                    )}
                    <input 
                      type="file" 
                      accept=".xlsx, .xls" 
                      className="hidden" 
                      onChange={handleBudgetUpload} 
                      disabled={isUploadingBudget}
                    />
                  </label>
                </div>
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                <input 
                  type="text" 
                  placeholder="Filtrar por Paquete..." 
                  value={filterPaquete}
                  onChange={(e) => setFilterPaquete(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Filtrar por Ubicación..." 
                  value={filterUbicacion}
                  onChange={(e) => setFilterUbicacion(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Filtrar por Concepto..." 
                  value={filterConcepto}
                  onChange={(e) => setFilterConcepto(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Filtrar por Material..." 
                  value={filterMaterial}
                  onChange={(e) => setFilterMaterial(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Filtrar por Unidad..." 
                  value={filterUnidad}
                  onChange={(e) => setFilterUnidad(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent">
              <div className="bg-[var(--color-sidebar-bg)] rounded-2xl shadow-md border-2 border-[var(--color-line)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-200">
                      <tr>
                        <th className="px-4 py-3 font-bold">Paquete</th>
                        <th className="px-4 py-3 font-bold">Ubicación</th>
                        <th className="px-4 py-3 font-bold">Concepto</th>
                        <th className="px-4 py-3 font-bold">Material</th>
                        <th className="px-4 py-3 font-bold">Unidad</th>
                        <th className="px-4 py-3 font-bold text-right">Existencia Inicial (Presupuesto)</th>
                        <th className="px-4 py-3 font-bold text-right">Salidas</th>
                        <th className="px-4 py-3 font-bold text-right">Saldo (Nueva Existencia)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {budgets.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                            No hay datos de presupuesto cargados. Sube un archivo Excel para comenzar.
                          </td>
                        </tr>
                      ) : (
                        budgets.filter(b => {
                          if (showOnlyExceeded && b.saldoTotal >= 0) return false;
                          if (filterPaquete && !b.paquete.toLowerCase().includes(filterPaquete.toLowerCase())) return false;
                          if (filterUbicacion && !b.ubicacion.toLowerCase().includes(filterUbicacion.toLowerCase())) return false;
                          if (filterConcepto && !b.concepto.toLowerCase().includes(filterConcepto.toLowerCase())) return false;
                          if (filterMaterial && !b.material.toLowerCase().includes(filterMaterial.toLowerCase())) return false;
                          if (filterUnidad && !b.unidad.toLowerCase().includes(filterUnidad.toLowerCase())) return false;
                          return true;
                        }).map((b) => (
                          <tr key={b.id} className={cn("hover:bg-zinc-50 transition-colors", b.saldoTotal < 0 ? "bg-red-50 hover:bg-red-100" : "")}>
                            <td className="px-4 py-3 font-medium text-zinc-900">{b.paquete}</td>
                            <td className="px-4 py-3 text-zinc-600">{b.ubicacion}</td>
                            <td className="px-4 py-3 text-zinc-600">{b.concepto}</td>
                            <td className="px-4 py-3 text-zinc-600 font-medium">{b.material}</td>
                            <td className="px-4 py-3 text-zinc-600">{b.unidad}</td>
                            <td className="px-4 py-3 text-zinc-900 text-right font-mono">{b.cantidadPresupuesto.toFixed(2)}</td>
                            <td className="px-4 py-3 text-zinc-900 text-right font-mono">{b.salidas.toFixed(2)}</td>
                            <td className={cn("px-4 py-3 text-right font-mono font-bold", b.saldoTotal < 0 ? "text-red-600" : "text-black")}>
                              {b.saldoTotal.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usuarios Tab */}
        {activeTab === 'usuarios' && (
          <div className="flex-1 overflow-hidden flex flex-col bg-[var(--color-app-bg)]">
            <div className="p-4 md:p-6 border-b-2 border-[var(--color-line)] bg-[var(--color-sidebar-bg)] shrink-0 flex justify-between items-center">
              <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
                <Users className="text-black" />
                Gestión de Usuarios
              </h2>
              <button 
                onClick={() => {
                  setIsEditingUser(false);
                  setNewUser({ role: 'Capturista', name: '', email: '', password: '' });
                  setShowUserModal(true);
                }}
                className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-md"
              >
                <UserPlus size={18} />
                Nuevo Usuario
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent">
              <div className="bg-[var(--color-sidebar-bg)] rounded-2xl shadow-md border-2 border-[var(--color-line)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-bold">Nombre</th>
                        <th className="px-6 py-4 font-bold">Usuario</th>
                        <th className="px-6 py-4 font-bold">Contraseña</th>
                        <th className="px-6 py-4 font-bold">Rol</th>
                        <th className="px-6 py-4 font-bold">Fecha Creación</th>
                        <th className="px-6 py-4 font-bold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {appUsers.map(user => (
                        <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-800">{user.name}</td>
                          <td className="px-6 py-4 text-zinc-600 font-mono text-sm">{user.email}</td>
                          <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{user.password || '••••••••'}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold",
                              user.role === 'Administrador' ? "bg-black text-white" : "bg-zinc-100 text-zinc-800"
                            )}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-zinc-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setIsEditingUser(true);
                                setNewUser({
                                  id: user.id,
                                  name: user.name,
                                  email: user.email,
                                  role: user.role,
                                  password: user.password || ''
                                });
                                setShowUserModal(true);
                              }}
                              className="text-zinc-400 hover:text-[var(--color-accent-cyan)] transition-colors p-2 rounded-lg hover:bg-blue-50"
                              title="Editar usuario"
                            >
                              <Settings size={18} />
                            </button>
                            <button 
                              onClick={async () => {
                                try {
                                  await deleteDoc(doc(db, 'users', user.id));
                                } catch (error) {
                                  handleFirestoreError(error, OperationType.DELETE, 'users');
                                }
                              }}
                              className={cn(
                                "text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50",
                                user.email === 'luciohernandez133@gmail.com' && "opacity-50 cursor-not-allowed hover:text-zinc-400 hover:bg-transparent"
                              )}
                              disabled={user.email === 'luciohernandez133@gmail.com'}
                              title={user.email === 'luciohernandez133@gmail.com' ? "No se puede eliminar al administrador principal" : "Eliminar usuario"}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Budget Modal */}
        {showDeleteBudgetModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--color-sidebar-bg)] rounded-3xl shadow-2xl border-2 border-[var(--color-line)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 bg-red-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={24} />
                  <h3 className="text-xl font-bold">Eliminar Existencias</h3>
                </div>
                <button 
                  onClick={() => setShowDeleteBudgetModal(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                  disabled={isDeletingBudget}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-zinc-600 mb-6">
                  ¿Estás seguro de que deseas eliminar todas las existencias/presupuesto actuales? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteBudgetModal(false)}
                    className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-xl font-medium transition-colors"
                    disabled={isDeletingBudget}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteBudget}
                    disabled={isDeletingBudget}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                  >
                    {isDeletingBudget ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Eliminar Todo
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--color-sidebar-bg)] rounded-3xl shadow-2xl border-2 border-[var(--color-line)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 bg-black text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserPlus size={24} />
                  <h2 className="text-xl font-bold">{isEditingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                </div>
                <button onClick={() => setShowUserModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-all">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={newUser.name}
                    onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Usuario</label>
                  <input 
                    type="text" 
                    value={newUser.email?.replace('@construvivienda.local', '')}
                    onChange={e => setNewUser(u => ({ ...u, email: e.target.value.replace(/\s+/g, '') }))}
                    placeholder="Ej. jperez"
                    disabled={isEditingUser}
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all",
                      isEditingUser && "opacity-50 cursor-not-allowed"
                    )}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Contraseña</label>
                  <input 
                    type="text" 
                    value={newUser.password}
                    onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
                    placeholder="Contraseña para el usuario"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Rol</label>
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser(u => ({ ...u, role: e.target.value as 'Administrador' | 'Capturista' }))}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                  >
                    <option value="Capturista">Capturista</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="px-6 py-2 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={async () => {
                    if (newUser.name && newUser.email && newUser.email.trim() !== '' && newUser.password) {
                      const rawUsername = newUser.email.toLowerCase().trim().replace(/\s+/g, '');
                      const userEmail = rawUsername.includes('@') ? rawUsername : `${rawUsername}@construvivienda.local`;
                      
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(userEmail)) {
                        alert('El nombre de usuario o correo no es válido.');
                        return;
                      }
                      
                      try {
                        if (isEditingUser && newUser.id) {
                          await updateDoc(doc(db, 'users', newUser.id), {
                            name: newUser.name,
                            role: newUser.role,
                            password: newUser.password
                          });
                        } else {
                          const newUserData: AppUser = {
                            id: userEmail,
                            name: newUser.name,
                            email: userEmail,
                            role: newUser.role as 'Administrador' | 'Capturista',
                            createdAt: new Date().toISOString(),
                            password: newUser.password
                          };
                          // 1. Create in Firestore
                          await setDoc(doc(db, 'users', userEmail), newUserData);
                          
                          // 2. Create in Firebase Auth using a secondary app to avoid logging out the admin
                          const { initializeApp } = await import('firebase/app');
                          const { getAuth, createUserWithEmailAndPassword } = await import('firebase/auth');
                          const firebaseConfig = (await import('../firebase-applet-config.json')).default;
                          
                          const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp" + Date.now());
                          const secondaryAuth = getAuth(secondaryApp);
                          
                          await createUserWithEmailAndPassword(secondaryAuth, userEmail, newUser.password);
                          await secondaryAuth.signOut();
                        }
                        
                        setShowUserModal(false);
                        setNewUser({ role: 'Capturista', name: '', email: '', password: '' });
                      } catch (error: any) {
                        if (error.code === 'auth/email-already-in-use') {
                          alert('Este usuario ya existe en el sistema.');
                        } else {
                          console.error("Error saving user:", error);
                          alert('Hubo un error al guardar el usuario. Revisa la consola.');
                        }
                      }
                    }
                  }}
                  disabled={!newUser.name || !newUser.email || newUser.email.trim() === '' || !newUser.password || newUser.password.length < 6}
                  className="bg-black hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-md"
                >
                  {isEditingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--color-sidebar-bg)] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border-2 border-[var(--color-line)] p-6">
              <h3 className="text-xl font-bold text-zinc-800 mb-4">Confirmar Acción</h3>
              <p className="text-zinc-600 mb-6 whitespace-pre-wrap">{confirmModal.message}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-zinc-500 hover:bg-zinc-100 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-md"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        {alertModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="bg-[var(--color-sidebar-bg)] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border-2 border-[var(--color-line)] flex flex-col max-h-[80vh]">
              <div className="p-6 pb-0">
                <h3 className="text-lg font-bold text-zinc-800 mb-2">Aviso</h3>
              </div>
              <div className="px-6 py-4 overflow-y-auto flex-1">
                <p className="text-zinc-600 text-sm whitespace-pre-wrap leading-relaxed">{alertModal.message}</p>
              </div>
              <div className="p-6 pt-4 flex justify-end border-t border-zinc-50">
                <button
                  onClick={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-6 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-sm font-bold transition-colors shadow-md"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
