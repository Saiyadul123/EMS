import React, { useState } from 'react';
import {
  FinanceRecord,
  WalletAccount,
  FinanceCategory,
  PublicFinancialReport
} from '../../../types';
import {
  saveFinanceRecord,
  deleteFinanceRecord,
  updateWalletBalance,
  logActivity,
  savePublicFinancialReport,
  deletePublicFinancialReport
} from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { FinancialReportEditModal } from '../../common/FinancialReportEditModal';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Filter,
  DollarSign,
  Download,
  Building,
  Smartphone,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Edit3
} from 'lucide-react';

interface FinanceViewProps {
  mode: 'income' | 'expense' | 'wallet' | 'reports';
  records: FinanceRecord[];
  wallets: WalletAccount[];
  reports?: PublicFinancialReport[];
  onRefresh: () => void;
  onViewPublicReports?: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  mode,
  records,
  wallets,
  reports = [],
  onRefresh,
  onViewPublicReports
}) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'income' | 'expense' | 'wallet' | 'reports'>(mode);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState<Partial<FinanceRecord> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Wallet adjustment modal
  const [editingWallet, setEditingWallet] = useState<WalletAccount | null>(null);
  const [newWalletBalance, setNewWalletBalance] = useState<string>('');

  // Public Financial Reports Management
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingPublicReport, setEditingPublicReport] = useState<Partial<PublicFinancialReport> | null>(null);
  const [deletingPublicReportId, setDeletingPublicReportId] = useState<string | null>(null);
  const [selectedAdminReportId, setSelectedAdminReportId] = useState<string>(
    reports?.[0]?.id || ''
  );

  const activeAdminReport = reports?.find(r => r.id === selectedAdminReportId) || reports?.[0];

  const handleOpenEditPublicReport = (rep?: PublicFinancialReport) => {
    const target = rep || activeAdminReport || reports?.[0];
    if (target) {
      setEditingPublicReport({ ...target });
      setIsReportModalOpen(true);
    }
  };

  const handleOpenNewPublicReport = () => {
    setEditingPublicReport({
      id: `fin-rep-${Date.now()}`,
      fiscalYear: '২০২৫-২০২৬',
      title: '২০২৫-২০২৬ অর্থবছরের নিরীক্ষিত আর্থিক অডিট ও আয়-ব্যয় রিপোর্ট',
      periodName: '০১ জুলাই ২০২৫ হতে ৩০ জুন ২০২৬ (বার্ষিক নিরীক্ষা)',
      publishedDate: new Date().toISOString().split('T')[0],
      auditedBy: 'মেসার্স কে. রহমান অ্যান্ড কোং, চার্টার্ড অ্যাকাউন্ট্যান্টস',
      totalIncome: 5500000,
      totalExpense: 3800000,
      netSurplus: 1700000,
      status: 'audited',
      summaryText: 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দান পরিচালনা পরিষদের অনুমোদিত ও চার্টার্ড অ্যাকাউন্ট্যান্ট দ্বারা নিরীক্ষিত বার্ষিক আর্থিক বিবরণী।',
      incomeCategories: [
        { category: 'সাধারণ অনুদান ও দানবাক্স সংগ্রহ', amount: 2200000, percentage: 40 },
        { category: 'প্রবাসী ও বিশিষ্ট শুভাকাঙ্ক্ষী অনুদান', amount: 1650000, percentage: 30 },
        { category: 'মাঠ ও সংলগ্ন ওয়াকফ সম্পত্তি বাৎসরিক লিজ', amount: 1100000, percentage: 20 },
        { category: 'উন্নয়ন তহবিল বিশেষ অনুদান', amount: 550000, percentage: 10 }
      ],
      expenseCategories: [
        { category: 'মিনার ও অবকাঠামোগত উন্নয়ন কাজ', amount: 1600000, percentage: 42 },
        { category: 'পাকা সীমানা প্রাচীর ও আরসিসি ড্রেনেজ সংস্কার', amount: 900000, percentage: 24 },
        { category: 'ঈদ জামাত সামিয়ানা, মাঠ পরিষ্কার ও লাইন অঙ্কন', amount: 550000, percentage: 14 },
        { category: 'সাউন্ড সিস্টেম ও বিদ্যুৎ আলোকসজ্জা', amount: 450000, percentage: 12 },
        { category: 'অফিস পরিচালনা ও স্টাফ সম্মানী', amount: 300000, percentage: 8 }
      ],
      auditDocumentTitle: '২০২৫-২০২৬ অর্থবছরের চার্টার্ড অডিট সনদপত্র ও আর্থিক প্রতিবেদন (PDF)'
    });
    setIsReportModalOpen(true);
  };

  const handleSavePublicReport = async (saved: PublicFinancialReport) => {
    try {
      await savePublicFinancialReport(saved);
      success('পাবলিক আর্থিক রিপোর্ট সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!');
      setIsReportModalOpen(false);
      setEditingPublicReport(null);
      setSelectedAdminReportId(saved.id);
      onRefresh();
    } catch (err: any) {
      error('রিপোর্ট সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleRequestDeletePublicReport = (id: string) => {
    setDeletingPublicReportId(id);
  };

  const handleConfirmDeletePublicReport = async () => {
    if (!deletingPublicReportId) return;
    try {
      await deletePublicFinancialReport(deletingPublicReportId);
      success('পাবলিক আর্থিক রিপোর্ট সফলভাবে মুছে ফেলা হয়েছে।');
      setDeletingPublicReportId(null);
      const remaining = reports.filter(r => r.id !== deletingPublicReportId);
      if (remaining.length > 0) {
        setSelectedAdminReportId(remaining[0].id);
      }
      onRefresh();
    } catch (err) {
      error('রিপোর্ট মুছতে ব্যর্থ হয়েছে।');
    }
  };

  const incomeRecords = records.filter(r => r.type === 'income');
  const expenseRecords = records.filter(r => r.type === 'expense');

  const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = expenseRecords.reduce((sum, r) => sum + r.amount, 0);
  const netFundSurplus = totalIncome - totalExpense;
  const totalWalletBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord?.title || !editingRecord?.amount) {
      error('শিরোনাম ও পরিমাণ পূরণ করুন');
      return;
    }

    try {
      await saveFinanceRecord({
        type: editingRecord.type || (activeTab === 'expense' ? 'expense' : 'income'),
        category: editingRecord.category || 'general_fund',
        title: editingRecord.title,
        amount: Number(editingRecord.amount),
        date: editingRecord.date || new Date().toISOString().split('T')[0],
        voucherNo: editingRecord.voucherNo || `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
        approvedBy: editingRecord.approvedBy || userProfile?.displayName || 'সাধারণ সম্পাদক',
        description: editingRecord.description || '',
        account: editingRecord.account || 'Islami Bank',
        id: editingRecord.id
      });

      await logActivity(
        `${editingRecord.type === 'expense' ? 'ব্যয়' : 'আয়'} রেকর্ড সংরক্ষিত`,
        `${editingRecord.title} - ৳${editingRecord.amount}`,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );

      success('আর্থিক রেকর্ড সফলভাবে সংরক্ষিত হয়েছে।');
      setIsRecordModalOpen(false);
      setEditingRecord(null);
      onRefresh();
    } catch (err) {
      error('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  const handleDeleteRecord = async () => {
    if (!deletingId) return;
    try {
      await deleteFinanceRecord(deletingId);
      success('রেকর্ড অপসারিত হয়েছে।');
      setDeletingId(null);
      onRefresh();
    } catch (err) {
      error('মুছে ফেলতে সমস্যা হয়েছে।');
    }
  };

  const handleUpdateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWallet) return;
    const bal = parseInt(newWalletBalance, 10);
    if (isNaN(bal)) {
      error('সঠিক ব্যালেন্স লিখুন');
      return;
    }

    try {
      await updateWalletBalance(editingWallet.id, bal);
      await logActivity(
        'ওয়ালেট ব্যালেন্স সংশোধন',
        `${editingWallet.accountName} - নতুন স্থিতি ৳${bal}`,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('ওয়ালেট ব্যালেন্স হালনাগাদ হয়েছে।');
      setEditingWallet(null);
      onRefresh();
    } catch (err: any) {
      console.error('Wallet update error:', err);
      error(err?.message || 'ওয়ালেট ব্যালেন্স হালনাগাদ করা সম্ভব হয়নি।');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">অর্থ ও তহবিল হিসাব ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            আয়, ব্যয়, ভাউচার অডিট, ব্যাংক একাউন্ট ও সার্বিক আর্থিক পরিসংখ্যান
          </p>
        </div>

        {canAccess('admin') && activeTab !== 'reports' && activeTab !== 'wallet' && (
          <button
            onClick={() => {
              setEditingRecord({
                type: activeTab === 'expense' ? 'expense' : 'income',
                title: '',
                amount: 0,
                category: 'general_fund',
                date: new Date().toISOString().split('T')[0],
                voucherNo: `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
                account: 'Islami Bank'
              });
              setIsRecordModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন {activeTab === 'expense' ? 'ব্যয়' : 'আয়'} ভাউচার যোগ করুন</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'income' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>আয়ের হিসাব (Income)</span>
        </button>
        <button
          onClick={() => setActiveTab('expense')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'expense' ? 'bg-white text-rose-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
          <span>ব্যয়ের হিসাব (Expense)</span>
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'wallet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-3.5 h-3.5 text-amber-600" />
          <span>ওয়ালেট ও ব্যাংক (Wallet)</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'reports' ? 'bg-white text-sky-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PieChart className="w-3.5 h-3.5 text-sky-600" />
          <span>আর্থিক রিপোর্ট (Reports)</span>
          <span className="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
            পাবলিক
          </span>
        </button>
      </div>

      {/* Stat Cards for Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">সর্বমোট আয়</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            ৳{totalIncome.toLocaleString('bn-BD')}
          </div>
          <span className="text-[11px] text-slate-400">অনলাইন অনুদান ও দানবাক্সসহ</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">সর্বমোট ব্যয়</span>
          <div className="text-2xl font-black text-rose-700 mt-1">
            ৳{totalExpense.toLocaleString('bn-BD')}
          </div>
          <span className="text-[11px] text-slate-400">উন্নয়ন, মাইক ও পরিচালনা খরচ</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">নিট তহবিল উদ্বৃত্ত (Surplus)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ৳{netFundSurplus.toLocaleString('bn-BD')}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">সার্বিক ব্যাংকিং স্থিতির সাথে সামঞ্জস্যপূর্ণ</span>
        </div>
      </div>

      {/* View Switch: Income / Expense Table */}
      {(activeTab === 'income' || activeTab === 'expense') && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {activeTab === 'income' ? 'আয়ের ভাউচার ও খাতের তালিকা' : 'ব্যয়ের ভাউচার ও বিলের বিবরণ'}
            </h3>
            <span className="text-xs text-slate-500">
              মোট রেকর্ড: {(activeTab === 'income' ? incomeRecords : expenseRecords).length} টি
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ভাউচার নং</th>
                  <th className="py-3 px-4">খাত / বিবরণ</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">হিসাব খাত</th>
                  <th className="py-3 px-4">অনুমোদনকারী</th>
                  <th className="py-3 px-4 text-right">পরিমাণ</th>
                  {canAccess('admin') && <th className="py-3 px-4 text-right">পদক্ষেপ</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === 'income' ? incomeRecords : expenseRecords).map((rec, idx) => (
                  <tr key={`fin-rec-${rec.id || idx}-${idx}`} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-english font-bold text-slate-700">{rec.voucherNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{rec.title}</div>
                      {rec.description && (
                        <div className="text-[11px] text-slate-400">{rec.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-english text-slate-500">{rec.date}</td>
                    <td className="py-3 px-4 text-slate-600">{rec.account}</td>
                    <td className="py-3 px-4 text-slate-600">{rec.approvedBy}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      ৳{rec.amount.toLocaleString('bn-BD')}
                    </td>
                    {canAccess('admin') && (
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingRecord(rec);
                            setIsRecordModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(rec.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Switch: Wallet & Accounts */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wallets.map((wallet, idx) => (
            <div
              key={`fin-wal-${wallet.id || idx}-${idx}`}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                    {wallet.accountType === 'bank' ? <Building className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">{wallet.accountType}</span>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-slate-900 text-sm">{wallet.accountName}</h4>
                  <p className="text-xs text-slate-500 font-english mt-0.5">{wallet.accountNumber}</p>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">বর্তমান ব্যালেন্স</span>
                  <div className="text-2xl font-black text-emerald-800">
                    ৳{wallet.balance.toLocaleString('bn-BD')}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{wallet.updatedAt}</span>
                {canAccess('admin') && (
                  <button
                    onClick={() => {
                      setEditingWallet(wallet);
                      setNewWalletBalance(wallet.balance.toString());
                    }}
                    className="text-emerald-800 font-bold hover:underline"
                  >
                    ব্যালেন্স সংশোধন
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Switch: Financial Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Public Visibility Callout Notice */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sky-950">
            <div className="flex items-start gap-2.5">
              <Globe className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">পাবলিক আর্থিক রিপোর্ট (Public Visibility)</h4>
                <p className="text-xs text-sky-800/90 mt-0.5">
                  ব্যবহারকারীর নির্দেশ অনুযায়ী এই রিপোর্টটি (Reports) সাধারণ পাবলিক ও মুসল্লিদের জন্য ওয়েবসাইটে উন্মুক্ত রাখা হয়েছে। কমিটি বা অ্যাডমিন এখান থেকে সরাসরি পাবলিক রিপোর্ট এডিট বা নতুন রিপোর্ট যুক্ত করতে পারেন।
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenNewPublicReport}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন অর্থবছর রিপোর্ট যোগ</span>
              </button>
              {onViewPublicReports && (
                <button
                  onClick={onViewPublicReports}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>পাবলিক ভিউ দেখুন</span>
                </button>
              )}
            </div>
          </div>

          {/* Fiscal Year Selector Tabs */}
          {reports && reports.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {reports.map((rep) => (
                <button
                  key={rep.id}
                  onClick={() => setSelectedAdminReportId(rep.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    (selectedAdminReportId === rep.id || (!selectedAdminReportId && rep.id === reports[0].id))
                      ? 'bg-emerald-800 text-amber-300 shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>অর্থবছর: {rep.fiscalYear}</span>
                  {rep.status === 'audited' && (
                    <span className="text-[10px] bg-emerald-700 text-emerald-100 px-1.5 py-0.5 rounded">
                      অডিটেড
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={handleOpenNewPublicReport}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-amber-700" />
                <span>নতুন রিপোর্ট</span>
              </button>
            </div>
          )}

          {activeAdminReport ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      অর্থবছর: {activeAdminReport.fiscalYear}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{activeAdminReport.status === 'audited' ? 'সিএ অডিট অনুমোদিত' : 'প্রস্তাবিত বিবরণী'}</span>
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {activeAdminReport.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeAdminReport.periodName} • নিরীক্ষক: {activeAdminReport.auditedBy}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleOpenEditPublicReport(activeAdminReport)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>রিপোর্ট সম্পাদনা করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestDeletePublicReport(activeAdminReport.id)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="এই অর্থবছর রিপোর্টটি মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>প্রিন্ট / PDF</span>
                  </button>
                </div>
              </div>

              {/* Summary Narrative */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">অনুমোদিত সারসংক্ষেপ: </span>
                {activeAdminReport.summaryText}
              </div>

              {/* High-level stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-800 block mb-1">মোট সংগৃহীত আয়</span>
                  <span className="text-2xl font-black text-emerald-950">
                    ৳{activeAdminReport.totalIncome.toLocaleString('bn-BD')}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <span className="text-xs font-bold text-rose-800 block mb-1">মোট ব্যয়</span>
                  <span className="text-2xl font-black text-rose-950">
                    ৳{activeAdminReport.totalExpense.toLocaleString('bn-BD')}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-xs font-bold text-amber-800 block mb-1">সংরক্ষিত উদ্বৃত্ত তহবিল</span>
                  <span className="text-2xl font-black text-amber-950">
                    ৳{activeAdminReport.netSurplus.toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>

              {/* Category Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                {/* Income Categories */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-emerald-900 pb-2 border-b border-emerald-100 flex items-center justify-between">
                    <span>আয় খাতের বিস্তারিত বিভাজন</span>
                    <span className="text-xs text-emerald-700">মোট: ৳{activeAdminReport.totalIncome.toLocaleString('bn-BD')}</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {activeAdminReport.incomeCategories.map((item, idx) => (
                      <div key={`adm-inc-${idx}`} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex justify-between font-semibold text-slate-800">
                          <span>{item.category}</span>
                          <span className="font-bold text-emerald-900">৳{item.amount.toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>অংশ</span>
                          <span className="font-bold text-emerald-700">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expense Categories */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-rose-900 pb-2 border-b border-rose-100 flex items-center justify-between">
                    <span>ব্যয় খাতের বিস্তারিত বিভাজন</span>
                    <span className="text-xs text-rose-700">মোট: ৳{activeAdminReport.totalExpense.toLocaleString('bn-BD')}</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {activeAdminReport.expenseCategories.map((item, idx) => (
                      <div key={`adm-exp-${idx}`} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex justify-between font-semibold text-slate-800">
                          <span>{item.category}</span>
                          <span className="font-bold text-rose-900">৳{item.amount.toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>অংশ</span>
                          <span className="font-bold text-rose-700">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audit Certificate Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-100 block">
                      {activeAdminReport.auditDocumentTitle || 'বার্ষিক নিরীক্ষিত অডিট সনদপত্র (PDF)'}
                    </span>
                    <span className="text-slate-400">নিরীক্ষক: {activeAdminReport.auditedBy}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEditPublicReport(activeAdminReport)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold"
                >
                  সম্পাদনা করুন
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <p className="text-slate-500 text-sm">কোনো আর্থিক রিপোর্ট পাওয়া যায়নি।</p>
              <button
                onClick={handleOpenNewPublicReport}
                className="px-4 py-2 bg-emerald-800 text-amber-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>প্রথম রিপোর্ট তৈরি করুন</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Record Add/Edit Modal */}
      {isRecordModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingRecord.id ? 'ভাউচার সম্পাদনা' : `নতুন ${editingRecord.type === 'expense' ? 'ব্যয়' : 'আয়'} ভাউচার`}
            </h3>
            <form onSubmit={handleSaveRecord} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শিরোনাম / বিবরণের বিষয় *</label>
                <input
                  type="text"
                  required
                  value={editingRecord.title || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, title: e.target.value })}
                  placeholder="যেমন: ঈদ জামাত সাউন্ড সিস্টেম ও মাইক ভাড়া"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">টাকার পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingRecord.amount || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ভাউচার নং</label>
                  <input
                    type="text"
                    value={editingRecord.voucherNo || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, voucherNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={editingRecord.date || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">হিসাব খাত / ওয়ালেট</label>
                  <select
                    value={editingRecord.account || 'Islami Bank'}
                    onChange={(e) => setEditingRecord({ ...editingRecord, account: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Islami Bank">ইসলামী ব্যাংক</option>
                    <option value="Sonali Bank">সোনালী ব্যাংক</option>
                    <option value="bKash">বিকাশ মার্চেন্ট</option>
                    <option value="Nagad">নগদ মার্চেন্ট</option>
                    <option value="Cash">ক্যাশ ইন হ্যান্ড</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecordModalOpen(false);
                    setEditingRecord(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Balance Edit Modal */}
      {editingWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              ওয়ালেট ব্যালেন্স পরিবর্তন: {editingWallet.accountName}
            </h3>
            <p className="text-slate-500 mb-4">অডিট অনুযায়ী প্রকৃত স্থিতি লিখুন:</p>
            <form onSubmit={handleUpdateWallet} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">নতুন ব্যালেন্স (টাকা):</label>
                <input
                  type="number"
                  required
                  value={newWalletBalance ?? ''}
                  onChange={(e) => setNewWalletBalance(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 text-base"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWallet(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  হালনাগাদ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deletingId}
        title="রেকর্ড মুছে ফেলা"
        message="আপনি কি নিশ্চিতভাবে এই আর্থিক ভাউচারটি মুছে ফেলতে চান?"
        onConfirm={handleDeleteRecord}
        onCancel={() => setDeletingId(null)}
      />

      <ConfirmationModal
        isOpen={!!deletingPublicReportId}
        title="আর্থিক রিপোর্ট মুছে ফেলা"
        message="আপনি কি নিশ্চিতভাবে এই অর্থবছর আর্থিক অডিট রিপোর্টটি মুছে ফেলতে চান? এটি মুছে ফেললে পাবলিক ওয়েবসাইট থেকেও রিপোর্টটি অপসারিত হবে।"
        confirmText="হ্যাঁ, রিপোর্ট মুছুন"
        cancelText="বাতিল"
        isDestructive={true}
        onConfirm={handleConfirmDeletePublicReport}
        onCancel={() => setDeletingPublicReportId(null)}
      />

      {/* Public Financial Report Edit/Create Modal */}
      {isReportModalOpen && editingPublicReport && (
        <FinancialReportEditModal
          report={editingPublicReport}
          isOpen={isReportModalOpen}
          incomes={records.filter(r => r.type === 'income').map(r => ({
            id: r.id,
            source: r.title,
            amount: r.amount,
            date: r.date,
            category: 'donation',
            voucherNo: r.voucherNo,
            receivedBy: r.approvedBy,
            description: r.description
          }))}
          expenses={records.filter(r => r.type === 'expense').map(r => ({
            id: r.id,
            purpose: r.title,
            amount: r.amount,
            date: r.date,
            category: 'development',
            voucherNo: r.voucherNo,
            spentBy: r.approvedBy,
            approvedBy: r.approvedBy,
            description: r.description
          }))}
          onClose={() => {
            setIsReportModalOpen(false);
            setEditingPublicReport(null);
          }}
          onSave={handleSavePublicReport}
        />
      )}
    </div>
  );
};
