import React, { useState } from 'react';
import { AlertOctagon, X, Send } from 'lucide-react';
import { Donation } from '../types';
import { useApp } from '../context/AppContext';

interface ReportModalProps {
  donation: Donation;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ donation, onClose }) => {
  const { submitReport } = useApp();
  const [reason, setReason] = useState('Temperature Violation (<65C or >4C)');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      alert('Please provide specific details about the observed safety issue.');
      return;
    }

    setSubmitting(true);
    const result = submitReport(donation.id, reason, details);
    setSubmitting(false);

    if (result.success) {
      alert(result.message);
      onClose();
    } else {
      alert(result.message);
    }
  };

  const reportReasons = [
    'Temperature Violation (<65C or >4C)',
    'Packaging Damaged or Broken Seal',
    'Unlisted Allergen Suspected',
    'Pickup Gate Closed or Contact Unreachable',
    'Sensory Spoilage Signs (Odor/Texture/Discoloration)',
    'Preparation Time or Quantity Discrepancy',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-800 border border-red-500/30 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Report Food Safety or Logistics Issue</h3>
            <p className="text-xs text-slate-400">Escalate immediately to FoodBridge Noida Admin Team</p>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-xs text-slate-300">
          <p className="font-semibold text-white">{donation.food_name}</p>
          <p className="text-slate-400">
            Source: {donation.restaurant_name} | {donation.address}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Issue Category</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
            >
              {reportReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Factual Observations & Urgent Details *
            </label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what was observed (e.g., container temperature measured, packaging puncture, volunteer delay, allergen risk)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>

          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-[11px] leading-relaxed">
            Filing this report records an immutable entry into the audit trail and immediately flags this batch for admin review.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Urgent Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
