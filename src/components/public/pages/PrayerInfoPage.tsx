import React from 'react';
import {
  EidPrayerInfo,
  SystemSettings
} from '../../../types';
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Umbrella,
  PhoneCall,
  Sparkles,
  Info
} from 'lucide-react';

interface PrayerInfoPageProps {
  prayerInfo: EidPrayerInfo;
  settings: SystemSettings;
}

export const PrayerInfoPage: React.FC<PrayerInfoPageProps> = ({ prayerInfo, settings }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>পবিত্র {prayerInfo.eidType === 'eid_ul_fitr' ? 'ঈদুল ফিতর' : 'ঈদুল আজহা'} {prayerInfo.year}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ঈদের নামাজের সময়সূচি ও মুসল্লিদের নির্দেশিকা
        </h1>
        <p className="mt-3 text-base text-slate-600 font-medium">
          {prayerInfo.date} • {prayerInfo.venue}
        </p>
      </div>

      {/* Main Jamat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prayerInfo.jamats.map((jamat, idx) => (
          <div
            key={`prayer-jamat-${jamat.jamatNo || idx + 1}-${idx}`}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-md hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-amber-300 mb-4">
                <Clock className="w-3.5 h-3.5" />
                <span>{jamat.jamatNo === 1 ? '১ম প্রধান জামাত' : jamat.jamatNo === 2 ? '২য় জামাত' : jamat.jamatNo === 3 ? '৩য় জামাত' : `${idx + 1}ম জামাত`}</span>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                {jamat.time}
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400">ইমামতি করবেন:</span>
                  <h4 className="text-base font-bold text-emerald-900">{jamat.imamName}</h4>
                  <p className="text-xs text-slate-500">{jamat.imamTitle}</p>
                </div>
              </div>
            </div>

            {jamat.notes && (
              <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{jamat.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Guidelines & Safety Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">সম্মানিত মুসল্লিদের জন্য নির্দেশিকা</h3>
              <p className="text-xs text-slate-500">সুষ্ঠু ও সুন্দরভাবে নামাজ আদায়ের স্বার্থে অনুসরণীয়</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {prayerInfo.guidelines.map((g, idx) => (
              <div key={`guideline-${idx}`} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alternative & Emergency Helpline */}
        <div className="space-y-6">
          <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white">
                <Umbrella className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-amber-950">আবহাওয়া ও বৃষ্টি সংক্রান্ত বিকল্প ব্যবস্থা</h3>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              {prayerInfo.weatherAlternative}
            </p>
          </div>

          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-800 text-amber-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">কন্ট্রোল রুম ও জরুরি হেল্পলাইন</h3>
                <p className="text-xs text-slate-400">নিরাপত্তা, পার্কিং বা হারানো বিজ্ঞপ্তি সংক্রান্ত</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 font-bold text-amber-400 text-base">
              {prayerInfo.emergencyContact}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ঈদ জামাত উপলক্ষে পুরো ঈদগাহ এলাকায় বিশেষ পুলিশ ক্যাম্প, আনসার ও স্কাউট দল দায়িত্বে নিয়োজিত থাকবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
