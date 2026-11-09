import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Sidebar } from './components/common/Sidebar';
import { ConsentModal } from './components/common/ConsentModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { RegulationsPage } from './pages/RegulationsPage';
import { CommunityPage } from './pages/CommunityPage';
import { OptimiserPage } from './pages/OptimiserPage';
import { CreditAllocationPage } from './pages/CreditAllocationPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

const RouterView: React.FC = () => {
  const { currentPath, isAuthenticated, navigateTo, currentUser } = useApp();
  const isPublicPath = currentPath === '/' || currentPath === '/login' || currentPath === '/signup';
  const needsOnboarding = currentUser?.needsOnboarding === true;
  const hasCompletedOnboarding = currentUser?.onboardingCompleted === true;

  useEffect(() => {
    if (!isAuthenticated && !isPublicPath) {
      navigateTo('/');
    } else if (isAuthenticated && (currentPath === '/login' || currentPath === '/signup')) {
      navigateTo('/dashboard');
    } else if (isAuthenticated && needsOnboarding && currentPath !== '/onboarding') {
      // Redirect to onboarding only for new signups
      navigateTo('/onboarding');
    } else if (isAuthenticated && hasCompletedOnboarding && currentPath === '/onboarding') {
      // Redirect away from onboarding if already completed
      navigateTo('/dashboard');
    }
  }, [currentPath, isAuthenticated, isPublicPath, needsOnboarding, hasCompletedOnboarding, navigateTo]);

  const getSubtitle = () => {
    switch (currentPath) {
      case '/':
        return 'Public Showcase';
      case '/dashboard':
        return 'Community solar command centre';
      case '/onboarding':
        return 'Location & profile setup';
      case '/assessment':
        return 'Solar feasibility calculator · F04';
      case '/regulations':
        return 'VNM readiness · F02';
      case '/community':
        return 'Community workspace · F01';
      case '/optimiser':
        return 'Benefit-aware plan optimiser · F05';
      case '/credit-allocation':
        return 'Credit reconciliation · F09';
      case '/monitoring':
        return 'Provider & O&M evidence · F07';
      case '/reports':
        return 'Statements & plan-vs-actual · F08/F10';
      case '/admin':
        return 'Rules, approvals & audit ledger';
      default:
        if (currentPath.startsWith('/community')) {
          return 'Community workspace · F01';
        }
        return 'Community solar command centre';
    }
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <LandingPage />;
      case '/login':
        return <LoginPage />;
      case '/signup':
        return <SignupPage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/onboarding':
        return <OnboardingPage />;
      case '/assessment':
        return <AssessmentPage />;
      case '/regulations':
        return <RegulationsPage />;
      case '/community':
        return <CommunityPage />;
      case '/optimiser':
        return <OptimiserPage />;
      case '/credit-allocation':
        return <CreditAllocationPage />;
      case '/monitoring':
        return <MonitoringPage />;
      case '/reports':
        return <ReportsPage />;
      case '/admin':
        return <AdminPage />;
      default:
        if (currentPath.startsWith('/community')) {
          return <CommunityPage />;
        }
        return <DashboardPage />;
    }
  };

  const showAppShell = isAuthenticated && !isPublicPath;
  const content = !isAuthenticated && !isPublicPath ? <LandingPage /> : renderContent();

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1C2930] flex flex-col antialiased selection:bg-[#9af4d8] selection:text-[#00725d]">
      {showAppShell ? (
        <>
          <Header subtitle={getSubtitle()} />
          <main className="flex-1 w-full pt-20 pb-20 md:pb-8">
            {content}
          </main>
          <Sidebar />
          <BottomNav />
          <ConsentModal />
        </>
      ) : (
        <main className="flex-1 w-full">{content}</main>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <RouterView />
    </AppProvider>
  );
}
