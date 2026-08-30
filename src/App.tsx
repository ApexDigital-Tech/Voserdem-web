import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { api } from './services/api';
import { LogoConfig } from './types';
import { useReveal } from './hooks/useReveal';

const AboutUs = lazy(() => import('./components/AboutUs'));
const Projects = React.lazy(() => import('./components/Projects'));
const DonationForm = React.lazy(() => import('./components/DonationForm'));
const Contact = React.lazy(() => import('./components/Contact'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const HowToHelp = React.lazy(() => import('./components/HowToHelp'));
const NuestraObra = React.lazy(() => import('./components/NuestraObra'));
const ImpactoTerritorial = React.lazy(() => import('./components/ImpactoTerritorial'));
const Transparencia = React.lazy(() => import('./components/Transparencia'));
const Blog = React.lazy(() => import('./components/Blog'));

// Default logo config used before the first API response arrives (avoids flash)
const defaultLogoConfig: LogoConfig = {
  logoColor: {
    brandName: 'VOSERDEM',
    slogan: 'Voluntarios al Servicio de los Dem\u00e1s',
    useCustomImage: false,
    imageUrl: '',
  },
  logoGold: {
    brandName: 'VOSERDEM',
    slogan: 'Una Bolivia mejor es posible',
    useCustomImage: false,
    imageUrl: '',
  },
};

import ErrorBoundary from './components/ErrorBoundary';

const RouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <div className="flex flex-col space-y-4 animate-pulse w-full max-w-4xl mx-auto py-12">
          <div className="h-8 bg-[#C5A059]/20 w-1/3 rounded-[4px]"></div>
          <div className="h-64 bg-[#C5A059]/10 w-full rounded-[8px]"></div>
          <div className="h-4 bg-[#C5A059]/20 w-2/3 rounded-[4px]"></div>
          <div className="h-4 bg-[#C5A059]/20 w-1/2 rounded-[4px]"></div>
        </div>
      }
    >
      <motion.div
        className="w-full flex-1 flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </Suspense>
  </ErrorBoundary>
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [preselectedProjectId, setPreselectedProjectId] = useState<string>('');

  useReveal();

  const [logoConfig, setLogoConfig] = useState<LogoConfig>(defaultLogoConfig);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const refreshLogos = useCallback(() => {
    api
      .get<LogoConfig>('/api/logos')
      .then((res) => {
        if (res.success && res.data) setLogoConfig(res.data);
      })
      .catch(() => {}) 
      .finally(() => setIsInitialLoading(false));
  }, []);

  useEffect(() => {
    refreshLogos();
    window.addEventListener('logo-updated', refreshLogos);
    return () => window.removeEventListener('logo-updated', refreshLogos);
  }, [refreshLogos]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  const navigateToDonateWithProject = (projectId: string) => {
    setPreselectedProjectId(projectId);
    navigate('/donar');
  };

  const handleSuccessRedirect = () => {
    setPreselectedProjectId('');
    navigate('/programas');
  };

  if (isInitialLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F2ED]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3022]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Toaster position="top-right" />
      <Navbar logoConfig={logoConfig} />

      <main className="flex-1 w-full flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <RouteWrapper>
                  <Hero
                    onLearnMore={() => navigate('/programas')}
                    onDonate={() => navigate('/donar')}
                  />
                  <AboutUs
                    onDonateClick={() => navigate('/donar')}
                    onProjectsClick={() => navigate('/programas')}
                    onBlogClick={() => navigate('/blog')}
                    onBulletinsClick={() => navigate('/transparencia')}
                  />
                </RouteWrapper>
              }
            />
            <Route
              path="/nuestra-obra"
              element={
                <RouteWrapper>
                  <NuestraObra />
                </RouteWrapper>
              }
            />
            <Route
              path="/impacto"
              element={
                <RouteWrapper>
                  <ImpactoTerritorial />
                </RouteWrapper>
              }
            />
            <Route
              path="/programas"
              element={
                <RouteWrapper>
                  <Projects onDonateSelect={navigateToDonateWithProject} />
                </RouteWrapper>
              }
            />
            <Route
              path="/transparencia"
              element={
                <RouteWrapper>
                  <Transparencia />
                </RouteWrapper>
              }
            />
            <Route
              path="/donar"
              element={
                <RouteWrapper>
                  <DonationForm
                    preselectedProjectId={preselectedProjectId}
                    onSuccessRedirect={handleSuccessRedirect}
                  />
                </RouteWrapper>
              }
            />
            <Route
              path="/como-ayudar"
              element={
                <RouteWrapper>
                  <HowToHelp
                    onDonateClick={() => navigate('/donar')}
                    onContactClick={() => navigate('/contacto')}
                  />
                </RouteWrapper>
              }
            />
            <Route
              path="/contacto"
              element={
                <RouteWrapper>
                  <Contact />
                </RouteWrapper>
              }
            />
            <Route
              path="/blog"
              element={
                <RouteWrapper>
                  <Blog />
                </RouteWrapper>
              }
            />
            <Route
              path="/admin"
              element={
                <RouteWrapper>
                  <AdminPanel />
                </RouteWrapper>
              }
            />
            <Route
              path="*"
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center min-h-[50vh] text-[#1B3022]"
                >
                  <h2 className="text-2xl font-bold font-display mb-4">404 - Página no encontrada</h2>
                  <p className="text-sm text-[#2C2C2C] mb-6 max-w-md text-center">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="text-[#F5F2ED] bg-[#1B3022] hover:bg-[#1B3022]/90 px-6 py-2 rounded-[4px] font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                    aria-label="Volver a la página de inicio"
                  >
                    Volver al inicio
                  </button>
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer logoConfig={logoConfig} />
    </div>
  );
}
