import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  Download,
  Printer,
  Copy,
  Building,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SystemSettings, DonationRecord } from '../../../types';
import { submitDonation, logActivity } from '../../../services/db';
import { useToast } from '../../../context/ToastContext';

interface DonationPageProps {
  settings: SystemSettings;
  initialAmount?: number;
}

export const DonationPage: React.FC<DonationPageProps> = ({ settings, initialAmount = 1000 }) => {
  const { success, error } = useToast();
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [amount, setAmount] = useState(initialAmount.toString());
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash'>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [purpose, setPurpose] = useState<'general' | 'development' | 'zakat' | 'beautification'>('development');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<DonationRecord | null>(null);

  const presets = [500, 1000, 2000, 5000, 10000];

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      error('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন');
      return;
    }
    if (!donorPhone.trim()) {
      error('অনুগ্রহ করে আপনার মোবাইল নম্বর লিখুন');
      return;
    }
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      error('সঠিক অনুদানের পরিমাণ প্রদান করুন');
      return;
    }

    try {
      setIsSubmitting(true);
      const record = await submitDonation({
        donorName: donorName.trim(),
        donorPhone: donorPhone.trim(),
        amount: parsedAmount,
        paymentMethod,
        transactionId: transactionId.trim() || `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        purpose,
        notes: notes.trim()
      });

      await logActivity(
        'নতুন অনলাইন অনুদান গৃহীত',
        `${donorName} থেকে ৳${parsedAmount.toLocaleString('bn-BD')} (${paymentMethod}) রসিদ: ${record.receiptNo}`,
        donorName,
        'committee'
      );

      setCompletedReceipt(record);
      success('আলহামদুলিল্লাহ! আপনার অনুদান সফলভাবে গৃহীত হয়েছে।');
    } catch (err: any) {
      error('অনুদানের তথ্য সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} কপি করা হয়েছে`);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Heart className="w-3.5 h-3.5 fill-emerald-700 text-emerald-700" />
          <span>সদকায়ে জারিয়া ও উন্নয়ন তহবিল</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          ঈদগাহের উন্নয়নে মুক্তহস্তে দান করুন
        </h1>
        <p className="mt-3 text-base text-slate-600 font-medium leading-relaxed">
          "যারা আল্লাহর সন্তুষ্টির উদ্দেশ্যে দান করে, তাদের উপমা একটি শস্যবীজের ন্যায় যা সাতটি শীষ উৎপাদন করে..." — আল-কুরআন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Donation Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md">
          <h2 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
            অনলাইন অনুদানের বিবরণ দিন
          </h2>

          <form onSubmit={handleDonationSubmit} className="space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                অনুদানের পরিমাণ (টাকা):
              </label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p.toString())}
                    className={`py-2 text-center rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                      amount === p.toString()
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ৳{p}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                <input
                  type="number"
                  required
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="অন্যান্য যেকোনো পরিমাণ লিখুন"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                অনুদানের খাত/উদ্দেশ্য:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'development', label: 'মিনার ও অবকাঠামো উন্নয়ন' },
                  { key: 'general', label: 'ঈদ জামাত ও সাধারণ পরিচালন' },
                  { key: 'zakat', label: 'দরিদ্র সহায়তা ও যাকাত' },
                  { key: 'beautification', label: 'সৌন্দর্যবর্ধন ও বাগান' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPurpose(item.key as any)}
                    className={`p-3 text-left rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      purpose === item.key
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                পেমেন্ট পদ্ধতি:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'bKash', label: 'বিকাশ' },
                  { key: 'Nagad', label: 'নগদ' },
                  { key: 'Rocket', label: 'রকেট' },
                  { key: 'Bank', label: 'ব্যাংক' }
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setPaymentMethod(m.key as any)}
                    className={`py-2.5 text-center rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                      paymentMethod === m.key
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Donor Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  দানকারী / আপনার পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="যেমন: হাজী আব্দুল করিম"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর (রসিদের জন্য) *
                </label>
                <input
                  type="text"
                  required
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="যেমন: 017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ট্রানজেকশন আইডি (TrxID) / রেফারেন্স নম্বর:
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="বিকাশ/নগদের TrxID অথবা ব্যাংকের জমা রশিদ নম্বর (প্রযোজ্য ক্ষেত্রে)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white font-english"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isSubmitting ? 'প্রক্রিয়াধীন...' : `৳${amount} টাকা দান সম্পন্ন করুন ও রসিদ পান`}</span>
            </button>
          </form>
        </div>

        {/* Right Info: Official Merchant Accounts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-md border border-slate-800">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-800 text-amber-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">ঈদগাহের অফিশিয়াল মার্চেন্ট নম্বর</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold">বিকাশ মার্চেন্ট একাউন্ট:</span>
                  <div className="text-base font-bold text-amber-300 font-english mt-0.5">
                    {settings.bkashMerchantNumber}
                  </div>
                  <span className="text-[11px] text-slate-400">মেক পেমেন্ট অপশন ব্যবহার করুন</span>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.bkashMerchantNumber.split(' ')[0], 'বিকাশ নম্বর')}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  title="কপি করুন"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold">নগদ মার্চেন্ট একাউন্ট:</span>
                  <div className="text-base font-bold text-amber-300 font-english mt-0.5">
                    {settings.nagadMerchantNumber}
                  </div>
                  <span className="text-[11px] text-slate-400">পেমেন্ট অপশন ব্যবহার করুন</span>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.nagadMerchantNumber.split(' ')[0], 'নগদ নম্বর')}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  title="কপি করুন"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold">রকেট একাউন্ট:</span>
                  <div className="text-base font-bold text-amber-300 font-english mt-0.5">
                    {settings.rocketMerchantNumber}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.rocketMerchantNumber, 'রকেট নম্বর')}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  title="কপি করুন"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">ব্যাংক হিসাবের বিবরণ</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {settings.bankAccountDetails}
            </p>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>বাংলাদেশ ওয়াকফ প্রশাসন কর্তৃক অনুমোদিত প্রাতিষ্ঠানিক ব্যাংক একাউন্ট</span>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Money Receipt Modal */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 text-slate-800 space-y-6">
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">{settings.eidgahNameBn}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                অফিসিয়াল ডিজিটাল মানি রসিদ (Money Receipt)
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                ওয়াকফ সনদ: {settings.waqfNumber.split('/')[0]}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">রসিদ নম্বর:</span>
                <span className="font-bold text-slate-900 font-english">{completedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">তারিখ:</span>
                <span className="font-bold text-slate-900">{completedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">দানকারীর নাম:</span>
                <span className="font-bold text-slate-900">{completedReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মোবাইল:</span>
                <span className="font-bold text-slate-900 font-english">{completedReceipt.donorPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">অনুদানের খাত:</span>
                <span className="font-bold text-emerald-800">
                  {completedReceipt.purpose === 'development' ? 'মিনার ও অবকাঠামো উন্নয়ন' : 'সাধারণ ঈদগাহ তহবিল'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
                <span className="font-bold text-slate-900">{completedReceipt.paymentMethod}</span>
              </div>
              {completedReceipt.transactionId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">TrxID / রেফারেন্স:</span>
                  <span className="font-bold text-slate-900 font-english">{completedReceipt.transactionId}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
                <span className="font-bold text-slate-800">মোট গৃহীত অংক:</span>
                <span className="font-black text-emerald-800 text-base">
                  ৳{completedReceipt.amount.toLocaleString('bn-BD')} টাকা
                </span>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400 italic">
              "মহান রাব্বুল আলামিন আপনার এই পবিত্র দানকে সদকায়ে জারিয়া হিসেবে কবুল করুন। আমিন।"
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                onClick={() => setCompletedReceipt(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors"
              >
                সম্পন্ন হয়েছে
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
