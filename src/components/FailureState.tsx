import React from 'react';
import { AlertTriangle, RefreshCw, UserCheck, HelpCircle } from 'lucide-react';

interface FailureStateProps {
  errorMessage: string;
  onRetry: () => void;
  onOpenExpertModal: () => void;
}

export const FailureState: React.FC<FailureStateProps> = ({
  errorMessage,
  onRetry,
  onOpenExpertModal,
}) => {
  return (
    <div 
      id="failure-state-alert"
      className="flex justify-start mb-6 pr-4 sm:pr-12 animate-fadeIn"
    >
      <div className="flex items-start gap-3 max-w-2xl w-full">
        <div className="w-8 h-8 rounded-full bg-red-100 border border-red-300 text-red-700 flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
          <AlertTriangle className="w-4 h-4" />
        </div>

        <div className="bg-red-50/80 border border-red-200 rounded-2xl rounded-tl-xs p-4 shadow-xs text-slate-800 w-full">
          <div className="flex items-center gap-2 text-red-900 font-semibold text-sm">
            <span>Query Processing Error</span>
          </div>

          <p className="mt-1 text-xs text-red-800 leading-relaxed">
            {errorMessage || "Unable to reach the regulatory analysis service. Please check network connectivity or retry your request."}
          </p>

          <div className="mt-3 pt-2.5 border-t border-red-200/60 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="retry-query-btn"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Query
            </button>

            <button
              type="button"
              id="failure-escalate-btn"
              onClick={onOpenExpertModal}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-red-100 text-red-900 border border-red-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-red-700" />
              Submit Directly to Human Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
