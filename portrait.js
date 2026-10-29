/* ── 3D POINT-CLOUD PORTRAIT ──
   Rebuilds pro.png from portrait-data.js as a WebGL point cloud.
   Points gather from a scattered cloud, drift, follow the pointer and splash on click. */
(function () {
  const fig = document.getElementById('portrait');
  const gl_canvas = document.getElementById('portraitGL');
  const hud = document.getElementById('portraitHUD');
  const data = window.PORTRAIT;
  if (!fig || !gl_canvas || !hud || !data) return;

  const gl = gl_canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
  if (!gl) { fig.classList.add('no-webgl'); return; }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const html = document.documentElement;

  /* ── decode grid → points (2 jittered points per filled cell) ── */
  const raw = atob(data.data);
  const W = data.w, H = data.h, S = 2.0 / H; // fit height into [-1, 1]
  const cells = [];
  for (let i = 0; i < W * H; i++) {
    const lum = raw.charCodeAt(i * 2);
    if (lum) cells.push(i);
  }
  const PER = 2, N = cells.length * PER;
  const base = new Float32Array(N * 3), start = new Float32Array(N * 3), attr = new Float32Array(N * 2);
  let rnd = 1337; // seeded so the cloud looks the same on every visit
  const rand = () => ((rnd = (rnd * 16807) % 2147483647) / 2147483647);
  const depthAt = (i) => raw.charCodeAt(i * 2 + 1) / 255;
  cells.forEach((cell, c) => {
    const gx = cell % W, gy = (cell / W) | 0;
    const lum = raw.charCodeAt(cell * 2) / 255, depth = depthAt(cell);
    for (let k = 0; k < PER; k++) {
      const n = c * PER + k;
      base[n * 3] = (gx + rand() - W / 2) * S;
      base[n * 3 + 1] = -(gy + rand() - H / 2) * S;
      base[n * 3 + 2] = depth * 0.42 + lum * 0.06;
      // start on a loose sphere shell so the portrait "gathers" in
      const th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1), r = 1.6 + rand() * 1.4;
      start[n * 3] = r * Math.sin(ph) * Math.cos(th);
      start[n * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      start[n * 3 + 2] = r * Math.cos(ph);
      attr[n * 2] = lum;
      attr[n * 2 + 1] = rand();
    }
  });

  /* ── trackers: spread-out points on the upper body for the HUD ── */
  const trackers = [];
  const candidates = [];
  for (let c = 0; c < cells.length; c += 7) {
    const n = c * PER;
    if (base[n * 3 + 2] > 0.18 && attr[n * 2] > 0.35) candidates.push(n);
  }
  if (candidates.length) {
    trackers.push(candidates[(candidates.length * 0.18) | 0]);
    while (trackers.length < 7) {
      let best = candidates[0], bestD = -1;
      for (const n of candidates) {
        let d = Infinity;
        for (const t of trackers) {
          const dx = base[n * 3] - base[t * 3], dy = base[n * 3 + 1] - base[t * 3 + 1];
          d = Math.min(d, dx * dx + dy * dy);
        }
        if (d > bestD) { bestD = d; best = n; }
      }
      trackers.push(best);
    }
  }

  /* ── shaders ── */
  const vs = `
    attribute vec3 aBase; attribute vec3 aStart; attribute vec2 aAttr;
    uniform float uTime, uGather, uDrift, uSize, uAspect, uScale;
    uniform vec2 uRot, uPointer, uSplash; uniform float uSplashT, uPointerOn;
    varying float vLum; varying float vDepth;
    vec3 rot(vec3 p) {
      float cy = cos(uRot.x), sy = sin(uRot.x), cx = cos(uRot.y), sx = sin(uRot.y);
      p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
      return vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
    }
    void main() {
      float seed = aAttr.y;
      float g = clamp(uGather * 1.25 - seed * 0.25, 0.0, 1.0);
      g = 1.0 - pow(1.0 - g, 3.0);
      vec3 p = mix(aStart, aBase - vec3(0.0, 0.0, 0.21), g);
      p += uDrift * 0.012 * vec3(sin(uTime * 1.3 + seed * 40.0), cos(uTime * 1.1 + seed * 70.0), sin(uTime * 0.9 + seed * 20.0));
      p = rot(p);
      float persp = 3.2 / (3.2 - p.z);
      vec2 ndc = p.xy * persp * uScale;
      ndc.x /= uAspect;
      // pointer pushes points aside
      vec2 d = ndc - uPointer; d.x *= uAspect;
      float l = length(d);
      ndc += uPointerOn * (d / max(l, 1e-4)) * 0.06 * exp(-l * l / 0.008) * vec2(1.0 / uAspect, 1.0);
      // click splash: an expanding ring
      vec2 s = ndc - uSplash; s.x *= uAspect;
      float ls = length(s), ring = uSplashT * 1.4;
      float wave = exp(-pow((ls - ring) / 0.06, 2.0)) * max(0.0, 1.0 - uSplashT);
      ndc += (s / max(ls, 1e-4)) * wave * 0.08 * vec2(1.0 / uAspect, 1.0);
      gl_Position = vec4(ndc, 0.0, 1.0);
      vLum = aAttr.x; vDepth = aBase.z;
      gl_PointSize = uSize * persp * (0.55 + aAttr.x * 0.9) * (1.0 + wave * 1.5);
    }`;
  const fs = `
    precision mediump float;
    uniform vec3 uInk, uAccent; uniform float uAlpha;
    varying float vLum; varying float vDepth;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float r = dot(c, c);
      if (r > 0.25) discard;
      vec3 col = mix(uAccent, uInk, smoothstep(0.15, 0.75, vLum));
      gl_FragColor = vec4(col, (0.28 + pow(vLum, 0.9) * 0.72) * uAlpha * (1.0 - r * 3.0));
    }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { fig.classList.add('no-webgl'); return; }
  gl.useProgram(prog);
  const buf = (arr, name, size) => {
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  buf(base, 'aBase', 3); buf(start, 'aStart', 3); buf(attr, 'aAttr', 2);
  const U = {};
  ['uTime', 'uGather', 'uDrift', 'uSize', 'uAspect', 'uScale', 'uRot', 'uPointer', 'uSplash', 'uSplashT', 'uPointerOn', 'uInk', 'uAccent', 'uAlpha']
    .forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));
  gl.enable(gl.BLEND);

  /* ── state ── */
  const ctx = hud.getContext('2d');
  let w = 0, h = 0, dpr = 1, scale = 0.9;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0 };
  const splash = { x: 9, y: 9, t: 1 };
  const rotS = { x: 0, y: 0 };
  let t0 = performance.now(), visible = true, running = false;
  const ptsLabel = document.getElementById('portraitPts');
  const rotLabel = document.getElementById('portraitRot');
  if (ptsLabel) ptsLabel.textContent = N.toLocaleString('en-US') + ' PTS';

  const hex = (v) => { v = v.trim().replace('#', ''); if (v.length === 3) v = v.replace(/./g, '$&$&'); const n = parseInt(v, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
  let theme = {};
  function readTheme() {
    const cs = getComputedStyle(html);
    const dark = html.getAttribute('data-theme') !== 'light';
    theme = { dark, ink: hex(cs.getPropertyValue('--ink') || '#e8eaf0'), accent: hex(cs.getPropertyValue('--accent') || '#2ecc71'), hud: cs.getPropertyValue('--ink2').trim(), acc: cs.getPropertyValue('--accent').trim() };
    // dark: points glow (additive); light: points print like ink
    if (dark) gl.blendFunc(gl.SRC_ALPHA, gl.ONE); else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
  readTheme();
  new MutationObserver(() => { readTheme(); if (!running) frame(performance.now()); }).observe(html, { attributes: true, attributeFilter: ['data-theme'] });

  function resize() {
    const r = fig.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    for (const c of [gl_canvas, hud]) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    gl.viewport(0, 0, gl_canvas.width, gl_canvas.height);
    scale = Math.min(0.86, 0.9 * (w / h) / (W / H)); // fit height, but never overflow width
    if (!running) frame(performance.now());
  }

  /* CPU copy of the vertex transform, for HUD trackers only */
  function project(n, time, gather) {
    let x = base[n * 3], y = base[n * 3 + 1], z = base[n * 3 + 2] - 0.21;
    const g = 1 - Math.pow(1 - Math.min(1, Math.max(0, gather * 1.25 - attr[n * 2 + 1] * 0.25)), 3);
    x = start[n * 3] + (x - start[n * 3]) * g; y = start[n * 3 + 1] + (y - start[n * 3 + 1]) * g; z = start[n * 3 + 2] + (z - start[n * 3 + 2]) * g;
    const cy = Math.cos(rotS.x), sy = Math.sin(rotS.x), cx = Math.cos(rotS.y), sx = Math.sin(rotS.y);
    const x1 = cy * x + sy * z, z1 = -sy * x + cy * z;
    const y2 = cx * y - sx * z1, z2 = sx * y + cx * z1;
    const persp = 3.2 / (3.2 - z2);
    const aspect = w / h;
    return { sx: ((x1 * persp * scale / aspect) * 0.5 + 0.5) * w, sy: (0.5 - (y2 * persp * scale) * 0.5) * h, x: x1, y: y2, z: z2 };
  }

  const fmt = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);
  let lastLabel = 0;
  function drawHUD(time, gather) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (gather < 0.85 || !trackers.length) return;
    const a = Math.min(1, (gather - 0.85) / 0.15);
    const pts = trackers.map((n) => project(n, time, gather));
    ctx.globalAlpha = 0.35 * a;
    ctx.strokeStyle = theme.hud; ctx.lineWidth = 0.6;
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.sx, p.sy) : ctx.moveTo(p.sx, p.sy)));
    ctx.stroke();
    ctx.font = '500 10px "JetBrains Mono", ui-monospace, monospace';
    ctx.textBaseline = 'middle';
    pts.forEach((p, i) => {
      const s = 7;
      ctx.globalAlpha = 0.9 * a;
      ctx.strokeStyle = i === 0 ? theme.acc : theme.hud;
      ctx.beginPath();
      ctx.moveTo(p.sx - s, p.sy - s + 3); ctx.lineTo(p.sx - s, p.sy - s); ctx.lineTo(p.sx - s + 3, p.sy - s);
      ctx.moveTo(p.sx + s - 3, p.sy + s); ctx.lineTo(p.sx + s, p.sy + s); ctx.lineTo(p.sx + s, p.sy + s - 3);
      ctx.stroke();
      if (w > 360) {
        ctx.fillStyle = i === 0 ? theme.acc : theme.hud;
        ctx.globalAlpha = 0.75 * a;
        const label = String(i + 1).padStart(2, '0') + ' ' + fmt(p.x) + ' ' + fmt(p.y) + ' ' + fmt(p.z);
        const tw = ctx.measureText(label).width;
        ctx.fillText(label, p.sx + s + 5 + tw > w - 4 ? p.sx - s - 5 - tw : p.sx + s + 5, p.sy); // flip left near the edge
      }
    });
    ctx.globalAlpha = 1;
    if (rotLabel && time - lastLabel > 0.12) {
      lastLabel = time;
      rotLabel.textContent = 'YAW ' + fmt(rotS.x) + '  PITCH ' + fmt(rotS.y);
    }
  }

  function frame(now) {
    const time = (now - t0) / 1000;
    const gather = reduceMotion ? 1 : Math.min(1, time / 3.6);
    const k = reduceMotion ? 1 : 0.06;
    pointer.x += (pointer.tx - pointer.x) * 0.2; pointer.y += (pointer.ty - pointer.y) * 0.2;
    pointer.on += (pointer.ton - pointer.on) * 0.1;
    const idle = reduceMotion ? 0 : Math.sin(time * 0.35) * 0.18;
    rotS.x += ((pointer.on ? pointer.x * 0.55 : idle) - rotS.x) * k;
    rotS.y += ((pointer.on ? -pointer.y * 0.3 : 0) - rotS.y) * k;
    if (splash.t < 1) splash.t = Math.min(1, splash.t + 0.016);

    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(U.uTime, time);
    gl.uniform1f(U.uGather, gather);
    gl.uniform1f(U.uDrift, reduceMotion ? 0 : 1);
    gl.uniform1f(U.uSize, Math.max(1.2, Math.min(3.2, h / 280)) * dpr);
    gl.uniform1f(U.uAspect, w / h);
    gl.uniform1f(U.uScale, scale);
    gl.uniform2f(U.uRot, rotS.x, rotS.y);
    gl.uniform2f(U.uPointer, pointer.x, pointer.y);
    gl.uniform1f(U.uPointerOn, reduceMotion ? 0 : pointer.on);
    gl.uniform2f(U.uSplash, splash.x, splash.y);
    gl.uniform1f(U.uSplashT, splash.t);
    gl.uniform3fv(U.uInk, theme.ink);
    gl.uniform3fv(U.uAccent, theme.accent);
    gl.uniform1f(U.uAlpha, theme.dark ? 0.55 : 0.8);
    gl.drawArrays(gl.POINTS, 0, N);
    drawHUD(time, gather);

    if (!reduceMotion && visible && !document.hidden) { running = true; requestAnimationFrame(frame); } else running = false;
  }

  const toNdc = (e) => { const r = fig.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 2 - 1, 1 - ((e.clientY - r.top) / r.height) * 2]; };
  fig.addEventListener('pointermove', (e) => { [pointer.tx, pointer.ty] = toNdc(e); pointer.ton = 1; });
  fig.addEventListener('pointerleave', () => { pointer.ton = 0; });
  fig.addEventListener('pointerdown', (e) => { [splash.x, splash.y] = toNdc(e); splash.t = 0; });

  new ResizeObserver(resize).observe(fig);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !running) requestAnimationFrame(frame); }).observe(fig);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !running) requestAnimationFrame(frame); });
  resize();
  fig.classList.add('is-live');
})();
