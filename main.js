/* Wulan Winata — portfolio behaviour: theme, reveal, tech view toggle */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  var root = document.documentElement;

  function applyTheme(mode) {
    root.classList.toggle("dark", mode === "dark");
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("title", mode === "dark" ? "Switch to light" : "Switch to dark");
      btn.setAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  function currentTheme() {
    return root.classList.contains("dark") ? "dark" : "light";
  }

  applyTheme(currentTheme());

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".theme-toggle");
    if (!btn) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (err) { /* private mode */ }
  });

  /* follow the OS only while the visitor has made no explicit choice */
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function (ev) {
      var stored = null;
      try { stored = localStorage.getItem("theme"); } catch (err) { /* ignore */ }
      if (!stored) applyTheme(ev.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Scroll reveal ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Technologies: marquee <-> grouped ---------- */
  var techToggle = document.querySelector("[data-tech-toggle]");
  if (techToggle) {
    var marquee = document.querySelector("[data-tech-marquee]");
    var grouped = document.querySelector("[data-tech-grouped]");
    var iconGrid = techToggle.querySelector(".ico-grid");
    var iconRows = techToggle.querySelector(".ico-rows");

    techToggle.addEventListener("click", function () {
      var showGrouped = marquee.hidden === false;
      marquee.hidden = showGrouped;
      grouped.hidden = !showGrouped;
      if (iconGrid) iconGrid.hidden = showGrouped;
      if (iconRows) iconRows.hidden = !showGrouped;
      techToggle.setAttribute(
        "title",
        showGrouped ? "Show scrolling technologies" : "Show grouped technologies"
      );
    });
  }

  /* ---------- Marquee: duplicate track content for a seamless loop ---------- */
  document.querySelectorAll(".tech-track").forEach(function (track) {
    if (track.dataset.cloned === "true") return;
    var items = Array.prototype.slice.call(track.children);
    items.forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
    track.dataset.cloned = "true";
  });

  /* ---------- Mark the active nav link ---------- */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });
})();
