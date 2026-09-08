export type UserRole = 'super_admin' | 'admin' | 'committee';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  designation?: string;
  avatarUrl?: string;
  createdAt?: string;
  status: 'active' | 'suspended';
}

export type CommitteeCategory = 'executive' | 'advisory' | 'subcommittee' | 'general';

export interface CommitteeMember {
  id: string;
  name: string;
  nameEn?: string;
  designation: string;
  category: CommitteeCategory;
  phone: string;
  email?: string;
  order: number;
  photoUrl?: string;
  term: string;
  bio?: string;
  status: 'active' | 'former';
}

export interface AboutEidgahData {
  id?: string;
  title: string;
  subtitle: string;
  history: string;
  waqfRegistrationNo: string;
  waqfEstateNo?: string;
  totalArea: string; // e.g. "১২.৫ বিঘা"
  capacity: string;  // e.g. "৫০,০০০+ মুসল্লি"
  establishedYear: string; // e.g. "১৯৫২"
  address: string;
  location?: string;
  district: string;
  facilities: string[];
  imamName: string;
  khatibName: string;
  khatibTitle?: string;
  moazzinName: string;
  mission?: string;
  vision?: string;
  updatedAt?: string;
}

export type EidgahAboutInfo = AboutEidgahData;


export interface GalleryItem {
  id: string;
  title: string;
  category: 'eid_ul_fitr' | 'eid_ul_adha' | 'development' | 'social';
  imageUrl: string;
  caption?: string;
  year: string;
  uploadedAt?: string;
  order?: number;
}

export interface NoticeItem {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  category: 'eid' | 'emergency' | 'general' | 'financial';
  publishedDate: string;
  isPinned: boolean;
  author: string;
  fileUrl?: string;
  status?: 'published' | 'draft' | 'archived';
}

export interface JamatSchedule {
  jamatNo: number;
  time: string;
  imamName: string;
  imamTitle: string;
  notes?: string;
}

export interface EidPrayerInfo {
  id: string;
  year: string;
  hijriYear: string;
  eidType: 'eid_ul_fitr' | 'eid_ul_adha';
  date: string;
  venue: string;
  jamats: JamatSchedule[];
  guidelines: string[];
  weatherAlternative: string;
  emergencyContact: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorPhone: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash';
  transactionId?: string;
  purpose: 'general' | 'development' | 'qurbani' | 'zakat' | 'beautification';
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  receiptNo: string;
  notes?: string;
}

export interface IncomeRecord {
  id: string;
  source: string;
  amount: number;
  date: string;
  category: 'donation' | 'pond_lease' | 'field_rent' | 'grant' | 'other';
  voucherNo: string;
  receivedBy: string;
  description?: string;
}

export interface ExpenseRecord {
  id: string;
  purpose: string;
  amount: number;
  date: string;
  category: 'maintenance' | 'sound_system' | 'illumination' | 'honorarium' | 'cleaning' | 'development' | 'other';
  voucherNo: string;
  spentBy: string;
  approvedBy: string;
  description?: string;
}

export type FinanceCategory = string;

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  date: string;
  voucherNo: string;
  approvedBy: string;
  description?: string;
  account?: string;
  category?: string;
}

export interface WalletAccount {
  id: string;
  accountName: string;
  accountType: 'cash' | 'bank' | 'mobile_money';
  accountNumber?: string;
  bankName?: string;
  balance: number;
  updatedAt: string;
}


export interface DevelopmentProject {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  targetBudget: number;
  raisedBudget: number;
  status: 'planning' | 'ongoing' | 'completed';
  startDate: string;
  estimatedEndDate?: string;
  completionDate?: string;
  coverImage?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  chiefGuest?: string;
  specialGuests?: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface MeetingItem {
  id: string;
  title: string;
  meetingDate: string;
  meetingTime: string;
  location: string;
  agenda: string;
  presidedBy: string;
  attendeesCount?: number;
  resolutionSummary?: string;
  status: 'scheduled' | 'concluded';
}

export interface CommitteeMeeting {
  id: string;
  meetingTitle: string;
  meetingNo?: string;
  date: string;
  time: string;
  location: string;
  agenda: string;
  decisions?: string;
  presidedBy: string;
  attendeesCount?: number;
  status: 'upcoming' | 'completed' | 'scheduled';
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'audit' | 'constitution' | 'resolution' | 'land_record' | 'other';
  accessLevel: 'public' | 'committee' | 'admin';
  uploadDate: string;
  fileSize?: string;
  fileUrl?: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  docType: 'waqf_deed' | 'land_record' | 'audit_report' | 'constitution';
  fileUrl: string;
  uploadDate: string;
  accessLevel: 'admin' | 'committee' | 'public';
  fileSize: string;
  description?: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  performedBy: string;
  userRole: UserRole;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  role: UserRole;
  details: string;
  timestamp: string;
}


export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | 'admin' | 'committee';
  createdAt: string;
  isRead?: boolean;
}

export interface SystemSettings {
  eidgahNameBn: string;
  eidgahNameEn: string;
  taglineBn: string;
  addressBn: string;
  contactPhone: string;
  contactEmail: string;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  rocketMerchantNumber: string;
  bankAccountDetails: string;
  waqfNumber: string;
  facebookPage?: string;
  youtubeChannel?: string;
}

export interface PublicFinancialReport {
  id: string;
  fiscalYear: string;
  title: string;
  periodName: string;
  publishedDate: string;
  auditedBy: string;
  totalIncome: number;
  totalExpense: number;
  netSurplus: number;
  status: 'audited' | 'approved' | 'interim';
  summaryText: string;
  incomeCategories: { category: string; amount: number; percentage: number }[];
  expenseCategories: { category: string; amount: number; percentage: number }[];
  auditDocumentTitle?: string;
  auditDocumentId?: string;
}

export type PublicPage = 
  | 'home'
  | 'about'
  | 'committee'
  | 'gallery'
  | 'notices'
  | 'prayer-info'
  | 'donation'
  | 'projects'
  | 'events'
  | 'contact'
  | 'login'
  | 'forgot-password'
  | 'reports';

export type AdminSection =
  | 'dashboard'
  | 'users'
  | 'committee'
  | 'about'
  | 'gallery'
  | 'notices'
  | 'prayer-info'
  | 'donations'
  | 'income'
  | 'expense'
  | 'wallet'
  | 'reports'
  | 'projects'
  | 'events'
  | 'meetings'
  | 'documents'
  | 'logs'
  | 'notifications'
  | 'builder-info'
  | 'settings';
