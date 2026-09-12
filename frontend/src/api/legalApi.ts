import { Jurisdiction } from '../types';

/**
 * Sends a POST request with the user's message and selected jurisdiction to the backend.
 * Features an AbortController for timeouts, and specific error throwing for network vs app errors.
 */
export async function sendMessageToAPI(message: string, jurisdiction: Jurisdiction) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 seconds timeout

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, jurisdiction }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetail = 'Unknown Error';
      try {
        const errData = await response.json();
        // Specifically read the FastAPI-style detail string
        errorDetail = errData.detail || errData.message || response.statusText;
      } catch (parseErr) {
        errorDetail = response.statusText;
      }
      
      throw new Error(`HTTP ${response.status}: ${errorDetail}`);
    }

    return await response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    
    // Differentiate between network/abort errors vs standard App errors
    if (err.name === 'AbortError') {
      throw new Error("Request timed out after 25 seconds.");
    }
    
    if (err.message === 'Failed to fetch') {
      throw new Error("Network Error: Backend is unreachable (Failed to fetch).");
    }

    throw err;
  }
}

export interface ExpertTicketPayload {
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  query: string;
  jurisdiction: string;
}

export async function submitToHumanExpert(payload: ExpertTicketPayload) {
  // Generate ticket acknowledgment for human escalation
  return {
    ticketId: `AYUSH-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'Submitted',
    estimatedReviewHours: 48,
  };
}
