import React from 'react';
import {
  UtensilsCrossed,
  HeartHandshake,
  Truck,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  Leaf,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Building2,
  Award,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { analytics, donations, switchRole } = useApp();

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-7">
          {/* Live Beacon Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-lg shadow-emerald-950/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>NCR Food Rescue Network</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-300">Live in Noida & Greater Noida</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] font-display">
            Save Food.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-sm">
              Feed People.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
            FoodBridge instantly bridges surplus cooked meals, fresh groceries, and bakery yields from commercial kitchens to verified shelters and food banks across Noida sectors and Expressway.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                switchRole('restaurant');
                onNavigate('post');
              }}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 group cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
              <span>Donate Food Surplus</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                switchRole('ngo');
                onNavigate('browse');
              }}
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/40 text-white font-bold text-sm backdrop-blur-xl shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Claim as Verified NGO</span>
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="px-6 py-3.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300 font-bold text-sm backdrop-blur-xl transition-all duration-200 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Noida Map View</span>
            </button>
          </div>
        </div>

        {/* Real-time Impact Ticker */}
        <div className="mt-16 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-60" />

          {/* Stat 1 */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-3.5 hover:border-emerald-500/30 transition-all">
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shrink-0">
              <UtensilsCrossed className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total Servings</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-display mt-0.5">
                {analytics.total_servings}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">Wholesome meals saved</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-3.5 hover:border-emerald-500/30 transition-all">
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 shrink-0">
              <Clock className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Active Batches</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-display mt-0.5">
                {donations.filter((d) => d.status === 'available').length}
              </div>
              <span className="text-[10px] text-amber-400 font-medium">Ready for pickup</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-3.5 hover:border-emerald-500/30 transition-all">
            <div className="p-3 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/25 shrink-0">
              <Leaf className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">CO₂ Diverted</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-display mt-0.5">
                {analytics.co2_diverted_kg} <span className="text-sm font-semibold text-slate-400">kg</span>
              </div>
              <span className="text-[10px] text-teal-400 font-medium">Methane averted</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-3.5 hover:border-emerald-500/30 transition-all">
            <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Success Rate</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-display mt-0.5">
                {analytics.completion_rate}%
              </div>
              <span className="text-[10px] text-cyan-400 font-medium">Dispatch reliability</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 4-STEP WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            Streamlined Recovery Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            How FoodBridge Works
          </h2>
          <p className="text-sm text-slate-400">
            A zero-waste chain of custody taking wholesome surplus food from prep counters to community tables
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Kitchen Logs Surplus',
              desc: 'Commercial kitchens post servings count, storage requirements (hot/chilled), allergen tags, and strict pickup deadlines.',
              tag: 'FSSAI Hygiene Declaration',
              icon: UtensilsCrossed,
              glowColor: 'from-emerald-500/20 to-emerald-600/5',
              borderColor: 'hover:border-emerald-500/50',
            },
            {
              step: '02',
              title: 'Smart NGO Matching',
              desc: 'Transparent multi-factor algorithm scores Noida NGOs based on proximity, meal capacity, category match, and urgency.',
              tag: 'Algorithmic Score (0-100)',
              icon: Sparkles,
              glowColor: 'from-teal-500/20 to-teal-600/5',
              borderColor: 'hover:border-teal-500/50',
            },
            {
              step: '03',
              title: 'Courier Dispatched',
              desc: 'Verified couriers execute strict transport stages: Assigned → Accepted → Picked Up, guaranteeing temperature hygiene.',
              tag: 'Cold-Chain Preserved',
              icon: Truck,
              glowColor: 'from-cyan-500/20 to-cyan-600/5',
              borderColor: 'hover:border-cyan-500/50',
            },
            {
              step: '04',
              title: 'Delivered & Logged',
              desc: 'Shelters receive nutritious meals. Platform updates tamper-evident audit ledger and calculates CO₂ telemetry.',
              tag: 'Audit Ledger Verified',
              icon: ShieldCheck,
              glowColor: 'from-indigo-500/20 to-indigo-600/5',
              borderColor: 'hover:border-indigo-500/50',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-gradient-to-b ${item.glowColor} bg-slate-900/70 border border-slate-800 ${item.borderColor} shadow-xl relative transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-display">
                      {item.step}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 font-display">{item.title}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/80">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED LIVE RESCUE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Live Marketplace
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Live Surplus Batches in Noida
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ready for immediate claim and pickup by accredited NGO food shelters
            </p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <span>View All ({donations.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {donations.slice(0, 3).map((d) => {
            const isCritical = d.urgency === 'critical';
            return (
              <div
                key={d.id}
                className="group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={d.image_url}
                    alt={d.food_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-slate-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-md">
                      {d.category}
                    </span>
                  </div>

                  {/* Urgency Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-md shadow-md flex items-center gap-1 ${
                        isCritical
                          ? 'bg-rose-950/85 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-amber-950/85 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {d.urgency}
                    </span>
                  </div>

                  {/* Servings Pill */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30">
                      {d.servings} Servings
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base font-display line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {d.food_name}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{d.address}</span>
                    </p>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Kitchen: <strong className="text-slate-300 font-medium">{d.restaurant_name}</strong>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="text-[11px]">
                      <span className="text-slate-400 block">Pickup Deadline</span>
                      <span className="text-amber-400 font-bold">
                        {new Date(d.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        switchRole('ngo');
                        onNavigate('browse');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 transition cursor-pointer"
                    >
                      Claim Batch
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRUST & ACCREDITATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-900/40 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">FSSAI Hygiene Pledged</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Every donor kitchen signs mandatory sanitary declarations. Temperature tolerances strictly verified before handover.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/30 shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Zero AI Guessing</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Strict human verification chain-of-custody. We never rely on automated image predictions for food safety.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">10+ Verified Noida Partners</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Connecting vetted shelters including Robin Hood Army, Noida Food Rescue Society, and Mother Teresa Seva Kutir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 pt-12 text-xs text-slate-400 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-slate-950 shadow-md">
              FB
            </div>
            <div>
              <span className="font-extrabold text-white text-sm font-display">FoodBridge Noida</span>
              <p className="text-[11px] text-emerald-400">Save Food &bull; Alleviate Hunger &bull; Avert Waste</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <button onClick={() => onNavigate('browse')} className="hover:text-emerald-300 transition cursor-pointer">
              Browse Surplus
            </button>
            <button onClick={() => onNavigate('map')} className="hover:text-emerald-300 transition cursor-pointer">
              Noida Map
            </button>
            <button onClick={() => onNavigate('analytics')} className="hover:text-emerald-300 transition cursor-pointer">
              Impact Analytics
            </button>
            <button onClick={() => onNavigate('admin')} className="hover:text-emerald-300 transition cursor-pointer">
              Governance Portal
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 text-[11px] text-slate-500 text-center leading-relaxed">
          FoodBridge adheres strictly to Food Safety and Standards Authority of India (FSSAI) guidelines. Food donations undergo mandatory human verification and temperature checks.
        </div>
      </footer>
    </div>
  );
};
