import React from 'react';
import { Jurisdiction } from '../types';

interface HeaderProps {
  jurisdiction: Jurisdiction;
  onJurisdictionChange: (newJurisdiction: Jurisdiction) => void;
}

export const Header: React.FC<HeaderProps> = ({
  jurisdiction,
  onJurisdictionChange,
}) => {
  const isIndia = jurisdiction === 'India';

  return (
    <header className="relative w-full bg-gradient-to-r from-[#0a192f] to-[#114b3e] text-white shadow-md overflow-hidden flex-shrink-0 z-10">
      {/* Right-Side Overlay Graphic (Mandala + Head with Lightbulb) */}
      <div className="absolute inset-y-0 right-0 w-[500px] opacity-30 pointer-events-none flex items-center justify-end overflow-hidden mix-blend-screen">
        <img 
          src="/brain.webp" 
          alt="Brain Graphic" 
          className="h-[150%] max-w-none object-cover transform translate-x-12 opacity-80 invert brightness-125"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Content (Branding) */}
        <div className="flex items-center gap-5">
          {/* State Emblem of India (Lion Capital) */}
          <div className="flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center relative">
            <img 
              src={`/images.jpg?v=${Date.now()}`}
              alt="State Emblem of India" 
              className="relative z-10 max-w-full max-h-full object-contain invert mix-blend-screen scale-110" 
            />
          </div>
          
          <div className="flex flex-col">
            <div className="text-sm text-white font-normal">
              IP-SAKTI Sahayak | Ministry of Ayush
            </div>
            <div className="text-2xl font-bold text-white tracking-wide mt-0.5">
              IP & Regulatory Facilitation Cell
            </div>
          </div>
        </div>

        {/* Right Content (Toggle) */}
        <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-5 py-2.5 z-10 relative gap-4 border border-white/10 shadow-inner">
          <span 
            className={`text-sm font-semibold transition-colors cursor-pointer ${isIndia ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            onClick={() => onJurisdictionChange('India')}
          >
            India
          </span>
          <button
            type="button"
            onClick={() => onJurisdictionChange(isIndia ? 'International' : 'India')}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${!isIndia ? 'bg-[#1e40af]' : 'bg-white/40'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${!isIndia ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span 
            className={`text-sm font-semibold transition-colors cursor-pointer ${!isIndia ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            onClick={() => onJurisdictionChange('International')}
          >
            International
          </span>
        </div>
      </div>
    </header>
  );
};
