/**
 * User ID Manager Utility
 * Handles user UUID generation and storage using browser localStorage
 */

const USER_ID_KEY = "user_id";
const OLD_SESSION_KEY = "user_session_id";

/**
 * Migrate from old localStorage key to new key
 * This preserves the original UUID when transitioning from session_id to user_id
 */
export function migrateFromOldKey(): void {
  if (typeof window === "undefined") return;
  
  const oldValue = localStorage.getItem(OLD_SESSION_KEY);
  const newValue = localStorage.getItem(USER_ID_KEY);
  
  if (oldValue && !newValue) {
    // Migrate old value to new key
    localStorage.setItem(USER_ID_KEY, oldValue);
  }
  
  // Always remove old key if it exists
  if (oldValue) {
    localStorage.removeItem(OLD_SESSION_KEY);
  }
}

/**
 * Generate a new UUID using the browser's crypto API
 */
export function generateUserId(): string {
  return crypto.randomUUID();
}

/**
 * Get the current user ID from localStorage
 * Returns null if no user exists
 * Automatically migrates from old key if needed
 */
export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  migrateFromOldKey();
  return localStorage.getItem(USER_ID_KEY);
}

/**
 * Save a user ID to localStorage
 */
export function saveUserId(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_ID_KEY, userId);
}

/**
 * Get existing user ID or create a new one if none exists
 * This is the main function to use when starting a session
 */
export function getOrCreateUserId(): string {
  const existingId = getUserId();
  if (existingId) {
    return existingId;
  }
  const newId = generateUserId();
  saveUserId(newId);
  return newId;
}

/**
 * Clear the user ID from localStorage (for reset)
 */
export function clearUserId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_ID_KEY);
}

/**
 * Check if a user already exists
 */
export function hasExistingUser(): boolean {
  return getUserId() !== null;
}

// Legacy aliases for backward compatibility
export const getSessionId = getUserId;
export const clearSessionId = clearUserId;
export const getOrCreateSessionId = getOrCreateUserId;
