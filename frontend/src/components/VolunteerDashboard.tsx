import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Donation } from '../types';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Thermometer,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  PackageCheck,
  Bike,
} from 'lucide-react';
import { ReportModal } from './ReportModal';

export const VolunteerDashboard: React.FC = () => {
  const {
    donations,
    currentUser,
    volunteerAcceptDelivery,
    volunteerPickupDelivery,
    volunteerCompleteDelivery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('active');
  const [reportTarget, setReportTarget] = useState<Donation | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);

  // Filter deliveries
  const openDispatches = donations.filter(
    (d) => d.status === 'claimed' && (d.delivery_status === 'assigned' || d.delivery_status === 'unassigned')
  );

  const activeDeliveries = donations.filter(
    (d) => d.delivery_status === 'accepted' || d.delivery_status === 'picked_up'
  );

  const completedDeliveries = donations.filter((d) => d.delivery_status === 'delivered');

  const handleAccept = (id: string) => {
    setFeedback(null);
    const res = volunteerAcceptDelivery(id);
    setFeedback(res);
    if (res.success) setActiveTab('active');
  };

  const handlePickup = (id: string) => {
    setFeedback(null);
    const res = volunteerPickupDelivery(id);
    setFeedback(res);
  };

  const handleDeliver = (id: string) => {
    setFeedback(null);
    const res = volunteerCompleteDelivery(id);
    setFeedback(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Volunteer Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Truck className="w-6 h-6 text-emerald-400" />
              Volunteer Dispatch & Transport Hub
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Courier
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accept food recovery dispatches, follow cold-chain temperature precautions, and bridge hot surplus meals to Noida shelters.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>In-Progress ({activeDeliveries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'available'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Open Requests ({openDispatches.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Delivered ({completedDeliveries.length})</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            feedback.success
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: ACTIVE IN-PROGRESS MISSIONS */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Missions Assigned to You</span>
            <span className="text-emerald-400">{activeDeliveries.length} Active Routes</span>
          </div>

          {activeDeliveries.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6">
              <Bike className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No active deliveries in progress right now.</p>
              <p className="text-xs text-slate-500 mt-1">Check "Open Requests" to claim and dispatch food across Noida.</p>
              <button
                onClick={() => setActiveTab('available')}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl"
              >
                Browse Open Requests
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeDeliveries.map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl text-xs space-y-4"
                >
                  {/* Top Bar with Status Breadcrumb */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">FOOD ITEM</span>
                      <h3 className="text-base font-bold text-white">{d.food_name}</h3>
                      <p className="text-emerald-400 font-semibold">{d.servings} Servings &bull; {d.quantity}</p>
                    </div>

                    {/* Step Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        1. Assigned
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span
                        className={`px-2 py-0.5 rounded ${
                          d.delivery_status === 'accepted' || d.delivery_status === 'picked_up'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-900 text-slate-500'
                        }`}
                      >
                        2. Accepted
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span
                        className={`px-2 py-0.5 rounded ${
                          d.delivery_status === 'picked_up'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                            : 'bg-slate-900 text-slate-500'
                        }`}
                      >
                        3. Picked Up
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-500">
                        4. Delivered
                      </span>
                    </div>
                  </div>

                  {/* Route Details Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pickup details */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> A. Pickup From (Kitchen)
                        </span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {d.restaurant_name}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium">{d.address}</p>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{d.restaurant_phone}</span>
                      </div>
                    </div>

                    {/* Drop-off details */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-blue-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> B. Deliver To (NGO Shelter)
                        </span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          Destination
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium">
                        {d.claimed_by_ngo_name || 'Noida Food Rescue & Seva Society'}
                      </p>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <Thermometer className="w-3 h-3 text-amber-400" />
                        <span>Required Storage: {d.storage_info}</span>
                      </div>
                    </div>
                  </div>

                  {/* Food Handling Alert */}
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Transport Advisory: Maintain {d.storage_info}. Keep containers securely covered and handle with sanitized gloves.
                    </span>
                  </div>

                  {/* Next Step Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setReportTarget(d)}
                      className="text-slate-400 hover:text-red-400 text-xs underline font-medium"
                    >
                      Report Safety or Route Issue
                    </button>

                    <div className="flex items-center gap-3">
                      {d.delivery_status === 'accepted' && (
                        <button
                          onClick={() => handlePickup(d.id)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>Confirm Picked Up at Kitchen</span>
                        </button>
                      )}

                      {d.delivery_status === 'picked_up' && (
                        <button
                          onClick={() => handleDeliver(d.id)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Handover & Delivered</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AVAILABLE DISPATCHES */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Pending Delivery Rides across Noida</span>
            <span className="text-emerald-400">{openDispatches.length} Claimed Batches</span>
          </div>

          {openDispatches.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">All claimed donations currently have active couriers!</p>
              <p className="text-xs text-slate-500 mt-1">Check back soon as NGOs claim additional surplus meals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openDispatches.map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-xl text-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Dispatch Ready &bull; {d.urgency}
                    </span>
                    <span className="text-emerald-400 font-bold">{d.servings} Servings</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{d.food_name}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Pickup from: <strong className="text-slate-300">{d.restaurant_name}</strong> ({d.address})
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Destination: <strong className="text-slate-300">{d.claimed_by_ngo_name}</strong>
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/60 text-[11px] flex items-center justify-between text-slate-300">
                    <span>Deadline: {new Date(d.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-amber-400 font-semibold">{d.storage_info}</span>
                  </div>

                  <button
                    onClick={() => handleAccept(d.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Accept Delivery Dispatch</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPLETED DELIVERIES */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Delivered Noida Batches</span>
            <span className="text-blue-400">{completedDeliveries.length} Successful Missions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedDeliveries.map((d) => (
              <div
                key={d.id}
                className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 text-xs space-y-2 opacity-90"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delivered
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {d.delivered_at ? new Date(d.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Earlier Today'}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm line-clamp-1">{d.food_name}</h4>
                <p className="text-slate-400 text-[11px]">
                  Delivered {d.servings} servings from {d.restaurant_name} to {d.claimed_by_ngo_name}
                </p>
              </div>
            ))}
          </div>
        </div>
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
