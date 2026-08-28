import "./styles.css";
import "./pages.css";
import { initSiteNav } from "./site-nav.js";

const announcement = document.getElementById("announcement");
const announcementClose = document.getElementById("announcementClose");

announcementClose?.addEventListener("click", () => {
  announcement?.classList.add("hidden");
});

initSiteNav();
