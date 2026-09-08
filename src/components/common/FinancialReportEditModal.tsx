import React, { useState, useEffect } from 'react';
import { PublicFinancialReport, IncomeRecord, ExpenseRecord } from '../../types';
import {
  X,
  Save,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calculator,
  ShieldCheck,
  Calendar,
  Building2,
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface FinancialReportEditModalProps {
  report: Partial<PublicFinancialReport> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedReport: PublicFinancialReport) => Promise<void>;
  incomes?: IncomeRecord[];
  expenses?: ExpenseRecord[];
}

const buildInitialFormData = (report: Partial<PublicFinancialReport> | null): PublicFinancialReport => ({
  id: report?.id || `fin-rep-${Date.now()}`,
  fiscalYear: report?.fiscalYear || '২০২৪-২০২৫',
  title: report?.title || 'বার্ষিক নিরীক্ষিত আর্থিক অডিট ও আয়-ব্যয় রিপোর্ট',
  periodName: report?.periodName || '০১ জুলাই ২০২৪ হতে ৩০ জুন ২০২৫ (বার্ষিক নিরীক্ষা)',
  publishedDate: report?.publishedDate || new Date().toISOString().split('T')[0],
  auditedBy: report?.auditedBy || 'মেসার্স কে. রহমান অ্যান্ড কোং, চার্টার্ড অ্যাকাউন্ট্যান্টস',
  totalIncome: report?.totalIncome ?? 5000000,
  totalExpense: report?.totalExpense ?? 3500000,
  netSurplus: report?.netSurplus ?? 1500000,
  status: report?.status || 'audited',
  summaryText: report?.summaryText || 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দান পরিচালনা পরিষদের অনুমোদিত ও চার্টার্ড অ্যাকাউন্ট্যান্ট দ্বারা নিরীক্ষিত বার্ষিক আর্থিক বিবরণী।',
  incomeCategories: report?.incomeCategories && report.incomeCategories.length > 0
    ? [...report.incomeCategories]
    : [
        { category: 'সাধারণ অনুদান ও দানবাক্স সংগ্রহ', amount: 2000000, percentage: 40 },
        { category: 'প্রবাসী ও বিশিষ্ট দাতাবৃন্দের অনুদান', amount: 1500000, percentage: 30 },
        { category: 'মাঠ ও দিঘি বার্ষিক লিজ/ইজারা', amount: 1000000, percentage: 20 },
        { category: 'উন্নয়ন তহবিল বিশেষ অনুদান', amount: 500000, percentage: 10 }
      ],
  expenseCategories: report?.expenseCategories && report.expenseCategories.length > 0
    ? [...report.expenseCategories]
    : [
        { category: 'মিনার ও অবকাঠামোগত উন্নয়ন কাজ', amount: 1500000, percentage: 43 },
        { category: 'বৃষ্টির পানি নিষ্কাশন ড্রেনেজ সংস্কার', amount: 800000, percentage: 23 },
        { category: 'ঈদ জামাত ব্যবস্থাপনা, শামিয়ানা ও লাইন অঙ্কন', amount: 500000, percentage: 14 },
        { category: 'সাউন্ড সিস্টেম ও বিদ্যুৎ আলোকসজ্জা', amount: 400000, percentage: 11 },
        { category: 'প্রশাসনিক ব্যয় ও প্রাতিষ্ঠানিক মেরামত', amount: 300000, percentage: 9 }
      ],
  auditDocumentTitle: report?.auditDocumentTitle || 'বার্ষিক অডিট সনদ ও আর্থিক প্রতিবেদন (PDF)',
  auditDocumentId: report?.auditDocumentId || 'doc-2'
});

export const FinancialReportEditModal: React.FC<FinancialReportEditModalProps> = ({
  report,
  isOpen,
  onClose,
  onSave,
  incomes,
  expenses
}) => {
  if (!isOpen || !report) return null;

  const [formData, setFormData] = useState<PublicFinancialReport>(() => buildInitialFormData(report));

  useEffect(() => {
    if (report && isOpen) {
      setFormData(buildInitialFormData(report));
    }
  }, [report, isOpen]);

  const [isSaving, setIsSaving] = useState(false);

  // Helper to sync from live accounting vouchers (Incomes & Expenses)
  const handleSyncFromAccountingRecords = () => {
    if (!incomes && !expenses) return;
    const incList = incomes || [];
    const expList = expenses || [];

    const incTotal = incList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const expTotal = expList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const surplus = incTotal - expTotal;

    // Group categories
    const incCategoryMap: Record<string, number> = {};
    incList.forEach(item => {
      const catLabel = item.source || item.category || 'সাধারণ অনুদান';
      incCategoryMap[catLabel] = (incCategoryMap[catLabel] || 0) + (Number(item.amount) || 0);
    });

    const expCategoryMap: Record<string, number> = {};
    expList.forEach(item => {
      const catLabel = item.purpose || item.category || 'উন্নয়ন ও পরিচালনা ব্যয়';
      expCategoryMap[catLabel] = (expCategoryMap[catLabel] || 0) + (Number(item.amount) || 0);
    });

    const newIncCategories = Object.entries(incCategoryMap).slice(0, 5).map(([category, amount]) => ({
      category,
      amount,
      percentage: incTotal > 0 ? Math.round((amount / incTotal) * 100) : 0
    }));

    const newExpCategories = Object.entries(expCategoryMap).slice(0, 6).map(([category, amount]) => ({
      category,
      amount,
      percentage: expTotal > 0 ? Math.round((amount / expTotal) * 100) : 0
    }));

    setFormData(prev => ({
      ...prev,
      totalIncome: incTotal > 0 ? incTotal : prev.totalIncome,
      totalExpense: expTotal > 0 ? expTotal : prev.totalExpense,
      netSurplus: surplus,
      incomeCategories: newIncCategories.length > 0 ? newIncCategories : prev.incomeCategories,
      expenseCategories: newExpCategories.length > 0 ? newExpCategories : prev.expenseCategories
    }));
  };

  // Helper to re-calculate surplus
  const handleAutoCalculateSurplus = () => {
    const surplus = formData.totalIncome - formData.totalExpense;
    setFormData(prev => ({ ...prev, netSurplus: surplus }));
  };

  // Helper to re-calculate category percentages based on total amounts
  const handleRecalculatePercentages = () => {
    const totalInc = formData.totalIncome || 1;
    const totalExp = formData.totalExpense || 1;

    setFormData(prev => ({
      ...prev,
      incomeCategories: prev.incomeCategories.map(cat => ({
        ...cat,
        percentage: Math.round((cat.amount / totalInc) * 100)
      })),
      expenseCategories: prev.expenseCategories.map(cat => ({
        ...cat,
        percentage: Math.round((cat.amount / totalExp) * 100)
      }))
    }));
  };

  // Add category row
  const handleAddCategory = (type: 'income' | 'expense') => {
    if (type === 'income') {
      setFormData(prev => ({
        ...prev,
        incomeCategories: [
          ...prev.incomeCategories,
          { category: 'নতুন আয় খাত', amount: 100000, percentage: 0 }
        ]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        expenseCategories: [
          ...prev.expenseCategories,
          { category: 'নতুন ব্যয় খাত', amount: 50000, percentage: 0 }
        ]
      }));
    }
  };

  // Remove category row
  const handleRemoveCategory = (type: 'income' | 'expense', index: number) => {
    if (type === 'income') {
      setFormData(prev => ({
        ...prev,
        incomeCategories: prev.incomeCategories.filter((_, idx) => idx !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        expenseCategories: prev.expenseCategories.filter((_, idx) => idx !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Error saving public financial report:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>পাবলিক আর্থিক রিপোর্ট সম্পাদনা</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {report.id ? 'আর্থিক রিপোর্ট সম্পাদনা করুন' : 'নতুন পাবলিক আর্থিক রিপোর্ট প্রকাশ করুন'}
            </h3>
            <p className="text-xs text-slate-500">
              এখানে পরিবর্তন করা তথ্যসমূহ সরাসরি ওয়েবসাইটের পাবলিক আর্থিক রিপোর্ট পেজে প্রদর্শিত হবে।
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-6 text-xs flex-1">
          {/* Basic Info Grid */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>সাধারণ ও অডিট সংক্রান্ত তথ্য</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">অর্থবছর (Fiscal Year) *</label>
                <input
                  type="text"
                  required
                  value={formData.fiscalYear}
                  onChange={e => setFormData({ ...formData, fiscalYear: e.target.value })}
                  placeholder="যেমন: ২০২৪-২০২৫"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রকাশের তারিখ *</label>
                <input
                  type="text"
                  required
                  value={formData.publishedDate}
                  onChange={e => setFormData({ ...formData, publishedDate: e.target.value })}
                  placeholder="যেমন: ২০২৬-০১-২০"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">রিপোর্টের স্ট্যাটাস *</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                >
                  <option value="audited">সিএ অডিটেড (Audited)</option>
                  <option value="approved">কমিটি অনুমোদিত (Approved)</option>
                  <option value="interim">অন্তর্বর্তীকালীন / খসড়া (Interim)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">রিপোর্টের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: ২০২৪-২০২৫ অর্থবছরের বার্ষিক নিরীক্ষিত আর্থিক রিপোর্ট"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">নিরীক্ষা সময়কাল (Period) *</label>
                <input
                  type="text"
                  required
                  value={formData.periodName}
                  onChange={e => setFormData({ ...formData, periodName: e.target.value })}
                  placeholder="যেমন: ০১ জুলাই ২০২৪ হতে ৩০ জুন ২০২৫"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">নিরীক্ষক / সিএ ফার্মের নাম *</label>
                <input
                  type="text"
                  required
                  value={formData.auditedBy}
                  onChange={e => setFormData({ ...formData, auditedBy: e.target.value })}
                  placeholder="যেমন: মেসার্স কে. রহমান অ্যান্ড কোং, চার্টার্ড অ্যাকাউন্ট্যান্টস"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অডিট সনদ ডকুমেন্টের শিরোনাম</label>
                <input
                  type="text"
                  value={formData.auditDocumentTitle || ''}
                  onChange={e => setFormData({ ...formData, auditDocumentTitle: e.target.value })}
                  placeholder="যেমন: ২০২৪-২০২৫ অর্থবছরের চার্টার্ড অ্যাকাউন্ট্যান্ট বার্ষিক অডিট রিপোর্ট (PDF)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">সারসংক্ষেপ ও ওয়াকফ অডিট নোট *</label>
              <textarea
                rows={3}
                required
                value={formData.summaryText}
                onChange={e => setFormData({ ...formData, summaryText: e.target.value })}
                placeholder="রিপোর্টের বিস্তারিত সারসংক্ষেপ ও নীতিগত সিদ্ধান্ত..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white"
              />
            </div>
          </div>

          {/* Key Totals Box */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>মূল আর্থিক পরিসংখ্যান (৳ টাকা)</span>
              </h4>
              <div className="flex items-center gap-2">
                {((incomes && incomes.length > 0) || (expenses && expenses.length > 0)) && (
                  <button
                    type="button"
                    onClick={handleSyncFromAccountingRecords}
                    className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-emerald-950 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1 shadow-xs"
                    title="সিস্টেমের মোট জমা আয় ও খরচের ভাউচার থেকে স্বয়ংক্রিয়ভাবে অংক বসান"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-950" />
                    <span>ভাউচার খতিয়ান হতে অটো-সিঙ্ক</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAutoCalculateSurplus}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-colors"
                >
                  উদ্বৃত্ত অটো হিসাব করুন
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-emerald-900 mb-1">মোট আয় (৳) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.totalIncome}
                  onChange={e => setFormData({ ...formData, totalIncome: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 font-bold bg-white text-emerald-950 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">মোট ব্যয় (৳) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.totalExpense}
                  onChange={e => setFormData({ ...formData, totalExpense: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-rose-300 font-bold bg-white text-rose-950 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-950 mb-1">উদ্বৃত্ত তহবিল স্থিতি (৳) *</label>
                <input
                  type="number"
                  required
                  value={formData.netSurplus}
                  onChange={e => setFormData({ ...formData, netSurplus: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 font-bold bg-white text-amber-950 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Category Breakdowns: Income & Expense */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Income Categories */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>আয় খাতের বিস্তারিত বিভাজন</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleAddCategory('income')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-[11px] font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>খাত যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.incomeCategories.map((item, idx) => (
                  <div key={`inc-${idx}`} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        required
                        value={item.category}
                        onChange={e => {
                          const updated = [...formData.incomeCategories];
                          updated[idx].category = e.target.value;
                          setFormData({ ...formData, incomeCategories: updated });
                        }}
                        placeholder="খাতের নাম"
                        className="flex-1 px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory('income', idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">টাকার পরিমাণ (৳)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={item.amount}
                          onChange={e => {
                            const updated = [...formData.incomeCategories];
                            updated[idx].amount = Number(e.target.value);
                            setFormData({ ...formData, incomeCategories: updated });
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">শতকরা হার (%)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          max={100}
                          value={item.percentage}
                          onChange={e => {
                            const updated = [...formData.incomeCategories];
                            updated[idx].percentage = Number(e.target.value);
                            setFormData({ ...formData, incomeCategories: updated });
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Categories */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  <span>ব্যয় খাতের বিস্তারিত বিভাজন</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleAddCategory('expense')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-lg text-[11px] font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>খাত যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.expenseCategories.map((item, idx) => (
                  <div key={`exp-${idx}`} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        required
                        value={item.category}
                        onChange={e => {
                          const updated = [...formData.expenseCategories];
                          updated[idx].category = e.target.value;
                          setFormData({ ...formData, expenseCategories: updated });
                        }}
                        placeholder="খাতের নাম"
                        className="flex-1 px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory('expense', idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">টাকার পরিমাণ (৳)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={item.amount}
                          onChange={e => {
                            const updated = [...formData.expenseCategories];
                            updated[idx].amount = Number(e.target.value);
                            setFormData({ ...formData, expenseCategories: updated });
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">শতকরা হার (%)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          max={100}
                          value={item.percentage}
                          onChange={e => {
                            const updated = [...formData.expenseCategories];
                            updated[idx].percentage = Number(e.target.value);
                            setFormData({ ...formData, expenseCategories: updated });
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRecalculatePercentages}
              className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline"
            >
              মোট আয়ের ও ব্যয়ের ভিত্তিতে সব শতকরা (%) হার স্বয়ংক্রিয় রি-ক্যালকুলেট করুন
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold transition-all shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'রিপোর্ট সংরক্ষণ ও প্রকাশ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
