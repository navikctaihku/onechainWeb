const announcement = document.getElementById("announcement");
const announcementClose = document.getElementById("announcementClose");
const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

announcementClose?.addEventListener("click", () => {
  announcement?.classList.add("hidden");
});

navToggle?.addEventListener("click", () => {
  nav?.classList.toggle("open");
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 10);
});

// Fan cards: start stacked, expand into fan on scroll
const fanSection = document.querySelector(".fan-section");
const fanCards = document.querySelectorAll(".fan-card");
const angles = [-24, -12, 0, 12, 24];
const offsets = [-220, -110, 0, 110, 220];

function handleFanScroll() {
  if (!fanSection) return;
  const rect = fanSection.getBoundingClientRect();
  const windowH = window.innerHeight;

  // progress: 0 = cards stacked, 1 = fully fanned out
  const progress = Math.max(0, Math.min(1, 1 - (rect.top - windowH * 0.2) / (windowH * 0.5)));

  fanCards.forEach((card, i) => {
    if (card.classList.contains("active")) return;
    const angle = angles[i] * progress;
    const tx = offsets[i] * progress;
    card.style.transform = `rotate(${angle}deg) translateX(${tx}px)`;
  });
}

window.addEventListener("scroll", handleFanScroll, { passive: true });
handleFanScroll();

// Fan cards: click/tap to pop out the card fully visible
let activeCard = null;

fanCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    e.stopPropagation();
    if (activeCard === card) {
      card.classList.remove("active");
      activeCard = null;
      handleFanScroll();
    } else {
      fanCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      activeCard = card;
    }
  });
});

document.addEventListener("click", () => {
  if (activeCard) {
    activeCard.classList.remove("active");
    activeCard = null;
    handleFanScroll();
  }
});

// Counter animation
const counters = document.querySelectorAll("[data-count]");

function animateCounter(el) {
  const target = Number(el.dataset.count || 0);
  if (target === 0) { el.textContent = "0"; return; }
  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.5 });

counters.forEach((el) => counterObserver.observe(el));

// Industry cards: click to expand with description (Terminal 3 style)
const industryCards = document.querySelectorAll("[data-industry]");
let activeIndustry = null;

function setIndustryCardState(card, isActive) {
  const detail = card.querySelector(".industry-card-detail");
  card.classList.toggle("active", isActive);
  card.setAttribute("aria-pressed", String(isActive));
  if (detail) detail.hidden = !isActive;
}

industryCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest(".industry-link")) return;

    if (activeIndustry === card) {
      setIndustryCardState(card, false);
      activeIndustry = null;
      return;
    }

    industryCards.forEach((c) => setIndustryCardState(c, false));
    setIndustryCardState(card, true);
    activeIndustry = card;
  });

  card.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    card.click();
  });
});

document.addEventListener("click", (e) => {
  if (!activeIndustry) return;
  if (e.target.closest("[data-industry]") || e.target.closest(".industry-link")) return;
  setIndustryCardState(activeIndustry, false);
  activeIndustry = null;
});

// Scroll reveal: fade + slide up when elements enter viewport
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }
);

function revealInViewport() {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      el.classList.add("is-visible");
    }
  });
}

function registerReveal(el, delayMs = 0) {
  if (!el || el.classList.contains("reveal-registered")) return;
  el.classList.add("reveal", "reveal-registered");
  el.style.setProperty("--reveal-delay", `${delayMs}ms`);
  revealObserver.observe(el);
  revealInViewport();
}

// Static reveal elements in HTML
document.querySelectorAll(".reveal:not(.reveal-registered)").forEach((el, i) => {
  registerReveal(el, Math.min(i * 80, 240));
});

// Stagger reveals inside major sections
const staggerGroups = [
  { parent: ".trust-grid", child: ".trust-visual, .trust-copy" },
  { parent: ".industries-grid", child: ".industries-copy" },
  { parent: ".product-cards", child: ".p-card" },
  { parent: "#industryCards", child: ".industry-card" },
];

staggerGroups.forEach(({ parent, child }) => {
  document.querySelectorAll(parent).forEach((group) => {
    group.querySelectorAll(child).forEach((el, i) => registerReveal(el, i * 100));
  });
});

// Reveal everything already on screen + on scroll
function initReveals() {
  document.querySelectorAll(".hero .reveal, .fan-section .reveal").forEach((el) => {
    el.classList.add("is-visible");
  });
  revealInViewport();
}

initReveals();
window.addEventListener("scroll", revealInViewport, { passive: true });
window.addEventListener("resize", revealInViewport, { passive: true });
window.addEventListener("load", initReveals);
// Safety net: never leave sections invisible
setTimeout(revealInViewport, 100);
setTimeout(() => {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    el.classList.add("is-visible");
  });
}, 2000);
