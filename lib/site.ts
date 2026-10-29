export const SITE_NAME = "Instinct";
export const TAGLINE = "Five situations. Your gut instinct. Let's see what it says about you.";

/** Resolved at build time in next.config.ts, so it's the same on server and client. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
