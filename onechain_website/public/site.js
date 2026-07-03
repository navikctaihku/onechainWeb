const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
const announcement = document.getElementById("announcement");
const announcementClose = document.getElementById("announcementClose");

announcementClose?.addEventListener("click", () => {
  announcement?.classList.add("hidden");
});

navToggle?.addEventListener("click", () => {
  nav?.classList.toggle("open");
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 10);
});

document.querySelectorAll(".nav a").forEach((link) => {
  if (link.dataset.active === "true") {
    link.setAttribute("aria-current", "page");
  }
});
