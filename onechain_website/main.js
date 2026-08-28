import "./styles.css";
import "./pages.css";
import { initSiteNav } from "./site-nav.js";
import { initPipeline, initShowcaseCarousel, initVerifyDemo } from "./home-features.js";

function boot() {
  initSiteNav();
  initPipeline();
  initShowcaseCarousel();
  initVerifyDemo();

  const announcement = document.getElementById("announcement");
  const announcementClose = document.getElementById("announcementClose");

  announcementClose?.addEventListener("click", () => {
    announcement?.classList.add("hidden");
  });

  // Fan cards: expand into fan while section scrolls through viewport
  const fanSection = document.querySelector(".fan-section");
  const fanCards = document.querySelectorAll(".fan-card");
  const angles = [-32, -16, 0, 16, 32];
  const offsets = [-320, -160, 0, 160, 320];
  let activeCard = null;

  function setFanTransforms(progress) {
    fanCards.forEach((card, i) => {
      if (card.classList.contains("active")) return;
      const angle = angles[i] * progress;
      const tx = offsets[i] * progress;
      card.style.setProperty("transform", `rotate(${angle}deg) translateX(${tx}px)`, "important");
    });
  }

  function handleFanScroll() {
    if (!fanSection) return;
    const rect = fanSection.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollRange = windowH * 0.9;
    const progress = Math.max(0, Math.min(1, 1 - rect.top / scrollRange));
    setFanTransforms(progress);
  }

  window.addEventListener("scroll", handleFanScroll, { passive: true });
  handleFanScroll();

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
    if (target === 0) {
      el.textContent = "0";
      return;
    }
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

  // Industry cards: click to expand
  const industryCards = document.querySelectorAll("[data-industry]");
  let activeIndustry = null;

  function setIndustryCardState(card, isActive) {
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-pressed", String(isActive));
  }

  industryCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
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
    if (e.target.closest("[data-industry]")) return;
    setIndustryCardState(activeIndustry, false);
    activeIndustry = null;
  });

  // Scroll reveal (skip trust visuals — always visible)
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.05 }
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

  document.querySelectorAll(".reveal:not(.reveal-registered)").forEach((el, i) => {
    registerReveal(el, Math.min(i * 80, 240));
  });

  const staggerGroups = [
    { parent: ".trust-grid", child: ".trust-copy" },
    { parent: ".industries-grid", child: ".industries-copy" },
    { parent: ".product-cards", child: ".p-card" },
  ];

  staggerGroups.forEach(({ parent, child }) => {
    document.querySelectorAll(parent).forEach((group) => {
      group.querySelectorAll(child).forEach((el, i) => registerReveal(el, i * 100));
    });
  });

  document.querySelectorAll(".hero .reveal, .fan-section .reveal").forEach((el) => {
    el.classList.add("is-visible");
  });
  revealInViewport();
  window.addEventListener("scroll", revealInViewport, { passive: true });
  window.addEventListener("resize", revealInViewport, { passive: true });
  window.addEventListener("load", revealInViewport);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
