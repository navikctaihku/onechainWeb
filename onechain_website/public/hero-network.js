/**
 * Center-column blockchain network — nodes drift downward with mouse interaction.
 */
(function initHeroNetworks() {
  const hero = document.getElementById("hero");
  const canvas = hero?.querySelector(".hero-network--center");
  if (!hero || !canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  const mouse = { x: 0, y: 0, active: false };
  const pointer = { x: 0, y: 0 };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];
  let time = 0;

  const colors = {
    nodeA: "rgba(167, 139, 250, 0.9)",
    nodeB: "rgba(127, 119, 221, 0.85)",
    nodeC: "rgba(77, 184, 255, 0.8)",
  };

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
    pointer.x += (mouse.x - pointer.x) * 0.14;
    pointer.y += (mouse.y - pointer.y) * 0.14;
  });

  hero.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  function spawnNode(yOverride) {
    const centerBias = 0.5;
    const spread = 0.22;
    const nx = centerBias + (Math.random() - 0.5) * spread * 2;
    const y = yOverride ?? Math.random() * height;
    return {
      x: nx * width,
      y,
      bx: nx,
      vy: 0.45 + Math.random() * 0.7,
      r: 2 + Math.random() * 3.5,
      phase: Math.random() * Math.PI * 2,
      sway: 0.4 + Math.random() * 0.8,
    };
  }

  function buildNodes() {
    const count = Math.round(36 + (width / 900) * 16);
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push(spawnNode(Math.random() * height));
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
    if (reducedMotion) draw();
  }

  function localPointer() {
    const heroRect = hero.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    return {
      x: pointer.x - (canvasRect.left - heroRect.left),
      y: pointer.y - (canvasRect.top - heroRect.top),
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += reducedMotion ? 0 : 0.016;

    const lp = localPointer();
    const connectDist = Math.min(width * 0.14, 120);
    const centerX = width * 0.5;
    const parallaxX = mouse.active ? (pointer.x / hero.clientWidth - 0.5) * 14 : 0;

    nodes.forEach((node) => {
      if (!reducedMotion) {
        node.y += node.vy;
        const swayX = Math.sin(time * node.sway + node.phase) * 8;
        node.x = node.bx * width + swayX + parallaxX;
      }

      if (node.y > height + 20) {
        const fresh = spawnNode(-20);
        Object.assign(node, fresh);
        node.x = fresh.bx * width;
      }

      if (mouse.active) {
        const dx = node.x - lp.x;
        const dy = node.y - lp.y;
        const dist = Math.hypot(dx, dy);
        const radius = 100;
        if (dist < radius && dist > 0.01) {
          const force = (1 - dist / radius) * 18;
          node.x += (dx / dist) * force;
          node.y += (dy / dist) * force * 0.6;
        }
      }

      const edgeFade = 1 - Math.min(1, Math.abs(node.x - centerX) / (width * 0.28));
      node.alpha = 0.35 + edgeFade * 0.65;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist > connectDist) continue;

        const alpha = (1 - dist / connectDist) * Math.min(a.alpha, b.alpha);
        let hot = 0;
        if (mouse.active) {
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const pd = Math.hypot(midX - lp.x, midY - lp.y);
          hot = Math.max(0, 1 - pd / 130);
        }

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = hot > 0.1
          ? `rgba(77, 184, 255, ${0.12 + alpha * 0.4 + hot * 0.3})`
          : `rgba(127, 119, 221, ${0.06 + alpha * 0.32})`;
        ctx.lineWidth = 0.7 + hot * 0.7;
        ctx.stroke();
      }

      const a = nodes[i];
      const b = nodes[i + 1];
      if (!b) continue;
      if (b.y > a.y && Math.abs(a.x - b.x) < connectDist * 0.85) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(127, 119, 221, ${0.04 + a.alpha * 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    nodes.forEach((node, i) => {
      let hot = 0;
      if (mouse.active) {
        const pd = Math.hypot(node.x - lp.x, node.y - lp.y);
        hot = Math.max(0, 1 - pd / 95);
      }

      const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * (2.4 + hot));
      grad.addColorStop(0, hot > 0.2 ? colors.nodeC : i % 3 === 0 ? colors.nodeA : colors.nodeB);
      grad.addColorStop(1, "rgba(127, 119, 221, 0)");

      ctx.globalAlpha = node.alpha;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r + hot * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      if (hot > 0.12) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(77, 184, 255, ${0.12 + hot * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });

    if (!reducedMotion) requestAnimationFrame(draw);
  }

  resize();
  draw();

  new ResizeObserver(resize).observe(canvas);

  if (!reducedMotion) {
    function idlePointer() {
      if (!mouse.active) {
        const rect = hero.getBoundingClientRect();
        pointer.x += (rect.width / 2 - pointer.x) * 0.04;
        pointer.y += (rect.height / 2 - pointer.y) * 0.04;
      }
      requestAnimationFrame(idlePointer);
    }
    idlePointer();
  }
})();
