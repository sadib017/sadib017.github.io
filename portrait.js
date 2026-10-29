/* ── PORTRAIT: ASCII DECODE, THEN THE REAL PHOTO ──
   On load the photo is drawn as ASCII glyphs from a precomputed luminance grid
   (portrait-data.js, so no canvas pixel reads), a few glyphs flicker green, then
   the cells clear in a diagonal sweep to reveal photo.jpg underneath.
   Afterwards hovering scans an ASCII lens over the photo and a click replays the intro. */
(function () {
  const fig = document.getElementById('portrait');
  const cv = document.getElementById('portraitAscii');
  const D = window.PORTRAIT_ASCII;
  if (!fig || !cv || !cv.getContext) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stateEl = document.getElementById('portraitPts');
  const setState = (t) => { if (stateEl) stateEl.textContent = t; };
  if (!D || reduce) { fig.classList.add('is-photo'); setState('Original'); return; }

  const stage = cv.parentElement;
  const ctx = cv.getContext('2d');
  const lum = Uint8Array.from(atob(D.data), (c) => c.charCodeAt(0));
  const N = D.w * D.h;
  const RAMP = ' .,:;-=+*x%#@';
  const glyph = (v) => RAMP[Math.min(RAMP.length - 1, Math.floor((v / 256) * RAMP.length))];
  const settle = new Float32Array(N), reveal = new Float32Array(N), green = new Uint8Array(N);

  let W = 0, H = 0, cell = 0, ox = 0, oy = 0, t0 = 0, raf = 0, mode = 'intro', lens = null;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  let BG = '#0f1117', INK = '#8b90a3', ACC = '#2ecc71';

  function size() {
    const r = stage.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = Math.min(W / D.w, H / D.h); // same "contain" box as the photo
    ox = (W - cell * D.w) / 2; oy = (H - cell * D.h) / 2;
    ctx.font = `${(cell * 1.15).toFixed(2)}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  }

  function plan() {
    for (let i = 0; i < N; i++) {
      const x = i % D.w, y = (i / D.w) | 0;
      settle[i] = 250 + Math.random() * 900;
      reveal[i] = 2000 + ((x / D.w) * 0.55 + (y / D.h) * 0.45) * 1300 + Math.random() * 260; // diagonal sweep
      green[i] = Math.random() < 0.035 ? 1 : 0;
    }
  }

  function drawCell(i, ch, color, textAlpha = 1, bgAlpha = 1) {
    const x = ox + (i % D.w) * cell, y = oy + ((i / D.w) | 0) * cell;
    ctx.globalAlpha = bgAlpha; ctx.fillStyle = BG; ctx.fillRect(x, y, cell + 0.5, cell + 0.5);
    if (ch !== ' ') { ctx.globalAlpha = textAlpha; ctx.fillStyle = color; ctx.fillText(ch, x + cell / 2, y + cell / 2); }
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
    const R = Math.max(56, W * 0.14), cx = (lens.x - ox) / cell, cy = (lens.y - oy) / cell, rc = R / cell;
    for (let y = Math.max(0, Math.floor(cy - rc)); y <= Math.min(D.h - 1, Math.ceil(cy + rc)); y++) {
      for (let x = Math.max(0, Math.floor(cx - rc)); x <= Math.min(D.w - 1, Math.ceil(cx + rc)); x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / rc;
        if (d > 1) continue;
        const i = y * D.w + x;
        drawCell(i, glyph(lum[i]), d < 0.35 ? ACC : INK, 1, 0.94 * (1 - Math.pow(d, 4)));
      }
    }
  }

  function start() {
    cancelAnimationFrame(raf);
    BG = css('--bg') || BG; INK = css('--ink') || INK; ACC = css('--accent') || ACC;
    mode = 'intro'; lens = null; plan(); size();
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
  stage.addEventListener('click', start);
  let rt;
  new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => { size(); if (mode === 'idle') drawLens(); }, 120); }).observe(stage);

  // paint the first frame right away so the photo never flashes before the glyphs
  plan(); size(); ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
})();
