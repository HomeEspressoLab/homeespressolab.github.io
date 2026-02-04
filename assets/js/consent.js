/* =========================================================
   HomeEspressoLab — consent.js (Consent Mode v2)
   - Default consent is set in <head> BEFORE gtag.js loads
   - Stores choice in localStorage
   - "Custom" does NOT auto-enable analytics
   ========================================================= */

(() => {
  const KEY = "hel_consent_v1";

  const el = document.getElementById("consent");
  const custom = document.getElementById("consentCustom");
  const toggleAnalytics = document.getElementById("toggleAnalytics");

  const g = (...args) => {
    if (typeof window.gtag === "function") window.gtag(...args);
  };

  const show = () => { if (el) el.hidden = false; };
  const hide = () => { if (el) el.hidden = true; };

  const safeParse = (str) => {
    try { return JSON.parse(str); } catch { return null; }
  };

  const read = () => {
    try { return safeParse(localStorage.getItem(KEY) || "null"); }
    catch { return null; }
  };

  const write = (obj) => {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch {}
  };

  const applyConsent = (state) => {
    g("consent", "update", {
      analytics_storage: state.analytics ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      personalization_storage: "denied",
      functionality_storage: "granted",
      security_storage: "granted"
    });
  };

  const saved = read();

  if (custom) custom.hidden = true;

  if (saved && typeof saved.analytics === "boolean") {
    applyConsent(saved);
    hide();
    if (toggleAnalytics) toggleAnalytics.checked = !!saved.analytics;
  } else {
    show();
    if (toggleAnalytics) toggleAnalytics.checked = false;
  }

  document.addEventListener("click", (e) => {
    const btn = e.target?.closest?.("[data-consent]");
    if (!btn) return;

    const action = btn.getAttribute("data-consent");

    if (action === "accept") {
      const state = { analytics: true, ts: Date.now(), v: 1 };
      write(state);
      applyConsent(state);
      hide();
      if (custom) custom.hidden = true;
      return;
    }

    if (action === "reject") {
      const state = { analytics: false, ts: Date.now(), v: 1 };
      write(state);
      applyConsent(state);
      hide();
      if (custom) custom.hidden = true;
      return;
    }

    if (action === "custom") {
      if (custom) custom.hidden = false;

      const cur = read();
      if (toggleAnalytics) {
        toggleAnalytics.checked =
          (cur && typeof cur.analytics === "boolean") ? !!cur.analytics : false;
      }
      return;
    }

    if (action === "save") {
      const state = {
        analytics: !!toggleAnalytics?.checked,
        ts: Date.now(),
        v: 1
      };
      write(state);
      applyConsent(state);
      hide();
      if (custom) custom.hidden = true;
      return;
    }
  });
})();
