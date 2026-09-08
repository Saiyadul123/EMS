import React from 'react';
import {
  AboutEidgahData,
  SystemSettings
} from '../../../types';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';

interface AboutPageProps {
  aboutData: AboutEidgahData;
  settings: SystemSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ aboutData, settings }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>ঐতিহাসিক পরিচয় ও ওয়াকফ দলিল</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {aboutData.title}
        </h1>
        <p className="mt-3 text-base text-slate-600 font-medium">
          {aboutData.subtitle}
        </p>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">প্রতিষ্ঠা সাল</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">{aboutData.establishedYear} খ্রিষ্টাব্দ</div>
          <div className="text-xs text-slate-400 mt-1">৭৪ বছরের পবিত্র ঐতিহ্য</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">মোট জমির পরিমাণ</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">{aboutData.totalArea}</div>
          <div className="text-xs text-slate-400 mt-1">নিষ্কণ্টক ওয়াকফ সম্পত্তি</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">ধারনক্ষমতা</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">{aboutData.capacity}</div>
          <div className="text-xs text-slate-400 mt-1">একসাথে এক জামাতে</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">ওয়াকফ নিবন্ধন নং</div>
          <div className="text-lg sm:text-xl font-black text-emerald-800 mt-1">{aboutData.waqfRegistrationNo}</div>
          <div className="text-xs text-slate-400 mt-1">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
        </div>
      </div>

      {/* History & Waqf Details */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
            <Award className="w-6 h-6 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">গৌরবময় ইতিহাস ও পটভূমি</h2>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base space-y-4">
          <p>{aboutData.history}</p>
          <p>
            ঈদগাহের তত্ত্বাবধান ও সার্বিক পরিচালনার দায়িত্বে রয়েছে একটি সুসংগঠিত কার্যনির্বাহী পরিষদ এবং বরেণ্য আলেম-ওলামাদের সমন্বয়ে গঠিত স্থায়ী উপদেষ্টা কমিটি। প্রতি বছর সুষ্ঠু ও নির্বিঘ্নভাবে ঈদের জামাত সুসম্পন্ন করার লক্ষ্যে জেলা প্রশাসন, পুলিশ বাহিনী এবং পৌর কর্তৃপক্ষের সার্বক্ষণিক সহযোগিতা নেওয়া হয়।
          </p>
        </div>

        {/* Key Facilities Checklist */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            ঈদগাহ ময়দানের স্থায়ী অবকাঠামো ও সুবিধাসমূহ:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aboutData.facilities.map((fac, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-sm font-medium text-slate-800"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Islamic Scholars & Imams */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-950 rounded-3xl p-8 text-white space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-2xl font-bold">সম্মানিত খতিব, ইমাম ও মুয়াজ্জিনবৃন্দ</h3>
          <p className="text-xs text-emerald-200 mt-1">পবিত্র ঈদ জামাতে ইমামতি ও বয়ানকারী আলেমমণ্ডলী</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-emerald-950/80 p-6 rounded-2xl border border-emerald-700/50 text-center">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">প্রধান খতিব</div>
            <h4 className="text-lg font-bold text-white">{aboutData.khatibName}</h4>
            <p className="text-xs text-emerald-300 mt-1">বিশিষ্ট মুহাদ্দিস ও ইসলামি চিন্তাবিদ</p>
          </div>
          <div className="bg-emerald-950/80 p-6 rounded-2xl border border-emerald-700/50 text-center">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">প্রধান ইমাম</div>
            <h4 className="text-lg font-bold text-white">{aboutData.imamName}</h4>
            <p className="text-xs text-emerald-300 mt-1">মুফতি ও মুদাররিস</p>
          </div>
          <div className="bg-emerald-950/80 p-6 rounded-2xl border border-emerald-700/50 text-center">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">প্রধান মুয়াজ্জিন</div>
            <h4 className="text-lg font-bold text-white">{aboutData.moazzinName}</h4>
            <p className="text-xs text-emerald-300 mt-1">আন্তর্জাতিক ক্বিরাত গবেষক</p>
          </div>
        </div>
      </div>
    </div>
  );
};
