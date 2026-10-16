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
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { analytics, donations, switchRole } = useApp();

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-teal-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Hackathon Edition &bull; Live in Noida & Greater Noida, NCR</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Save Food. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">Feed People.</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            FoodBridge instantly bridges surplus cooked meals, fresh groceries, and bakery yields from commercial kitchens to verified shelters and food banks across Noida sectors and Expressway.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                switchRole('restaurant');
                onNavigate('post');
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition flex items-center gap-2 group"
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
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-semibold text-sm transition flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Claim as Verified NGO</span>
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="px-6 py-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold text-sm transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Noida Map View</span>
            </button>
          </div>
        </div>

        {/* Real-time Impact Ticker */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-emerald-900/40 shadow-2xl">
          <div className="text-center p-2">
            <span className="text-[11px] text-slate-400 font-medium block">Total Servings Rescued</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              {analytics.total_servings}
            </div>
            <span className="text-[10px] text-slate-500">Wholesome meals saved</span>
          </div>

          <div className="text-center p-2 border-l border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">Active Noida Batches</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {donations.filter((d) => d.status === 'available').length}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Available for pickup</span>
          </div>

          <div className="text-center p-2 border-l border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">CO₂ Landfill Diverted</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
              {analytics.co2_diverted_kg} kg
            </div>
            <span className="text-[10px] text-slate-500">Greenhouse gas averted</span>
          </div>

          <div className="text-center p-2 border-l border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">Rescue Success Rate</span>
            <div className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">
              {analytics.completion_rate}%
            </div>
            <span className="text-[10px] text-slate-500">Fulfillment reliability</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 4-STEP WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Streamlined Recovery Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How FoodBridge Works</h2>
          <p className="text-xs text-slate-400">
            A zero-waste chain of custody taking wholesome food from prep counters to community tables
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl relative text-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/30">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Kitchen Logs Surplus</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Restaurant or caterer posts servings count, storage info (hot/cold), allergen tags, and pickup deadline.
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold pt-1">
              ✓ FSSAI Sanitary Declaration
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl relative text-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/30">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Smart NGO Matching</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Transparent multi-factor algorithm scores Noida NGOs based on proximity, meal capacity, category match, and urgency.
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold pt-1">
              ✓ Explainable Score (0-100)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl relative text-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/30">
              3
            </div>
            <h3 className="text-sm font-bold text-white">Volunteer Dispatched</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Verified courier claims the route: Assigned → Accepted → Picked Up, strictly respecting storage temperatures.
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold pt-1">
              ✓ Cold-Chain Preservation
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl relative text-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/30">
              4
            </div>
            <h3 className="text-sm font-bold text-white">Delivered & Logged</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Shelter receives hot, nutritious meals. Platform generates immutable audit entry and impact telemetry.
            </p>
            <div className="text-[10px] text-emerald-400 font-semibold pt-1">
              ✓ Tamper-Evident Audit Trail
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED LIVE RESCUE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Live Noida Surplus Batches
            </h2>
            <p className="text-xs text-slate-400">
              Fresh listings ready for immediate claim by accredited Noida NGOs
            </p>
          </div>
          <button
            onClick={() => onNavigate('browse')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All ({donations.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {donations.slice(0, 3).map((d) => (
            <div
              key={d.id}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-40">
                <img src={d.image_url} alt={d.food_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/90 text-emerald-300 border border-emerald-500/30">
                    {d.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-0.5 rounded bg-black/70 font-black text-emerald-400 text-xs">
                    {d.servings} Servings
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 text-xs flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{d.food_name}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{d.address}</span>
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1">
                    Source: <strong className="text-slate-300">{d.restaurant_name}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-amber-400 font-medium text-[11px]">
                    Due: {new Date(d.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => {
                      switchRole('ngo');
                      onNavigate('browse');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-[11px] shadow transition"
                  >
                    Claim Batch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 pt-10 text-xs text-slate-400 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
              FB
            </div>
            <span className="font-bold text-white text-sm">FoodBridge Noida</span>
            <span className="text-slate-500">&bull; Save Food, Feed People</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => onNavigate('map')} className="hover:text-emerald-300">
              Noida OpenStreetMap
            </button>
            <button onClick={() => onNavigate('analytics')} className="hover:text-emerald-300">
              Impact Analytics
            </button>
            <button onClick={() => onNavigate('admin')} className="hover:text-emerald-300">
              Admin Portal
            </button>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-slate-500 text-center leading-relaxed">
          FoodBridge complies with Food Safety and Standards Authority of India (FSSAI) guidelines. Food donations undergo mandatory human verification and strict chain-of-custody checks. AI or computer-vision is never utilized to judge food edibility.
        </p>
      </footer>
    </div>
  );
};
