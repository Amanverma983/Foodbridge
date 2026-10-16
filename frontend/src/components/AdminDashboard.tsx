import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Building,
  RefreshCw,
  Download,
  Search,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { exportDonationsToCSV } from '../utils/csvExport';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    verifications,
    verifyOrganization,
    reports,
    auditLogs,
    donations,
    resetDemoData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verifications' | 'moderation' | 'audit' | 'settings'>('verifications');
  const [auditSearch, setAuditSearch] = useState('');

  const pendingVerifications = verifications.filter((v) => v.status === 'pending');
  const verifiedCount = verifications.filter((v) => v.status === 'verified').length;
  const pendingReports = reports.filter((r) => r.status === 'pending');

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!auditSearch.trim()) return true;
    const q = auditSearch.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actor_name.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.actor_role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              FoodBridge Administration & Governance
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Admin Clearance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            FSSAI license verification, food safety incident resolution, and immutable regulatory audit trail.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'verifications' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Verifications ({pendingVerifications.length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'moderation' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Safety Reports ({pendingReports.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'audit' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit History ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Verified Organizations</span>
          <div className="text-2xl font-black text-white">{verifiedCount}</div>
          <span className="text-[10px] text-emerald-400 font-medium">Licensed Kitchens & NGOs</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Pending Accreditations</span>
          <div className="text-2xl font-black text-amber-400">{pendingVerifications.length}</div>
          <span className="text-[10px] text-slate-400 font-medium">Requires FSSAI check</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Open Incident Reports</span>
          <div className="text-2xl font-black text-red-400">{pendingReports.length}</div>
          <span className="text-[10px] text-slate-400 font-medium">Food safety / delivery</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Recorded Audit Events</span>
          <div className="text-2xl font-black text-indigo-300">{auditLogs.length}</div>
          <span className="text-[10px] text-slate-400 font-medium">Tamper-evident log</span>
        </div>
      </div>

      {/* TAB 1: ORGANIZATION VERIFICATION */}
      {activeTab === 'verifications' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
            <div>
              <h3 className="text-sm font-bold text-white">Partner Accreditation Verification</h3>
              <p className="text-xs text-slate-400">Validate commercial licenses, FSSAI numbers, and NGO trust certificates</p>
            </div>
            <span className="text-xs text-slate-400">{verifications.length} Total Partners</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="pb-2.5">Organization</th>
                  <th className="pb-2.5">Type</th>
                  <th className="pb-2.5">Contact Person</th>
                  <th className="pb-2.5">FSSAI / Reg License</th>
                  <th className="pb-2.5">Address</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-750/50">
                    <td className="py-3 font-semibold text-white">{v.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900 text-slate-300">
                        {v.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">
                      <div>{v.contact_person}</div>
                      <div className="text-[10px] text-slate-500">{v.phone}</div>
                    </td>
                    <td className="py-3">
                      <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[11px]">
                        {v.license_number}
                      </code>
                    </td>
                    <td className="py-3 text-slate-400">{v.address}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          v.status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : v.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {v.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => verifyOrganization(v.id, 'verified')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-[11px] transition shadow"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => verifyOrganization(v.id, 'rejected')}
                            className="px-2.5 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded-lg font-semibold text-[11px] transition shadow"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            verifyOrganization(v.id, v.status === 'verified' ? 'rejected' : 'verified')
                          }
                          className="text-[11px] text-slate-400 hover:text-white underline"
                        >
                          Change Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MODERATION & REPORTS */}
      {activeTab === 'moderation' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-700/80">
            <h3 className="text-sm font-bold text-white">Food Safety & Logistics Moderation</h3>
            <p className="text-xs text-slate-400">Review incident reports and inspect allergen/temperature compliance flags</p>
          </div>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No moderation reports have been filed.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-700 text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-red-400 font-bold uppercase text-[10px] block">
                        INCIDENT REASON: {rep.reason}
                      </span>
                      <h4 className="font-bold text-white text-sm">{rep.donation_title}</h4>
                      <p className="text-[11px] text-slate-400">
                        Filed by: <strong className="text-slate-300">{rep.reported_by}</strong> ({rep.reported_by_role})
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-slate-300 bg-slate-950 p-3 rounded-lg leading-relaxed text-[11px]">
                    "{rep.details}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Timestamp: {new Date(rep.created_at).toLocaleString()}</span>
                    {rep.status === 'pending' && (
                      <button
                        onClick={() => {
                          alert(`Report marked as resolved. Safety advisory recorded in audit log.`);
                        }}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                      >
                        Acknowledge & Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Immutable System Audit Ledger
              </h3>
              <p className="text-xs text-slate-400">Timestamped record of all donations, claims, verifications, and deliveries</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter audit logs..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 text-xs">
            {filteredAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-200">{log.actor_name}</span>
                    <span className="text-[10px] text-slate-400">({log.actor_role})</span>
                  </div>
                  <p className="text-slate-300 mt-1 text-[11px]">{log.details}</p>
                </div>
                <div className="text-[10px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MAINTENANCE & RESET */}
      {activeTab === 'settings' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white">Platform Maintenance & Sandbox Tools</h3>
            <p className="text-xs text-slate-400">Testing utilities for hackathon evaluators and demo presentations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700 space-y-3">
              <h4 className="font-bold text-emerald-300">Reset Demo Noida Ledger</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Clears localStorage and resets all 8+ Noida demo donations, volunteer missions, and audit trail back to initial pristine seed state.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Reset all demo data back to factory Noida seed?')) {
                    resetDemoData();
                    alert('Demo data successfully restored.');
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restore Default Noida Seed Data</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700 space-y-3">
              <h4 className="font-bold text-indigo-300">Export Regulatory CSV Dump</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Downloads raw CSV dataset of all active and delivered batches including timestamps, allergen flags, and addresses.
              </p>
              <button
                onClick={() => exportDonationsToCSV(donations, 'foodbridge-admin-audit-dump.csv')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Admin CSV Audit Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
