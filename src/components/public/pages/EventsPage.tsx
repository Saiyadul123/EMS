import React from 'react';
import { CommunityEvent } from '../../../types';
import { Calendar, Clock, MapPin, Sparkles, User } from 'lucide-react';

interface EventsPageProps {
  events: CommunityEvent[];
}

export const EventsPage: React.FC<EventsPageProps> = ({ events }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          <span>কর্মসূচি ও দোয়া মাহফিল</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ঈদগাহের ধর্মীয় ও সামাজিক আয়োজনসমূহ
        </h1>
        <p className="mt-3 text-base text-slate-600 font-medium">
          আসন্ন ঈদ প্রস্তুতি, বার্ষিক দোয়া মাহফিল, গণ-ইফতার ও কুরআন খতম কর্মসূচি
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  evt.status === 'upcoming' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {evt.status === 'upcoming' ? 'আসন্ন কর্মসূচি' : 'সম্পন্ন'}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{evt.date}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {evt.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {evt.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>সময়: {evt.time}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>স্থান: {evt.venue}</span>
              </div>
              {evt.chiefGuest && (
                <div className="flex items-center gap-2 font-medium text-emerald-800">
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>প্রধান অতিথি: {evt.chiefGuest}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
