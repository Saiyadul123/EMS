import React, { useState } from 'react';
import { DonationRecord, SystemSettings } from '../../../types';
import { updateDonationStatus, logActivity } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Heart, Search, CheckCircle2, XCircle, Printer, Download, Eye, Clock } from 'lucide-react';

interface DonationViewProps {
  donations: DonationRecord[];
  settings: SystemSettings;
  onRefresh: () => void;
}

export const DonationView: React.FC<DonationViewProps> = ({ donations, settings, onRefresh }) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [viewingReceipt, setViewingReceipt] = useState<DonationRecord | null>(null);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    if (!canAccess('admin')) {
      error('শুধুমাত্র অ্যাডমিন অনুদান যাচাই বা অনুমোদন করতে পারেন');
      return;
    }

    try {
      await updateDonationStatus(id, newStatus);
      await logActivity(
        'অনুদানের স্থিতি হালনাগাদ',
        `রসিদ আইডি ${id} এখন ${newStatus === 'approved' ? 'অনুমোদিত' : 'বাতিল'}`,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success(`অনুদান সফলভাবে ${newStatus === 'approved' ? 'অনুমোদন' : 'বাতিল'} করা হয়েছে।`);
      onRefresh();
    } catch (err: any) {
      console.error('Donation status update error:', err);
      error(err?.message || 'অনুদানের স্থিতি পরিবর্তন করা সম্ভব হয়নি।');
    }
  };

  const filtered = donations.filter(d => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorPhone.includes(searchTerm) ||
      d.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.transactionId && d.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filtered.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">অনলাইন অনুদান ব্যবস্থাপনা (Donations)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ওয়েবসাইট ও ডিজিটাল ওয়ালেটে প্রাপ্ত অনুদান যাচাই, অনুমোদন ও রসিদ মুদ্রণ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
          >
            <option value="all">সব স্থিতি</option>
            <option value="verified">অনুমোদিত</option>
            <option value="pending">অপেক্ষমাণ</option>
          </select>
          <input
            type="text"
            placeholder="রসিদ, নাম বা মোবাইল দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white w-64"
          />
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-900">
          প্রদর্শিত অনুদান রেকর্ড: {filtered.length} টি
        </span>
        <span className="text-sm font-black text-emerald-950">
          মোট পরিমাণ: ৳{totalAmount.toLocaleString('bn-BD')} টাকা
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">রসিদ নং</th>
                <th className="py-3 px-4">দানকারীর নাম</th>
                <th className="py-3 px-4">মোবাইল</th>
                <th className="py-3 px-4">মাধ্যম ও ট্রানজেকশন</th>
                <th className="py-3 px-4">খাত</th>
                <th className="py-3 px-4">পরিমাণ</th>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">অবস্থা</th>
                <th className="py-3 px-4 text-right">রসিদ / অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-english font-bold text-slate-700">{d.receiptNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{d.donorName}</td>
                  <td className="py-3 px-4 font-english text-slate-600">{d.donorPhone}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800">{d.paymentMethod}</span>
                    {d.transactionId && (
                      <span className="block text-[11px] font-english text-slate-400 truncate max-w-[120px]">
                        {d.transactionId}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {d.purpose === 'development' ? 'মিনার ও অবকাঠামো' : 'সাধারণ পরিচালন'}
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-800">
                    ৳{d.amount.toLocaleString('bn-BD')}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-english">{d.date}</td>
                  <td className="py-3 px-4">
                    {d.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> অনুমোদিত
                      </span>
                    ) : d.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> অপেক্ষমাণ
                      </span>
                    ) : (
                      <span className="text-rose-600 text-[11px] font-bold">বাতিল</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setViewingReceipt(d)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                      title="রসিদ দেখুন ও প্রিন্ট করুন"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    {canAccess('admin') && d.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(d.id, 'approved')}
                        className="px-2 py-1 bg-emerald-800 text-white font-bold rounded-md text-[11px] hover:bg-emerald-700"
                      >
                        অনুমোদন
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-6">
            <div className="text-center pb-4 border-b border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">{settings.eidgahNameBn}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                অফিসিয়াল ডিজিটাল মানি রসিদ
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                ওয়াকফ প্রশাসন সনদ নং: {settings.waqfNumber}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">রসিদ নম্বর:</span>
                <span className="font-bold text-slate-900 font-english">{viewingReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">তারিখ:</span>
                <span className="font-bold text-slate-900">{viewingReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">দানকারীর নাম:</span>
                <span className="font-bold text-slate-900">{viewingReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মোবাইল:</span>
                <span className="font-bold text-slate-900 font-english">{viewingReceipt.donorPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">অনুদানের খাত:</span>
                <span className="font-bold text-emerald-800">
                  {viewingReceipt.purpose === 'development' ? 'মিনার ও অবকাঠামো উন্নয়ন' : 'সাধারণ পরিচালন'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
                <span className="font-bold text-slate-900">{viewingReceipt.paymentMethod}</span>
              </div>
              {viewingReceipt.transactionId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">TrxID / রেফারেন্স:</span>
                  <span className="font-bold text-slate-900 font-english">{viewingReceipt.transactionId}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
                <span className="font-bold text-slate-800">মোট গৃহীত অংক:</span>
                <span className="font-black text-emerald-800 text-base">
                  ৳{viewingReceipt.amount.toLocaleString('bn-BD')} টাকা
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                onClick={() => setViewingReceipt(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
