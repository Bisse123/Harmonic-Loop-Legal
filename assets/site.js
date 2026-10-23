(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Fills a container with drifting glow particles in the game's palette.
   * @param {HTMLElement|null} container Element to fill; nothing happens when null.
   * @param {number} count How many particles to add; any positive whole number.
   * @returns {void} Appends `count` span elements to the container.
   */
  function spawnMotes(container, count) {
    if (!container || reduceMotion) return;
    var colors = ["#38d6ff", "#ff9be6", "#f7c948", "#a77bff"];
    for (var i = 0; i < count; i++) {
      var mote = document.createElement("span");
      mote.className = "mote";
      mote.style.left = (Math.random() * 100).toFixed(2) + "%";
      mote.style.top = (20 + Math.random() * 85).toFixed(2) + "%";
      mote.style.setProperty("--size", (2 + Math.random() * 4).toFixed(1) + "px");
      mote.style.setProperty("--color", colors[i % colors.length]);
      mote.style.setProperty("--alpha", (0.35 + Math.random() * 0.55).toFixed(2));
      mote.style.setProperty("--duration", (10 + Math.random() * 14).toFixed(1) + "s");
      mote.style.setProperty("--delay", (-Math.random() * 20).toFixed(1) + "s");
      mote.style.setProperty("--sway", (Math.random() * 80 - 40).toFixed(0) + "px");
      container.appendChild(mote);
    }
  }

  /**
   * Fades in every `.reveal` element the first time it scrolls into view.
   * @returns {void} Adds `is-visible` to each `.reveal` element as it appears.
   */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /**
   * Opens screenshots marked `data-full` in the page's `.lightbox` dialog.
   * @returns {void} Wires click handlers on every `[data-full]` button; does nothing without a dialog.
   */
  function initLightbox() {
    var dialog = document.querySelector(".lightbox");
    if (!dialog || typeof dialog.showModal !== "function") return;
    var img = dialog.querySelector("img");
    var caption = dialog.querySelector(".lightbox-caption");

    document.querySelectorAll("[data-full]").forEach(function (button) {
      button.addEventListener("click", function () {
        img.src = button.getAttribute("data-full");
        img.alt = button.querySelector("img").alt;
        caption.textContent = button.getAttribute("data-caption") || "";
        dialog.showModal();
      });
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog || event.target.closest("[data-close]")) dialog.close();
    });
  }

  /**
   * Highlights the table-of-contents link for the section currently being read.
   * @returns {void} Toggles `is-active` on the `.toc` links as the reader scrolls.
   */
  function initTocSpy() {
    var links = document.querySelectorAll(".toc a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-active"); });
        var link = byId[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-20% 0px -70% 0px" });

    document.querySelectorAll(".doc section[id]").forEach(function (s) { observer.observe(s); });
  }

  spawnMotes(document.querySelector(".motes"), 36);
  initReveal();
  initLightbox();
  initTocSpy();
})();
