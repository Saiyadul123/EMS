import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { PublicPage } from '../../../types';

interface ForgotPasswordPageProps {
  onNavigate: (page: PublicPage) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('ইমেইল ঠিকানা লিখুন');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setIsSent(true);
      success('পাসওয়ার্ড রিস্টার্ট লিংক আপনার ইমেইলে পাঠানো হয়েছে।');
    } catch (err: any) {
      error(err.message || 'লিংক পাঠাতে ব্যর্থ হয়েছে। ইমেইল ঠিকানাটি পুনরায় পরীক্ষা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          পাসওয়ার্ড পুনরুদ্ধার
        </h2>
        <p className="mt-2 text-xs text-slate-500 font-medium">
          আপনার নিবন্ধিত ইমেইল ঠিকানা প্রবেশ করিয়ে পাসওয়ার্ড রিসেট লিংক গ্রহণ করুন
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {isSent ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ইমেইল পাঠানো হয়েছে!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="font-english font-bold text-slate-700">{email}</span> ঠিকানায় পাসওয়ার্ড রিসেট নির্দেশনা পাঠানো হয়েছে। ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>লগইন পেজে ফিরে যান</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@eidgah.org.bd"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white font-english"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs text-slate-500 hover:text-emerald-800 font-semibold"
              >
                লগইন পেজে ফিরে যান
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
