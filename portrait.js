/* ── PORTRAIT: ASCII DECODE, THEN THE REAL PHOTO ──
   The ASCII grid is sampled at runtime from whatever image .portrait-photo points to,
   using the same "cover" crop as the CSS, so swapping the photo needs no other change.
   On load the glyphs decode, a few flicker green, then the cells clear in a diagonal
   sweep to reveal the photo. Afterwards hovering scans an ASCII lens over the photo
   and a click replays the intro. */
(function () {
  const fig = document.getElementById('portrait');
  const cv = document.getElementById('portraitAscii');
  const img = fig && fig.querySelector('.portrait-photo');
  if (!fig || !cv || !img || !cv.getContext) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stateEl = document.getElementById('portraitPts');
  const gridEl = document.getElementById('portraitGrid');
  const setState = (t) => { if (stateEl) stateEl.textContent = t; };
  const showPhoto = () => { fig.classList.add('is-photo'); setState('Original'); };
  if (reduce) return showPhoto();

  const stage = cv.parentElement;
  const ctx = cv.getContext('2d');
  const RAMP = ' .,:;-=+*x%#@';
  const CELL = 8; // target glyph cell in CSS px
  const glyph = (v) => RAMP[Math.min(RAMP.length - 1, Math.floor((v / 256) * RAMP.length))];
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  let BG = '#0f1117', INK = '#e8eaf0', ACC = '#2ecc71';

  let W = 0, H = 0, cols = 0, rows = 0, cw = 0, chh = 0, N = 0;
  let lum = new Uint8Array(0), settle, reveal, green;
  let t0 = 0, raf = 0, mode = 'intro', lens = null;

  // read the image's focal point from CSS object-position so the grid crops exactly like the photo
  function focus() {
    const p = getComputedStyle(img).objectPosition.split(' ');
    const f = (v) => (v && v.endsWith('%') ? parseFloat(v) / 100 : 0.5);
    return [f(p[0]), f(p[1] || p[0])];
  }

  function sample() {
    const r = stage.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.max(24, Math.round(W / CELL)); rows = Math.max(24, Math.round(H / CELL));
    cw = W / cols; chh = H / rows; N = cols * rows;
    ctx.font = `${(Math.min(cw, chh) * 1.15).toFixed(2)}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (gridEl) gridEl.textContent = `ASCII ${cols} × ${rows}`;

    // cover crop: same maths as object-fit: cover with the CSS object-position
    const iw = img.naturalWidth, ih = img.naturalHeight, s = Math.max(W / iw, H / ih);
    const [fx, fy] = focus();
    const sw = W / s, sh = H / s, sx = (iw - sw) * fx, sy = (ih - sh) * fy;
    const off = document.createElement('canvas');
    off.width = cols; off.height = rows;
    const o = off.getContext('2d', { willReadFrequently: true });
    o.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
    const px = o.getImageData(0, 0, cols, rows).data; // throws on file:// (tainted canvas)
    lum = new Uint8Array(N);
    let lo = 255, hi = 0;
    for (let i = 0; i < N; i++) {
      const v = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
      lum[i] = v; if (v < lo) lo = v; if (v > hi) hi = v;
    }
    const span = Math.max(1, hi - lo);
    for (let i = 0; i < N; i++) lum[i] = ((lum[i] - lo) / span) * 255; // auto contrast
    settle = new Float32Array(N); reveal = new Float32Array(N); green = new Uint8Array(N);
  }

  function plan() {
    for (let i = 0; i < N; i++) {
      const x = i % cols, y = (i / cols) | 0;
      settle[i] = 250 + Math.random() * 900;
      reveal[i] = 2000 + ((x / cols) * 0.55 + (y / rows) * 0.45) * 1300 + Math.random() * 260; // diagonal sweep
      green[i] = Math.random() < 0.035 ? 1 : 0;
    }
  }

  function drawCell(i, ch, color, textAlpha = 1, bgAlpha = 1) {
    const x = (i % cols) * cw, y = ((i / cols) | 0) * chh;
    ctx.globalAlpha = bgAlpha; ctx.fillStyle = BG; ctx.fillRect(x, y, cw + 0.5, chh + 0.5);
    if (ch !== ' ') { ctx.globalAlpha = textAlpha; ctx.fillStyle = color; ctx.fillText(ch, x + cw / 2, y + chh / 2); }
    ctx.globalAlpha = 1;
  }

  function intro(now) {
    const t = now - t0;
    ctx.clearRect(0, 0, W, H);
    const flick = Math.floor(t / 110);
    let left = 0;
    for (let i = 0; i < N; i++) {
      if (t >= reveal[i] + 140) continue;
      left++;
      if (t >= reveal[i]) { drawCell(i, glyph(lum[i]), ACC); continue; } // green flash as it clears
      const real = t >= settle[i];
      const ch = real ? glyph(lum[i]) : RAMP[(Math.random() * RAMP.length) | 0];
      const hot = green[i] && ((i + flick) % 5 < 2);
      drawCell(i, ch, hot ? ACC : INK, real ? 0.4 + 0.6 * (lum[i] / 255) : 0.4);
    }
    setState(t < 1900 ? `Decoding ${Math.min(100, Math.round((t / 1900) * 100))}%` : 'Rendering');
    if (left) raf = requestAnimationFrame(intro);
    else { mode = 'idle'; ctx.clearRect(0, 0, W, H); setState('Original'); }
  }

  function drawLens() {
    ctx.clearRect(0, 0, W, H);
    if (!lens) return;
    const R = Math.max(56, W * 0.14), cx = lens.x / cw, cy = lens.y / chh;
    for (let y = Math.max(0, Math.floor(cy - R / chh)); y <= Math.min(rows - 1, Math.ceil(cy + R / chh)); y++) {
      for (let x = Math.max(0, Math.floor(cx - R / cw)); x <= Math.min(cols - 1, Math.ceil(cx + R / cw)); x++) {
        const d = Math.hypot((x + 0.5) * cw - lens.x, (y + 0.5) * chh - lens.y) / R;
        if (d > 1) continue;
        const i = y * cols + x;
        drawCell(i, glyph(lum[i]), d < 0.35 ? ACC : INK, 1, 0.94 * (1 - Math.pow(d, 4)));
      }
    }
  }

  function start() {
    cancelAnimationFrame(raf);
    BG = css('--bg') || BG; INK = css('--ink') || INK; ACC = css('--accent') || ACC;
    try { sample(); } catch (e) { ctx.clearRect(0, 0, W, H); return showPhoto(); } // e.g. opened from file://
    mode = 'intro'; lens = null; plan();
    fig.classList.add('is-photo'); // photo sits under the canvas; cells clearing reveal it
    t0 = performance.now();
    raf = requestAnimationFrame(intro);
  }

  stage.addEventListener('pointermove', (e) => {
    if (mode !== 'idle' || e.pointerType === 'touch') return;
    const r = stage.getBoundingClientRect();
    lens = { x: e.clientX - r.left, y: e.clientY - r.top };
    cancelAnimationFrame(raf); raf = requestAnimationFrame(drawLens);
  });
  stage.addEventListener('pointerleave', () => { if (mode === 'idle') { lens = null; drawLens(); } });
  stage.addEventListener('click', () => { if (N) start(); });
  let rt;
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = setTimeout(() => { if (mode !== 'idle' || !img.complete) return; try { sample(); } catch (e) { /* keep photo */ } drawLens(); }, 150);
  }).observe(stage);

  // cover the frame right away so the photo never flashes before the glyphs
  const r0 = stage.getBoundingClientRect();
  cv.width = r0.width; cv.height = r0.height; ctx.fillStyle = BG; ctx.fillRect(0, 0, cv.width, cv.height);
  const ready = img.decode ? img.decode().catch(() => {}) : new Promise((res) => (img.complete ? res() : img.addEventListener('load', res, { once: true })));
  Promise.all([ready, document.fonts ? document.fonts.ready : null]).then(() => (img.naturalWidth ? start() : showPhoto()));
})();
