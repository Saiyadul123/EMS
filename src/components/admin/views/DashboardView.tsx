import React from 'react';
import {
  Users,
  Heart,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  Building,
  Bell,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import {
  AdminSection,
  WalletAccount,
  DonationRecord,
  EidPrayerInfo,
  DevelopmentProject,
  NoticeItem,
  UserRole,
  SystemSettings
} from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface DashboardViewProps {
  wallets: WalletAccount[];
  donations: DonationRecord[];
  prayerInfo: EidPrayerInfo;
  projects: DevelopmentProject[];
  notices: NoticeItem[];
  settings?: SystemSettings;
  onNavigateSection: (section: AdminSection) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  wallets,
  donations,
  prayerInfo,
  projects,
  notices,
  settings,
  onNavigateSection
}) => {
  const { userProfile, userRole } = useAuth();

  const totalFundBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
  const totalDonationAmount = donations.reduce((acc, d) => acc + d.amount, 0);
  const pendingDonations = donations.filter(d => d.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-bold border border-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>সিস্টেম সচল • ক্লাউড ফায়ারবেস ডেটাবেস সংযুক্ত</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            স্বাগতম, {userProfile?.displayName || 'শ্রদ্ধেয় সদস্য'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            {settings?.eidgahNameBn || 'ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দান'} প্রশাসন প্যানেলে আপনাকে স্বাগতম। এখান থেকে ওয়েবসাইট কন্টেন্ট, জামাত সিডিউল, আর্থিক হিসাব ও প্রকল্প পরিচালনা করুন।
          </p>
        </div>

        {userRole === 'committee' && (
          <div className="mt-4 p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              আপনি <strong>কমিটি সদস্য (Committee Member)</strong> হিসেবে লগইন আছেন। আপনি নির্ধারিত রিপোর্ট ও তথ্য দেখতে পারবেন; আর্থিক ও প্রশাসনিক ডেটা পরিবর্তন করার অনুমতি সংরক্ষিত।
            </span>
          </div>
        )}
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">মোট তহবিল স্থিতি</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              ৳{totalFundBalance.toLocaleString('bn-BD')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">ব্যাংক ও মার্চেন্ট ওয়ালেটসহ</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">মোট অনলাইন অনুদান</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              ৳{totalDonationAmount.toLocaleString('bn-BD')}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">
              মোট {donations.length} টি রসিদ নিবন্ধিত
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">আসন্ন ঈদের জামাত</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {prayerInfo.jamats.length} টি জামাত
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              প্রথম জামাত: {prayerInfo.jamats[0]?.time}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">চলমান মেগা প্রকল্প</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {projects.filter(p => p.status === 'ongoing').length} টি প্রকল্প
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              মিনার ও ড্রেনেজ কমপ্লেক্স
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Accounts Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">তহবিল ও ব্যাংক একাউন্ট স্থিতি (Wallets)</h3>
            <p className="text-xs text-slate-500">অনুমোদিত আর্থিক হিসাব ও বর্তমান ব্যালেন্স</p>
          </div>
          <button
            onClick={() => onNavigateSection('wallet')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
          >
            <span>বিস্তারিত ওয়ালেট</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wallets.map((wallet, idx) => (
            <div
              key={`dash-wallet-${wallet.id || idx}-${idx}`}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <div className="text-xs font-bold text-slate-600 truncate">{wallet.accountName}</div>
              <div className="text-xl font-black text-emerald-800">
                ৳{wallet.balance.toLocaleString('bn-BD')}
              </div>
              <div className="text-[11px] text-slate-400">হালনাগাদ: {wallet.updatedAt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Donations & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Donations */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">সাম্প্রতিক অনুদান তালিকা</h3>
              <p className="text-xs text-slate-500">ওয়েবসাইট ও বিকাশ/নগদ চ্যানেলে সংগৃহীত অনুদান</p>
            </div>
            <button
              onClick={() => onNavigateSection('donations')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
            >
              <span>সব অনুদান</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">রসিদ নং</th>
                  <th className="py-2.5 px-3">দানকারী</th>
                  <th className="py-2.5 px-3">মাধ্যম</th>
                  <th className="py-2.5 px-3">পরিমাণ</th>
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3">অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.slice(0, 5).map((don, idx) => (
                  <tr key={`dash-don-${don.id || idx}-${idx}`} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-english font-bold text-slate-700">{don.receiptNo}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{don.donorName}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">{don.paymentMethod}</span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-800">
                      ৳{don.amount.toLocaleString('bn-BD')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{don.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        অনুমোদিত
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
            জরুরি অ্যাকশন ও শর্টকাট
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={() => onNavigateSection('prayer-info')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>ঈদের জামাত শিডিউল পরিবর্তন</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateSection('notices')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-emerald-700" />
                <span>নতুন নোটিশ প্রকাশ করুন</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateSection('income')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>নতুন আয়ের ভাউচার যোগ করুন</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateSection('expense')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <TrendingDown className="w-4 h-4 text-rose-700" />
                <span>নতুন ব্যয়ের ভাউচার যোগ করুন</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateSection('committee')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>কমিটি সদস্য তালিকা আপডেট</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
