import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  Heart,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Megaphone,
  CheckCircle2,
  PhoneCall,
  PieChart,
  FileText,
  TrendingUp,
  Edit3
} from 'lucide-react';
import {
  PublicPage,
  EidPrayerInfo,
  NoticeItem,
  DevelopmentProject,
  CommitteeMember,
  GalleryItem,
  SystemSettings,
  PublicFinancialReport,
  IncomeRecord,
  ExpenseRecord
} from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { FinancialReportEditModal } from '../../common/FinancialReportEditModal';
import { savePublicFinancialReport } from '../../../services/db';

interface HomePageProps {
  prayerInfo: EidPrayerInfo;
  notices: NoticeItem[];
  projects: DevelopmentProject[];
  committee: CommitteeMember[];
  gallery: GalleryItem[];
  settings: SystemSettings;
  reports?: PublicFinancialReport[];
  incomes?: IncomeRecord[];
  expenses?: ExpenseRecord[];
  onNavigate: (page: PublicPage) => void;
  onQuickDonate: (amount: number) => void;
  onRefreshReports?: () => Promise<void> | void;
}

export const HomePage: React.FC<HomePageProps> = ({
  prayerInfo,
  notices,
  projects,
  committee,
  gallery,
  settings,
  reports = [],
  incomes = [],
  expenses = [],
  onNavigate,
  onQuickDonate,
  onRefreshReports
}) => {
  const { canAccess } = useAuth();
  const { success, error } = useToast();
  const isPrivileged = canAccess('committee') || canAccess('admin') || canAccess('super_admin');

  const [customAmount, setCustomAmount] = useState<string>('১০০০');
  const presetAmounts = [500, 1000, 2500, 5000];

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<PublicFinancialReport | null>(null);

  const activeReport = (reports && reports.length > 0)
    ? (reports.find(r => r.id === selectedReportId) || reports[0])
    : null;

  const handleSaveReport = async (saved: PublicFinancialReport) => {
    try {
      await savePublicFinancialReport(saved);
      success('আর্থিক রিপোর্ট সফলভাবে সংরক্ষিত ও হোমপেজে আপডেট করা হয়েছে!');
      setIsEditModalOpen(false);
      setEditingReport(null);
      if (onRefreshReports) {
        await onRefreshReports();
      }
    } catch (err: any) {
      error('রিপোর্ট সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customAmount.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d).toString()), 10) || 1000;
    onQuickDonate(num);
  };

  const pinnedNotices = notices.filter(n => n.isPinned).slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Notice Ticker Banner */}
      {pinnedNotices.length > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shrink-0">
              <Megaphone className="w-3 h-3" />
              জরুরি নোটিশ
            </span>
            <div className="overflow-hidden whitespace-nowrap text-xs sm:text-sm font-semibold text-amber-950 truncate">
              {pinnedNotices.map((n, i) => (
                <span key={`pinned-notice-${n.id || i}-${i}`} className="inline-block mr-6">
                  {n.title}
                  {i < pinnedNotices.length - 1 && ' • '}
                </span>
              ))}
            </div>
            <button
              onClick={() => onNavigate('notices')}
              className="ml-auto text-xs font-bold text-amber-800 hover:text-amber-950 underline shrink-0"
            >
              সব নোটিশ
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-emerald-800">
        {/* Decorative Background Arabesque Circles */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>পবিত্র {prayerInfo.eidType === 'eid_ul_fitr' ? 'ঈদুল ফিতর' : 'ঈদুল আজহা'} {prayerInfo.year} • {prayerInfo.hijriYear}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {settings.eidgahNameBn}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {settings.taglineBn || 'ঐক্য, সম্প্রীতি ও তাকওয়ার প্রতীক হিসেবে সুদীর্ঘ সাত দশক ধরে এই ঐতিহাসিক প্রাঙ্গণে অনুষ্ঠিত হচ্ছে দেশের অন্যতম বৃহৎ ঈদ জামাত। আসুন সবাই মিলে ঈদগাহের উন্নয়ন ও সুরক্ষায় অংশ নিই।'}
              </p>

              {/* Jamaat highlights badge */}
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 backdrop-blur-md max-w-xl mx-auto lg:mx-0 shadow-lg">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  <span>আসন্ন ঈদ জামাতের নির্ধারিত সময়সূচি ({prayerInfo.year}):</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {prayerInfo.jamats.map((j, idx) => (
                    <div key={`home-jamat-${j.jamatNo || idx + 1}-${idx}`} className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-700/40">
                      <div className="text-xs text-emerald-300 font-semibold">{j.jamatNo === 1 ? '১ম জামাত' : j.jamatNo === 2 ? '২য় জামাত' : j.jamatNo === 3 ? '৩য় জামাত' : `${idx + 1}ম জামাত`}</div>
                      <div className="text-sm sm:text-base font-bold text-white mt-0.5">{j.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('prayer-info')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all hover:scale-102"
                >
                  <Calendar className="w-4 h-4" />
                  <span>জামাত ও মুসল্লিদের নির্দেশিকা</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/60 transition-colors"
                >
                  <span>ঈদগাহের বিস্তারিত ইতিহাস</span>
                </button>
              </div>
            </div>

            {/* Right Quick Donation Card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                    <Heart className="w-6 h-6 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">অনলাইনে দান করুন</h3>
                    <p className="text-xs text-slate-500">সদকায়ে জারিয়া ও ঈদগাহ উন্নয়ন তহবিল</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      অনুদানের পরিমাণ নির্বাচন করুন (টাকা)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {presetAmounts.map((amt, idx) => (
                        <button
                          key={`preset-amt-${amt}-${idx}`}
                          type="button"
                          onClick={() => setCustomAmount(amt.toString())}
                          className={`py-2 text-center rounded-xl font-bold text-sm border transition-all ${
                            customAmount === amt.toString()
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ৳{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      অন্যান্য পরিমাণ (টাকায় লিখুন):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                      <input
                        type="text"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-base"
                        placeholder="টাকার অংক লিখুন"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>তাৎক্ষণিক ডিজিটাল মানিরসিদ প্রদান</span>
                    </div>
                    <p className="text-emerald-700/90 text-[11px]">
                      বিকাশ, নগদ, রকেট ও অনলাইন ব্যাংকের মাধ্যমে নিরাপদ পেমেন্ট।
                    </p>
                  </div>

                  <button
                    onClick={handleDonateSubmit}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-700/20 transition-all active:scale-98"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>এগিয়ে যান ও দান করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => onNavigate('donation')}
                      className="text-xs text-slate-500 hover:text-emerald-700 font-semibold"
                    >
                      ব্যাংক একাউন্ট বিবরণ ও সরাসরি পেমেন্ট তথ্য দেখুন
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Numbers / Statistics Bar */}
      <section className="bg-white border-b border-slate-200/80 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">১৪.৫ বিঘা</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">মোট ওয়াকফ ময়দান এলাকা</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">৬৫,০০০+</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">একসাথে মুসল্লির ধারণক্ষমতা</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">১৯৫২ খ্রি.</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">প্রতিষ্ঠা ও গৌরবময় ঐতিহ্য</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">৩টি প্রধান জামাত</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">সুশৃঙ্খল ও পর্যায়ক্রমিক জামাত</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Development Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                মিনার ও অবকাঠামো উন্নয়ন
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                চলমান উন্নয়ন প্রকল্পসমূহ
              </h2>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950"
            >
              <span>সকল প্রকল্প দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((proj, idx) => {
              const percent = Math.min(100, Math.round((proj.raisedBudget / proj.targetBudget) * 100));
              return (
                <div
                  key={`home-proj-${proj.id || idx}-${idx}`}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="h-44 bg-slate-200 relative overflow-hidden">
                    <img
                      src={proj.coverImage || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        proj.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {proj.status === 'completed' ? 'সম্পন্ন' : 'চলমান প্রকল্প'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">সংগৃহীত তহবিল:</span>
                        <span className="text-emerald-800 font-bold">
                          ৳{proj.raisedBudget.toLocaleString('bn-BD')} / ৳{proj.targetBudget.toLocaleString('bn-BD')}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>{percent}% অর্জিত</span>
                        <span>শুরু: {proj.startDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('donation')}
                      className="w-full py-2.5 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                    >
                      এই প্রকল্পে দান করুন
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facilities & Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              আলোকিত পরিবেশ ও সুবিধা
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              মুসল্লিদের জন্য আধুনিক সুযোগ-সুবিধা
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              বিশাল ময়দানে সুশৃঙ্খল ঈদ জামাত আয়োজনের স্বার্থে আমাদের বিশেষ বন্দোবস্তসমূহ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold mb-4 shadow-xs">
                ১
              </div>
              <h4 className="font-bold text-slate-900 mb-2">দ্বিতল আধুনিক ওজুখানা</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                একসাথে ১০০০ মুসল্লির দ্রুত ওজুর জন্য সার্বক্ষণিক বিশুদ্ধ পানির ব্যবস্থা ও মার্বেল বাথরুম।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold mb-4 shadow-xs">
                ২
              </div>
              <h4 className="font-bold text-slate-900 mb-2">১০০+ স্পিকার নেটওয়ার্ক</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                উন্নত অ্যাকোস্টিক ডিজিটাল সাউন্ড সিস্টেম, যাতে মাঠের শেষ প্রান্তের মুসল্লিও সুস্পষ্ট খুতবা শুনতে পান।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold mb-4 shadow-xs">
                ৩
              </div>
              <h4 className="font-bold text-slate-900 mb-2">সিসিটিভি ও নিরাপত্তা ক্যাম্প</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                পুলিশ ও র‍্যাব কন্ট্রোল রুমের সাথে যুক্ত সার্বক্ষণিক সিসিটিভি ক্যামেরা ও ১০০ স্বেচ্ছাসেবক দল।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold mb-4 shadow-xs">
                ৪
              </div>
              <h4 className="font-bold text-slate-900 mb-2">বৃষ্টির পানি নিষ্কাশন</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                সাব-সারফেস পাইপ ড্রেনেজ প্রযুক্তির ফলে ভারী বৃষ্টি হলেও ময়দানে কোনো পানি আটকে থাকে না।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Committee & Leadership Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                পরিচালনা পরিষদ
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                ঈদগাহ পরিচালনা ও উপদেষ্টা পরিষদ
              </h2>
            </div>
            <button
              onClick={() => onNavigate('committee')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950"
            >
              <span>সকল সদস্য দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {committee.slice(0, 4).map((member, idx) => (
              <div
                key={`home-comm-${member.id || idx}-${idx}`}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold border-2 border-emerald-300 mb-4 overflow-hidden">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{member.name.split(' ')[0][0]}</span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                <p className="text-xs font-semibold text-emerald-700 mt-1 mb-2">{member.designation}</p>
                <p className="text-xs text-slate-400">{member.term}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Transparency & Audit Reports Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/80 text-amber-300 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>পাবলিক আর্থিক স্বচ্ছতা ও চার্টার্ড অডিট</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/90 border border-emerald-600/40 text-emerald-200 text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>স্বয়ংক্রিয় লাইভ ডাটাবেস সিঙ্ক</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                  {activeReport?.title || 'ঈদগাহের আর্থিক হিসাব ও বার্ষিক অডিট রিপোর্ট'}
                </h2>
                <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                  {activeReport?.summaryText || 'ওয়াকফ অধ্যাদেশ ও পরিচালনা পরিষদের স্বচ্ছতা নীতি অনুযায়ী সাধারণ মুসল্লি ও সম্মানিত দাতাগণের অবগতির জন্য নিরীক্ষিত আর্থিক রিপোর্ট ও আয়-ব্যয় বিবরণী উন্মুক্ত রাখা হয়েছে।'}
                </p>

                {reports && reports.length > 1 && (
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-xs text-emerald-300 font-semibold">অর্থবছর নির্বাচন:</span>
                    {reports.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedReportId(r.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          (activeReport?.id === r.id)
                            ? 'bg-amber-400 text-emerald-950 shadow-sm'
                            : 'bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/10'
                        }`}
                      >
                        {r.fiscalYear}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('reports')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-emerald-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md hover:scale-102"
                  >
                    <PieChart className="w-4 h-4" />
                    <span>সম্পূর্ণ আর্থিক রিপোর্ট দেখুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {isPrivileged && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReport(activeReport || (reports && reports[0]) || null);
                        setIsEditModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-amber-300 bg-emerald-800/90 hover:bg-emerald-700 border border-amber-400/40 transition-all shadow-sm cursor-pointer"
                      title="হোমপেজের এই রিপোর্ট তথ্য সরাসরি পরিবর্তন ও আপডেট করুন"
                    >
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <span>রিপোর্ট সম্পাদনা করুন</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('donation')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-amber-400" />
                    <span>তহবিলে দান করুন</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                {/* 1. Barshik Aay */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-1 relative group">
                  <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>বার্ষিক আয়</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white">
                    ৳{(activeReport?.totalIncome ?? 5250000).toLocaleString('bn-BD')}
                  </div>
                  <p className="text-[10px] text-emerald-200 truncate">
                    {activeReport?.fiscalYear || '২০২৪-২০২৫'} অর্থবছর
                  </p>
                </div>

                {/* 2. Unnayan o Byay */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-1 relative group">
                  <div className="text-xs text-rose-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>উন্নয়ন ও ব্যয়</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white">
                    ৳{(activeReport?.totalExpense ?? 3840000).toLocaleString('bn-BD')}
                  </div>
                  <p className="text-[10px] text-emerald-200 truncate" title={activeReport?.expenseCategories?.[0]?.category || 'উন্নয়ন ও পরিচালনা'}>
                    {activeReport?.expenseCategories?.[0]?.category || 'মিনার ও ড্রেনেজ কাজ'}
                  </p>
                </div>

                {/* 3. Reserve Tohobil */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-1 relative group">
                  <div className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>রিজার্ভ তহবিল</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white">
                    ৳{((activeReport?.netSurplus ?? ((activeReport?.totalIncome ?? 5250000) - (activeReport?.totalExpense ?? 3840000)))).toLocaleString('bn-BD')}
                  </div>
                  <p className="text-[10px] text-emerald-200">ব্যাংক ও নিরাপদ স্থিতি</p>
                </div>

                {/* 4. Audit Pottyon */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-1 relative group">
                  <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>অডিট প্রত্যয়ন</span>
                  </div>
                  <div className="text-sm font-bold text-white leading-tight truncate">
                    {activeReport?.status === 'audited' ? 'সিএ নিরীক্ষিত' : activeReport?.status === 'approved' ? 'কমিটি অনুমোদিত' : 'ওয়াকফ নিরীক্ষিত'}
                  </div>
                  <p className="text-[10px] text-emerald-200 truncate" title={activeReport?.auditedBy || 'ওয়াকফ সনদপ্রাপ্ত'}>
                    {activeReport?.auditedBy ? activeReport.auditedBy.split(',')[0].replace('মেসার্স ', '').trim() : 'ওয়াকফ সনদপ্রাপ্ত'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Helpline Banner */}
      <section className="bg-emerald-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">ঈদ প্রস্তুতি বা কোনো তথ্যের জন্য যোগাযোগ করুন</h3>
            <p className="text-xs sm:text-sm text-emerald-200">
              আমাদের কন্ট্রোল রুম হটলাইন ২৪ ঘণ্টা খোলা থাকে।
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${settings.contactPhone}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{settings.contactPhone}</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 transition-colors"
            >
              <span>বার্তা পাঠান</span>
            </button>
          </div>
        </div>
      </section>

      {/* Edit Modal on HomePage for Admins/Committee */}
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
    </div>
  );
};
