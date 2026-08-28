/**
 * Side-band node network — matches classic OneChain hero (cyan plexus, clear center).
 */
export function initHeroNetwork() {
  const hero = document.getElementById("hero");
  const canvas = hero?.querySelector(".hero-network--sides");
  if (!hero || !canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const LINK_DIST = 130;
  const MOUSE_DIST = 260;
  const PULL = 0.65;
  const NODE_COLOR = "0,180,216";
  const LEFT_BAND = 0.28;
  const RIGHT_BAND = 0.72;

  let dpr = 1;
  let w = 0;
  let h = 0;
  let nodes = [];
  let rafId = 0;
  const mouse = { x: -9999, y: -9999, active: false };

  function buildNodes() {
    const perSide = Math.max(6, Math.min(14, Math.round((w * h) / 80000)));
    nodes = [];
    const bands = [
      { min: 0, max: w * LEFT_BAND },
      { min: w * RIGHT_BAND, max: w },
    ];

    bands.forEach((band) => {
      for (let i = 0; i < perSide; i++) {
        nodes.push({
          x: band.min + Math.random() * (band.max - band.min),
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 2 + Math.random() * 3.5,
          homeBandMin: band.min,
          homeBandMax: band.max,
        });
      }
    });
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
  }

  function drawLinks() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist >= LINK_DIST) continue;

        const alpha = (1 - dist / LINK_DIST) * 0.45;
        ctx.strokeStyle = `rgba(${NODE_COLOR},${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    if (!mouse.active) return;

    for (const n of nodes) {
      const dist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
      if (dist >= MOUSE_DIST) continue;

      ctx.strokeStyle = `rgba(${NODE_COLOR},${(1 - dist / MOUSE_DIST) * 0.65})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    }
  }

  function drawNodes() {
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${NODE_COLOR},0.8)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${NODE_COLOR},0.07)`;
      ctx.fill();
    }
  }

  function stepNodes() {
    for (const n of nodes) {
      if (mouse.active) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_DIST && dist > 0.1) {
          const pull = (1 - dist / MOUSE_DIST) * PULL;
          n.vx += (dx / dist) * pull * 0.06;
          n.vy += (dy / dist) * pull * 0.06;
        }
      }

      n.x += n.vx;
      n.y += n.vy;
      n.vx *= 0.99;
      n.vy *= 0.99;

      if (n.x < n.homeBandMin) {
        n.x = n.homeBandMin;
        n.vx *= -1;
      }
      if (n.x > n.homeBandMax) {
        n.x = n.homeBandMax;
        n.vx *= -1;
      }
      if (n.y < 0) {
        n.y = 0;
        n.vy *= -1;
      }
      if (n.y > h) {
        n.y = h;
        n.vy *= -1;
      }
      if (Math.abs(n.vx) < 0.05) n.vx += (Math.random() - 0.5) * 0.2;
      if (Math.abs(n.vy) < 0.05) n.vy += (Math.random() - 0.5) * 0.2;
    }
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    if (!reducedMotion) stepNodes();
    drawLinks();
    drawNodes();
    if (!reducedMotion) rafId = requestAnimationFrame(tick);
  }

  function start() {
    resize();
    cancelAnimationFrame(rafId);
    tick();
  }

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  hero.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  new ResizeObserver(start).observe(hero);
  window.addEventListener("resize", start);
  requestAnimationFrame(() => requestAnimationFrame(start));
}
