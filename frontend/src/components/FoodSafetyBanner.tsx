import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Thermometer, Clock, X, Info } from 'lucide-react';

export const FoodSafetyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border-y border-amber-600/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <p className="text-slate-200">
              <strong className="text-amber-300 font-semibold">Strict Food Safety Protocol: </strong>
              Per FSSAI regulations, donations must be prepared under hygienic standards and temperature-monitored.
              <span className="text-slate-400 ml-1 hidden sm:inline">
                We never rely on automated predictions for safety; strict human verification and safe temperature handling are mandatory.
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="text-emerald-400 hover:text-emerald-300 underline font-medium"
            >
              View Guidelines
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-700/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">FoodBridge Safety & FSSAI Standards</h3>
                <p className="text-xs text-slate-400">Noida Food Recovery Hygiene Compliance Protocol</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex gap-2.5 text-amber-200">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Zero AI-Sanctified Safety Policy</strong>
                  FoodBridge never determines whether food is safe or fit for human consumption via computer vision, images, or AI predictions. Physical inspection, kitchen certification, time-temperature checks, and chain of custody are legally binding.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                  <div className="flex items-center gap-2 font-semibold text-emerald-300 mb-1">
                    <Thermometer className="w-4 h-4 text-emerald-400" />
                    Temperature Control
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Hot cooked food maintained at or above 65°C.</li>
                    <li>Chilled dairy & prepared salads held below 4°C.</li>
                    <li>Avoid the "Danger Zone" (5°C to 60°C) during transit.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                  <div className="flex items-center gap-2 font-semibold text-emerald-300 mb-1">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Shelf-Life & Deadlines
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Cooked meals must be consumed within 4 hours of preparation unless properly refrigerated.</li>
                    <li>Pickups must occur prior to the declared deadline.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                <div className="flex items-center gap-2 font-semibold text-emerald-300 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Allergen Transparency
                </div>
                <p className="text-slate-400">
                  All potential allergens (dairy, nuts, gluten, soy, eggs, shellfish) must be declared explicitly before handoff. Recipient NGOs verify dietary restrictions of beneficiaries.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                <div className="flex items-center gap-2 font-semibold text-emerald-300 mb-1">
                  <Info className="w-4 h-4 text-emerald-400" />
                  Incident Reporting & Sanctions
                </div>
                <p className="text-slate-400">
                  Any beneficiary or volunteer observing temperature abuse, broken packaging, or signs of spoilage is required to trigger an immediate "Food Safety Incident Report" to halt distribution.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition"
              >
                I Understand & Comply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
