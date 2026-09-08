import React from 'react';
import { Sparkles, Phone, Mail, MapPin, Heart, ShieldCheck, ExternalLink } from 'lucide-react';
import { PublicPage, SystemSettings } from '../../types';

interface FooterProps {
  onNavigate: (page: PublicPage) => void;
  settings: SystemSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-emerald-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Identity & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 border border-emerald-700/60 shadow-inner">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {settings.eidgahNameBn}
              </h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              ঐতিহাসিক শাহী ঈদগাহ ময়দান বাংলাদেশ ওয়াকফ প্রশাসনের তালিকাভুক্ত একটি ঐতিহ্যবাহী ধর্মীয় ও সামাজিক প্রতিষ্ঠান। প্রতি বছর লক্ষাধিক মুসল্লির সুশৃঙ্খল ঈদ জামাত আয়োজনে এটি নিবেদিত।
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800/80 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ওয়াকফ রেজিস্ট্রেশন: {settings.waqfNumber}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">
              প্রয়োজনীয় লিংক
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ঈদগাহের ইতিহাস ও অবকাঠামো
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('prayer-info')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ঈদের জামাতের সময়সূচি ও নিয়মাবলী
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('committee')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  পরিচালনা পরিষদ ও উপদেষ্টা কমিটি
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  উন্নয়ন ও মিনার নির্মাণ প্রকল্প
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reports')}
                  className="hover:text-emerald-400 transition-colors text-amber-300 font-medium"
                >
                  আর্থিক রিপোর্ট ও অডিট বিবরণী
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('notices')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  সর্বশেষ বিজ্ঞপ্তি ও নোটিশ বোর্ড
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ফটো ও ভিডিও গ্যালারি
                </button>
              </li>
            </ul>
          </div>

          {/* Donation & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">
              অনুদান ও তহবিল
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              ঈদগাহের উন্নয়ন ও সংস্কারে মুক্তহস্তে সদকায়ে জারিয়া হিসেবে আপনার যাকাত বা অনুদান প্রদান করুন।
            </p>
            <div className="space-y-2 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-300">
                <span>বিকাশ (মার্চেন্ট):</span>
                <span className="font-bold text-amber-300">{settings.bkashMerchantNumber}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>নগদ (মার্চেন্ট):</span>
                <span className="font-bold text-amber-300">{settings.nagadMerchantNumber}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>রকেট:</span>
                <span className="font-bold text-amber-300">{settings.rocketMerchantNumber}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('donation')}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>অনলাইনে রশিদসহ দান করুন</span>
            </button>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">
              যোগাযোগ ও ঠিকানা
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span className="text-xs leading-relaxed">{settings.addressBn}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.contactPhone}`} className="text-xs hover:text-white">
                  {settings.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="text-xs hover:text-white">
                  {settings.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.eidgahNameBn}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-slate-400 transition-colors"
            >
              জরুরি যোগাযোগ
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('login')}
              className="hover:text-slate-400 transition-colors"
            >
              প্রশাসন পোর্টাল
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
