(function () {
  'use strict';

  var btn = document.querySelector('.menu-btn');
  var drawer = document.getElementById('mobileNav');
  if (!btn || !drawer) return;

  var closeBtn = drawer.querySelector('.mobile-nav__close');
  var panel = drawer.querySelector('.mobile-nav__panel');

  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  function openMenu() {
    drawer.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    lockScroll();

    // Focus pour accessibilité
    if (closeBtn) closeBtn.focus();
  }

  function closeMenu() {
    drawer.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    unlockScroll();

    // Retour focus au bouton menu (safe)
    if (btn && typeof btn.focus === 'function') btn.focus();
  }

  btn.addEventListener('click', function () {
    var isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // ✅ ferme seulement si tu cliques sur l’overlay (pas dans le panel)
  drawer.addEventListener('click', function (e) {
    if (e.target === drawer) closeMenu();
  });

  // Escape closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && !drawer.hidden) closeMenu();
  });

  // Close after clicking a link
  var links = drawer.querySelectorAll('a');
  links.forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
})();
