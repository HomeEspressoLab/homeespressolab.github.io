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

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
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
      ad_personalization: "denied"
    });
  };

  const saved = read();
  if (saved && typeof saved.analytics === "boolean") {
    applyConsent(saved);
    hide();
  } else {
    show();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target && e.target.closest && e.target.closest("[data-consent]");
    if (!btn) return;

    const action = btn.getAttribute("data-consent");

    if (action === "accept") {
      const state = { analytics: true, ts: Date.now() };
      write(state); applyConsent(state); hide(); return;
    }

    if (action === "reject") {
      const state = { analytics: false, ts: Date.now() };
      write(state); applyConsent(state); hide(); return;
    }

    if (action === "custom") {
      if (custom) custom.hidden = false;
      if (toggleAnalytics) toggleAnalytics.checked = true;
      return;
    }

    if (action === "save") {
      const state = { analytics: !!(toggleAnalytics && toggleAnalytics.checked), ts: Date.now() };
      write(state); applyConsent(state); hide(); return;
    }
  });
})();
