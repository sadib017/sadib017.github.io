/* ── INTERACTIVE SECTIONS ──
   Pipeline rail, command palette, skill graph, project filter, experience timeline,
   publications table, education meters, certification filter, count-up stats and the scroll-linked ticker. */
(function () {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // run fn once when el scrolls into view
  function onceVisible(el, fn, threshold = 0.25) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) return fn();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { threshold });
    io.observe(el);
  }

  /* ── PIPELINE RAIL ── */
  const stages = $$('[data-stage]');
  const railLinks = $$('.rail .stage');
  const railFill = $('#railFill');
  let railTick = false;
  function updateRail() {
    railTick = false;
    const mid = window.innerHeight * 0.45;
    let current = -1;
    stages.forEach((s, i) => { if (s.getBoundingClientRect().top < mid) current = i; });
    railLinks.forEach((a, i) => {
      a.classList.toggle('done', i < current);
      a.classList.toggle('run', i === current);
    });
    if (railFill && railLinks.length) {
      const target = railLinks[Math.max(0, current)];
      railFill.style.transform = `scaleY(${current < 0 ? 0 : (target.offsetTop + 6) / railFill.parentElement.clientHeight})`;
    }
  }
  window.addEventListener('scroll', () => { if (!railTick) { railTick = true; requestAnimationFrame(updateRail); } }, { passive: true });
  updateRail();

  /* ── CURSOR SPOTLIGHT ON CARDS ── */
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest && e.target.closest('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  /* ── STACK: GRAPH / LIST TABS ── */
  $$('.seg [data-view]').forEach((btn) => btn.addEventListener('click', () => {
    $$('.seg [data-view]').forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
    $$('[data-view-panel]').forEach((p) => { p.hidden = p.dataset.viewPanel !== btn.dataset.view; });
  }));

  /* ── SKILL GRAPH + PROJECT FILTER ── */
  const graph = $('#skillGraph');
  const edgesSvg = $('#graphEdges');
  const cards = $$('#bento .card');
  const status = $('#stackStatus');
  const projLabel = $('#projFilterLabel');
  const projEmpty = $('#projEmpty');

  const G = window.SITE.skills.graph; // edit nodes and links in content.js
  const SKILLS = Object.keys(G.nodes);
  const LINKS = G.links;

  // category view: turn each "A · B · C" list into skill chips that drive the same filter
  $$('#stackList dd').forEach((dd) => {
    dd.innerHTML = dd.textContent.split(' · ').map((t) => `<button type="button" class="chip" data-skill="${t}" aria-pressed="false">${t}</button>`).join('');
  });
  $$('#stackList .chip').forEach((c) => c.addEventListener('click', () => setSkill(c.dataset.skill)));
  const traceList = $('#traceList');

  const usedBy = {};
  cards.forEach((c) => c.dataset.skills.split(',').forEach((s) => { (usedBy[s] = usedBy[s] || []).push(c); }));

  let active = null;
  function setSkill(name) {
    active = active === name ? null : name;
    const near = new Set(active ? [active] : []);
    if (active) LINKS.forEach(([a, b]) => { if (a === active) near.add(b); if (b === active) near.add(a); });
    $$('.node', graph).forEach((n) => {
      n.classList.toggle('hot', n.dataset.skill === active);
      n.classList.toggle('lit', !!active && near.has(n.dataset.skill) && n.dataset.skill !== active);
      n.classList.toggle('dim', !!active && !near.has(n.dataset.skill));
      n.setAttribute('aria-pressed', String(n.dataset.skill === active));
    });
    $$('#stackList .chip').forEach((c) => {
      c.classList.toggle('hot', c.dataset.skill === active);
      c.setAttribute('aria-pressed', String(c.dataset.skill === active));
    });
    $$('line', edgesSvg).forEach((l) => l.classList.toggle('on', !!active && (l.dataset.a === active || l.dataset.b === active)));
    const hits = active ? (usedBy[active] || []) : cards;
    cards.forEach((c) => c.classList.toggle('dim', !!active && !hits.includes(c)));
    const n = active ? hits.length : cards.length;
    if (status) status.textContent = active ? `${active} · ${n ? n + (n === 1 ? ' project' : ' projects') : 'research and coursework'}` : 'Pick a tool to trace it';
    if (projLabel) projLabel.textContent = active ? `Filtered by ${active} · ${n} of ${cards.length}` : `${cards.length} projects`;
    if (projEmpty) projEmpty.hidden = !(active && !n);
    if (traceList) {
      traceList.innerHTML = '';
      if (!active) traceList.innerHTML = '<span class="trace-empty">Select any skill above to see where I used it.</span>';
      else if (!n) traceList.innerHTML = `<span class="trace-empty">${active} comes from research and coursework.</span>`;
      else hits.forEach((c) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'trace-item';
        b.innerHTML = `${$('.card-title', c).textContent} <span aria-hidden="true">↓</span>`;
        b.addEventListener('click', () => { c.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); c.classList.add('flash'); setTimeout(() => c.classList.remove('flash'), 1400); });
        traceList.appendChild(b);
      });
    }
  }
  $$('[data-clear-skill]').forEach((b) => b.addEventListener('click', () => active && setSkill(active)));

  const POS = G.nodes;

  function layoutGraph() {
    if (!graph) return;
    const W = graph.clientWidth, H = graph.clientHeight;
    const chips = matchMedia('(max-width: 640px)').matches; // phones: a wrap of chips, no edges
    const at = (s) => [POS[s][0] * W, POS[s][1] * H];
    edgesSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    edgesSvg.innerHTML = chips ? '' : LINKS.map(([a, b]) => {
      const [x1, y1] = at(a), [x2, y2] = at(b);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" data-a="${a}" data-b="${b}"/>`;
    }).join('');
    $$('.node', graph).forEach((n) => n.remove());
    SKILLS.forEach((s) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'node' + (usedBy[s] ? ' used' : '');
      b.dataset.skill = s;
      if (!chips) { const [x, y] = at(s); b.style.left = `${x}px`; b.style.top = `${y}px`; }
      b.textContent = s;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => setSkill(s));
      graph.appendChild(b);
    });
    if (active) { const a = active; active = null; setSkill(a); }
  }
  if (graph) {
    layoutGraph();
    let rt;
    new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(layoutGraph, 120); }).observe(graph);
  }

  /* ── EXPERIENCE: EXPAND DETAILS ── */
  $$('.xp-toggle').forEach((btn) => btn.addEventListener('click', () => {
    const open = btn.closest('.xp-item').classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.firstElementChild.textContent = open ? 'Hide details' : 'More details';
  }));

  /* ── PUBLICATIONS: FILTER + EXPAND ── */
  const rows = $$('#pubRows .pub-row');
  rows.forEach((r) => {
    const toggle = () => {
      const open = r.getAttribute('aria-expanded') !== 'true';
      r.setAttribute('aria-expanded', String(open));
      r.nextElementSibling.classList.toggle('open', open);
    };
    r.addEventListener('click', toggle);
    r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  $$('[data-field]', document).filter((b) => b.tagName === 'BUTTON').forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.field;
    btn.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    let n = 0;
    $$('#pubRows tr:not(.pub-empty)').forEach((tr) => {
      const show = f === 'all' || (tr.dataset.field || '').split(' ').includes(f); // a paper can carry several tags, e.g. "imaging conference"
      tr.hidden = !show;
      if (show && tr.classList.contains('pub-row')) n++;
    });
    const c = $('#pubCount'); if (c) c.textContent = n;
    const empty = $('#pubRows .pub-empty'); if (empty) empty.hidden = n > 0;
  }));

  /* ── COUNT-UP STATS ── */
  const counters = $$('[data-count]');
  counters.forEach((el) => onceVisible(el, () => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), pad = +(el.dataset.pad || 0);
    const show = (v) => { el.textContent = dec ? v.toFixed(dec) : String(Math.round(v)).padStart(pad, '0'); };
    if (reduceMotion) return show(end);
    const t0 = performance.now(), dur = 1200;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      show(end * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, 0.4));

  /* ── TIMELINES (EXPERIENCE, EDUCATION): LINE AND METERS FILL ON SCROLL ── */
  $$('.edu').forEach((el) => onceVisible(el, () => el.classList.add('run'), 0.15));

  /* ── CERTIFICATIONS: FILTER BY TOPIC ── */
  const certBtns = $$('.cert-bar [data-topic]'), certCards = $$('#certGrid .cred'), certCount = $('#certCount');
  certBtns.forEach((btn) => btn.addEventListener('click', () => {
    const t = btn.dataset.topic;
    certBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    let n = 0;
    certCards.forEach((c) => { const show = t === 'all' || c.dataset.topic === t; c.hidden = !show; n += show; });
    if (certCount) certCount.textContent = `${n} of ${certCards.length}`;
  }));

  /* ── TICKER: MOVES WITH SCROLL, NOT ON ITS OWN ── */
  const ticker = $('#ticker');
  if (ticker && !reduceMotion) {
    let tt = false;
    const move = () => {
      tt = false;
      const r = ticker.parentElement.getBoundingClientRect();
      const half = ticker.scrollWidth / 2;
      const x = (Math.max(0, window.innerHeight - r.top) * 0.6) % half;
      ticker.style.transform = `translateX(${-x}px)`;
    };
    window.addEventListener('scroll', () => { if (!tt) { tt = true; requestAnimationFrame(move); } }, { passive: true });
    move();
  }

  /* ── COMMAND PALETTE (Ctrl+K or /) ── */
  const dlg = $('#palette'), input = $('#paletteInput'), list = $('#paletteList'), toast = $('#paletteToast');
  if (!dlg || !dlg.showModal) return;
  const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  const items = [
    ...window.SITE.sections.map((x) => ({ group: 'Sections', label: x.label || x.title, hint: 'Jump', run: go(x.id) })),
    ...cards.map((c) => ({ group: 'Projects', label: `${$('.card-title', c).textContent} · ${c.dataset.skills.split(',').slice(0, 3).join(', ')}`, hint: 'Open', keys: c.dataset.skills,
      run: () => { c.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); c.classList.add('flash'); setTimeout(() => c.classList.remove('flash'), 1400); } })),
    ...rows.map((r) => ({ group: 'Papers', label: r.children[1].textContent, hint: 'Read', run: () => { go('publications')(); if (r.getAttribute('aria-expanded') !== 'true') r.click(); } })),
    { group: 'Actions', label: 'Download CV', hint: 'PDF', run: () => window.open(window.SITE.person.cv, '_blank', 'noopener') },
    { group: 'Actions', label: 'Copy email', hint: 'Copy', stay: true, run: () => navigator.clipboard?.writeText(window.SITE.person.email).then(() => { toast.textContent = 'Email copied'; }, () => { toast.textContent = `Copy failed. Email: ${window.SITE.person.email}`; }) },
    { group: 'Actions', label: 'Toggle light / dark theme', hint: 'Theme', stay: true, run: () => document.getElementById('themeToggle')?.click() },
  ];
  let shown = [], sel = 0;
  function render() {
    const q = input.value.trim().toLowerCase();
    shown = items.filter((it) => !q || (it.label + ' ' + (it.keys || '') + ' ' + it.group).toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    let last = '';
    list.innerHTML = shown.length ? shown.map((it, i) => {
      const head = it.group !== last ? `<li class="palette-grp" role="presentation">${it.group}</li>` : '';
      last = it.group;
      return `${head}<li role="option" id="pal-${i}" class="palette-item${i === sel ? ' on' : ''}" aria-selected="${i === sel}" data-i="${i}"><span></span><kbd>${it.hint}</kbd></li>`;
    }).join('') : '<li class="palette-empty">No match. Try "postgres", "thyroid" or "cv".</li>';
    $$('.palette-item', list).forEach((li) => { li.firstChild.textContent = shown[li.dataset.i].label; });
    input.setAttribute('aria-activedescendant', shown.length ? `pal-${sel}` : '');
    $('.palette-item.on', list)?.scrollIntoView({ block: 'nearest' });
  }
  function run(i) { const it = shown[i]; if (!it) return; if (!it.stay) dlg.close(); it.run(); }
  function open() { if (dlg.open) return; input.value = ''; sel = 0; toast.textContent = ''; render(); dlg.showModal(); input.focus(); }
  $('#paletteOpen')?.addEventListener('click', open);
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName) && document.activeElement !== input;
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing && !dlg.open)) { e.preventDefault(); dlg.open ? dlg.close() : open(); }
  });
  input.addEventListener('input', () => { sel = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
  });
  list.addEventListener('click', (e) => { const li = e.target.closest('.palette-item'); if (li) run(+li.dataset.i); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
})();

/* ── CERTIFICATE LIGHTBOX ── */
(function () {
  const dlg = document.getElementById('certDialog');
  if (!dlg || !dlg.showModal) return;
  const img = dlg.querySelector('img');
  document.querySelectorAll('[data-cert]').forEach((b) => b.addEventListener('click', () => { img.src = b.dataset.cert; dlg.showModal(); }));
  dlg.querySelector('.cert-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }); // backdrop click
})();
