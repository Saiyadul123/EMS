import React, { useState } from 'react';
import {
  PublicFinancialReport,
  PublicPage,
  SystemSettings,
  DocumentItem,
  IncomeRecord,
  ExpenseRecord
} from '../../../types';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Calendar,
  Download,
  FileCheck2,
  Heart,
  CheckCircle2,
  Building2,
  Sparkles,
  Info,
  Edit3,
  Plus,
  Trash2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { FinancialReportEditModal } from '../../common/FinancialReportEditModal';
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { savePublicFinancialReport, deletePublicFinancialReport } from '../../../services/db';

interface ReportsPageProps {
  reports: PublicFinancialReport[];
  settings: SystemSettings;
  incomes?: IncomeRecord[];
  expenses?: ExpenseRecord[];
  auditDocuments?: DocumentItem[];
  onNavigate: (page: PublicPage) => void;
  onRefreshReports?: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  reports,
  settings,
  incomes = [],
  expenses = [],
  auditDocuments = [],
  onNavigate,
  onRefreshReports
}) => {
  const { userProfile, canAccess, userRole } = useAuth();
  const { success, error } = useToast();

  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports[0]?.id || 'fin-rep-2024-2025'
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Partial<PublicFinancialReport> | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  const isPrivileged = canAccess('admin') || userRole === 'committee' || userRole === 'super_admin';

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const handlePrint = () => {
    window.print();
  };

  const handleOpenEdit = (reportToEdit: PublicFinancialReport) => {
    const target = reportToEdit || activeReport || reports[0];
    if (target) {
      setEditingReport({ ...target });
      setIsEditModalOpen(true);
    }
  };

  const handleOpenNew = () => {
    setEditingReport({
      id: `fin-rep-${Date.now()}`,
      fiscalYear: '২০২৫-২০২৬',
      title: '২০২৫-২০২৬ অর্থবছরের নিরীক্ষিত আর্থিক ও অডিট বিবরণী',
      periodName: '০১ জুলাই ২০২৫ হতে ৩০ জুন ২০২৬ (বার্ষিক নিরীক্ষা)',
      publishedDate: new Date().toISOString().split('T')[0],
      auditedBy: 'মেসার্স কে. রহমান অ্যান্ড কোং, চার্টার্ড অ্যাকাউন্ট্যান্টস',
      totalIncome: 5500000,
      totalExpense: 3800000,
      netSurplus: 1700000,
      status: 'audited',
      summaryText: `${settings.eidgahNameBn || 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দান'}-এর অনুমোদিত বার্ষিক হিসাব ও চার্টার্ড অ্যাকাউন্ট্যান্ট অডিট বিবরণী।`,
      incomeCategories: [
        { category: 'সাধারণ দানবাক্স ও বিশেষ মোনাজাত দান', amount: 2200000, percentage: 40 },
        { category: 'প্রবাসী ও বিশিষ্ট শুভাকাঙ্ক্ষী অনুদান', amount: 1650000, percentage: 30 },
        { category: 'মাঠ ও সংলগ্ন ওয়াকফ সম্পত্তি বাৎসরিক লিজ', amount: 1100000, percentage: 20 },
        { category: 'মিনার ও অবকাঠামো উন্নয়ন বিশেষ অনুদান', amount: 550000, percentage: 10 }
      ],
      expenseCategories: [
        { category: 'মিনার নির্মাণ ও মার্বেল পাথরের কারুকাজ', amount: 1600000, percentage: 42 },
        { category: 'পাকা সীমানা প্রাচীর ও আরসিসি ড্রেনেজ সংস্কার', amount: 900000, percentage: 24 },
        { category: 'ঈদ জামাত সামিয়ানা, মাঠ পরিষ্কার ও লাইন অঙ্কন', amount: 550000, percentage: 14 },
        { category: 'অত্যাধুনিক সাউন্ড সিস্টেম ও মাইক ভাড়া', amount: 450000, percentage: 12 },
        { category: 'অফিস পরিচালনা ও স্টাফ সম্মানী', amount: 300000, percentage: 8 }
      ],
      auditDocumentTitle: '২০২৫-২০২৬ অর্থবছরের বার্ষিক চার্টার্ড অডিট সনদপত্র (PDF)'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveReport = async (saved: PublicFinancialReport) => {
    try {
      await savePublicFinancialReport(saved);
      success('আর্থিক রিপোর্ট সফলভাবে সংরক্ষিত ও ওয়েবসাইটে আপডেট করা হয়েছে!');
      setSelectedReportId(saved.id);
      setIsEditModalOpen(false);
      setEditingReport(null);
      if (onRefreshReports) {
        onRefreshReports();
      }
    } catch (err: any) {
      error(err.message || 'রিপোর্ট সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleRequestDeleteReport = (id: string) => {
    setDeletingReportId(id);
  };

  const handleConfirmDeleteReport = async () => {
    if (!deletingReportId) return;
    try {
      await deletePublicFinancialReport(deletingReportId);
      success('আর্থিক রিপোর্ট সফলভাবে মুছে ফেলা হয়েছে।');
      setDeletingReportId(null);
      if (onRefreshReports) {
        onRefreshReports();
      }
      const remaining = reports.filter(r => r.id !== deletingReportId);
      if (remaining.length > 0) {
        setSelectedReportId(remaining[0].id);
      }
    } catch (err: any) {
      error('রিপোর্ট মুছতে ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Banner Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>পাবলিক স্বচ্ছতা ও নিরীক্ষিত আর্থিক বিবরণী</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ঈদগাহের বার্ষিক ও নিরীক্ষিত আর্থিক রিপোর্ট
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
          {settings.eidgahNameBn || 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দান'}-এর তহবিল পরিচালনা ও ওয়াকফ প্রশাসন বিধিমালা অনুযায়ী সাধারণ মুসল্লি ও সম্মানিত দাতাগণের অবগতির জন্য উন্মুক্ত আর্থিক প্রতিবেদন।
        </p>

        {/* Admin Quick Action Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {isPrivileged ? (
            <div className="inline-flex items-center gap-2 p-1.5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-900 px-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>অ্যাডমিন মোড সক্রিয় ({userProfile?.displayName || userRole})</span>
              </span>
              <button
                onClick={handleOpenNew}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন অর্থবছর রিপোর্ট যোগ করুন</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-bold text-slate-500 hover:text-emerald-700 inline-flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>পরিচালনা পরিষদ বা অ্যাডমিন হিসেবে রিপোর্ট এডিট করতে লগইন করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Fiscal Year Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {reports.map(rep => (
          <button
            key={rep.id}
            onClick={() => setSelectedReportId(rep.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              selectedReportId === rep.id
                ? 'bg-emerald-800 text-amber-300 shadow-md ring-2 ring-emerald-900/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>অর্থবছর: {rep.fiscalYear}</span>
            {rep.status === 'audited' && (
              <span className="text-[10px] bg-emerald-700/80 text-emerald-100 px-1.5 py-0.5 rounded-md">
                অডিটেড
              </span>
            )}
          </button>
        ))}

        {isPrivileged && (
          <button
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors flex items-center gap-1.5 border border-amber-300"
          >
            <Plus className="w-4 h-4 text-amber-800" />
            <span>+ নতুন অর্থবছর</span>
          </button>
        )}
      </div>

      {activeReport ? (
        <div className="space-y-8 print:space-y-4">
          {/* Main Statement Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 relative">
            {/* Top Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    অর্থবছর: {activeReport.fiscalYear}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>সিএ অডিট অনুমোদিত</span>
                  </span>
                  {activeReport.publishedDate && (
                    <span className="text-xs text-slate-400 font-medium">
                      প্রকাশ: {activeReport.publishedDate}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeReport.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  নিরীক্ষা সময়কাল: {activeReport.periodName} • নিরীক্ষক: {activeReport.auditedBy}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Admin Edit & Delete buttons */}
                {isPrivileged && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(activeReport)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
                      title="এই রিপোর্টটি সম্পাদনা করুন"
                    >
                      <Edit3 className="w-4 h-4 text-amber-300" />
                      <span>রিপোর্ট সম্পাদনা করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRequestDeleteReport(activeReport.id)}
                      className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="এই রিপোর্টটি মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>মুছুন</span>
                    </button>
                  </>
                )}

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>প্রিন্ট / PDF</span>
                </button>
                <button
                  onClick={() => onNavigate('donation')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-950 bg-amber-400 hover:bg-amber-500 transition-all shadow-xs"
                >
                  <Heart className="w-4 h-4" />
                  <span>তহবিলে অনুদান দিন</span>
                </button>
              </div>
            </div>

            {/* Summary Narrative */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-emerald-950 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold">পরিচালনা পরিষদ ও সাধারণ সভার অনুমোদিত বিবরণী:</p>
                    {isPrivileged && (
                      <button
                        onClick={() => handleOpenEdit(activeReport)}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>সারসংক্ষেপ সম্পাদনা</span>
                      </button>
                    )}
                  </div>
                  <p className="text-slate-700">{activeReport.summaryText}</p>
                </div>
              </div>
            </div>

            {/* Key Metric Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Income */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 relative group">
                <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-1">
                  <span>মোট সংগৃহীত আয়</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-900">
                  ৳{activeReport.totalIncome.toLocaleString('bn-BD')}
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">দান, ইজারা ও উন্নয়ন তহবিল</p>
                {isPrivileged && (
                  <button
                    onClick={() => handleOpenEdit(activeReport)}
                    className="absolute top-2 right-2 p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="আয় তথ্য পরিবর্তন করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Expense */}
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 relative group">
                <div className="flex items-center justify-between text-rose-800 text-xs font-bold mb-1">
                  <span>মোট উন্নয়ন ও পরিচালনা ব্যয়</span>
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-900">
                  ৳{activeReport.totalExpense.toLocaleString('bn-BD')}
                </div>
                <p className="text-[11px] text-rose-700 mt-1">মিনার কাজ, ড্রেনেজ ও ঈদ জামাত ব্যয়</p>
                {isPrivileged && (
                  <button
                    onClick={() => handleOpenEdit(activeReport)}
                    className="absolute top-2 right-2 p-1.5 text-rose-700 hover:bg-rose-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="ব্যয় তথ্য পরিবর্তন করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Net Surplus */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 relative group">
                <div className="flex items-center justify-between text-amber-900 text-xs font-bold mb-1">
                  <span>সংরক্ষিত উদ্বৃত্ত তহবিল স্থিতি</span>
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-950">
                  ৳{activeReport.netSurplus.toLocaleString('bn-BD')}
                </div>
                <p className="text-[11px] text-amber-800 mt-1">ব্যাংক একাউন্ট ও রিজার্ভে সংরক্ষিত</p>
                {isPrivileged && (
                  <button
                    onClick={() => handleOpenEdit(activeReport)}
                    className="absolute top-2 right-2 p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="উদ্বৃত্ত স্থিতি পরিবর্তন করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Breakdowns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              {/* Income Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                  <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>আয় খাতের পুঙ্খানুপুঙ্খ বিবরণ</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800">
                      মোট: ৳{activeReport.totalIncome.toLocaleString('bn-BD')}
                    </span>
                    {isPrivileged && (
                      <button
                        onClick={() => handleOpenEdit(activeReport)}
                        className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>এডিট</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {activeReport.incomeCategories.map((item, idx) => (
                    <div
                      key={`inc-cat-${idx}`}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors space-y-1.5"
                    >
                      <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-800">
                        <span>{item.category}</span>
                        <span className="font-bold text-emerald-900">
                          ৳{item.amount.toLocaleString('bn-BD')}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>মোট আয়ের অংশ</span>
                        <span className="font-bold text-emerald-700">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                  <h3 className="text-base font-bold text-rose-950 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                    <span>ব্যয় খাতের পুঙ্খানুপুঙ্খ বিবরণ</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-800">
                      মোট: ৳{activeReport.totalExpense.toLocaleString('bn-BD')}
                    </span>
                    {isPrivileged && (
                      <button
                        onClick={() => handleOpenEdit(activeReport)}
                        className="text-[11px] text-rose-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>এডিট</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {activeReport.expenseCategories.map((item, idx) => (
                    <div
                      key={`exp-cat-${idx}`}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-colors space-y-1.5"
                    >
                      <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-800">
                        <span>{item.category}</span>
                        <span className="font-bold text-rose-900">
                          ৳{item.amount.toLocaleString('bn-BD')}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>মোট ব্যয়ের অংশ</span>
                        <span className="font-bold text-rose-700">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Audit Verification Box */}
            <div className="mt-8 p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <FileCheck2 className="w-4 h-4" />
                  <span>চার্টার্ড অ্যাকাউন্ট্যান্ট প্রত্যয়ন সনদ</span>
                </div>
                <p className="text-sm font-bold text-slate-100">
                  {activeReport.auditDocumentTitle || 'বার্ষিক নিরীক্ষিত অডিট সনদপত্র ও আর্থিক প্রতিবেদন (PDF)'}
                </p>
                <p className="text-xs text-slate-400">
                  নিরীক্ষক: {activeReport.auditedBy} • ওয়াকফ রেজিস্ট্রেশন: {settings.waqfNumber || 'WQF-DHK-48201'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isPrivileged && (
                  <button
                    onClick={() => handleOpenEdit(activeReport)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-amber-300 hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>সনদ তথ্য পরিবর্তন</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors inline-flex items-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>অডিট রিপোর্ট ডাউনলোড / প্রিন্ট</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Islamic & Waqf Transparency Disclosure Note */}
      <div className="bg-emerald-900 text-emerald-50 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>আমানতদারিতা ও স্বচ্ছতা নীতি (Waqf Transparency Commitment)</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          পবিত্র হাদিস শরিফে বর্ণিত আছে— <em>"আল্লাহ তায়ালা তাদের ভালোবাসেন যারা আমানতের যথাযথ হেফাজত করে।"</em> ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দান একটি ঐতিহ্যবাহী ওয়াকফ সম্পত্তি। পরিচালনা পরিষদ নিয়মিতভাবে অভ্যন্তরীণ আয়-ব্যয়ের হিসাব বাংলাদেশ সরকারের ওয়াকফ প্রশাসন এবং সনদপ্রাপ্ত চার্টার্ড একাউন্ট্যান্ট দ্বারা অডিট করিয়ে সাধারণ মুসল্লি ও শুভাকাঙ্ক্ষীদের নিকট উন্মুক্ত রাখে।
        </p>
        <div className="pt-2 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-300">
          <span>ওয়াকফ রেজিস্ট্রেশন নম্বর: {settings.waqfNumber || 'WQF-DHK-48201'}</span>
          <span>হিসাব ও অডিট সংক্রান্ত যোগাযোগ: {settings.contactEmail}</span>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingReport && (
        <FinancialReportEditModal
          report={editingReport}
          isOpen={isEditModalOpen}
          incomes={incomes}
          expenses={expenses}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingReport(null);
          }}
          onSave={handleSaveReport}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingReportId}
        title="আর্থিক রিপোর্ট মুছে ফেলা"
        message="আপনি কি নিশ্চিতভাবে এই অর্থবছরের পাবলিক আর্থিক অডিট রিপোর্টটি মুছে ফেলতে চান? এটি মুছে ফেললে ওয়েবসাইটের পাবলিক পেজ থেকেও রিপোর্টটি অপসারিত হবে।"
        confirmText="হ্যাঁ, রিপোর্ট মুছুন"
        cancelText="বাতিল"
        isDestructive={true}
        onConfirm={handleConfirmDeleteReport}
        onCancel={() => setDeletingReportId(null)}
      />
    </div>
  );
};
