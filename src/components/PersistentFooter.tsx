import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const PersistentFooter: React.FC = () => {
  return (
    <footer 
      id="persistent-disclaimer-footer"
      className="w-full bg-slate-100 border-t border-slate-200/90 py-2 px-4 text-center select-none"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-500 leading-snug">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <p>
          <strong className="text-slate-700 font-semibold">Regulatory Disclaimer:</strong> IP-SAKTI Sahayak provides statutory reference and procedural regulatory guidance rather than formal legal advice. For patent drafting, litigation, or binding opinions, consult an empaneled patent attorney or legal practitioner.
        </p>
      </div>
    </footer>
  );
};
