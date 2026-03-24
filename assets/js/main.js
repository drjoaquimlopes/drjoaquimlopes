/* ══════════════════════════════════════════
   Dr. Joaquim Lopes - Global Scripts
   ══════════════════════════════════════════ */

// ── Mobile menu ──
function toggleMenu() {
  var drawer = document.getElementById('navDrawer');
  var burger = document.getElementById('hamburger');
  var overlay = document.getElementById('navOverlay');
  var isOpen = drawer.classList.contains('open');

  drawer.classList.toggle('open', !isOpen);
  burger.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function closeMenu() {
  var drawer = document.getElementById('navDrawer');
  if (drawer.classList.contains('open')) toggleMenu();
}

document.addEventListener('DOMContentLoaded', function () {

  // Close drawer when clicking a navigation link
  var drawerLinks = document.querySelectorAll('#navDrawer li:not(.nav-drawer-social) a');
  for (var i = 0; i < drawerLinks.length; i++) {
    drawerLinks[i].addEventListener('click', closeMenu);
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Nav shadow on scroll
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Active nav link (desktop + drawer)
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var allLinks = document.querySelectorAll('.nav-links a, .nav-drawer a');
  for (var j = 0; j < allLinks.length; j++) {
    var href = allLinks[j].getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      allLinks[j].classList.add('active');
    }
  }

  // Scroll-reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  var reveals = document.querySelectorAll('.reveal');
  for (var k = 0; k < reveals.length; k++) io.observe(reveals[k]);
});
