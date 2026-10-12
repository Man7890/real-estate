/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePropertyStore } from './store';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { UlpinGeneratorPage } from './pages/UlpinGeneratorPage';
import { PropertyExplorerPage } from './pages/PropertyExplorerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutPage } from './pages/AboutPage';
import { ParcelComparisonModal } from './components/dialogs/ParcelComparisonModal';
import { PropertyCertificateModal } from './components/dialogs/PropertyCertificateModal';

export default function App() {
  const { activeView } = usePropertyStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar (Single-line 3-zone contract) */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'dashboard' && <DashboardPage />}
        {activeView === 'map' && <MapPage />}
        {activeView === 'ulpin' && <UlpinGeneratorPage />}
        {activeView === 'properties' && <PropertyExplorerPage />}
        {activeView === 'analytics' && <AnalyticsPage />}
        {activeView === 'about' && <AboutPage />}
      </main>

      {/* Persistent Footer on non-map screens, or concise footer */}
      {activeView !== 'map' && <Footer />}

      {/* Modals & Dialogs */}
      <ParcelComparisonModal />
      <PropertyCertificateModal />
    </div>
  );
}
