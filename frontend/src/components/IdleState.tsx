import React from 'react';
import { Scale, BookOpen, ShieldCheck, Sparkles, ArrowRight, Globe, AlertCircle, Building2 } from 'lucide-react';
import { Jurisdiction } from '../types';

interface IdleStateProps {
  jurisdiction: Jurisdiction;
  onSelectPrompt: (promptText: string) => void;
  onOpenExpertModal: () => void;
}

export const IdleState: React.FC<IdleStateProps> = ({
  jurisdiction,
  onSelectPrompt,
  onOpenExpertModal,
}) => {
  const isIndia = jurisdiction === 'india';

  const SAMPLE_PROMPTS = isIndia
    ? [
        {
          title: "Patentability of Traditional Remedy",
          query: "I want to patent a traditional Ayurveda remedy. Can you explain the rules under Indian law?",
          tag: "The Patents Act §3(p)",
        },
        {
          title: "Synergistic Polyherbal Formulations",
          query: "Can a combination of known Ayurvedic herbs with synergistic therapeutic effect be patented under Section 3(e)?",
          tag: "Section 3(e) Synergism",
        },
        {
          title: "Biological Diversity Act Approval",
          query: "Do I need National Biodiversity Authority (NBA) approval under Section 6 before filing a patent using Indian medicinal plants?",
          tag: "NBA Sec 6(1)",
        },
        {
          title: "Evergreening & Efficacy Standard",
          query: "How does Section 3(d) apply to modified extracts of known Ayurvedic plant formulations?",
          tag: "Section 3(d) Efficacy",
        },
      ]
    : [
        {
          title: "Exporting Ayurvedic Formulations to US",
          query: "How does the USPTO evaluate Ayurvedic patent applications against the Traditional Knowledge Digital Library (TKDL)?",
          tag: "USPTO 35 U.S.C. 102/103",
        },
        {
          title: "WIPO & International Prior Art",
          query: "What protections exist under WIPO treaties to prevent biopiracy of Indian traditional medicine abroad?",
          tag: "WIPO IGC Framework",
        },
        {
          title: "European Patent Office (EPO) TK Rules",
          query: "Can an Ayurvedic formulation be patented at the European Patent Office under EPC Article 53/54?",
          tag: "EPO EPC Standards",
        },
        {
          title: "International PCT Filing Strategies",
          query: "What are the regulatory prerequisites before filing an international PCT patent application using Indian biological resources?",
          tag: "PCT & NBA Mandate",
        },
      ];

  return (
    <div id="chat-idle-state" className="max-w-3xl mx-auto py-6 sm:py-10 px-4 text-center animate-fadeIn">
      {/* Official Ayush Branding Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 text-xs font-semibold mb-4 shadow-xs">
        <Scale className="w-3.5 h-3.5 text-emerald-700" />
        <span>Ministry of Ayush • IPR Facilitation Assistance</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Welcome to <span className="text-emerald-800">IP-SAKTI Sahayak</span>
      </h2>

      <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
        Your dedicated regulatory assistant for Ayurveda, Yoga, Unani, Siddha, and Homeopathy intellectual property rights. We deliver structured legal guidance with verifiable statutory citation cards.
      </p>

      {/* Active Jurisdiction Badge */}
      <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
        <Globe className="w-3.5 h-3.5 text-emerald-700" />
        <span>Active Jurisdiction: <strong className="text-slate-900 capitalize">{jurisdiction}</strong></span>
        <span className="text-slate-400">•</span>
        <span className="text-emerald-700">Toggleable at the top banner</span>
      </div>

      {/* Trust Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-7 text-left">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-900 text-xs">Statutory Citations</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-normal">
            Every guidance point is grounded in specific sections of the Patents Act, 1970 and TKDL databases.
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-900 text-xs">Expandable Legal Cards</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-normal">
            Inspect statutory text, legal interpretations, authorities, and confidence scores for each citation.
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-900 text-xs">Human Expert Escalation</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-normal">
            Uncertain of your formulation's patentability? Submit directly to an empaneled patent attorney.
          </p>
        </div>
      </div>

      {/* Suggested Prompt Starters */}
      <div className="text-left mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Recommended Regulatory Queries
          </span>
          <span className="text-xs text-slate-400">Click any prompt to start</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              id={`sample-prompt-${idx}`}
              type="button"
              onClick={() => onSelectPrompt(prompt.query)}
              className="group text-left p-3.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-300 shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  {prompt.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-800 transition-colors">
                  {prompt.tag}
                </span>
              </div>
              <p className="text-xs text-slate-500 group-hover:text-slate-700 line-clamp-2 leading-relaxed">
                "{prompt.query}"
              </p>
              <div className="mt-2 text-[11px] font-medium text-emerald-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Analyze query</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
