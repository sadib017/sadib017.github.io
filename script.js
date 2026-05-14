/* ── THEME TOGGLE ── */
const html = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
const toggleIcon = document.getElementById('toggleIcon');
function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  toggleIcon.textContent = theme === 'dark' ? '☀' : '◑';
}
toggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});
// Load saved preference
const saved = localStorage.getItem('theme') || 'dark';
applyTheme(saved);
/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
revealEls.forEach(el => revealObs.observe(el));
/* ── ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id], div[id="about"], footer[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObs.observe(s));
/* ── NAVBAR SHADOW ON SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 2px 20px rgba(0,0,0,0.3)'
    : 'none';
});
/* ── BACK TO TOP ── */
const backTop = document.getElementById('backTop');
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('scroll', () => {
  backTop.style.opacity = window.scrollY > 400 ? '1' : '0';
  backTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
});
backTop.style.opacity = '0';
backTop.style.transition = 'opacity 0.3s';
/* ── AVATAR UPLOAD (click to replace) ── */
const avatarEl = document.getElementById('avatarEl');
avatarEl.title = 'Click to upload photo';
avatarEl.style.cursor = 'pointer';
avatarEl.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    avatarEl.innerHTML = '';
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
    avatarEl.appendChild(img);
  };
  input.click();
});
/* ── INTEREST TAG interaction ── */
document.querySelectorAll('.interest-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.style.borderColor = 'var(--accent)';
    tag.style.color = 'var(--accent)';
    setTimeout(() => {
      tag.style.borderColor = '';
      tag.style.color = '';
    }, 600);
  });
});
/* ── STATUS CYCLE ── */
const STATUS_STATES = ['ongoing', 'under-review', 'published'];
const PROJECT_LABELS = { 'ongoing': 'Ongoing', 'under-review': 'Under Review', 'published': 'Published' };
const PUB_LABELS     = { 'ongoing': 'In Progress', 'under-review': 'Under Review', 'published': 'Published' };

function cycleProjectStatus(btn) {
  const current = btn.getAttribute('data-status');
  const next = STATUS_STATES[(STATUS_STATES.indexOf(current) + 1) % STATUS_STATES.length];
  btn.setAttribute('data-status', next);
  btn.querySelector('.status-text').textContent = PROJECT_LABELS[next];
}

function cyclePubStatus(btn) {
  const current = btn.getAttribute('data-status');
  const next = STATUS_STATES[(STATUS_STATES.indexOf(current) + 1) % STATUS_STATES.length];
  btn.setAttribute('data-status', next);
  btn.querySelector('.status-text').textContent = PUB_LABELS[next];
}