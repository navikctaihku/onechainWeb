/** Mega-menu navigation — open/close, keyboard, mobile accordion */
export function initSiteNav() {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const header = document.getElementById("header");
  if (!nav) return;

  const dropdowns = nav.querySelectorAll(".nav-item--dropdown");

  function closeAll(except) {
    dropdowns.forEach((item) => {
      if (item === except) return;
      item.classList.remove("open");
      item.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
    });
  }

  dropdowns.forEach((item) => {
    const trigger = item.querySelector(".nav-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = item.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) closeAll(item);
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        item.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      }
    });
  });

  document.addEventListener("click", () => closeAll());
  nav.addEventListener("click", (e) => e.stopPropagation());

  navToggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
    if (!nav.classList.contains("open")) closeAll();
  });

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 10);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      nav.classList.remove("open");
      closeAll();
    }
  });
}
