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
const offsets = [-160, -80, 0, 80, 160];

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
