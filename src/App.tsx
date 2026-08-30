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

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [preselectedProjectId, setPreselectedProjectId] = useState<string>('');

  useReveal();

  // Logos loaded once at app level — prevents flash-of-SVG in Navbar/Footer
  const [logoConfig, setLogoConfig] = useState<LogoConfig>(defaultLogoConfig);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const refreshLogos = useCallback(() => {
    api
      .get<LogoConfig>('/api/logos')
      .then((res) => {
        if (res.success && res.data) setLogoConfig(res.data);
      })
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
    <div className="flex flex-col min-h-screen font-sans">
      <Toaster position="top-right" />
      {/* Top sticky Navigation Header */}
      <Navbar logoConfig={logoConfig} />

      {/* Main Tab Render Flow */}
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] w-full items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1B3022]"></div>
            </div>
          }
        >
          <AnimatePresence mode="wait">
            {/* @ts-expect-error React Router v7 Props typings omit key for AnimatePresence */}
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
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
                  </motion.div>
                }
              />
              <Route
                path="/nuestra-obra"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <NuestraObra />
                  </motion.div>
                }
              />
              <Route
                path="/impacto"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <ImpactoTerritorial />
                  </motion.div>
                }
              />
              <Route
                path="/programas"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Projects onDonateSelect={navigateToDonateWithProject} />
                  </motion.div>
                }
              />
              <Route
                path="/transparencia"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Transparencia />
                  </motion.div>
                }
              />
              <Route
                path="/donar"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <DonationForm
                      preselectedProjectId={preselectedProjectId}
                      onSuccessRedirect={handleSuccessRedirect}
                    />
                  </motion.div>
                }
              />
              <Route
                path="/como-ayudar"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <HowToHelp
                      onDonateClick={() => navigate('/donar')}
                      onContactClick={() => navigate('/contacto')}
                    />
                  </motion.div>
                }
              />
              <Route
                path="/contacto"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Contact />
                  </motion.div>
                }
              />
              <Route
                path="/blog"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Blog />
                  </motion.div>
                }
              />
              <Route
                path="/admin"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <AdminPanel />
                  </motion.div>
                }
              />
              {/* Fallback route */}
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
                    <h2 className="text-2xl font-bold font-display mb-4">Página no encontrada</h2>
                    <button
                      onClick={() => navigate('/')}
                      className="text-[#C5A059] underline font-semibold cursor-pointer"
                      aria-label="Volver a la página de inicio"
                    >
                      Volver al inicio
                    </button>
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Global Branded Footer */}
      <Footer logoConfig={logoConfig} />
    </div>
  );
}
