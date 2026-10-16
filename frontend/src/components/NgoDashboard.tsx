import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCategory, StorageType, UrgencyLevel, Donation } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Phone,
  Thermometer,
  ShieldCheck,
} from 'lucide-react';
import { SmartMatchModal } from './SmartMatchModal';
import { ReportModal } from './ReportModal';

export const NgoDashboard: React.FC = () => {
  const { donations, claimDonation, currentUser } = useApp();

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [availableOnly, setAvailableOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'urgency' | 'servings' | 'newest'>('urgency');

  // Modals state
  const [smartMatchTarget, setSmartMatchTarget] = useState<Donation | null>(null);
  const [reportTarget, setReportTarget] = useState<Donation | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ message: string; success: boolean } | null>(null);

  const categories: (FoodCategory | 'all')[] = [
    'all',
    'Cooked Meals',
    'Raw Groceries',
    'Bakery',
    'Dairy',
    'Produce',
    'Packaged',
  ];

  // Filtering and Sorting
  const filteredDonations = useMemo(() => {
    return donations
      .filter((d) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            d.food_name.toLowerCase().includes(q) ||
            d.restaurant_name.toLowerCase().includes(q) ||
            d.address.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category
        if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;

        // Urgency
        if (selectedUrgency !== 'all' && d.urgency !== selectedUrgency) return false;

        // Storage
        if (selectedStorage !== 'all' && d.storage_info !== selectedStorage) return false;

        // Available only
        if (availableOnly && d.status !== 'available') return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') {
          return new Date(a.pickup_deadline).getTime() - new Date(b.pickup_deadline).getTime();
        }
        if (sortBy === 'servings') {
          return b.servings - a.servings;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [donations, searchQuery, selectedCategory, selectedUrgency, selectedStorage, availableOnly, sortBy]);

  const handleClaim = (donationId: string) => {
    setActionFeedback(null);
    const result = claimDonation(donationId);
    setActionFeedback(result);
    setTimeout(() => {
      setActionFeedback(null);
    }, 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {currentUser.role === 'ngo'
                ? currentUser.organization_name || 'Noida Food Rescue & Seva Society'
                : 'Surplus Food Marketplace'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              NGO Rescue Station
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified food donations across Noida, inspect storage requirements, and claim for local community distribution.
          </p>
        </div>

        {/* Live Counter badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Available in Noida</span>
            <span className="text-lg font-black text-emerald-400">
              {donations.filter((d) => d.status === 'available').length} Batches
            </span>
          </div>
        </div>
      </div>

      {actionFeedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            actionFeedback.success
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}
        >
          <span>{actionFeedback.message}</span>
          <button onClick={() => setActionFeedback(null)} className="underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3">
        {/* Search Input & Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-3 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by food name, restaurant, or sector (e.g. Sector 18, Sector 62)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="urgency">Sort: Shortest Deadline (Urgent)</option>
              <option value="servings">Sort: Highest Servings Count</option>
              <option value="newest">Sort: Most Recently Posted</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-700/60 text-xs">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition capitalize ${
                  selectedCategory === c
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Toggle Available Only */}
          <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="accent-emerald-500 w-3.5 h-3.5 rounded"
            />
            <span>Show Available Batches Only</span>
          </label>
        </div>
      </div>

      {/* Donation Cards Grid */}
      {filteredDonations.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6">
          <p className="text-sm font-semibold text-slate-300">No surplus food batches match your filter criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or toggling "Available Only".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonations.map((d) => {
            const isAvailable = d.status === 'available';
            const diffHours = Math.max(
              0,
              Math.round(((new Date(d.pickup_deadline).getTime() - Date.now()) / 3600000) * 10) / 10
            );

            return (
              <div
                key={d.id}
                className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition hover:border-slate-600"
              >
                {/* Card Top Image & Badges */}
                <div className="relative h-44 bg-slate-900">
                  {d.image_url ? (
                    <img src={d.image_url} alt={d.food_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍲</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700">
                      {d.category}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        d.urgency === 'critical'
                          ? 'bg-red-500/80 text-white border-red-400'
                          : d.urgency === 'high'
                          ? 'bg-amber-500/80 text-slate-950 border-amber-300 font-black'
                          : 'bg-emerald-500/80 text-slate-950 border-emerald-300 font-bold'
                      }`}
                    >
                      {d.urgency} ({diffHours}h left)
                    </span>
                  </div>

                  {/* Bottom Image Overlay Servings */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                      {d.quantity}
                    </span>
                    <span className="text-sm font-black text-emerald-400 bg-black/70 px-2 py-0.5 rounded">
                      {d.servings} Servings
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">
                      {d.food_name}
                    </h3>

                    {/* Source restaurant details */}
                    <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium text-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{d.restaurant_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{d.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{d.restaurant_phone}</span>
                      </div>
                    </div>

                    {/* Storage & Allergens strip */}
                    <div className="mt-3 p-2 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-emerald-400" /> Storage:
                        </span>
                        <span className="font-semibold text-slate-200">{d.storage_info}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Allergens:</span>
                        <span className="font-semibold text-amber-300">
                          {d.allergens.length > 0 ? d.allergens.join(', ') : 'None Declared'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Pickup Deadline:</span>
                        <span className="font-semibold text-white">
                          {new Date(d.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-3 border-t border-slate-700/60 space-y-2">
                    {/* Smart Match Breakdown Button */}
                    <button
                      onClick={() => setSmartMatchTarget(d)}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-750 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Inspect Smart Match Score</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isAvailable ? (
                        <button
                          onClick={() => handleClaim(d.id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                        >
                          <HeartHandshake className="w-4 h-4" />
                          <span>Claim Food Surplus</span>
                        </button>
                      ) : (
                        <div className="flex-1 py-2 px-3 rounded-xl bg-slate-900 text-slate-400 border border-slate-700 text-center font-semibold text-[11px]">
                          Claimed by {d.claimed_by_ngo_name || 'NGO'}
                        </div>
                      )}

                      <button
                        onClick={() => setReportTarget(d)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition"
                        title="Report Spoilage / Safety Issue"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {smartMatchTarget && (
        <SmartMatchModal
          donation={smartMatchTarget}
          onClose={() => setSmartMatchTarget(null)}
        />
      )}

      {reportTarget && (
        <ReportModal
          donation={reportTarget}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
};
