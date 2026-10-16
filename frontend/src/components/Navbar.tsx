import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Bell,
  MapPin,
  HeartHandshake,
  Truck,
  ShieldCheck,
  BarChart3,
  User,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  Database,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
  openProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  openProfileModal,
}) => {
  const {
    currentUser,
    switchRole,
    isDemoMode,
    unreadCount,
    markAllNotificationsAsRead,
    notifications,
    resetDemoData,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const roles: { role: Role; label: string; desc: string; icon: string }[] = [
    { role: 'restaurant', label: 'Restaurant', desc: 'Donate surplus hot meals & food', icon: '🍲' },
    { role: 'ngo', label: 'NGO / Shelter', desc: 'Claim and distribute to people in need', icon: '🤝' },
    { role: 'volunteer', label: 'Volunteer Rider', desc: 'Accept dispatches & transport meals', icon: '🚴' },
    { role: 'admin', label: 'Platform Admin', desc: 'Audit logs, verifications & safety', icon: '🛡️' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/40 text-slate-100 shadow-lg shadow-black/20">
      {/* Top Demo Bar Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-4 py-1.5 text-xs border-b border-emerald-800/30 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-emerald-300">FoodBridge Noida</span>
          <span className="hidden sm:inline text-slate-400">| Demo Mode: Local Persistence Enabled</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            FSSAI Standards Ready
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo donations and audit logs back to initial Noida seed data?')) {
                resetDemoData();
              }
            }}
            className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition"
            title="Reset Seed Data"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Noida Demo Data</span>
          </button>
          <div className="h-3 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Database className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Backend:</span>
            <span className="text-emerald-300">FastAPI & SQLite / Demo Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Food<span className="text-emerald-400">Bridge</span>
              </span>
              <span className="block text-[10px] tracking-wider text-emerald-300/80 uppercase font-semibold -mt-1">
                Save Food, Feed People
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'landing'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'browse'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              Browse Surplus
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Noida Map
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'post'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Post Donation
            </button>
            <button
              onClick={() => setActiveTab('deliveries')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'deliveries'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Truck className="w-4 h-4" />
              Deliveries
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Impact
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Persona Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 transition shadow-sm"
                title="Switch Demo Role Persona"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-400 hidden lg:inline">Role:</span>
                <span className="capitalize font-semibold text-emerald-300">
                  {currentUser.role}
                </span>
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </button>

              {showRoleSelector && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowRoleSelector(false)}
                >
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1 flex items-center justify-between">
                    <span>Switch Active Persona</span>
                    <span className="text-emerald-400">Demo Role Switcher</span>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setShowRoleSelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-start gap-2.5 my-0.5 ${
                        currentUser.role === r.role
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-200 hover:bg-slate-700/60'
                      }`}
                    >
                      <span className="text-base">{r.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold flex items-center justify-between">
                          <span>{r.label}</span>
                          {currentUser.role === r.role && (
                            <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                  <div className="p-2 mt-1 border-t border-slate-700 text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>In demo mode, switch personas instantly to test all roles.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold rounded-full text-[10px] ring-2 ring-slate-900 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-3 z-50"
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Notifications ({notifications.length})
                      </h4>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-700/50 mt-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 p-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg text-xs transition my-1 ${
                            n.read ? 'bg-slate-800/40 opacity-75' : 'bg-slate-700/50 border border-emerald-500/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-emerald-300">{n.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                          {n.linkTab && (
                            <button
                              onClick={() => {
                                setActiveTab(n.linkTab!);
                                setShowNotifications(false);
                              }}
                              className="mt-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium inline-block"
                            >
                              View in dashboard →
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth Button */}
            <button
              onClick={openProfileModal}
              className="flex items-center gap-2 p-1.5 sm:px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition"
              title="View User Profile & Credentials"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold truncate max-w-[120px]">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => {
              setActiveTab('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveTab('browse');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Browse Surplus Meals
          </button>
          <button
            onClick={() => {
              setActiveTab('map');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Noida Map View
          </button>
          <button
            onClick={() => {
              setActiveTab('post');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Post Food Donation
          </button>
          <button
            onClick={() => {
              setActiveTab('deliveries');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Volunteer Deliveries
          </button>
          <button
            onClick={() => {
              setActiveTab('analytics');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Impact Analytics
          </button>
          <button
            onClick={() => {
              setActiveTab('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
          >
            Admin Governance
          </button>
        </div>
      )}
    </header>
  );
};
