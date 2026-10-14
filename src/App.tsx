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
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';

const COLLECTION_ALIASES = ['/living-room', '/bedroom', '/custom-furniture'];

const getCanonicalPath = (path: string) =>
  COLLECTION_ALIASES.includes(path) ? '/collections' : path;

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = getCanonicalPath(window.location.pathname || '/');
    if (path !== window.location.pathname) {
      window.history.replaceState({}, '', path);
    }
    return path;
  });
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = getCanonicalPath(window.location.pathname || '/');
      if (path !== window.location.pathname) {
        window.history.replaceState({}, '', path);
      }
      setCurrentPath(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    const canonicalPath = getCanonicalPath(path);
    window.history.pushState({}, '', canonicalPath);
    setCurrentPath(canonicalPath);
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home onNavigate={handleNavigate} />;
      case '/about':
        return <About onNavigate={handleNavigate} />;
      case '/collections':
        return <Collections onNavigate={handleNavigate} />;
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
