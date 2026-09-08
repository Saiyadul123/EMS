import React, { useState } from 'react';
import { LogIn, Key, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { PublicPage } from '../../../types';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (page: PublicPage) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const { signIn, signInWithGoogle } = useAuth();
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      success('গুগল অ্যাকাউন্ট দিয়ে সফলভাবে লগইন হয়েছে!');
      onLoginSuccess();
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      error(err.message || 'গুগল লগইন সম্পন্ন করা যায়নি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('ইমেইল ও পাসওয়ার্ড প্রদান করুন');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, password);
      success('সফলভাবে লগইন হয়েছে। স্বাগতম!');
      onLoginSuccess();
    } catch (err: any) {
      error(err.message || 'লগইন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন বা অ্যাডমিনের সাথে যোগাযোগ করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto space-y-8">
      {/* Title */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-amber-400 flex items-center justify-center mx-auto shadow-md border border-emerald-700/50 mb-4">
          <Sparkles className="w-7 h-7 text-amber-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          প্রশাসন ও কমিটি লগইন
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
          ঈদগাহ ম্যানেজমেন্ট সিস্টেম অ্যাডমিন ও পরিচালনা পরিষদ পোর্টাল
        </p>
      </div>

      {/* Login Form and Google Authentication */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-3 active:scale-98 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>গুগল দিয়ে লগইন করুন (Google Sign-In)</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-400 font-medium">অথবা ইমেইল দিয়ে</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">পাসওয়ার্ড</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-emerald-800 hover:underline font-semibold"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white font-english"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
