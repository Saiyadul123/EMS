import React, { useState } from 'react';
import { EidgahAboutInfo } from '../../../types';
import { updateAboutInfo, logActivity } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { FileText, Save, Sparkles, Building, CheckCircle2 } from 'lucide-react';

interface AboutViewProps {
  aboutInfo: EidgahAboutInfo;
  onRefresh: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ aboutInfo, onRefresh }) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [formData, setFormData] = useState<EidgahAboutInfo>({
    ...aboutInfo,
    title: aboutInfo?.title || '',
    subtitle: aboutInfo?.subtitle || '',
    establishedYear: aboutInfo?.establishedYear || '',
    totalArea: aboutInfo?.totalArea || '',
    capacity: aboutInfo?.capacity || '',
    waqfRegistrationNo: aboutInfo?.waqfRegistrationNo || aboutInfo?.waqfEstateNo || '',
    waqfEstateNo: aboutInfo?.waqfEstateNo || aboutInfo?.waqfRegistrationNo || '',
    address: aboutInfo?.address || aboutInfo?.location || '',
    location: aboutInfo?.location || aboutInfo?.address || '',
    history: aboutInfo?.history || '',
    mission: aboutInfo?.mission || '',
    vision: aboutInfo?.vision || '',
    khatibName: aboutInfo?.khatibName || '',
    khatibTitle: aboutInfo?.khatibTitle || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (aboutInfo) {
      setFormData({
        ...aboutInfo,
        title: aboutInfo.title || '',
        subtitle: aboutInfo.subtitle || '',
        establishedYear: aboutInfo.establishedYear || '',
        totalArea: aboutInfo.totalArea || '',
        capacity: aboutInfo.capacity || '',
        waqfRegistrationNo: aboutInfo.waqfRegistrationNo || aboutInfo.waqfEstateNo || '',
        waqfEstateNo: aboutInfo.waqfEstateNo || aboutInfo.waqfRegistrationNo || '',
        address: aboutInfo.address || aboutInfo.location || '',
        location: aboutInfo.location || aboutInfo.address || '',
        history: aboutInfo.history || '',
        mission: aboutInfo.mission || '',
        vision: aboutInfo.vision || '',
        khatibName: aboutInfo.khatibName || '',
        khatibTitle: aboutInfo.khatibTitle || '',
      });
    }
  }, [aboutInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAccess('admin')) {
      error('আপনার এই তথ্য পরিবর্তনের অনুমতি নেই');
      return;
    }

    try {
      setIsSaving(true);
      await updateAboutInfo({
        ...formData,
        waqfRegistrationNo: formData.waqfRegistrationNo || formData.waqfEstateNo || '',
        address: formData.address || formData.location || '',
      });
      await logActivity(
        'ঈদগাহ পরিচিতি তথ্য হালনাগাদ',
        'ঐতিহাসিক পটভূমি, ওয়াকফ সনদ ও সুবিধা বিবরণী আপডেট করা হয়েছে',
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('ঈদগাহ পরিচিতি সফলভাবে সংরক্ষিত হয়েছে।');
      onRefresh();
    } catch (err) {
      error('সংরক্ষণ ব্যর্থ হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">ঈদগাহ পরিচিতি ও ওয়াকফ তথ্য ব্যবস্থাপনা</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          ঐতিহাসিক বিবরণ, ভূমির পরিমাণ, ধারণক্ষমতা, খতিব ও ওয়াকফ প্রশাসন সনদ বিবরণী
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Profile */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-700" />
            <span>মূল প্রাতিষ্ঠানিক উপাত্ত ও পরিচিতি শিরোনাম</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">পরিচিতির মূল শিরোনাম</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="যেমন: ঐতিহাসিক কেন্দ্রীয় শাহী ঈদগাহ ময়দানের গৌরবময় ইতিহাস"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">উপ-শিরোনাম / সংক্ষিপ্ত স্লোগান</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="যেমন: সাত দশকের ঐতিহ্যবাহী ঈদুল ফিতর ও ঈদুল আজহার প্রধান মিলনকেন্দ্র"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">প্রতিষ্ঠা সাল</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.establishedYear || ''}
                onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ভূমির আয়তন</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.totalArea || ''}
                onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">নামাজের ধারণক্ষমতা</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ওয়াকফ এস্টেট নম্বর</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.waqfEstateNo || formData.waqfRegistrationNo || ''}
                onChange={(e) => setFormData({ ...formData, waqfEstateNo: e.target.value, waqfRegistrationNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ঠিকানা / মৌজা</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.location || formData.address || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* History & Mission */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>ঐতিহাসিক পটভূমি ও লক্ষ্য</span>
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ঐতিহাসিক পটভূমি (বাংলায় বিস্তারিত)</label>
            <textarea
              rows={4}
              disabled={!canAccess('admin')}
              value={formData.history || ''}
              onChange={(e) => setFormData({ ...formData, history: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">লক্ষ্য ও উদ্দেশ্য (Mission)</label>
              <textarea
                rows={3}
                disabled={!canAccess('admin')}
                value={formData.mission || ''}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ভবিষ্যত পরিকল্পনা (Vision)</label>
              <textarea
                rows={3}
                disabled={!canAccess('admin')}
                value={formData.vision || ''}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Imam Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            প্রধান ইমাম ও খতিবের পরিচয়
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">প্রধান খতিবের নাম</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.khatibName || ''}
                onChange={(e) => setFormData({ ...formData, khatibName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">পদবি ও শিক্ষাগত পরিচয়</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.khatibTitle || ''}
                onChange={(e) => setFormData({ ...formData, khatibTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {canAccess('admin') && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-md transition-all active:scale-98 disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরিচিতি তথ্য হালনাগাদ করুন'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
