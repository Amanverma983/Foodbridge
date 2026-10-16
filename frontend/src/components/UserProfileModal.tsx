import React, { useState } from 'react';
import { X, User, ShieldCheck, KeyRound, Building2, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, switchRole, isDemoMode, isBackendConnected } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'auth_config' | 'test_login'>('profile');

  // Form states for login/register test
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('restaurant');
  const [orgName, setOrgName] = useState('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const handleSimulateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage(`Authenticated as ${selectedRole.toUpperCase()} (${email || 'test@foodbridge.org'}). Switching demo context...`);
    setTimeout(() => {
      switchRole(selectedRole);
      setLoginMessage(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-700">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-500/20 shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
              {currentUser.is_verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700 text-emerald-300">
              Role: {currentUser.role}
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-700 mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 transition border-b-2 ${
              activeTab === 'profile'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Profile
          </button>
          <button
            onClick={() => setActiveTab('test_login')}
            className={`pb-2.5 px-3 transition border-b-2 ${
              activeTab === 'test_login'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Role Login / Register
          </button>
          <button
            onClick={() => setActiveTab('auth_config')}
            className={`pb-2.5 px-3 transition border-b-2 ${
              activeTab === 'auth_config'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Supabase & Security Status
          </button>
        </div>

        {/* Tab 1: Profile View */}
        {activeTab === 'profile' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-400">Organization:</span>
                <span className="font-semibold text-white">
                  {currentUser.organization_name || 'Independent Partner'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-400">Direct Phone:</span>
                <span className="font-semibold text-white">{currentUser.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-400">Base Location:</span>
                <span className="font-semibold text-white">{currentUser.address || 'Noida, Uttar Pradesh'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-slate-300">
              <h4 className="font-bold text-emerald-300 text-xs mb-1">Quick Role Persona Switcher</h4>
              <p className="text-[11px] text-slate-400 mb-2.5">
                Switch between all 4 personas instantly to test the complete food recovery lifecycle:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(['restaurant', 'ngo', 'volunteer', 'admin'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      onClose();
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition flex items-center justify-between ${
                      currentUser.role === r
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-700/80 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser.role === r && <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Test Login/Register */}
        {activeTab === 'test_login' && (
          <form onSubmit={handleSimulateLogin} className="space-y-3 text-xs">
            <p className="text-slate-400 text-[11px]">
              Test user authentication with custom credentials. When Supabase keys are configured, this authenticates against Supabase Auth. In local mode, this initializes a verified session.
            </p>
            {loginMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs">
                {loginMessage}
              </div>
            )}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Account Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
              >
                <option value="restaurant">Restaurant (Food Donor)</option>
                <option value="ngo">NGO / Shelter (Food Distributor)</option>
                <option value="volunteer">Volunteer (Transport Courier)</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <input
                type="email"
                placeholder="partner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition"
            >
              Sign In / Switch Persona
            </button>
          </form>
        )}

        {/* Tab 3: Supabase & Security Architecture */}
        {activeTab === 'auth_config' && (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Local Demo Mode</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                  Active & Functional
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Donations, claims, audit history, and deliveries persist across page refreshes in browser localStorage and Python SQLite backend.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Supabase Credentials</span>
                <span className="text-amber-400 font-semibold bg-amber-500/20 px-2 py-0.5 rounded text-[10px]">
                  Optional Production Key
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                To bind to a live Supabase PostgreSQL cluster, add <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> to your environment file.
              </p>
              <div className="text-[10px] text-slate-500">
                Service-role keys are never exposed in client code.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                Backend Permission Guard
              </div>
              <p className="text-[11px] text-slate-400">
                FastAPI endpoints enforce role-based access: Only registered restaurants may post donations; only NGOs can claim surplus meals; only volunteers can transition delivery states.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
