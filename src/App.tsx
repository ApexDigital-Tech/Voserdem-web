import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Projects from './components/Projects';
import DonationForm from './components/DonationForm';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import HowToHelp from './components/HowToHelp';
import Blog from './components/Blog';
import Bulletins from './components/Bulletins';
import Footer from './components/Footer';
import { LogoConfig } from './types';

// Default logo config used before the first API response arrives (avoids flash)
const defaultLogoConfig: LogoConfig = {
  logoColor: {
    brandName: 'VOSERDEM',
    slogan: 'Voluntarios al Servicio de los Dem\u00e1s',
    useCustomImage: false,
    imageUrl: ''
  },
  logoGold: {
    brandName: 'VOSERDEM',
    slogan: 'Unidos por Bolivia',
    useCustomImage: false,
    imageUrl: ''
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('about');
  const [preselectedProjectId, setPreselectedProjectId] = useState<string>('');
  // Logos loaded once at app level — prevents flash-of-SVG in Navbar/Footer
  const [logoConfig, setLogoConfig] = useState<LogoConfig>(defaultLogoConfig);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const refreshLogos = useCallback(() => {
    fetch('/api/logos')
      .then(res => res.json())
      .then(data => setLogoConfig(data))
      .catch(() => {}) // silently keep defaults
      .finally(() => setIsInitialLoading(false));
  }, []);

  useEffect(() => {
    refreshLogos();
    // Re-fetch when admin saves branding
    window.addEventListener('logo-updated', refreshLogos);
    return () => window.removeEventListener('logo-updated', refreshLogos);
  }, [refreshLogos]);

  // Scroll to top instantly on every navigation
  const navigate = useCallback((tab: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setActiveTab(tab);
  }, []);

  const navigateToDonateWithProject = (projectId: string) => {
    setPreselectedProjectId(projectId);
    navigate('donate');
  };

  const handleSuccessRedirect = () => {
    setPreselectedProjectId('');
    navigate('projects');
  };

  if (isInitialLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F2ED]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3022]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Top sticky Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'donate') setPreselectedProjectId('');
          navigate(tab);
        }}
        logoConfig={logoConfig}
      />

      {/* Main Tab Render Flow */}
      <main className="flex-grow">
        {activeTab === 'about' && (
          <div className="animate-fade-in">
            <Hero 
              onLearnMore={() => setActiveTab('projects')} 
              onDonate={() => setActiveTab('donate')} 
            />
            <AboutUs 
              onDonateClick={() => navigate('donate')}
              onProjectsClick={() => navigate('projects')}
              onBlogClick={() => navigate('blog')}
              onBulletinsClick={() => navigate('boletines')}
            />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="animate-fade-in">
            <Projects onDonateSelect={navigateToDonateWithProject} />
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="animate-fade-in animate-duration-300">
            <Blog />
          </div>
        )}

        {activeTab === 'boletines' && (
          <div className="animate-fade-in animate-duration-300">
            <Bulletins />
          </div>
        )}

        {activeTab === 'donate' && (
          <div className="animate-fade-in">
            <DonationForm 
              preselectedProjectId={preselectedProjectId} 
              onSuccessRedirect={handleSuccessRedirect} 
            />
          </div>
        )}

        {activeTab === 'how-to-help' && (
          <div className="animate-fade-in">
            <HowToHelp 
              onDonateClick={() => setActiveTab('donate')}
              onContactClick={() => setActiveTab('contact')}
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="animate-fade-in">
            <Contact />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <AdminPanel />
          </div>
        )}
      </main>

      {/* Global Branded Footer */}
      <Footer
        setActiveTab={navigate}
        logoConfig={logoConfig}
      />
    </div>
  );
}
