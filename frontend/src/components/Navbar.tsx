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
    isBackendConnected,
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
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 text-slate-100 shadow-xl shadow-black/40 transition-all">
      {/* Top Demo Bar Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-950 to-emerald-950/80 px-4 py-1.5 text-xs border-b border-emerald-900/30 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-300">FoodBridge NCR</span>
          <span className="hidden sm:inline text-slate-400">&bull; Noida & Greater Noida Food Recovery</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            FSSAI Verified
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo donations and audit logs back to initial Noida seed data?')) {
                resetDemoData();
              }
            }}
            className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800/60 transition"
            title="Reset Seed Data"
          >
            <RefreshCw className="w-3 h-3 text-slate-400 hover:rotate-180 transition-transform duration-500" />
            <span className="hidden md:inline">Reset Demo Data</span>
          </button>
          <div className="h-3 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
              isBackendConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isBackendConnected ? 'FastAPI Online' : 'Local Demo Mode'}
            </span>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 group-hover:shadow-emerald-500/40 transition-all duration-300 border border-emerald-300/30">
              <UtensilsCrossed className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1 font-display">
                Food<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Bridge</span>
              </span>
              <span className="block text-[10px] tracking-widest text-emerald-400/90 uppercase font-bold -mt-1">
                Save Food &bull; Feed People
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            {[
              { id: 'landing', label: 'Home' },
              { id: 'browse', label: 'Browse Meals', icon: HeartHandshake },
              { id: 'map', label: 'Live Map', icon: MapPin },
              { id: 'post', label: 'Donate', icon: PlusCircle },
              { id: 'deliveries', label: 'Dispatch', icon: Truck },
              { id: 'analytics', label: 'Impact', icon: BarChart3 },
              { id: 'admin', label: 'Governance', icon: ShieldCheck },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/15 text-emerald-300 border border-emerald-500/35 shadow-[0_0_15px_-3px_rgba(16,185,129,0.35)] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />}
                  <span>{label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
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
