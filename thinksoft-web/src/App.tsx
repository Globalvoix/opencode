import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InfrastructureSection } from './components/InfrastructureSection';
import { TrustedBrandsSection } from './components/TrustedBrandsSection';
import { Footer } from './components/Footer';
import { LoginModal, DownloadToast } from './components/Modals';
import { DownloadPage } from './components/DownloadPage';
import { ContactPage } from './components/ContactPage';
import { ApplyPage } from './components/ApplyPage';
import { PLATFORM_LABELS, type Download, startDownload } from './downloads';

type View = 'home' | 'download' | 'contact' | 'apply';

const VIEW_HASHES: Record<Exclude<View, 'home'>, string> = {
  download: 'download',
  contact: 'contact',
  apply: 'apply',
}

function viewFromLocation(): View {
  const hash = window.location.hash.replace('#', '')
  const path = window.location.pathname.replace(/\/$/, '')
  const match = (Object.entries(VIEW_HASHES) as [Exclude<View, 'home'>, string][]).find(
    ([, value]) => hash === value || path === `/${value}`,
  )
  return match?.[0] ?? 'home'
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>(() => viewFromLocation());
  const [activeModal, setActiveModal] = useState<'login' | null>(null);
  const [toastInfo, setToastInfo] = useState<{ title: string; platform: string } | null>(null);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

  // Sync view with URL hash for clean navigation
  useEffect(() => {
    const handleHashChange = () => setCurrentView(viewFromLocation());

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!toastInfo) return;
    const timeout = setTimeout(() => setToastInfo(null), 6000);
    return () => clearTimeout(timeout);
  }, [toastInfo]);

  const openDownloadPage = () => {
    window.location.hash = VIEW_HASHES.download;
    setCurrentView('download');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openContactPage = () => {
    window.location.hash = VIEW_HASHES.contact;
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openApplyPage = () => {
    window.location.hash = VIEW_HASHES.apply;
    setCurrentView('apply');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const closePage = () => {
    if (window.location.hash) window.history.pushState(null, '', window.location.pathname);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const download = (target: Download) => {
    startDownload(target);
    setToastInfo({
      title: target.title,
      platform: PLATFORM_LABELS[target.platform],
    });
  };

  // Secondary views render on their own, without the marketing chrome
  if (currentView === 'download') {
    return <DownloadPage onBack={closePage} onTriggerDownload={download} />;
  }

  if (currentView === 'contact') {
    return <ContactPage onBack={closePage} />;
  }

  if (currentView === 'apply') {
    return <ApplyPage onBack={closePage} />;
  }

  return (
    <div className="min-h-screen bg-white text-[#141414] flex flex-col selection:bg-[#D96B27]/20 selection:text-[#141414] antialiased">
      {/* Main Top Navigation */}
      <Navbar
        onOpenLogin={() => setActiveModal('login')}
        onOpenContactSales={openContactPage}
        onOpenTryThinksoft={openDownloadPage}
        onMenuStateChange={setIsProductMenuOpen}
      />

      {/* Page Content with smooth blur and dimming transition when menu opens */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-out origin-top ${
          isProductMenuOpen
            ? 'filter blur-[7px] brightness-[0.92] select-none pointer-events-none'
            : 'filter-none brightness-100'
        }`}
      >
        {/* Hero Content Section */}
        <Hero onOpenDownload={openDownloadPage} />

        {/* Infrastructure & Stack Showcase Section */}
        <InfrastructureSection />

        {/* Model provider wall */}
        <TrustedBrandsSection onLearnMore={openDownloadPage} />

        {/* Footer */}
        <Footer onGetStarted={() => setActiveModal('login')} onContact={openContactPage} />
      </div>

      {/* Interactive Modals & Toasts */}
      <LoginModal isOpen={activeModal === 'login'} onClose={() => setActiveModal(null)} />

      {toastInfo && (
        <DownloadToast
          fileName={`${toastInfo.title} · ${toastInfo.platform}`}
          architecture="Thinksoft"
          onClose={() => setToastInfo(null)}
        />
      )}
    </div>
  );
}
