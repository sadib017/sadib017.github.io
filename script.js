/* ── THEME TOGGLE ── */
const html = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
const toggleIcon = document.getElementById('toggleIcon');

function applyTheme(theme) {
  const selectedTheme = theme === 'light' ? 'light' : 'dark';

  html.setAttribute('data-theme', selectedTheme);
  localStorage.setItem('theme', selectedTheme);

  if (toggleIcon) {
    toggleIcon.textContent = selectedTheme === 'dark' ? '☀' : '◑';
  }
}

// Load the previously selected theme
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

// Change theme when the button is clicked
toggleBtn?.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');

  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});


/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.07
    }
  );

  revealEls.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Show all sections for browsers without IntersectionObserver support
  revealEls.forEach((element) => {
    element.classList.add('visible');
  });
}


/* ── ACTIVE NAVIGATION LINK ── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentSectionId = entry.target.id;

        navLinks.forEach((link) => {
          const linkTarget = link.getAttribute('href');

          link.classList.toggle(
            'active',
            linkTarget === `#${currentSectionId}`
          );
        });
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px'
    }
  );

  sections.forEach((section) => {
    navObserver.observe(section);
  });
}


/* ── NAVBAR SHADOW AND BACK-TO-TOP BUTTON ── */
const navbar = document.querySelector('#navbar .nav-inner');
const backTop = document.getElementById('backTop');

function updateScrollUI() {
  // Add navbar shadow after scrolling
  if (navbar) {
    navbar.style.boxShadow =
      window.scrollY > 10
        ? '0 2px 20px rgba(0, 0, 0, 0.3)'
        : 'none';
  }

  // Show or hide the back-to-top button
  if (backTop) {
    const shouldShow = window.scrollY > 400;

    backTop.style.opacity = shouldShow ? '1' : '0';
    backTop.style.pointerEvents = shouldShow ? 'auto' : 'none';
  }
}

if (backTop) {
  backTop.style.opacity = '0';
  backTop.style.pointerEvents = 'none';
  backTop.style.transition = 'opacity 0.3s ease';

  backTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

window.addEventListener('scroll', updateScrollUI, {
  passive: true
});

// Run once when the page loads
updateScrollUI();


/* ── INTEREST TAG INTERACTION ── */
document.querySelectorAll('.interest-tag').forEach((tag) => {
  tag.addEventListener('click', () => {
    tag.classList.add('selected');

    window.setTimeout(() => {
      tag.classList.remove('selected');
    }, 600);
  });
});

/* ── MOBILE MENU ── */
const nav = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');

function setMenu(open) {
  nav.classList.toggle('open', open);
  navMenu.setAttribute('aria-expanded', String(open));
  navMenu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
}

navMenu?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false); });


/* ── ABOUT STATEMENT: WORDS LIGHT UP ON SCROLL ── */
document.querySelectorAll('[data-words]').forEach((el) => {
  // wrap each word in a span, keeping <em> highlights intact
  el.querySelectorAll('*').forEach((child) => child.normalize());
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.textContent = part;
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else {
        walk(child);
      }
    });
  };
  walk(el);

  const words = el.querySelectorAll('.w');
  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.72; // words left of / above this line are lit
    words.forEach((w) => {
      const r = w.getBoundingClientRect();
      if (r.top < line && !w.classList.contains('on')) {
        w.style.transitionDelay = Math.round((r.left / window.innerWidth) * 320) + 'ms'; // left to right along the line
        w.classList.add('on');
      }
    });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
});


/* ── LOCAL CLOCK (DHAKA) ── */
const clock = document.getElementById('localClock');
if (clock) {
  const fmtClock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const tick = () => { clock.textContent = fmtClock.format(new Date()); };
  tick();
  setInterval(tick, 1000);
}
