/**
 * =========================================================
 *  CONFIG.JS  –  Portfolio AI & Services Configuration
 * =========================================================
 *
 *  ⚠️  SECURITY NOTICE:
 *  -------------------------------------------------------
 *  API keys stored here ARE VISIBLE to anyone who opens
 *  the browser DevTools → Sources / Network tab.
 *
 *  ✅  RECOMMENDED (for production):
 *  Deploy a lightweight Cloudflare Worker / Vercel Edge
 *  Function to proxy requests and keep keys server-side.
 *
 *  ✅  AT MINIMUM:
 *  - Keep config.js in .gitignore (already done ✔)
 *  - Rotate (regenerate) keys regularly from each provider
 *  - Set API key quotas / restrictions in each dashboard
 * =========================================================
 *
 *  EmailJS Setup (for Feedback Form):
 *  1. Sign up free at https://www.emailjs.com/
 *  2. Create a Service (Gmail / Outlook)
 *  3. Create an Email Template with variables:
 *       {{from_name}}, {{from_role}}, {{message}}, {{recommend}}
 *  4. Fill in the three EMAILJS_* values below
 */

window.PORTFOLIO_CONFIG = {
    // ── PROXY SETTINGS (10/10 Security) ──────────────────
    USE_PROXY: true, // Set to true after setting up Cloudflare Worker
    PROXY_URL: "https://winter-dream-6e3cgemini-proxy.mohamedsalahacc5050.workers.dev",    // e.g. "https://your-worker.name.workers.dev"

    // ── Chatbot AI Keys ──────────────────────────────────
    // (Used only if USE_PROXY is false)
    GEMINI_API_KEY: "", // Key is now secured in Cloudflare
    GITHUB_TOKEN: "",   // Key is now secured in Cloudflare
    OPENROUTER_KEY: "",  // Key is now secured in Cloudflare

    // ── EmailJS (Feedback Form) ──────────────────────────
    // Leave empty strings to run in dev/log-only mode
    EMAILJS_SERVICE_ID: "service_lvodp0f",
    EMAILJS_TEMPLATE_ID: "template_0tkc56w",
    EMAILJS_PUBLIC_KEY: "O1cvkBCJXkOE0x38P"
};
