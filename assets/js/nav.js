(function () {
  'use strict';

  var btn = document.querySelector('.menu-btn');
  var drawer = document.getElementById('mobileNav');
  if (!btn || !drawer) return;

  var closeBtn = drawer.querySelector('.mobile-nav__close');
  var panel = drawer.querySelector('.mobile-nav__panel');

  function openMenu() {
    drawer.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    // focus
    if (closeBtn) closeBtn.focus();
  }

  function closeMenu() {
    drawer.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    btn.focus();
  }

  btn.addEventListener('click', function () {
    var isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // click outside panel closes
  drawer.addEventListener('click', function (e) {
    if (!panel) return;
    if (!panel.contains(e.target)) closeMenu();
  });

  // escape closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) closeMenu();
  });

  // close after clicking a link
  var links = drawer.querySelectorAll('a');
  links.forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
})();
