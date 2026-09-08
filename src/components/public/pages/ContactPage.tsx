import React, { useState } from 'react';
import { SystemSettings } from '../../../types';
import { MapPin, Phone, Mail, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { logActivity } from '../../../services/db';
import { useToast } from '../../../context/ToastContext';

interface ContactPageProps {
  settings: SystemSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      error('সবগুলো ঘর পূরণ করুন');
      return;
    }

    try {
      await logActivity(
        'ওয়েবসাইট থেকে নতুন যোগাযোগ বার্তা',
        `${name} (${phone}) - বিষয়: ${subject || 'সাধারণ অনুসন্ধান'}`,
        name,
        'committee'
      );
      setSubmitted(true);
      success('আপনার বার্তা সফলভাবে প্রেরণ করা হয়েছে। ধন্যবাদ।');
    } catch (err) {
      error('বার্তা পাঠাতে সমস্যা হয়েছে। হটলাইনে কল করুন।');
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Phone className="w-3.5 h-3.5 text-emerald-700" />
          <span>যোগাযোগ ও কন্ট্রোল রুম</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          আমাদের সাথে যোগাযোগ করুন
        </h1>
        <p className="mt-3 text-base text-slate-600 font-medium">
          পবিত্র ঈদের জামাত, মাঠ ব্যবহারের অনুমতি, অনুদান বা যেকোনো অনুসন্ধানে আমাদের হেল্পলাইনে যোগাযোগ করুন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-100">
              ঈদগাহ প্রশাসনিক কার্যালয়
            </h3>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">ঠিকানা ও অবস্থান:</h4>
                  <p className="text-xs leading-relaxed mt-0.5">{settings.addressBn}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">কন্ট্রোল রুম ও হটলাইন:</h4>
                  <a href={`tel:${settings.contactPhone}`} className="text-xs font-bold text-emerald-800 hover:underline">
                    {settings.contactPhone}
                  </a>
                  <p className="text-[11px] text-slate-400">প্রতিদিন সকাল ৯টা থেকে রাত ৯টা</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">অফিসিয়াল ইমেইল:</h4>
                  <a href={`mailto:${settings.contactEmail}`} className="text-xs font-medium text-emerald-800 hover:underline">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ওয়াকফ সনদ তথ্য:</span>
              </div>
              <p>{settings.waqfNumber}</p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
            সরাসরি বার্তা প্রেরণ করুন
          </h3>

          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">আপনার বার্তা গৃহীত হয়েছে!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                আমাদের দাপ্তরিক সমন্বয়ক অতি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setPhone('');
                  setSubject('');
                  setMessage('');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
              >
                আরেকটি বার্তা পাঠান
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="পূর্ণ নাম লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিষয়</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="বার্তার বিষয় (যেমন: জামাত তথ্য / ভলান্টিয়ার ইত্যাদি)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আপনার বক্তব্য বা বার্তা *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="বিস্তারিত লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা প্রেরণ করুন</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
