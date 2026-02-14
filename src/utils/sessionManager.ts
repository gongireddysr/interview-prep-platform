/**
 * Session Manager Utility
 * Handles user session UUID generation and storage using browser localStorage
 */

const SESSION_KEY = "user_session_id";

/**
 * Generate a new UUID using the browser's crypto API
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Get the current session ID from localStorage
 * Returns null if no session exists
 */
export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

/**
 * Save a session ID to localStorage
 */
export function saveSessionId(sessionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, sessionId);
}

/**
 * Get existing session ID or create a new one if none exists
 * This is the main function to use when starting a session
 */
export function getOrCreateSessionId(): string {
  const existingId = getSessionId();
  if (existingId) {
    return existingId;
  }
  const newId = generateSessionId();
  saveSessionId(newId);
  return newId;
}

/**
 * Clear the session ID from localStorage (for dev reset)
 */
export function clearSessionId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Check if a session already exists
 */
export function hasExistingSession(): boolean {
  return getSessionId() !== null;
}
