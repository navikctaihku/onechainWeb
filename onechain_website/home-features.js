const VERIFY_DB = {
  "POLYU-2026-001": {
    status: "verified",
    title: "Certificate of Completion",
    holder: "Alex Chen",
    issuer: "The Hong Kong Polytechnic University",
    issued: "March 2026",
    block: "48291",
  },
  "WATSONS-RVM-042": {
    status: "verified",
    title: "Plastic Credit Batch",
    holder: "Watsons RVM Pilot",
    issuer: "ESGLedger · OneChain Consortium",
    issued: "June 2026",
    block: "51024",
  },
  "OC-DEV-2026": {
    status: "verified",
    title: "API Developer Credential",
    holder: "OneChain API Platform",
    issuer: "OneChain Limited",
    issued: "July 2026",
    block: "52817",
  },
};

export function initPipeline() {
  const track = document.getElementById("pipelineTrack");
  const lineFill = document.getElementById("pipelineLineFill");
  const steps = document.querySelectorAll(".pipeline-section .pipeline-step");
  if (!track || !steps.length) return;

  function update() {
    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.85;
    const end = vh * 0.25;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

    if (lineFill) lineFill.style.width = `${progress * 100}%`;

    steps.forEach((step, i) => {
      const threshold = (i + 0.5) / steps.length;
      step.classList.toggle("is-active", progress >= threshold - 0.15);
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

export function initShowcaseCarousel() {
  const carousel = document.getElementById("showcaseCarousel");
  const track = document.getElementById("showcaseTrack");
  const prevBtn = document.getElementById("showcasePrev");
  const nextBtn = document.getElementById("showcaseNext");
  const dots = document.querySelectorAll(".showcase-dot");
  const slides = document.querySelectorAll(".showcase-slide");
  if (!carousel || !slides.length) return;

  let current = 0;
  let autoplayTimer = null;
  const total = slides.length;

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
      dot.setAttribute("aria-selected", String(i === current));
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), 6000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  prevBtn?.addEventListener("click", () => { goTo(current - 1); startAutoplay(); });
  nextBtn?.addEventListener("click", () => { goTo(current + 1); startAutoplay(); });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.slide || 0));
      startAutoplay();
    });
  });
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  goTo(0);
  startAutoplay();
}

export function initVerifyDemo() {
  const form = document.getElementById("verifyForm");
  const input = document.getElementById("verifyInput");
  const result = document.getElementById("verifyResult");
  if (!form || !input || !result) return;

  document.querySelectorAll(".verify-hints code").forEach((code) => {
    code.addEventListener("click", () => {
      input.value = code.textContent.trim();
      input.focus();
    });
  });

  function renderIdle() {
    result.className = "verify-result verify-result--idle";
    result.innerHTML = '<p class="verify-result-hint">Enter a credential ID above to verify on-chain.</p>';
  }

  function renderLoading() {
    result.className = "verify-result verify-result--loading";
    result.innerHTML = '<div class="verify-spinner" aria-hidden="true"></div><p>Querying OneChain Consortium…</p>';
  }

  function renderVerified(record) {
    result.className = "verify-result verify-result--success";
    result.innerHTML = `
      <div class="verify-success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <p class="verify-success-label">Verified on-chain</p>
      <h3 class="verify-success-title">${record.title}</h3>
      <dl class="verify-success-meta">
        <div><dt>Holder</dt><dd>${record.holder}</dd></div>
        <div><dt>Issuer</dt><dd>${record.issuer}</dd></div>
        <div><dt>Issued</dt><dd>${record.issued}</dd></div>
        <div><dt>Block</dt><dd>#${record.block}</dd></div>
      </dl>`;
  }

  function renderFailed(id) {
    result.className = "verify-result verify-result--error";
    result.innerHTML = `
      <div class="verify-error-icon" aria-hidden="true">✕</div>
      <p class="verify-error-label">Credential not found</p>
      <p class="verify-error-hint">No record for <code>${id}</code>. Try one of the sample IDs listed.</p>`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = input.value.trim().toUpperCase();
    if (!id) { renderIdle(); return; }
    renderLoading();
    setTimeout(() => {
      const record = VERIFY_DB[id];
      if (record) renderVerified(record);
      else renderFailed(id);
    }, 900);
  });
}
