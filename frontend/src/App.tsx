import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { FoodSafetyBanner } from './components/FoodSafetyBanner';
import { LandingPage } from './components/LandingPage';
import { NgoDashboard } from './components/NgoDashboard';
import { RestaurantDashboard } from './components/RestaurantDashboard';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { MapView } from './components/MapView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfileModal } from './components/UserProfileModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={() => setShowProfileModal(true)}
        openProfileModal={() => setShowProfileModal(true)}
      />

      {/* Food Safety & FSSAI Standards Banner */}
      <FoodSafetyBanner />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage onNavigate={setActiveTab} />}
        {activeTab === 'browse' && <NgoDashboard />}
        {activeTab === 'post' && <RestaurantDashboard />}
        {activeTab === 'deliveries' && <VolunteerDashboard />}
        {activeTab === 'map' && <MapView />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* User Profile / Auth Modal */}
      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
