import React, { useState } from 'react';
import { EidPrayerInfo, JamatSchedule } from '../../../types';
import { updatePrayerInfo, logActivity } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Clock, Plus, Trash2, Save, Calendar, Sparkles } from 'lucide-react';

interface PrayerInfoViewProps {
  prayerInfo: EidPrayerInfo;
  onRefresh: () => void;
}

export const PrayerInfoView: React.FC<PrayerInfoViewProps> = ({ prayerInfo, onRefresh }) => {
  const { canAccess, userProfile, userRole } = useAuth();
  const { success, error } = useToast();
  const [formData, setFormData] = useState<EidPrayerInfo>({
    ...prayerInfo,
    eidType: prayerInfo?.eidType || 'eid_ul_fitr',
    year: prayerInfo?.year || '',
    hijriYear: prayerInfo?.hijriYear || '',
    date: prayerInfo?.date || '',
    venue: prayerInfo?.venue || '',
    weatherAlternative: prayerInfo?.weatherAlternative || '',
    emergencyContact: prayerInfo?.emergencyContact || '',
    jamats: (prayerInfo?.jamats || []).map(j => ({
      ...j,
      time: j?.time || '',
      imamName: j?.imamName || '',
      imamTitle: j?.imamTitle || ''
    }))
  });
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (prayerInfo) {
      setFormData({
        ...prayerInfo,
        eidType: prayerInfo.eidType || 'eid_ul_fitr',
        year: prayerInfo.year || '',
        hijriYear: prayerInfo.hijriYear || '',
        date: prayerInfo.date || '',
        venue: prayerInfo.venue || '',
        weatherAlternative: prayerInfo.weatherAlternative || '',
        emergencyContact: prayerInfo.emergencyContact || '',
        jamats: (prayerInfo.jamats || []).map((j, idx) => ({
          ...j,
          jamatNo: idx + 1,
          time: j?.time || '',
          imamName: j?.imamName || '',
          imamTitle: j?.imamTitle || ''
        }))
      });
    }
  }, [prayerInfo]);

  const handleJamatChange = (index: number, field: keyof JamatSchedule, value: any) => {
    const updated = [...formData.jamats];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, jamats: updated });
  };

  const handleAddJamat = () => {
    const updated = [
      ...formData.jamats,
      {
        jamatNo: formData.jamats.length + 1,
        time: 'সকাল ১০:০০ মিনিট',
        imamName: '',
        imamTitle: 'ইমাম ও খতিব',
        notes: ''
      }
    ].map((item, idx) => ({ ...item, jamatNo: idx + 1 }));

    setFormData({
      ...formData,
      jamats: updated
    });
  };

  const handleRemoveJamat = (index: number) => {
    const updated = formData.jamats
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, jamatNo: idx + 1 }));
    setFormData({ ...formData, jamats: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAccess('admin')) {
      error('আপনার এই তথ্য পরিবর্তনের অনুমতি নেই');
      return;
    }

    const payload = {
      ...formData,
      jamats: formData.jamats.map((j, idx) => ({
        ...j,
        jamatNo: idx + 1
      }))
    };

    try {
      setIsSaving(true);
      await updatePrayerInfo(payload);
      await logActivity(
        'ঈদের জামাত সময়সূচি হালনাগাদ',
        `পবিত্র ${formData.eidType === 'eid_ul_fitr' ? 'ঈদুল ফিতর' : 'ঈদুল আজহা'} জামাত আপডেট করা হয়েছে`,
        userProfile?.displayName || 'অ্যাডমিন',
        userRole || 'admin'
      );
      success('ঈদের জামাতের তথ্য সফলভাবে হালনাগাদ করা হয়েছে।');
      onRefresh();
    } catch (err: any) {
      console.error('Prayer info update error:', err);
      error(err?.message || 'হালনাগাদ সম্পন্ন করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">ঈদের জামাতের তথ্য ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ঈদুল ফিতর ও ঈদুল আজহার জামাত সময়সূচি, ইমাম ও খতিব এবং মুসল্লিদের নির্দেশিকা
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Schedule Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>সাধারণ জামাত বিবরণ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ঈদের ধরন</label>
              <select
                disabled={!canAccess('admin')}
                value={formData.eidType || 'eid_ul_fitr'}
                onChange={(e) => setFormData({ ...formData, eidType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
              >
                <option value="eid_ul_fitr">পবিত্র ঈদুল ফিতর</option>
                <option value="eid_ul_adha">পবিত্র ঈদুল আজহা</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">খ্রিষ্টীয় বছর</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">হিজরি সন</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.hijriYear || ''}
                onChange={(e) => setFormData({ ...formData, hijriYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">তারিখ বা সম্ভাব্য চাঁদ দেখার বিবরণ</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">স্থান / ভেন্যু</label>
              <input
                type="text"
                disabled={!canAccess('admin')}
                value={formData.venue || ''}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Jamat Schedulers */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>নির্ধারিত জামাতসমূহ ({formData.jamats.length} টি)</span>
            </h3>
            {canAccess('admin') && (
              <button
                type="button"
                onClick={handleAddJamat}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 hover:bg-emerald-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>আরেকটি জামাত যোগ করুন</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {formData.jamats.map((jamat, idx) => (
              <div
                key={`admin-jamat-${jamat.jamatNo || idx + 1}-${idx}`}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-1 font-bold text-slate-500">#{jamat.jamatNo}</div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">জামাতের সময়</label>
                  <input
                    type="text"
                    disabled={!canAccess('admin')}
                    value={jamat.time || ''}
                    onChange={(e) => handleJamatChange(idx, 'time', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-900"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">ইমামের নাম</label>
                  <input
                    type="text"
                    disabled={!canAccess('admin')}
                    value={jamat.imamName || ''}
                    onChange={(e) => handleJamatChange(idx, 'imamName', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">পদবি / পরিচয়</label>
                  <input
                    type="text"
                    disabled={!canAccess('admin')}
                    value={jamat.imamTitle || ''}
                    onChange={(e) => handleJamatChange(idx, 'imamTitle', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                {canAccess('admin') && formData.jamats.length > 1 && (
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveJamat(idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alternative weather and emergency */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            বিকল্প আবহাওয়া ও জরুরি তথ্য
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">বৃষ্টি বা প্রাকৃতিক দুর্যোগে বিকল্প স্থান</label>
            <textarea
              rows={2}
              disabled={!canAccess('admin')}
              value={formData.weatherAlternative || ''}
              onChange={(e) => setFormData({ ...formData, weatherAlternative: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">জরুরি হেল্পলাইন নম্বর</label>
            <input
              type="text"
              disabled={!canAccess('admin')}
              value={formData.emergencyContact || ''}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
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
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সকল তথ্য হালনাগাদ ও প্রকাশ করুন'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
