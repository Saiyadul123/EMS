import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../../types';
import { X, Shield, User, Mail, Phone, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  user: Partial<UserProfile> | null;
  onClose: () => void;
  onSave: (userData: UserProfile) => Promise<void>;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    displayName: '',
    email: '',
    role: 'admin',
    designation: '',
    phone: '',
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        uid: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        role: user.role || 'admin',
        designation: user.designation || '',
        phone: user.phone || '',
        status: user.status || 'active',
        createdAt: user.createdAt
      });
    } else {
      setFormData({
        displayName: '',
        email: '',
        role: 'admin',
        designation: '',
        phone: '',
        status: 'active'
      });
    }
    setValidationError('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName?.trim()) {
      setValidationError('অনুগ্রহ করে ব্যবহারকারীর পুরো নাম লিখুন।');
      return;
    }
    if (!formData.email?.trim() || !formData.email.includes('@')) {
      setValidationError('সঠিক ইমেইল ঠিকানা প্রদান করুন (লগইনের জন্য প্রযোজ্য)।');
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError('');
      const profileToSave: UserProfile = {
        uid: formData.uid || `usr-${Date.now()}`,
        displayName: formData.displayName.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role || 'admin',
        designation: formData.designation?.trim() || '',
        phone: formData.phone?.trim() || '',
        status: formData.status || 'active',
        createdAt: formData.createdAt || new Date().toISOString()
      };
      await onSave(profileToSave);
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'ইউজার সংরক্ষণ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(user?.uid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-amber-300 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isEditing ? 'ব্যবহারকারী তথ্য সম্পাদনা' : 'নতুন অ্যাডমিন বা কমিটি সদস্য যোগ'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                সুপার অ্যাডমিন কর্তৃক দায়িত্ব ও রোল নির্ধারণ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4.5 mt-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              পুরো নাম <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="যেমন: আলহাজ্ব মো: কামরুল ইসলাম"
                value={formData.displayName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ইমেইল ঠিকানা <span className="text-rose-500">*</span> (লগইনে ব্যবহৃত হবে)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@eidgah.org.bd বা gmail ঠিকানা"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-english focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-800"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              ব্যবহারকারী এই ইমেইল দিয়ে গুগল বা ইমেইল লগইন করলে স্বয়ংক্রিয়ভাবে নির্ধারিত পারমিশন পাবেন।
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ভূমিকা ও অ্যাক্সেস পারমিশন <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Admin */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  formData.role === 'admin'
                    ? 'border-sky-600 bg-sky-50 text-sky-950 ring-2 ring-sky-600/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">অ্যাডমিনিস্ট্রেটর</span>
                  {formData.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  কন্টেন্ট, জামাত, অনুদান ও আয়-ব্যয় ব্যবস্থাপনা
                </p>
              </button>

              {/* Committee Member */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'committee' }))}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  formData.role === 'committee'
                    ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">কমিটি সদস্য</span>
                  {formData.role === 'committee' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  অনুমোদিত ড্যাশবোর্ড ও রিপোর্ট দেখার অধিকার
                </p>
              </button>

              {/* Super Admin */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'super_admin' }))}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  formData.role === 'super_admin'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-700/30'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">সুপার অ্যাডমিন</span>
                  {formData.role === 'super_admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  সম্পূর্ণ ২০টি মডিউল ও ইউজার কন্ট্রোল
                </p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Designation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">পদবি / দায়িত্ব</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="যেমন: যুগ্ম সাধারণ সম্পাদক"
                  value={formData.designation || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">মোবাইল নম্বর</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="০১৭১১-XXXXXX"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-english focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">অ্যাকাউন্ট স্ট্যাটাস</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="user_status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={() => setFormData(prev => ({ ...prev, status: 'active' }))}
                  className="text-emerald-700 focus:ring-emerald-600"
                />
                <span>সক্রিয় (Active)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="user_status"
                  value="suspended"
                  checked={formData.status === 'suspended'}
                  onChange={() => setFormData(prev => ({ ...prev, status: 'suspended' }))}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>স্থগিত (Suspended)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : isEditing ? 'আপডেট সংরক্ষণ করুন' : 'অ্যাডমিন/কমিটি সদস্য যুক্ত করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
