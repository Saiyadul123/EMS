import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import {
  PublicPage,
  AdminSection,
  SystemSettings,
  AboutEidgahData,
  CommitteeMember,
  EidPrayerInfo,
  NoticeItem,
  DevelopmentProject,
  DonationRecord,
  WalletAccount,
  IncomeRecord,
  ExpenseRecord,
  CommunityEvent,
  MeetingItem,
  DocumentItem,
  GalleryItem,
  FinanceRecord,
  PublicFinancialReport
} from './types';
import {
  getSystemSettings,
  getAboutData,
  getCommitteeMembers,
  getPrayerInfo,
  getNotices,
  getProjects,
  getDonations,
  getWallets,
  getIncomes,
  getExpenses,
  getEvents,
  getMeetings,
  getDocuments,
  getGallery,
  getPublicFinancialReports
} from './services/db';
import { INITIAL_FINANCIAL_REPORTS } from './services/seedData';

// Public Components
import { Header } from './components/public/Header';
import { Footer } from './components/public/Footer';
import { HomePage } from './components/public/pages/HomePage';
import { AboutPage } from './components/public/pages/AboutPage';
import { CommitteePage } from './components/public/pages/CommitteePage';
import { GalleryPage } from './components/public/pages/GalleryPage';
import { NoticesPage } from './components/public/pages/NoticesPage';
import { PrayerInfoPage } from './components/public/pages/PrayerInfoPage';
import { DonationPage } from './components/public/pages/DonationPage';
import { ProjectsPage } from './components/public/pages/ProjectsPage';
import { EventsPage } from './components/public/pages/EventsPage';
import { ContactPage } from './components/public/pages/ContactPage';
import { ReportsPage } from './components/public/pages/ReportsPage';
import { LoginPage } from './components/public/pages/LoginPage';
import { ForgotPasswordPage } from './components/public/pages/ForgotPasswordPage';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardView } from './components/admin/views/DashboardView';
import { UsersView } from './components/admin/views/UsersView';
import { CommitteeView } from './components/admin/views/CommitteeView';
import { AboutView } from './components/admin/views/AboutView';
import { GalleryView } from './components/admin/views/GalleryView';
import { NoticeView } from './components/admin/views/NoticeView';
import { PrayerInfoView } from './components/admin/views/PrayerInfoView';
import { DonationView } from './components/admin/views/DonationView';
import { FinanceView } from './components/admin/views/FinanceView';
import { ProjectsView } from './components/admin/views/ProjectsView';
import { EventsAndMeetingsView } from './components/admin/views/EventsAndMeetingsView';
import { DocumentsView } from './components/admin/views/DocumentsView';
import { SystemView } from './components/admin/views/SystemView';

import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { userProfile, userRole } = useAuth();

  // Navigation State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<PublicPage>('home');
  const [currentAdminSection, setCurrentAdminSection] = useState<AdminSection>('dashboard');
  const [donationInitialAmount, setDonationInitialAmount] = useState<number>(1000);

  // Data state
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [aboutData, setAboutData] = useState<AboutEidgahData | null>(null);
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [prayerInfo, setPrayerInfo] = useState<EidPrayerInfo | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [wallets, setWallets] = useState<WalletAccount[]>([]);
  const [incomes, setIncomes] = useState<IncomeRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [financialReports, setFinancialReports] = useState<PublicFinancialReport[]>(INITIAL_FINANCIAL_REPORTS);

  const loadAllData = async () => {
    try {
      const [
        s,
        ab,
        c,
        pi,
        n,
        pr,
        don,
        w,
        inc,
        exp,
        ev,
        meet,
        docs,
        gal,
        finRep
      ] = await Promise.all([
        getSystemSettings(),
        getAboutData(),
        getCommitteeMembers(),
        getPrayerInfo(),
        getNotices(),
        getProjects(),
        getDonations(),
        getWallets(),
        getIncomes(),
        getExpenses(),
        getEvents(),
        getMeetings(),
        getDocuments(),
        getGallery(),
        getPublicFinancialReports()
      ]);

      setSettings(s);
      setAboutData(ab);
      setCommittee(c);
      setPrayerInfo(pi);
      setNotices(n);
      setProjects(pr);
      setDonations(don);
      setWallets(w);
      setIncomes(inc);
      setExpenses(exp);
      setEvents(ev);
      setMeetings(meet);
      setDocuments(docs);
      setGallery(gal);
      setFinancialReports(finRep);
    } catch (err) {
      console.error('Error fetching Eidgah data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (settings?.eidgahNameBn) {
      document.title = settings.eidgahNameBn;
    }
  }, [settings?.eidgahNameBn]);

  const handleNavigatePublic = (page: PublicPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickDonate = (amount: number) => {
    setDonationInitialAmount(amount);
    setCurrentPage('donation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !settings || !aboutData || !prayerInfo) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-4 text-white select-none">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-700 to-slate-900 flex items-center justify-center text-amber-400 shadow-xl border border-emerald-600/30 animate-pulse mb-4">
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">ঈদগাহ ম্যানেজমেন্ট সিস্টেম</h2>
        <p className="text-xs text-emerald-300 mt-1 font-medium">তথ্য ও ডেটাবেস লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
      </div>
    );
  }

  // Combined Finance Records for FinanceView
  const financeRecords: FinanceRecord[] = [
    ...incomes.map(inc => ({
      id: inc.id,
      type: 'income' as const,
      title: inc.source,
      amount: inc.amount,
      date: inc.date,
      voucherNo: inc.voucherNo,
      approvedBy: inc.receivedBy,
      description: inc.description,
      account: 'Islami Bank',
      category: inc.category
    })),
    ...expenses.map(exp => ({
      id: exp.id,
      type: 'expense' as const,
      title: exp.purpose,
      amount: exp.amount,
      date: exp.date,
      voucherNo: exp.voucherNo,
      approvedBy: exp.approvedBy,
      description: exp.description,
      account: 'Sonali Bank',
      category: exp.category
    }))
  ];

  // -------------------------
  // ADMIN PANEL ROUTING
  // -------------------------
  if (isAdminMode) {
    return (
      <AdminLayout
        currentSection={currentAdminSection}
        onSelectSection={(sec) => setCurrentAdminSection(sec)}
        onExitAdmin={() => setIsAdminMode(false)}
      >
        {currentAdminSection === 'dashboard' && (
          <DashboardView
            wallets={wallets}
            donations={donations}
            prayerInfo={prayerInfo}
            projects={projects}
            notices={notices}
            settings={settings}
            onNavigateSection={(sec) => setCurrentAdminSection(sec)}
          />
        )}

        {currentAdminSection === 'users' && <UsersView />}

        {currentAdminSection === 'committee' && (
          <CommitteeView committee={committee} onRefresh={loadAllData} />
        )}

        {currentAdminSection === 'about' && (
          <AboutView aboutInfo={aboutData} onRefresh={loadAllData} />
        )}

        {currentAdminSection === 'gallery' && (
          <GalleryView gallery={gallery} onRefresh={loadAllData} />
        )}

        {currentAdminSection === 'notices' && (
          <NoticeView notices={notices} onRefresh={loadAllData} />
        )}

        {currentAdminSection === 'prayer-info' && (
          <PrayerInfoView prayerInfo={prayerInfo} onRefresh={loadAllData} />
        )}

        {currentAdminSection === 'donations' && (
          <DonationView donations={donations} settings={settings} onRefresh={loadAllData} />
        )}

        {(currentAdminSection === 'income' ||
          currentAdminSection === 'expense' ||
          currentAdminSection === 'wallet' ||
          currentAdminSection === 'reports') && (
          <FinanceView
            mode={
              currentAdminSection === 'income'
                ? 'income'
                : currentAdminSection === 'expense'
                ? 'expense'
                : currentAdminSection === 'wallet'
                ? 'wallet'
                : 'reports'
            }
            records={financeRecords}
            wallets={wallets}
            reports={financialReports}
            onRefresh={loadAllData}
            onViewPublicReports={() => {
              setIsAdminMode(false);
              handleNavigatePublic('reports');
            }}
          />
        )}

        {currentAdminSection === 'projects' && (
          <ProjectsView projects={projects} onRefresh={loadAllData} />
        )}

        {(currentAdminSection === 'events' || currentAdminSection === 'meetings') && (
          <EventsAndMeetingsView
            initialTab={currentAdminSection === 'meetings' ? 'meetings' : 'events'}
            events={events}
            meetings={meetings as any}
            onRefresh={loadAllData}
          />
        )}

        {currentAdminSection === 'documents' && (
          <DocumentsView documents={documents as any} onRefresh={loadAllData} />
        )}

        {(currentAdminSection === 'logs' ||
          currentAdminSection === 'notifications' ||
          currentAdminSection === 'builder-info' ||
          currentAdminSection === 'settings') && (
          <SystemView
            mode={
              currentAdminSection === 'logs'
                ? 'logs'
                : currentAdminSection === 'notifications'
                ? 'notifications'
                : currentAdminSection === 'builder-info'
                ? 'builder-info'
                : 'settings'
            }
            settings={settings}
            onRefresh={loadAllData}
          />
        )}
      </AdminLayout>
    );
  }

  // -------------------------
  // PUBLIC WEBSITE ROUTING
  // -------------------------
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-800 selection:text-white">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigatePublic}
        onOpenAdmin={() => setIsAdminMode(true)}
        settings={settings}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            prayerInfo={prayerInfo}
            notices={notices}
            projects={projects}
            committee={committee}
            gallery={gallery}
            settings={settings}
            reports={financialReports}
            incomes={incomes}
            expenses={expenses}
            onNavigate={handleNavigatePublic}
            onQuickDonate={handleQuickDonate}
            onRefreshReports={loadAllData}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage aboutData={aboutData} settings={settings} />
        )}

        {currentPage === 'committee' && (
          <CommitteePage committee={committee} />
        )}

        {currentPage === 'prayer-info' && (
          <PrayerInfoPage prayerInfo={prayerInfo} settings={settings} />
        )}

        {currentPage === 'notices' && (
          <NoticesPage notices={notices} />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage gallery={gallery} />
        )}

        {currentPage === 'donation' && (
          <DonationPage settings={settings} initialAmount={donationInitialAmount} />
        )}

        {currentPage === 'reports' && (
          <ReportsPage
            reports={financialReports}
            settings={settings}
            incomes={incomes}
            expenses={expenses}
            auditDocuments={documents.filter(d => d.category === 'audit')}
            onNavigate={handleNavigatePublic}
            onRefreshReports={loadAllData}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage
            projects={projects}
            onDonateToProject={() => handleQuickDonate(5000)}
          />
        )}

        {currentPage === 'events' && (
          <EventsPage events={events} />
        )}

        {currentPage === 'contact' && (
          <ContactPage settings={settings} />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onLoginSuccess={() => {
              setIsAdminMode(true);
              setCurrentAdminSection('dashboard');
            }}
            onNavigate={handleNavigatePublic}
          />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPasswordPage onNavigate={handleNavigatePublic} />
        )}
      </main>

      <Footer settings={settings} onNavigate={handleNavigatePublic} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
