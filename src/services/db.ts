import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  AboutEidgahData,
  CommitteeMember,
  NoticeItem,
  EidPrayerInfo,
  DevelopmentProject,
  CommunityEvent,
  MeetingItem,
  DocumentItem,
  WalletAccount,
  IncomeRecord,
  ExpenseRecord,
  DonationRecord,
  GalleryItem,
  SystemSettings,
  ActivityLogItem,
  NotificationItem,
  UserProfile,
  UserRole,
  PublicFinancialReport
} from '../types';
import {
  INITIAL_ABOUT,
  INITIAL_COMMITTEE,
  INITIAL_PRAYER_INFO,
  INITIAL_NOTICES,
  INITIAL_PROJECTS,
  INITIAL_WALLETS,
  INITIAL_INCOMES,
  INITIAL_EXPENSES,
  INITIAL_DONATIONS,
  INITIAL_EVENTS,
  INITIAL_MEETINGS,
  INITIAL_DOCUMENTS,
  INITIAL_GALLERY,
  INITIAL_SETTINGS,
  INITIAL_FINANCIAL_REPORTS
} from './seedData';

// Local storage caching helpers
const getLocal = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(`ems_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setLocal = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(`ems_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`Could not save ems_${key} to localStorage:`, e);
  }
};

// Clean object sanitizer before passing to Firestore
const sanitizeForFirestore = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  if (typeof obj === 'object') {
    const res: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) {
        res[k] = sanitizeForFirestore(v);
      }
    }
    return res;
  }
  return obj;
};

// Helper to sanitize Firestore data
const sanitizeDoc = <T>(docSnap: any): T => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  } as T;
};

// Activity Logger
export const logActivity = async (
  action: string,
  details: string,
  performedBy: string,
  userRole: UserRole
) => {
  const logItem: ActivityLogItem = {
    id: `log-${Date.now()}`,
    action,
    details,
    performedBy,
    userRole,
    timestamp: new Date().toLocaleString('bn-BD', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  };

  const logs = getLocal<ActivityLogItem[]>('activity_logs', []);
  setLocal('activity_logs', [logItem, ...logs].slice(0, 50));

  try {
    const colRef = collection(db, 'activity_logs');
    await addDoc(colRef, {
      ...logItem,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Failed to log activity to Firestore, saved to local cache:', err);
  }
};

// System Settings
export const getSystemSettings = async (): Promise<SystemSettings> => {
  const local = getLocal<SystemSettings>('settings', INITIAL_SETTINGS);
  try {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as SystemSettings;
      setLocal('settings', data);
      return data;
    }
    try {
      await setDoc(docRef, sanitizeForFirestore(local), { merge: true });
    } catch (_) {}
    return local;
  } catch (err) {
    return local;
  }
};

export const updateSystemSettings = async (data: Partial<SystemSettings>): Promise<void> => {
  const current = getLocal<SystemSettings>('settings', INITIAL_SETTINGS);
  const updated = { ...current, ...data };
  setLocal('settings', updated);

  try {
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, sanitizeForFirestore(updated), { merge: true });
  } catch (err) {
    console.warn('Firestore settings update fallback to local:', err);
  }
};

// About Eidgah
export const getAboutData = async (): Promise<AboutEidgahData> => {
  const local = getLocal<AboutEidgahData>('about_eidgah', INITIAL_ABOUT);
  try {
    const docRef = doc(db, 'about_eidgah', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = sanitizeDoc<AboutEidgahData>(docSnap);
      setLocal('about_eidgah', data);
      return data;
    }
    try {
      await setDoc(docRef, sanitizeForFirestore(local), { merge: true });
    } catch (_) {}
    return local;
  } catch (err) {
    return local;
  }
};

export const updateAboutData = async (data: Partial<AboutEidgahData>): Promise<void> => {
  const current = getLocal<AboutEidgahData>('about_eidgah', INITIAL_ABOUT);
  const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
  setLocal('about_eidgah', updated);

  try {
    const docRef = doc(db, 'about_eidgah', 'main');
    await setDoc(docRef, sanitizeForFirestore(updated), { merge: true });
  } catch (err) {
    console.warn('Firestore about update fallback to local:', err);
  }
};
export const updateAboutInfo = updateAboutData;

// Committee Members
export const getCommitteeMembers = async (): Promise<CommitteeMember[]> => {
  const local = getLocal<CommitteeMember[]>('committee_members', INITIAL_COMMITTEE);
  try {
    const colRef = collection(db, 'committee_members');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<CommitteeMember>(d));
      const sorted = items.sort((a, b) => a.order - b.order);
      setLocal('committee_members', sorted);
      return sorted;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveCommitteeMember = async (member: Omit<CommitteeMember, 'id'> & { id?: string }): Promise<string> => {
  const memberId = member.id || `cm-${Date.now()}`;
  const record: CommitteeMember = { ...member, id: memberId };
  const cached = getLocal<CommitteeMember[]>('committee_members', INITIAL_COMMITTEE);
  const idx = cached.findIndex(m => m.id === memberId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.push(record);
  }
  setLocal('committee_members', cached);

  try {
    const docRef = doc(db, 'committee_members', memberId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore committee save fallback to local:', err);
  }
  return memberId;
};

export const deleteCommitteeMember = async (id: string): Promise<void> => {
  const cached = getLocal<CommitteeMember[]>('committee_members', INITIAL_COMMITTEE).filter(m => m.id !== id);
  setLocal('committee_members', cached);

  try {
    await deleteDoc(doc(db, 'committee_members', id));
  } catch (err) {
    console.warn('Firestore committee delete fallback to local:', err);
  }
};

// Notices
export const getNotices = async (): Promise<NoticeItem[]> => {
  const local = getLocal<NoticeItem[]>('notices', INITIAL_NOTICES);
  try {
    const colRef = collection(db, 'notices');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<NoticeItem>(d));
      setLocal('notices', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveNotice = async (notice: Omit<NoticeItem, 'id'> & { id?: string }): Promise<string> => {
  const noticeId = notice.id || `notice-${Date.now()}`;
  const record: NoticeItem = { ...notice, id: noticeId };
  const cached = getLocal<NoticeItem[]>('notices', INITIAL_NOTICES);
  const idx = cached.findIndex(n => n.id === noticeId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.unshift(record);
  }
  setLocal('notices', cached);

  try {
    const docRef = doc(db, 'notices', noticeId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore notice save fallback to local:', err);
  }
  return noticeId;
};

export const deleteNotice = async (id: string): Promise<void> => {
  const cached = getLocal<NoticeItem[]>('notices', INITIAL_NOTICES).filter(n => n.id !== id);
  setLocal('notices', cached);

  try {
    await deleteDoc(doc(db, 'notices', id));
  } catch (err) {
    console.warn('Firestore notice delete fallback to local:', err);
  }
};

// Prayer Information
export const getPrayerInfo = async (): Promise<EidPrayerInfo> => {
  const local = getLocal<EidPrayerInfo>('prayer_info', INITIAL_PRAYER_INFO);
  const sanitizeJamats = (info: EidPrayerInfo): EidPrayerInfo => {
    if (!info || !Array.isArray(info.jamats)) return info;
    return {
      ...info,
      jamats: info.jamats.map((j, idx) => ({
        ...j,
        jamatNo: idx + 1
      }))
    };
  };

  try {
    const docRef = doc(db, 'prayer_info', 'current');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = sanitizeJamats(sanitizeDoc<EidPrayerInfo>(docSnap));
      setLocal('prayer_info', data);
      return data;
    }
    const cleanLocal = sanitizeJamats(local);
    try {
      await setDoc(docRef, sanitizeForFirestore(cleanLocal), { merge: true });
    } catch (_) {}
    setLocal('prayer_info', cleanLocal);
    return cleanLocal;
  } catch (err) {
    const cleanLocal = sanitizeJamats(local);
    setLocal('prayer_info', cleanLocal);
    return cleanLocal;
  }
};

export const updatePrayerInfo = async (info: Partial<EidPrayerInfo>): Promise<void> => {
  const current = getLocal<EidPrayerInfo>('prayer_info', INITIAL_PRAYER_INFO);
  const updated: EidPrayerInfo = {
    ...current,
    ...info,
    jamats: Array.isArray(info.jamats || current.jamats)
      ? (info.jamats || current.jamats).map((j, idx) => ({
          ...j,
          jamatNo: idx + 1
        }))
      : []
  };
  setLocal('prayer_info', updated);

  try {
    const docRef = doc(db, 'prayer_info', 'current');
    await setDoc(docRef, sanitizeForFirestore(updated), { merge: true });
  } catch (err) {
    console.warn('Firestore prayer_info update fallback to local:', err);
  }
};

// Projects
export const getProjects = async (): Promise<DevelopmentProject[]> => {
  const local = getLocal<DevelopmentProject[]>('projects', INITIAL_PROJECTS);
  try {
    const colRef = collection(db, 'projects');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<DevelopmentProject>(d));
      setLocal('projects', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveProject = async (project: Omit<DevelopmentProject, 'id'> & { id?: string }): Promise<string> => {
  const projectId = project.id || `proj-${Date.now()}`;
  const record: DevelopmentProject = { ...project, id: projectId };
  const cached = getLocal<DevelopmentProject[]>('projects', INITIAL_PROJECTS);
  const idx = cached.findIndex(p => p.id === projectId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.unshift(record);
  }
  setLocal('projects', cached);

  try {
    const docRef = doc(db, 'projects', projectId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore project save fallback to local:', err);
  }
  return projectId;
};

export const deleteProject = async (id: string): Promise<void> => {
  const cached = getLocal<DevelopmentProject[]>('projects', INITIAL_PROJECTS).filter(p => p.id !== id);
  setLocal('projects', cached);

  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (err) {
    console.warn('Firestore project delete fallback to local:', err);
  }
};

// Donations
export const getDonations = async (): Promise<DonationRecord[]> => {
  const local = getLocal<DonationRecord[]>('donations', INITIAL_DONATIONS);
  try {
    const colRef = collection(db, 'donations');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<DonationRecord>(d));
      setLocal('donations', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const submitDonation = async (donation: Omit<DonationRecord, 'id' | 'receiptNo' | 'status' | 'date'>): Promise<DonationRecord> => {
  const receiptNo = `EMS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('bn-BD');
  const record: DonationRecord = {
    ...donation,
    id: `don-${Date.now()}`,
    status: 'approved',
    receiptNo,
    date: dateStr,
  };

  const cached = getLocal<DonationRecord[]>('donations', INITIAL_DONATIONS);
  setLocal('donations', [record, ...cached]);

  try {
    const colRef = collection(db, 'donations');
    const docRef = await addDoc(colRef, sanitizeForFirestore(record));
    record.id = docRef.id;
  } catch (err) {
    console.warn('Firestore donation add fallback to local:', err);
  }
  return record;
};

export const updateDonationStatus = async (id: string, status: 'approved' | 'pending' | 'rejected'): Promise<void> => {
  const cached = getLocal<DonationRecord[]>('donations', INITIAL_DONATIONS);
  const updated = cached.map(d => d.id === id ? { ...d, status } : d);
  setLocal('donations', updated);

  try {
    const docRef = doc(db, 'donations', id);
    await setDoc(docRef, { status }, { merge: true });
  } catch (err) {
    console.warn('Firestore donation status update fallback to local:', err);
  }
};

// Wallets & Finances
export const getWallets = async (): Promise<WalletAccount[]> => {
  const local = getLocal<WalletAccount[]>('wallets', INITIAL_WALLETS);
  try {
    const colRef = collection(db, 'wallets');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<WalletAccount>(d));
      setLocal('wallets', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveWallet = async (wallet: Omit<WalletAccount, 'id'> & { id?: string }): Promise<string> => {
  const walletId = wallet.id || `wallet-${Date.now()}`;
  const record: WalletAccount = { ...wallet, id: walletId };
  const cached = getLocal<WalletAccount[]>('wallets', INITIAL_WALLETS);
  const idx = cached.findIndex(w => w.id === walletId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.push(record);
  }
  setLocal('wallets', cached);

  try {
    const docRef = doc(db, 'wallets', walletId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore wallet save fallback to local:', err);
  }
  return walletId;
};

export const updateWalletBalance = async (id: string, newBalance: number): Promise<void> => {
  const cached = getLocal<WalletAccount[]>('wallets', INITIAL_WALLETS);
  const updated = cached.map(w => w.id === id ? {
    ...w,
    balance: newBalance,
    updatedAt: new Date().toLocaleDateString('bn-BD')
  } : w);
  setLocal('wallets', updated);

  try {
    const docRef = doc(db, 'wallets', id);
    await setDoc(docRef, {
      balance: newBalance,
      updatedAt: new Date().toLocaleDateString('bn-BD')
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore wallet update fallback to local:', err);
  }
};

// Incomes
export const getIncomes = async (): Promise<IncomeRecord[]> => {
  const local = getLocal<IncomeRecord[]>('incomes', INITIAL_INCOMES);
  try {
    const colRef = collection(db, 'incomes');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<IncomeRecord>(d));
      setLocal('incomes', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveIncome = async (income: Omit<IncomeRecord, 'id'> & { id?: string }): Promise<string> => {
  const incomeId = income.id || `inc-${Date.now()}`;
  const record: IncomeRecord = { ...income, id: incomeId };
  const cached = getLocal<IncomeRecord[]>('incomes', INITIAL_INCOMES);
  const idx = cached.findIndex(i => i.id === incomeId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.unshift(record);
  }
  setLocal('incomes', cached);

  try {
    const docRef = doc(db, 'incomes', incomeId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore income save fallback to local:', err);
  }
  return incomeId;
};

export const deleteIncome = async (id: string): Promise<void> => {
  const cached = getLocal<IncomeRecord[]>('incomes', INITIAL_INCOMES).filter(i => i.id !== id);
  setLocal('incomes', cached);

  try {
    await deleteDoc(doc(db, 'incomes', id));
  } catch (err) {
    console.warn('Firestore income delete fallback to local:', err);
  }
};

// Expenses
export const getExpenses = async (): Promise<ExpenseRecord[]> => {
  const local = getLocal<ExpenseRecord[]>('expenses', INITIAL_EXPENSES);
  try {
    const colRef = collection(db, 'expenses');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<ExpenseRecord>(d));
      setLocal('expenses', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveExpense = async (expense: Omit<ExpenseRecord, 'id'> & { id?: string }): Promise<string> => {
  const expenseId = expense.id || `exp-${Date.now()}`;
  const record: ExpenseRecord = { ...expense, id: expenseId };
  const cached = getLocal<ExpenseRecord[]>('expenses', INITIAL_EXPENSES);
  const idx = cached.findIndex(e => e.id === expenseId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.unshift(record);
  }
  setLocal('expenses', cached);

  try {
    const docRef = doc(db, 'expenses', expenseId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore expense save fallback to local:', err);
  }
  return expenseId;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const cached = getLocal<ExpenseRecord[]>('expenses', INITIAL_EXPENSES).filter(e => e.id !== id);
  setLocal('expenses', cached);

  try {
    await deleteDoc(doc(db, 'expenses', id));
  } catch (err) {
    console.warn('Firestore expense delete fallback to local:', err);
  }
};

// Public Financial Reports (Publicly accessible audit & summary reports)
export const getPublicFinancialReports = async (): Promise<PublicFinancialReport[]> => {
  const local = getLocal<PublicFinancialReport[]>('financial_reports', INITIAL_FINANCIAL_REPORTS);
  try {
    const colRef = collection(db, 'financial_reports');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<PublicFinancialReport>(d));
      setLocal('financial_reports', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const savePublicFinancialReport = async (
  report: Omit<PublicFinancialReport, 'id'> & { id?: string }
): Promise<string> => {
  const reportId = report.id || `fin-rep-${Date.now()}`;
  const record: PublicFinancialReport = { ...report, id: reportId };
  const cached = getLocal<PublicFinancialReport[]>('financial_reports', INITIAL_FINANCIAL_REPORTS);
  const idx = cached.findIndex(r => r.id === reportId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.unshift(record);
  }
  setLocal('financial_reports', cached);

  try {
    const docRef = doc(db, 'financial_reports', reportId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore financial report save fallback to local:', err);
  }
  return reportId;
};

export const deletePublicFinancialReport = async (id: string): Promise<void> => {
  const cached = getLocal<PublicFinancialReport[]>('financial_reports', INITIAL_FINANCIAL_REPORTS);
  setLocal('financial_reports', cached.filter(r => r.id !== id));
  try {
    await deleteDoc(doc(db, 'financial_reports', id));
  } catch (err) {
    console.warn('Firestore financial report delete fallback to local:', err);
  }
};

// Events & Meetings
export const getEvents = async (): Promise<CommunityEvent[]> => {
  const local = getLocal<CommunityEvent[]>('events', INITIAL_EVENTS);
  try {
    const colRef = collection(db, 'events');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<CommunityEvent>(d));
      setLocal('events', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveEvent = async (event: Omit<CommunityEvent, 'id'> & { id?: string }): Promise<string> => {
  const eventId = event.id || `evt-${Date.now()}`;
  const record: CommunityEvent = { ...event, id: eventId };
  const cached = getLocal<CommunityEvent[]>('events', INITIAL_EVENTS);
  const idx = cached.findIndex(e => e.id === eventId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.unshift(record);
  }
  setLocal('events', cached);

  try {
    const docRef = doc(db, 'events', eventId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore event save fallback to local:', err);
  }
  return eventId;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const cached = getLocal<CommunityEvent[]>('events', INITIAL_EVENTS).filter(e => e.id !== id);
  setLocal('events', cached);

  try {
    await deleteDoc(doc(db, 'events', id));
  } catch (err) {
    console.warn('Firestore event delete fallback to local:', err);
  }
};

export const getMeetings = async (): Promise<MeetingItem[]> => {
  const local = getLocal<MeetingItem[]>('meetings', INITIAL_MEETINGS);
  try {
    const colRef = collection(db, 'meetings');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<MeetingItem>(d));
      setLocal('meetings', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveMeeting = async (meeting: any): Promise<string> => {
  const meetingId = meeting.id || `mtg-${Date.now()}`;
  const record = { ...meeting, id: meetingId };
  const cached = getLocal<any[]>('meetings', INITIAL_MEETINGS);
  const idx = cached.findIndex(m => m.id === meetingId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.unshift(record);
  }
  setLocal('meetings', cached);

  try {
    const docRef = doc(db, 'meetings', meetingId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore meeting save fallback to local:', err);
  }
  return meetingId;
};

export const deleteMeeting = async (id: string): Promise<void> => {
  const cached = getLocal<any[]>('meetings', INITIAL_MEETINGS).filter(m => m.id !== id);
  setLocal('meetings', cached);

  try {
    await deleteDoc(doc(db, 'meetings', id));
  } catch (err) {
    console.warn('Firestore meeting delete fallback to local:', err);
  }
};

// Documents
export const getDocuments = async (): Promise<DocumentItem[]> => {
  const local = getLocal<DocumentItem[]>('documents', INITIAL_DOCUMENTS);
  try {
    const colRef = collection(db, 'documents');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<DocumentItem>(d));
      setLocal('documents', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveDocument = async (document: any): Promise<string> => {
  const docId = document.id || `doc-${Date.now()}`;
  const record = { ...document, id: docId };
  const cached = getLocal<any[]>('documents', INITIAL_DOCUMENTS);
  const idx = cached.findIndex(d => d.id === docId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.unshift(record);
  }
  setLocal('documents', cached);

  try {
    const docRef = doc(db, 'documents', docId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore document save fallback to local:', err);
  }
  return docId;
};

export const deleteDocument = async (id: string): Promise<void> => {
  const cached = getLocal<any[]>('documents', INITIAL_DOCUMENTS).filter(d => d.id !== id);
  setLocal('documents', cached);

  try {
    await deleteDoc(doc(db, 'documents', id));
  } catch (err) {
    console.warn('Firestore document delete fallback to local:', err);
  }
};

// Gallery
export const getGallery = async (): Promise<GalleryItem[]> => {
  const local = getLocal<GalleryItem[]>('gallery', INITIAL_GALLERY);
  try {
    const colRef = collection(db, 'gallery');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<GalleryItem>(d));
      setLocal('gallery', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveGalleryItem = async (item: Omit<GalleryItem, 'id'> & { id?: string }): Promise<string> => {
  const itemId = item.id || `gal-${Date.now()}`;
  const record: GalleryItem = { ...item, id: itemId };
  const cached = getLocal<GalleryItem[]>('gallery', INITIAL_GALLERY);
  const idx = cached.findIndex(g => g.id === itemId);
  if (idx >= 0) {
    cached[idx] = record;
  } else {
    cached.unshift(record);
  }
  setLocal('gallery', cached);

  try {
    const docRef = doc(db, 'gallery', itemId);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore gallery save fallback to local:', err);
  }
  return itemId;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  const cached = getLocal<GalleryItem[]>('gallery', INITIAL_GALLERY).filter(g => g.id !== id);
  setLocal('gallery', cached);

  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (err) {
    console.warn('Firestore gallery delete fallback to local:', err);
  }
};

// Activity Logs
export const getActivityLogs = async (): Promise<any[]> => {
  const local = getLocal<any[]>('activity_logs', [
    {
      id: 'log-1',
      action: 'সিস্টেম ইনিশিয়ালাইজেশন',
      performedBy: 'সুপার অ্যাডমিন',
      userRole: 'super_admin',
      role: 'super_admin',
      details: 'ঈদগাহ ম্যানেজমেন্ট সিস্টেম ডেটাবেস সফলভাবে সেটআপ ও কনফিগারেশন সম্পন্ন।',
      timestamp: new Date().toLocaleDateString('bn-BD')
    },
    {
      id: 'log-2',
      action: 'ঈদ জামাত শিডিউল হালনাগাদ',
      performedBy: 'অ্যাডমিন',
      userRole: 'admin',
      role: 'admin',
      details: 'পবিত্র ঈদুল ফিতর ২০২৬-এর তিনটি জামাতের সময়সূচি ওয়েবসাইটে প্রকাশ করা হয়েছে।',
      timestamp: new Date().toLocaleDateString('bn-BD')
    }
  ]);

  try {
    const colRef = collection(db, 'activity_logs');
    const snapshot = await getDocs(query(colRef, limit(40)));
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => {
        const item = sanitizeDoc<any>(d);
        return {
          ...item,
          role: item.role || item.userRole || 'admin'
        };
      });
      setLocal('activity_logs', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

// Notifications
export const getNotifications = async (): Promise<NotificationItem[]> => {
  const local = getLocal<NotificationItem[]>('notifications', [
    {
      id: 'notif-1',
      title: 'কার্যনির্বাহী পরিষদের জরুরি মিটিং',
      message: 'আসন্ন ঈদুল ফিতরের মাঠ প্রস্তুতি সংক্রান্ত বিশেষ সভা শুক্রবার বাদ মাগরিব।',
      targetRole: 'all',
      createdAt: '০৭ মার্চ, ২০২৬'
    },
    {
      id: 'notif-2',
      title: 'অনলাইন অনুদান অডিট পর্যালোচনা',
      message: 'বিকাশ ও ব্যাংক চ্যানেলে জমা হওয়া নতুন অনুদানগুলো অডিট ভাউচারে সংযোজন করুন।',
      targetRole: 'admin',
      createdAt: '০৬ মার্চ, ২০২৬'
    }
  ]);

  try {
    const colRef = collection(db, 'notifications');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<NotificationItem>(d));
      setLocal('notifications', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const addNotification = async (notif: Omit<NotificationItem, 'id'>): Promise<void> => {
  const notifId = `notif-${Date.now()}`;
  const record: NotificationItem = { ...notif, id: notifId };
  const cached = getLocal<NotificationItem[]>('notifications', []);
  setLocal('notifications', [record, ...cached]);

  try {
    const colRef = collection(db, 'notifications');
    await addDoc(colRef, sanitizeForFirestore(record));
  } catch (err) {
    console.warn('Firestore notification add fallback to local:', err);
  }
};

// Users
export const getUsers = async (): Promise<UserProfile[]> => {
  const local = getLocal<UserProfile[]>('users', []);
  try {
    const colRef = collection(db, 'users');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map(d => sanitizeDoc<UserProfile>(d));
      setLocal('users', items);
      return items;
    }
    return local;
  } catch (err) {
    return local;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<string> => {
  const uid = profile.uid || `usr-${Date.now()}`;
  const record: UserProfile = {
    ...profile,
    uid,
    email: (profile.email || '').trim(),
    displayName: (profile.displayName || '').trim(),
    createdAt: profile.createdAt || new Date().toISOString()
  };
  const cached = getLocal<UserProfile[]>('users', []);
  const idx = cached.findIndex(
    u => u.uid === uid || (u.email && record.email && u.email.toLowerCase() === record.email.toLowerCase())
  );
  if (idx >= 0) {
    cached[idx] = { ...cached[idx], ...record };
  } else {
    cached.unshift(record);
  }
  setLocal('users', cached);

  try {
    const docRef = doc(db, 'users', record.uid);
    await setDoc(docRef, sanitizeForFirestore(record), { merge: true });
  } catch (err) {
    console.warn('Firestore user profile save fallback to local:', err);
  }
  return record.uid;
};

export const deleteUserProfile = async (uid: string): Promise<void> => {
  const cached = getLocal<UserProfile[]>('users', []).filter(u => u.uid !== uid);
  setLocal('users', cached);

  try {
    const docRef = doc(db, 'users', uid);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore user profile delete fallback to local:', err);
  }
};

export const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
  const cached = getLocal<UserProfile[]>('users', []);
  const updated = cached.map(u => u.uid === uid ? { ...u, role } : u);
  setLocal('users', updated);

  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, { role }, { merge: true });
  } catch (err) {
    console.warn('Firestore user role update fallback to local:', err);
  }
};

// Aliases and Unified Helpers for Finance and Settings
export const updateSettings = updateSystemSettings;

export const saveFinanceRecord = async (record: {
  type: 'income' | 'expense';
  category?: string;
  title: string;
  amount: number;
  date?: string;
  voucherNo?: string;
  approvedBy?: string;
  description?: string;
  account?: string;
  id?: string;
}): Promise<string> => {
  if (record.type === 'expense') {
    return await saveExpense({
      id: record.id,
      purpose: record.title,
      amount: record.amount,
      date: record.date || new Date().toISOString().split('T')[0],
      category: (record.category as any) || 'maintenance',
      voucherNo: record.voucherNo || `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
      spentBy: 'হিসাবরক্ষক',
      approvedBy: record.approvedBy || 'সাধারণ সম্পাদক',
      description: record.description
    });
  } else {
    return await saveIncome({
      id: record.id,
      source: record.title,
      amount: record.amount,
      date: record.date || new Date().toISOString().split('T')[0],
      category: (record.category as any) || 'donation',
      voucherNo: record.voucherNo || `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
      receivedBy: record.approvedBy || 'কোষাধ্যক্ষ',
      description: record.description
    });
  }
};

export const deleteFinanceRecord = async (id: string): Promise<void> => {
  try {
    await deleteExpense(id);
  } catch (e) {
    // Might be in income
  }
  try {
    await deleteIncome(id);
  } catch (e) {
    // Ignored
  }
};
