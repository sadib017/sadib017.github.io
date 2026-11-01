/* ── RENDER: builds every section from content.js ──
   Runs before script.js / sections.js, which then add the interactions.
   You should not need to edit this file; change content.js instead. */
(function () {
  const S = window.SITE;
  if (!S) return;
  const $ = (s) => document.querySelector(s);
  const set = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };
  const pad = (n) => String(n).padStart(2, '0');
  const strip = (h) => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent; };
  const ext = 'target="_blank" rel="noopener noreferrer"';
  const arrow = ' <span aria-hidden="true">↗</span>';

  const ICONS = {
    cv: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12M6 11l6 6 6-6M5 20h14"/></svg>',
    linkedin: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    github: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    orcid: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/></svg>',
    kaggle: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v18M17.5 5.5 9 13.5M11.5 11l6.5 8.5"/></svg>',
    telegram: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
    email: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    link: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
  };
  const linkBtn = (l) => `<a href="${l.url}" ${ext} class="link-btn${l.primary ? ' link-btn-primary' : ''}">${ICONS[l.icon] || ICONS.link} ${l.label}</a>`;
  const tags = (list) => `<div class="tags">${list.map((t) => `<span>${t}</span>`).join('')}</div>`;
  const status = `<span class="live-dot"></span>${S.person.status}`;

  /* nav, rail, section headers */
  set('#navLinks', S.sections.map((s) => `<li><a href="#${s.id}">${s.nav}</a></li>`).join(''));
  const rail = $('.rail');
  if (rail) rail.insertAdjacentHTML('beforeend', S.sections.map((s, i) => `<a href="#${s.id}" class="stage" data-for="${pad(i + 1)}">${pad(i + 1)} ${s.stage}<small>${s.nav}</small></a>`).join(''));
  S.sections.forEach((s, i) => {
    const sec = document.getElementById(s.id);
    if (!sec) return;
    sec.dataset.stage = pad(i + 1);
    const head = sec.querySelector('[data-header]');
    const right = s.id === 'projects' ? `<span id="projFilterLabel">${S.projects.length} projects</span>` : `<span>${s.label || s.title}</span>`;
    if (head) head.innerHTML = `<p class="hud-row"><span class="accent">${pad(i + 1)}</span> ${s.stage}<span class="hud-line"></span>${right}</p><h2 class="section-title">${s.title}</h2>`;
    const fhud = sec.querySelector('[data-hud]');
    if (fhud) fhud.innerHTML = `<span class="accent">${pad(i + 1)}</span> ${s.stage}<span class="hud-line"></span><span>${status}</span>`;
  });

  /* hero */
  const H = S.hero;
  set('#heroLabel', `<span class="accent">00</span> Init <span class="hud-rule"></span> ${H.label}`);
  set('#heroName', S.person.name.join('<br/>'));
  set('#heroTagline', H.tagline);
  set('#heroFacts', H.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v === 'status' ? status : v}</dd></div>`).join(''));
  set('#heroLinks', S.links.filter((l) => l.hero).map(linkBtn).join(''));
  const photo = $('.portrait-photo');
  if (photo) { photo.src = H.photo; photo.alt = S.person.fullName; photo.dataset.focus = H.photoFocus; }
  set('.portrait-tag-l', H.photoTags[0] || '');
  set('.portrait-tag-r', H.photoTags[1] || '');
  const T = H.telemetry;
  set('#telemetryPos', `LAT ${T.lat} &nbsp;LON ${T.lon}`);
  set('#telemetryCity', `${T.city.toUpperCase()} <b id="localClock">--:--:--</b>`);

  /* about */
  set('#aboutStatement', S.about.statement);
  set('#aboutFocus', `<p class="about-focus-label">${S.about.focusTitle}</p><ul class="about-focus-list">${S.about.focus.map((f) => `<li>${f}</li>`).join('')}</ul>`);

  /* skills */
  set('#stackList', Object.entries(S.skills.categories).map(([k, v]) => `<div><dt>${k}</dt><dd>${v.join(' · ')}</dd></div>`).join(''));
  const tick = S.skills.ticker.map((t) => `<span>${t}</span><b>◆</b>`).join('');
  set('#ticker', tick + tick); // doubled so the loop is seamless

  /* projects */
  const pill = (st) => `<span class="pill ${/^complete/i.test(st) ? 'pill-ok' : 'pill-run'}">${st}</span>`;
  const plinks = (ls) => ls.length > 1
    ? `<div class="card-links">${ls.map(([t, u]) => `<a class="card-link" href="${u}" ${ext}>${t}${arrow}</a>`).join('')}</div>`
    : ls.map(([t, u]) => `<a class="card-link" href="${u}" ${ext}>${t}${arrow}</a>`).join('');
  const arch = (a) => a ? `<figure class="arch" aria-label="${a.label}">
      <p class="arch-cap"><span>Architecture</span><span class="accent">Live</span></p>
      <svg viewBox="0 0 320 240" class="arch-svg" aria-hidden="true">
        ${a.paths.map((d, i) => `<path id="arch${i}" d="${d}" />`).join('')}
        ${a.paths.map((_, i) => `<circle r="2.5"><animateMotion dur="${(2.4 + i * 0.3).toFixed(1)}s" begin="${(i * 0.4).toFixed(1)}s" repeatCount="indefinite"><mpath href="#arch${i}"/></animateMotion></circle>`).join('')}
      </svg>
      ${a.nodes.map(([t, sub, x, y]) => `<span class="arch-node" style="left:${x}%;top:${y}%"><b>${t}</b>${sub}</span>`).join('')}
    </figure>` : '';
  set('#bento', S.projects.map((p, i) => {
    const meta = `<p class="card-meta"><span class="accent">P/${pad(i + 1)}</span> ${p.type} ${pill(p.status)}</p>`;
    const body = `${meta}<h3 class="card-title">${p.title}</h3><p class="card-desc">${p.desc}</p>`;
    if (p.featured) {
      const stats = p.stats ? `<div class="feat-stats">${p.stats.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('')}</div>` : '';
      return `<article class="card card-feat" data-skills="${p.skills.join(',')}"><div class="feat-copy">${body}${stats}${tags(p.tags)}${plinks(p.links)}</div>${arch(p.arch)}</article>`;
    }
    return `<article class="card" data-skills="${p.skills.join(',')}">${body}${tags(p.tags)}${plinks(p.links)}</article>`;
  }).join(''));

  /* experience */
  set('#xpList', S.experience.map((x, i) => `<li class="edu-item xp-item">
      <p class="edu-when mono-sm">${x.when}</p>
      <div class="card edu-card">
        <p class="card-meta"><span class="accent">${x.org}</span> · ${x.meta}${x.now ? ' <span class="pill pill-ok">Now</span>' : ''}</p>
        <h3 class="card-title">${x.role}</h3>
        <p class="card-desc">${x.summary}</p>
        ${x.details ? `<div class="xp-body" id="xp${i}"><p>${x.details}</p></div><button type="button" class="xp-toggle" aria-expanded="false" aria-controls="xp${i}"><span>More details</span> <i aria-hidden="true">+</i></button>` : ''}
      </div></li>`).join(''));

  /* research */
  const R = S.research;
  set('#pubFilters', `<button aria-pressed="true" data-field="all">All</button>` + R.filters.map(([id, t]) => `<button aria-pressed="false" data-field="${id}">${t}</button>`).join(''));
  set('#pubCount', String(R.papers.length));
  set('#pubRows', R.papers.map((p, i) => {
    const f = p.tags.join(' ');
    return `<tr class="pub-row" data-field="${f}" tabindex="0" aria-expanded="false"><td class="mono-cell">${pad(i + 1)}</td><td>${p.title}</td><td class="mono-cell">${p.field}</td><td><span class="pill ${p.ok ? 'pill-ok' : 'pill-wait'}">${p.status}</span></td></tr>
      <tr class="pub-detail" data-field="${f}"><td></td><td colspan="3"><p>${p.summary}</p>${p.keywords ? tags(p.keywords) : ''}</td></tr>`;
  }).join('') + `<tr class="pub-empty" hidden><td></td><td colspan="3">${R.emptyText}</td></tr>`);
  set('#interestTags', R.interests.map((t) => `<span>${t}</span>`).join(''));

  /* education */
  set('#eduLine', S.education.map((e) => `<li class="edu-item">
      <p class="edu-when mono-sm">${e.when}</p>
      <div class="card edu-card">
        <p class="card-meta"><span class="accent">${e.level}</span> · ${e.school}</p>
        <h3 class="card-title">${e.title}</h3>
        <div class="meter" style="--v: ${(e.score / e.outOf).toFixed(3)}"><span class="meter-fill"></span></div>
        <p class="meter-label mono-sm">${e.grade} <b><span data-count="${e.score}" data-dec="2">0.00</span></b> / ${e.outOf.toFixed(2)}</p>
      </div></li>`).join(''));

  /* certifications */
  const C = S.certifications;
  set('#certFilters', `<button type="button" aria-pressed="true" data-topic="all">All</button>` + C.filters.map(([id, t]) => `<button type="button" aria-pressed="false" data-topic="${id}">${t}</button>`).join(''));
  set('#certCount', `${C.items.length} of ${C.items.length}`);
  set('#certGrid', C.items.map((c) => {
    const thumb = c.image ? `<button type="button" class="cert-thumb" data-cert="${c.image}" aria-label="View ${strip(c.title)} certificate"><img src="${c.image}" alt="" loading="lazy" /><span class="cert-thumb-hint">View certificate</span></button>` : '';
    const view = c.image ? `<button type="button" class="card-link cert-open" data-cert="${c.image}">View <span aria-hidden="true">⤢</span></button>` : '';
    const verify = c.url ? `<a class="card-link" href="${c.url}" ${ext}>Verify${arrow}</a>` : '<span class="card-link muted">Credential link coming</span>';
    return `<article class="card cred${c.image ? ' has-cert' : ''}" data-topic="${c.topic}">${thumb}
      <p class="card-meta"><span class="accent">${c.issuer}</span> · ${c.date}</p>
      <h3 class="card-title">${c.title}</h3>
      <span class="card-links">${view}${view && verify ? '<span class="dot" aria-hidden="true">·</span>' : ''}${verify}</span></article>`;
  }).join(''));

  /* footer */
  const F = S.footer;
  set('#footerHeadline', F.headline);
  const mail = $('#footerMail');
  if (mail) { mail.href = `mailto:${S.person.email}`; mail.innerHTML = `${S.person.email}${arrow}`; }
  set('#footerLinks', S.links.filter((l) => l.footer).map(linkBtn).join(''));
  const updated = F.updated === 'auto' ? new Date(document.lastModified).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : F.updated;
  set('#footerMeta', `<span>${S.person.fullName} · ${S.person.location}</span><span>© ${new Date().getFullYear()} · Last updated ${updated}</span>`);
})();
