"use client";

import { clearSessionId } from "@/utils/sessionManager";

/**
 * Reset button to clear session UUID for testing
 */
export default function DevResetButton() {
  const handleReset = () => {
    clearSessionId();
    alert("Session ID cleared! Next 'Start the Grind' will create a new session.");
  };

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-4 right-4 z-50 rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white opacity-70 hover:opacity-100 transition-opacity"
      title="Clear session UUID (Dev only)"
    >
      🗑️ Reset Session
    </button>
  );
}
