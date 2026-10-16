import React from 'react';
import { X, Sparkles, MapPin, Users, Utensils, Zap, ShieldCheck } from 'lucide-react';
import { Donation } from '../types';
import { useApp } from '../context/AppContext';
import { computeSmartNgoMatches } from '../utils/matching';

interface SmartMatchModalProps {
  donation: Donation;
  onClose: () => void;
  onClaimForNgo?: (ngoId: string) => void;
}

export const SmartMatchModal: React.FC<SmartMatchModalProps> = ({
  donation,
  onClose,
  onClaimForNgo,
}) => {
  const { ngos, currentUser, claimDonation } = useApp();
  const matches = computeSmartNgoMatches(donation, ngos);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 text-slate-200 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 rounded-xl font-bold shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Transparent Smart NGO Matching
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Algorithmic Breakdown
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Live multi-factor scoring matching "{donation.food_name}" to Noida food rescue shelters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Donation Summary strip */}
        <div className="my-3 p-3 rounded-xl bg-slate-900/70 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div>
            <span className="text-slate-400 block text-[10px]">DONATION POSTED BY</span>
            <span className="font-semibold text-white">{donation.restaurant_name}</span>
            <span className="text-slate-400 block">{donation.address}</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400 block text-[10px]">SERVINGS REQUIRED</span>
              <span className="font-bold text-emerald-400 text-sm">{donation.servings} people</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CATEGORY</span>
              <span className="font-semibold text-slate-200">{donation.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">URGENCY</span>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  donation.urgency === 'critical'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : donation.urgency === 'high'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {donation.urgency}
              </span>
            </div>
          </div>
        </div>

        {/* Matching Algorithm Formula Box */}
        <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-700/40 text-[11px] text-slate-400 flex items-center justify-between shrink-0 mb-3">
          <span>
            <strong className="text-slate-300">Scoring Formula: </strong>
            Proximity (30pts) + Capacity Fit (25pts) + Category Match (25pts) + Urgency Handling (20pts) = 100pts
          </span>
          <span className="text-emerald-400 font-semibold">100% Transparent</span>
        </div>

        {/* Ranked NGO List */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {matches.map((m, idx) => (
            <div
              key={m.ngo_id}
              className={`p-4 rounded-xl border transition ${
                idx === 0
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                  : 'bg-slate-800/80 border-slate-700/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      {m.ngo_name}
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      Distance: <strong className="text-slate-200">{m.distance_km} km away</strong> in Noida
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">
                    {m.total_score}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
                    {m.total_score >= 85 ? 'Top Optimal Fit' : m.total_score >= 70 ? 'Strong Match' : 'Feasible'}
                  </span>
                </div>
              </div>

              {/* Sub-score Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 text-[11px]">
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-emerald-400" /> Distance Score
                  </span>
                  <span className="font-bold text-white">{m.distance_score} / 30 pts</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                    <Users className="w-2.5 h-2.5 text-emerald-400" /> Capacity Score
                  </span>
                  <span className="font-bold text-white">{m.capacity_score} / 25 pts</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                    <Utensils className="w-2.5 h-2.5 text-emerald-400" /> Category Fit
                  </span>
                  <span className="font-bold text-white">{m.category_score} / 25 pts</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-emerald-400" /> Urgency Fit
                  </span>
                  <span className="font-bold text-white">{m.urgency_score} / 20 pts</span>
                </div>
              </div>

              {/* Explanations list */}
              <div className="mt-2 text-xs text-slate-300 bg-slate-900/40 p-2 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Why this NGO matches:
                </span>
                <ul className="space-y-0.5 text-[11px]">
                  {m.explanation.map((exp, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-emerald-400">✓</span> {exp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Claim Action if available */}
              {donation.status === 'available' && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      const res = claimDonation(donation.id);
                      if (res.success) {
                        alert(res.message);
                        onClose();
                      } else {
                        alert(res.message);
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition flex items-center gap-1.5"
                  >
                    <span>Claim Surplus for this NGO</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-700 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
