import React, { useEffect, useState } from 'react';
import { Loader2, Scale, BookOpen, ShieldCheck } from 'lucide-react';
import { Jurisdiction } from '../types';

interface ThinkingIndicatorProps {
  jurisdiction: Jurisdiction;
}

const SEARCH_STEPS = [
  'Querying Traditional Knowledge Digital Library (TKDL) database...',
  'Checking Section 3(p) & Section 3(d) of The Patents Act, 1970...',
  'Evaluating National Biodiversity Authority (NBA) prior approval mandates...',
  'Analyzing international prior art and WIPO defensive publication standards...',
  'Synthesizing legal rationale and extracting statutory citation cards...',
];

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ jurisdiction }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % SEARCH_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="thinking-state-indicator"
      className="flex justify-start mb-6 pr-4 sm:pr-12 animate-fadeIn"
    >
      <div className="flex items-start gap-3 max-w-2xl w-full">
        {/* Assistant Avatar */}
        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-xs mt-1 animate-pulse">
          <Scale className="w-4 h-4" />
        </div>

        {/* Thinking Card */}
        <div className="bg-white border border-emerald-200/80 rounded-2xl rounded-tl-xs p-4 shadow-xs text-slate-800 w-full">
          <div className="flex items-center gap-2.5 text-emerald-900 font-medium text-xs mb-2">
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
            <span className="font-semibold tracking-wide uppercase text-[11px] text-emerald-800">
              IP-SAKTI Regulatory Engine Active ({jurisdiction})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Animated bouncing dots */}
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
            </div>

            <p className="text-xs text-slate-600 font-mono tracking-tight transition-all duration-300">
              {SEARCH_STEPS[stepIndex]}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Accessing Section 3(p) statutory archives</span>
            <span>Est. 1-2s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
