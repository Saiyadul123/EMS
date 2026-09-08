import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Image,
  Bell,
  Clock,
  Heart,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  Building,
  Calendar,
  Briefcase,
  FileCheck,
  ShieldAlert,
  HelpCircle,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Shield
} from 'lucide-react';
import { AdminSection, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/Badge';

interface AdminLayoutProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

interface NavItem {
  key: AdminSection;
  label: string;
  icon: any;
  requiredRole?: UserRole;
  badge?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSection,
  onSelectSection,
  onExitAdmin,
  children
}) => {
  const { userProfile, userRole, logout, canAccess } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Grouped Navigation for the 20 modules
  const navGroups: { groupTitle: string; items: NavItem[] }[] = [
    {
      groupTitle: 'প্রধান নিয়ন্ত্রণ',
      items: [
        { key: 'dashboard', label: 'ড্যাশবোর্ড (Dashboard)', icon: LayoutDashboard }
      ]
    },
    {
      groupTitle: 'ইউজার ও পরিষদ',
      items: [
        { key: 'users', label: 'ইউজার ও ভূমিকা (Users)', icon: Users, requiredRole: 'super_admin' },
        { key: 'committee', label: 'কমিটি সদস্য (Committee)', icon: UserCheck }
      ]
    },
    {
      groupTitle: 'ওয়েবসাইট কন্টেন্ট',
      items: [
        { key: 'prayer-info', label: 'ঈদের জামাত (Prayer Info)', icon: Clock },
        { key: 'notices', label: 'নোটিশ ব্যবস্থাপনা (Notices)', icon: Bell },
        { key: 'about', label: 'ঈদগাহ পরিচিতি (About)', icon: FileText },
        { key: 'gallery', label: 'ফটো গ্যালারি (Gallery)', icon: Image }
      ]
    },
    {
      groupTitle: 'অর্থ ও তহবিল ব্যবস্থাপনা',
      items: [
        { key: 'donations', label: 'অনলাইন অনুদান (Donations)', icon: Heart },
        { key: 'income', label: 'আয়ের হিসাব (Income)', icon: TrendingUp },
        { key: 'expense', label: 'ব্যয়ের হিসাব (Expense)', icon: TrendingDown },
        { key: 'wallet', label: 'তহবিল ও ওয়ালেট (Wallet)', icon: Wallet },
        { key: 'reports', label: 'আর্থিক রিপোর্ট (Reports)', icon: PieChart }
      ]
    },
    {
      groupTitle: 'কার্যক্রম ও প্রকল্প',
      items: [
        { key: 'projects', label: 'উন্নয়ন প্রকল্প (Projects)', icon: Building },
        { key: 'events', label: 'কর্মসূচি (Events)', icon: Calendar },
        { key: 'meetings', label: 'কমিটির মিটিং (Meetings)', icon: Briefcase }
      ]
    },
    {
      groupTitle: 'নথিপত্র ও সিস্টেম',
      items: [
        { key: 'documents', label: 'দলিল ও অডিট (Documents)', icon: FileCheck },
        { key: 'logs', label: 'কার্যক্রম লগ (Activity Logs)', icon: ShieldAlert, requiredRole: 'super_admin' },
        { key: 'notifications', label: 'নোটিফিকেশন (Notifications)', icon: Bell },
        { key: 'builder-info', label: 'আর্কিটেকচার তথ্য (Builder Info)', icon: HelpCircle },
        { key: 'settings', label: 'সিস্টেম সেটিংস (Settings)', icon: Settings, requiredRole: 'admin' }
      ]
    }
  ];

  const handleNavClick = (key: AdminSection) => {
    onSelectSection(key);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm">ঈদগাহ অ্যাডমিন প্যানেল</span>
        </div>
        <button
          onClick={onExitAdmin}
          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-white"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>পাবলিক সাইট</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-400 font-bold border border-emerald-600/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">ঈদগাহ অ্যাডমিন</h2>
              <span className="text-[11px] text-emerald-400 font-medium">ম্যানেজমেন্ট পোর্টাল</span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Quick Info */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold text-sm border border-emerald-700 shrink-0">
            {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'A'}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-xs font-bold text-white truncate">
              {userProfile?.displayName || 'অ্যাডমিন'}
            </div>
            <div className="mt-0.5">
              <RoleBadge role={userRole || 'committee'} />
            </div>
          </div>
        </div>

        {/* Navigation Items Scroll Area */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider text-slate-400">
                {group.groupTitle}
              </div>
              {group.items.map((item) => {
                const isActive = currentSection === item.key;
                const Icon = item.icon;
                const isRestricted = item.requiredRole && !canAccess(item.requiredRole);

                if (isRestricted) return null;

                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>পাবলিক ওয়েবসাইট দেখুন</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Desktop Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              অ্যাডমিন পোর্টাল
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-800 capitalize">
              {currentSection.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>মূল পাবলিক ওয়েবসাইট দেখুন</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700">{userProfile?.displayName}</span>
              <RoleBadge role={userRole || 'committee'} />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
