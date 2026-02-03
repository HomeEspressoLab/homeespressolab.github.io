(() => {
  const isAmazon = (url) => {
    try {
      const u = new URL(url, location.href);
      return /(^|\.)amazon\./i.test(u.hostname);
    } catch { return false; }
  };

  const hasAffiliateTag = (url) => {
    try {
      const u = new URL(url, location.href);
      return u.searchParams.has("tag") || /tag=/.test(u.search);
    } catch { return false; }
  };

  const send = (name, params) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, params);
  };

  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    const isOutbound = (() => {
      try {
        const u = new URL(href, location.href);
        return u.origin !== location.origin;
      } catch { return false; }
    })();

    if (isAmazon(href)) {
      send("affiliate_click", {
        affiliate_network: "amazon",
        link_url: href,
        link_domain: "amazon",
        has_tag: hasAffiliateTag(href) ? "yes" : "no"
      });
      return;
    }

    // Optional: track other outbound clicks
    if (isOutbound) {
      send("outbound_click", {
        link_url: href,
        link_domain: (() => { try { return new URL(href, location.href).hostname; } catch { return ""; } })()
      });
    }
  }, { capture: true });
})();
