export type Jurisdiction = 'India' | 'International';

export interface LegalCitation {
  source: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  jurisdiction?: Jurisdiction;
  citations?: LegalCitation[];
  isError?: boolean;
}
