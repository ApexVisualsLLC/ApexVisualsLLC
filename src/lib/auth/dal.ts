import "server-only";
import { cache } from "react";
import { readAdminSessionCookie } from "./session";

/**
 * The single source of truth for "is this request an authenticated admin."
 * Cached per-request so it's cheap to call from a page AND independently
 * again from every Server Action it invokes (each action must re-check —
 * render-time gating alone is not a security boundary, since actions are
 * their own reachable endpoints).
 */
export const verifyAdminSession = cache(async (): Promise<boolean> => {
  return readAdminSessionCookie();
});
