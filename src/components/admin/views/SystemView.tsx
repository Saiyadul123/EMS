import React, { useState, useEffect } from 'react';
import {
  ActivityLog,
  SystemSettings
} from '../../../types';
import {
  getActivityLogs,
  updateSettings,
  logActivity
} from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import {
  ShieldAlert,
  Bell,
  HelpCircle,
  Settings,
  Save,
  CheckCircle2,
  Clock,
  Send,
  Database,
  Server,
  Layers,
  Sparkles,
  Building,
  Globe
} from 'lucide-react';
import { RoleBadge } from '../../common/Badge';

interface SystemViewProps {
  mode: 'logs' | 'notifications' | 'builder-info' | 'settings';
  settings: SystemSettings;
  onRefresh: () => void;
}

export const SystemView: React.FC<SystemViewProps> = ({ mode, settings, onRefresh }) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'logs' | 'notifications' | 'builder-info' | 'settings'>(mode);

  // Logs state
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Notification state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  // Settings state
  const [formSettings, setFormSettings] = useState<SystemSettings>({
    ...settings,
    eidgahNameBn: settings?.eidgahNameBn || '',
    eidgahNameEn: settings?.eidgahNameEn || '',
    taglineBn: settings?.taglineBn || '',
    addressBn: settings?.addressBn || '',
    waqfNumber: settings?.waqfNumber || '',
    facebookPage: settings?.facebookPage || '',
    youtubeChannel: settings?.youtubeChannel || '',
    bkashMerchantNumber: settings?.bkashMerchantNumber || '',
    nagadMerchantNumber: settings?.nagadMerchantNumber || '',
    rocketMerchantNumber: settings?.rocketMerchantNumber || '',
    bankAccountDetails: settings?.bankAccountDetails || '',
    contactPhone: settings?.contactPhone || '',
    contactEmail: settings?.contactEmail || '',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormSettings({
        ...settings,
        eidgahNameBn: settings.eidgahNameBn || '',
        eidgahNameEn: settings.eidgahNameEn || '',
        taglineBn: settings.taglineBn || '',
        addressBn: settings.addressBn || '',
        waqfNumber: settings.waqfNumber || '',
        facebookPage: settings.facebookPage || '',
        youtubeChannel: settings.youtubeChannel || '',
        bkashMerchantNumber: settings.bkashMerchantNumber || '',
        nagadMerchantNumber: settings.nagadMerchantNumber || '',
        rocketMerchantNumber: settings.rocketMerchantNumber || '',
        bankAccountDetails: settings.bankAccountDetails || '',
        contactPhone: settings.contactPhone || '',
        contactEmail: settings.contactEmail || '',
      });
    }
  }, [settings]);

  useEffect(() => {
    setActiveTab(mode);
  }, [mode]);

  useEffect(() => {
    if (activeTab === 'logs') {
      loadLogs();
    }
  }, [activeTab]);

  const loadLogs = async () => {
    setLoadingLogs(true);
    const data = await getActivityLogs();
    setLogs(data);
    setLoadingLogs(false);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      error('নোটিফিকেশনের শিরোনাম ও বার্তা পূরণ করুন');
      return;
    }

    try {
      await logActivity(
        'কমিটি সদস্যদের নোটিফিকেশন প্রেরণ',
        `${notifTitle}: ${notifMessage}`,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('কমিটি সদস্যদের নিকট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে।');
      setNotifTitle('');
      setNotifMessage('');
    } catch (err) {
      error('পাঠাতে সমস্যা হয়েছে।');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAccess('admin')) {
      error('আপনার এই সেটিংস পরিবর্তনের অনুমতি নেই');
      return;
    }

    try {
      setSavingSettings(true);
      await updateSettings(formSettings);
      await logActivity(
        'সিস্টেম সেটিংস হালনাগাদ',
        'মার্চেন্ট নম্বর ও সার্বিক কনফিগারেশন আপডেট',
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('সিস্টেম সেটিংস সফলভাবে হালনাগাদ করা হয়েছে।');
      onRefresh();
    } catch (err) {
      error('সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Heading */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">সিস্টেম প্রশাসন ও কনফিগারেশন</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          কার্যক্রম লগ, অভ্যন্তরীণ বার্তা, কারিগরি আর্কিটেকচার ও মার্চেন্ট একাউন্ট সেটিংস
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit text-xs font-bold">
        {canAccess('super_admin') && (
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'logs' ? 'bg-white text-rose-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>কার্যক্রম লগ (Activity Logs)</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'notifications' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-emerald-600" />
          <span>নোটিফিকেশন (Notifications)</span>
        </button>
        <button
          onClick={() => setActiveTab('builder-info')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'builder-info' ? 'bg-white text-sky-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
          <span>সিস্টেম আর্কিটেকচার (Builder Info)</span>
        </button>
        {canAccess('admin') && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'settings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-amber-600" />
            <span>সিস্টেম সেটিংস (Settings)</span>
          </button>
        )}
      </div>

      {/* 1. Activity Logs (Super Admin Only) */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">সিস্টেম সিকিউরিটি ও কার্যক্রম ট্রেইল</h3>
              <p className="text-xs text-slate-500">অনলাইন অনুদান, নোটিশ ও তথ্যাদি পরিবর্তনের স্বয়ংক্রিয় লগ</p>
            </div>
            <button
              onClick={loadLogs}
              className="text-xs text-emerald-800 font-bold hover:underline"
            >
              রিফ্রেশ করুন
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">সময় ও তারিখ</th>
                  <th className="py-3 px-4">অ্যাকশন / ইভেন্ট</th>
                  <th className="py-3 px-4">বিস্তারিত তথ্য</th>
                  <th className="py-3 px-4">ব্যবহারকারী</th>
                  <th className="py-3 px-4">রোল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 text-slate-400 font-english">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600">{log.details}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{log.performedBy}</td>
                    <td className="py-3 px-4">
                      <RoleBadge role={log.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs max-w-2xl space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">অভ্যন্তরীণ বার্তা ও জরুরি পুশ বিজ্ঞপ্তি</h3>
              <p className="text-xs text-slate-500">পরিচালনা পরিষদ ও কমিটি সদস্যদের তাৎক্ষণিক বার্তা প্রদান</p>
            </div>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">বিজ্ঞপ্তির শিরোনাম *</label>
              <input
                type="text"
                required
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="যেমন: আগামী শুক্রবার কার্যনির্বাহী কমিটির জরুরি সভা আহ্বান"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">বার্তার বিষয়বস্তু *</label>
              <textarea
                rows={4}
                required
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                placeholder="সদস্যদের উদ্দেশ্যে বিস্তারিত বার্তা লিখুন..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>বার্তা প্রেরণ করুন</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. Website Builder & Architecture Info */}
      {activeTab === 'builder-info' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Eidgah Management System আর্কিটেকচার</h3>
                <p className="text-xs text-slate-500">প্রযুক্তিগত স্ট্যাক ও ক্লাউড ডেটাবেস কনফিগারেশন</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Server className="w-4 h-4 text-emerald-700" />
                  <span>ফ্রন্টএন্ড ফ্রেমওয়ার্ক</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  React 18 + TypeScript + Vite + Tailwind CSS (কাস্টম ইসলামিক জিওমেট্রিক আর্টওয়ার্ক ও হিস্টরিকাল থিমিং সহকারে)।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span>ক্লাউড ফায়ারস্টোর ডেটাবেস</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  গুগল ক্লাউড ফায়ারস্টোর (Cloud Firestore) রিয়েল-টাইম নোটিফিকেশন, অনুদান ও রোল-ভিত্তিক সিকিউরিটি রুলস।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>নিরাপত্তা ও আরবিএসি (RBAC)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  সুপার অ্যাডমিন, অ্যাডমিন ও কমিটি মেম্বার ত্রি-স্তরীয় পারমিশন সিকিউরিটি রুলস (`firestore.rules`) দ্বারা সুরক্ষিত।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Settings */}
      {activeTab === 'settings' && canAccess('admin') && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* 1. Eidgah Identity & Branding */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-700" />
                <span>ঈদগাহ প্রতিষ্ঠানের নাম ও সাধারণ ব্রান্ডিং (Identity & Name)</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                হেডার, হোমপেজ ও রশিদে প্রদর্শিত হবে
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ঈদগাহের নাম (বাংলায়) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formSettings.eidgahNameBn || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, eidgahNameBn: e.target.value })}
                  placeholder="যেমন: ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দান"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">হোমপেজ টাইটেল, হেডার ব্যানার ও অফিসিয়াল রশিদে এই নামটি ব্যবহৃত হয়</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ঈদগাহের নাম (ইংরেজিতে)
                </label>
                <input
                  type="text"
                  value={formSettings.eidgahNameEn || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, eidgahNameEn: e.target.value })}
                  placeholder="e.g. Historic Central Shahi Eidgah"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 text-sm font-english focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">হেডার সাব-টাইটেল ও অফিসিয়াল নথিতে ব্যবহৃত ইংরেজি নাম</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  স্লোগান / পরিচিতি বাণী (হোমপেজে প্রদর্শিত)
                </label>
                <input
                  type="text"
                  value={formSettings.taglineBn || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, taglineBn: e.target.value })}
                  placeholder="যেমন: ঐক্য, ভ্রাতৃত্ব ও তাকওয়ার মিলনমেলা — প্রতিষ্ঠা: ১৯৫২ খ্রি."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">হোমপেজের হিরো সেকশনে প্রধান নামের নিচে প্রদর্শিত হবে</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ওয়াকফ এস্টেট রেজিস্ট্রেশন নম্বর
                </label>
                <input
                  type="text"
                  value={formSettings.waqfNumber || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, waqfNumber: e.target.value })}
                  placeholder="যেমন: WQF-DHK-48201 / বাংলাদেশ ওয়াকফ প্রশাসন"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ঈদগাহ ময়দানের সম্পূর্ণ ঠিকানা ও অবস্থান
              </label>
              <input
                type="text"
                value={formSettings.addressBn || ''}
                onChange={(e) => setFormSettings({ ...formSettings, addressBn: e.target.value })}
                placeholder="যেমন: ঈদগাহ রোড, কেন্দ্রীয় জামে মসজিদ সংলগ্ন, ঢাকা"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  অফিসিয়াল ফেসবুক পেজ লিংক (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={formSettings.facebookPage || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, facebookPage: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-english focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  অফিসিয়াল ইউটিউব চ্যানেল লিংক (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={formSettings.youtubeChannel || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, youtubeChannel: e.target.value })}
                  placeholder="https://youtube.com/@..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-english focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 2. Merchant & Bank Accounts */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-700" />
              <span>মার্চেন্ট ওয়ালেট নম্বর ও যোগাযোগ সেটিংস</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">বিকাশ মার্চেন্ট নম্বর</label>
                <input
                  type="text"
                  value={formSettings.bkashMerchantNumber || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, bkashMerchantNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold font-english"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">নগদ মার্চেন্ট নম্বর</label>
                <input
                  type="text"
                  value={formSettings.nagadMerchantNumber || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, nagadMerchantNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold font-english"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">রকেট একাউন্ট নম্বর</label>
                <input
                  type="text"
                  value={formSettings.rocketMerchantNumber || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, rocketMerchantNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold font-english"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">অফিসিয়াল ব্যাংক হিসাবের বিবরণ</label>
              <textarea
                rows={2}
                value={formSettings.bankAccountDetails || ''}
                onChange={(e) => setFormSettings({ ...formSettings, bankAccountDetails: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">কন্ট্রোল রুম হটলাইন</label>
                <input
                  type="text"
                  value={formSettings.contactPhone || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">অফিসিয়াল ইমেইল</label>
                <input
                  type="email"
                  value={formSettings.contactEmail || ''}
                  onChange={(e) => setFormSettings({ ...formSettings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-english"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-md transition-all active:scale-98 disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস হালনাগাদ করুন'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
