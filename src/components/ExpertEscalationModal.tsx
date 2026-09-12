import React, { useState } from 'react';
import { X, UserCheck, Send, CheckCircle2, ShieldCheck, Clock, Building2, Mail, User, Phone, FileText } from 'lucide-react';
import { submitToHumanExpert } from '../api/legalApi';

interface ExpertEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuery: string;
  jurisdiction: string;
}

export const ExpertEscalationModal: React.FC<ExpertEscalationModalProps> = ({
  isOpen,
  onClose,
  defaultQuery,
  jurisdiction,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState(defaultQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketId: string;
    status: string;
    estimatedReviewHours: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !query.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitToHumanExpert({
        fullName,
        email,
        phone,
        organization,
        query,
        jurisdiction,
      });
      setSubmittedTicket(result);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedTicket(null);
    onClose();
  };

  return (
    <div 
      id="expert-escalation-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={handleResetAndClose}
    >
      <div 
        id="expert-escalation-modal-content"
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b2e] to-[#14533f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Escalate to Ayush Legal Expert</h3>
              <p className="text-xs text-emerald-200">Ministry of Ayush IPR Facilitation Cell</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submittedTicket ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">Inquiry Escalated Successfully</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your regulatory inquiry has been routed to our empaneled patent attorney panel.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Official Ticket ID:</span>
                  <span className="font-mono font-bold text-emerald-900">{submittedTicket.ticketId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Jurisdiction:</span>
                  <span className="font-semibold text-slate-800 capitalize">{jurisdiction} Law</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="font-medium text-slate-800">{email}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est. Review SLA:
                  </span>
                  <span className="font-semibold text-amber-700">{submittedTicket.estimatedReviewHours} Hours</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-close-ticket-modal"
                onClick={handleResetAndClose}
                className="w-full bg-[#1b436d] hover:bg-[#153658] text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm shadow-xs"
              >
                Return to Chat
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 border-l-2 border-amber-500 p-2.5 rounded-r-lg">
                If the AI guidance lacks complete certainty or your formulation involves proprietary extracts or multi-herb synergistic ratios, our expert panel will conduct a formal prior art review.
              </p>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Institution / Pharma Company / Clinic
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. National Institute of Ayurveda"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Query */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Specific Patent / Regulatory Inquiry <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your formulation, herbs involved, or patent challenge..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="submit-expert-ticket-btn"
                  disabled={isSubmitting || !fullName.trim() || !email.trim() || !query.trim()}
                  className="inline-flex items-center gap-1.5 bg-[#0d3b2e] hover:bg-[#14533f] disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry to Attorney'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
