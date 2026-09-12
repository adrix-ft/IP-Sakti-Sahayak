import React from 'react';
import { FileText } from 'lucide-react';
import { LegalCitation } from '../types';

interface CitationCardProps {
  citation: LegalCitation;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation }) => {
  return (
    <div className="flex flex-col gap-1.5 bg-[#dcfce7] text-[#166534] px-4 py-3 rounded-lg border border-[#bbf7d0] my-2 w-fit max-w-full shadow-sm">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">
            Source: {citation.source}
          </span>
        </div>
        {citation.confidence !== undefined && (
          <span className="text-xs font-bold bg-[#bbf7d0] text-[#14532d] px-2 py-0.5 rounded-full border border-[#86efac]">
            {citation.confidence}% Match
          </span>
        )}
      </div>
      {citation.text && (
        <span className="text-sm text-[#14532d] ml-7 italic">
          "{citation.text}"
        </span>
      )}
    </div>
  );
};

