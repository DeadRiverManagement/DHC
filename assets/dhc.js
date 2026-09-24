/* Dynamic Heating & Cooling — refresh 2026
   Small, dependency-free behaviour: mobile drawer, dropdowns, current-page marking.
   No framework, no jQuery. Drops into the WordPress theme as one enqueued file. */
(function () {
  "use strict";

  var mq = window.matchMedia("(max-width: 900px)");

  /* ---- mobile drawer -------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("primary-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- dropdowns ------------------------------------------------------
     Desktop: open on hover, and on click/Enter for keyboard users.
     Mobile: the parent link's caret toggles the submenu instead of navigating. */
  var parents = document.querySelectorAll(".menu > li.has-sub");

  Array.prototype.forEach.call(parents, function (li) {
    var link = li.querySelector(":scope > a");
    var sub = li.querySelector(":scope > .submenu");
    if (!link || !sub) return;

    link.setAttribute("aria-expanded", "false");
    link.setAttribute("aria-haspopup", "true");

    function open(state) {
      li.classList.toggle("open", state);
      link.setAttribute("aria-expanded", state ? "true" : "false");
    }

    li.addEventListener("mouseenter", function () {
      if (!mq.matches) open(true);
    });
    li.addEventListener("mouseleave", function () {
      if (!mq.matches) open(false);
    });

    link.addEventListener("click", function (e) {
      // On mobile the top-level item reveals its children rather than navigating.
      // On desktop a click still follows the link; keyboard users get the panel.
      if (mq.matches) {
        e.preventDefault();
        open(!li.classList.contains("open"));
      }
    });

    li.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        open(false);
        link.focus();
      }
    });

    // Close the panel once focus leaves the whole item.
    li.addEventListener("focusout", function (e) {
      if (!mq.matches && !li.contains(e.relatedTarget)) open(false);
    });
  });

  /* ---- close everything on outside click ------------------------------ */
  document.addEventListener("click", function (e) {
    if (e.target.closest(".nav")) return;
    Array.prototype.forEach.call(parents, function (li) {
      li.classList.remove("open");
      var a = li.querySelector(":scope > a");
      if (a) a.setAttribute("aria-expanded", "false");
    });
  });

  /* ---- mark the current page in the nav and sidebar -------------------
     Saves hand-editing aria-current into 27 static files. */
  var here = location.pathname.split("/").pop() || "index.html";
  var links = document.querySelectorAll(".menu a, .sidenav a");

  Array.prototype.forEach.call(links, function (a) {
    var href = (a.getAttribute("href") || "").split("/").pop();
    if (href && href === here) {
      a.setAttribute("aria-current", "page");
      var top = a.closest(".menu > li");
      if (top) top.setAttribute("aria-current", "true");
    }
  });
})();
