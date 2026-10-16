import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Download, TrendingUp, Users, UtensilsCrossed, CheckCircle2, Leaf, Clock } from 'lucide-react';
import { exportDonationsToCSV } from '../utils/csvExport';

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const AnalyticsDashboard: React.FC = () => {
  const { analytics, donations } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Impact & Hunger Relief Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Real-time telemetry measuring rescued food volume, carbon mitigation, and distribution efficacy in Noida & NCR
          </p>
        </div>

        <button
          onClick={() => exportDonationsToCSV(donations)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Donation Ledger (CSV)</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" /> Total Donations
          </span>
          <div className="text-2xl font-black text-white">{analytics.total_donations}</div>
          <span className="text-[10px] text-emerald-400 font-medium">9 batches registered</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Total Servings
          </span>
          <div className="text-2xl font-black text-emerald-400">{analytics.total_servings}</div>
          <span className="text-[10px] text-slate-400 font-medium">Potential meals rescued</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Available Servings
          </span>
          <div className="text-2xl font-black text-amber-400">{analytics.available_servings}</div>
          <span className="text-[10px] text-slate-400 font-medium">Ready for NGO claim</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Delivered Servings
          </span>
          <div className="text-2xl font-black text-blue-400">{analytics.delivered_servings}</div>
          <span className="text-[10px] text-slate-400 font-medium">Safely fed to beneficiaries</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Completion Rate
          </span>
          <div className="text-2xl font-black text-emerald-300">{analytics.completion_rate}%</div>
          <span className="text-[10px] text-slate-400 font-medium">Pickup fulfillment success</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" /> CO₂ Avoided
          </span>
          <div className="text-2xl font-black text-emerald-400">{analytics.co2_diverted_kg} kg</div>
          <span className="text-[10px] text-slate-400 font-medium">Landfill methane averted</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Chart */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Meals Rescued Volume</h3>
              <p className="text-[11px] text-slate-400">Weekly trajectory of servings diverted from landfill</p>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
              Live Noida Telemetry
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.weekly_trend}>
                <defs>
                  <linearGradient id="servingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#475569',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="servings"
                  name="Servings Rescued"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#servingsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Servings by Food Category</h3>
              <p className="text-[11px] text-slate-400">Cooked meals, raw groceries, bakery & dairy proportion</p>
            </div>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-semibold">
              Distribution
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.category_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {analytics.category_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#475569',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Urgency Distribution & Safety Compliance Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1">Urgency Distribution</h3>
          <p className="text-[11px] text-slate-400 mb-4">Active batches classified by time-to-spoilage urgency</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.urgency_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#475569',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="value" name="Donation Count" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1">Noida Sector & Hub Rescue Distribution</h3>
          <p className="text-[11px] text-slate-400 mb-3">Live verified partner stations across Rajasthan capital</p>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="pb-2">Zone / Area</th>
                  <th className="pb-2">Primary Entity</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Servings</th>
                  <th className="pb-2">Storage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {donations.slice(0, 5).map((d) => (
                  <tr key={d.id} className="hover:bg-slate-750/50">
                    <td className="py-2.5 font-medium text-slate-200">{d.address}</td>
                    <td className="py-2.5 text-slate-300">{d.restaurant_name}</td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.status === 'delivered'
                            ? 'bg-blue-500/20 text-blue-300'
                            : d.status === 'available'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-emerald-400">{d.servings}</td>
                    <td className="py-2.5 text-slate-400">{d.storage_info}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
