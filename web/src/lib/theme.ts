export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Inline <head> script: sets data-theme before first paint (saved choice,
 * else the system setting), so there is no flash of the wrong theme. Allowed
 * by the CSP's script-src 'unsafe-inline' (see security-headers.ts).
 */
export const themeScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}`;
