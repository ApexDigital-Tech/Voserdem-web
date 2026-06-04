import React, { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('about');
  const [preselectedProjectId, setPreselectedProjectId] = useState<string>('');

  const navigateToDonateWithProject = (projectId: string) => {
    setPreselectedProjectId(projectId);
    setActiveTab('donate');
  };

  const handleSuccessRedirect = () => {
    setPreselectedProjectId('');
    setActiveTab('projects');
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Top sticky Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={(tab) => {
        // Reset preselected projects if moving elsewhere
        if (tab !== 'donate') setPreselectedProjectId('');
        setActiveTab(tab);
      }} />

      {/* Main Tab Render Flow */}
      <main className="flex-grow">
        {activeTab === 'about' && (
          <div className="animate-fade-in">
            <Hero 
              onLearnMore={() => setActiveTab('projects')} 
              onDonate={() => setActiveTab('donate')} 
            />
            <AboutUs 
              onDonateClick={() => setActiveTab('donate')}
              onProjectsClick={() => setActiveTab('projects')}
              onBlogClick={() => {
                setActiveTab('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBulletinsClick={() => {
                setActiveTab('boletines');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
      <Footer setActiveTab={(tab) => {
        if (tab !== 'donate') setPreselectedProjectId('');
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
