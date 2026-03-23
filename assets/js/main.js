/* ══════════════════════════════════════════
   Dr. Joaquim Lopes - Global Scripts
   ══════════════════════════════════════════ */

// ── Mobile menu ──
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const burger = document.getElementById('hamburger');
  links.classList.toggle('open');
  burger.classList.toggle('open');
  document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
}

document.addEventListener('DOMContentLoaded', () => {
  // Close menu on link click
  document.querySelectorAll('#navLinks a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Nav shadow on scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Active nav link (based on current page)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Scroll-reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});
