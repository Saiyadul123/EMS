import React, { useState } from 'react';
import {
  Menu,
  X,
  Phone,
  Calendar,
  LogIn,
  LayoutDashboard,
  Heart,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { PublicPage, SystemSettings } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentPage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  onOpenAdmin: () => void;
  settings: SystemSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenAdmin,
  settings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile } = useAuth();

  const navLinks: { page: PublicPage; label: string; icon?: any }[] = [
    { page: 'home', label: 'হোম' },
    { page: 'about', label: 'ঈদগাহ পরিচিতি' },
    { page: 'prayer-info', label: 'ঈদের জামাত' },
    { page: 'committee', label: 'কমিটি সদস্য' },
    { page: 'projects', label: 'উন্নয়ন প্রকল্প' },
    { page: 'reports', label: 'আর্থিক রিপোর্ট' },
    { page: 'notices', label: 'বিজ্ঞপ্তি' },
    { page: 'gallery', label: 'গ্যালারি' },
    { page: 'events', label: 'কর্মসূচি' },
    { page: 'contact', label: 'যোগাযোগ' }
  ];

  const handleNavClick = (page: PublicPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top Islamic Banner Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-emerald-200/90 font-medium">
            <span className="tracking-wide">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</span>
            <span className="hidden md:inline-block text-emerald-600">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-300">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              ১৪৪৭ হিজরি • ২০২৬ খ্রিষ্টাব্দ
            </span>
            <span className="hidden lg:inline-block text-emerald-600">|</span>
            <span className="hidden lg:inline-block text-emerald-200/80">
              ওয়াকফ রেজি: {settings.waqfNumber.split('/')[0]}
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-200">
            <a
              href={`tel:${settings.contactPhone}`}
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>জরুরি হটলাইন: {settings.contactPhone}</span>
            </a>
            {userProfile ? (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300 hover:bg-emerald-700 font-medium text-xs transition-colors border border-emerald-700"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>ড্যাশবোর্ড ({userProfile.displayName.split(' ')[0]})</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="inline-flex items-center gap-1 hover:text-amber-300 transition-colors font-medium"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>কমিটি লগইন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 flex items-center justify-center text-amber-400 shadow-md shadow-emerald-950/20 border border-emerald-700/50 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight group-hover:text-emerald-800 transition-colors">
                {settings.eidgahNameBn}
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {settings.taglineBn}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => handleNavClick('donation')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-md shadow-amber-600/20 transition-all hover:shadow-lg active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>দান করুন</span>
            </button>

            {userProfile ? (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-800" />
                <span>অ্যাডমিন প্যানেল</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 transition-colors"
              >
                <LogIn className="w-4 h-4 text-emerald-700" />
                <span>লগইন</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => handleNavClick('donation')}
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>দান</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-xl animate-fade-in">
          <div className="grid grid-cols-2 gap-1 mb-4">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('donation')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 shadow-sm"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>অনলাইনে অনুদান দিন</span>
            </button>
            {userProfile ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-emerald-900 bg-emerald-100 border border-emerald-300"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-800" />
                <span>অ্যাডমিন প্যানেলে প্রবেশ ({userProfile.displayName})</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-slate-700 bg-slate-100 border border-slate-200"
              >
                <LogIn className="w-4 h-4" />
                <span>কমিটি ও প্রশাসন লগইন</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
