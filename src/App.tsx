/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Collections } from './pages/Collections';
import { LivingRoom } from './pages/LivingRoom';
import { Bedroom } from './pages/Bedroom';
import { CustomFurniture } from './pages/CustomFurniture';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home onNavigate={handleNavigate} />;
      case '/about':
        return <About onNavigate={handleNavigate} />;
      case '/collections':
        return <Collections onNavigate={handleNavigate} />;
      case '/living-room':
        return <LivingRoom onNavigate={handleNavigate} />;
      case '/bedroom':
        return <Bedroom onNavigate={handleNavigate} />;
      case '/custom-furniture':
        return <CustomFurniture onNavigate={handleNavigate} />;
      case '/gallery':
        return <Gallery />;
      case '/contact':
        return <Contact />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E8] text-[#1C1511] font-sans selection:bg-[#C9A45C] selection:text-white">
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      
      {loadingComplete && (
        <>
          <Navbar currentPath={currentPath} onNavigate={handleNavigate} />
          <main className="flex-grow">
            {renderPage()}
          </main>
          <Footer onNavigate={handleNavigate} />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}
