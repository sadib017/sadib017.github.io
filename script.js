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
const navbar = document.getElementById('navbar');
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