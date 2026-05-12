/* main.js — SmileCare shared interactions */

// Custom cursor
const cursor = document.querySelector('.cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX - 9 + 'px';
    cursor.style.top  = e.clientY - 9 + 'px';
  });
  document.querySelectorAll('a, button, .card, .habit-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursor.style.background = 'rgba(26,107,107,0.2)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.background = 'transparent';
    });
  });
}

// Scroll reveal
const reveals = document.querySelectorAll(
  '.card, .tech-card, .mistake-card, .tip-big, .tip-sm, .zone-card, .step-item, .routine-col, .stat'
);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = entry.target.style.transform
        ? entry.target.style.transform.replace('translateY(30px)', 'translateY(0)')
        : 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Navbar scroll behavior
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

// Scale bar animation for mistakes page
document.querySelectorAll('.scale-fill').forEach(bar => {
  const w = bar.style.width;
  bar.style.width = '0';
  bar.style.setProperty('--final-w', w);
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      bar.style.width = w;
      io.disconnect();
    }
  }, { threshold: 0.4 });
  io.observe(bar);
});
