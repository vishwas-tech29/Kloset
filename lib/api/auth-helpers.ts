/**
 * Auth helper functions for API routes
 * 
 * Note: Authentication has been removed from this application.
 * These functions are kept for compatibility but will throw errors
 * if admin-only routes are accessed.
 */

/**
 * Require admin access (throws error since auth is removed)
 */
export async function requireAdmin(): Promise<void> {
  // Since authentication is removed, admin routes are not accessible
  throw new Error('Forbidden: Admin access required');
}

/**
 * Get current user (returns null since auth is removed)
 */
export async function getCurrentUser(): Promise<null> {
  return null;
}

/**
 * Check if user is authenticated (always returns false)
 */
export function isAuthenticated(): boolean {
  return false;
}

/**
 * Check if user is admin (always returns false)
 */
export function isAdmin(): boolean {
  return false;
}
