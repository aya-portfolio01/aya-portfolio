/* =====================================================================
   PORTFOLIO — Aya El Youssfi Alaoui
   JavaScript : navbar mobile, animations au scroll, contact anti-spam.
   Aucun appel externe, aucune dépendance, aucun secret. 100% statique.
   ===================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------
     ⚙️  À PERSONNALISER : remplacez par l'URL EXACTE du profil LinkedIn
     d'Aya (copiez-la depuis le navigateur).
  ----------------------------------------------------------------- */
  var LINKEDIN_URL = "https://www.linkedin.com/in/aya-el-youssfi-alaoui";

  /* Coordonnées assemblées au chargement (limite la collecte par robots) */
  var EMAIL = ["ayaalaouielyoussfi1403", "gmail.com"];        // user, domaine
  var PHONE_DISPLAY = "07 66 28 05 81";
  var PHONE_INTL = "+33766280581";                            // format tel:

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setupYear();
    setupNavScroll();
    setupMobileMenu();
    setupReveals();
    setupLangBars();
    setupScrollSpy();
    setupContact();
    setupPhotoFallback();
  }

  /* ----------------------------- Année ----------------------------- */
  function setupYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* -------------------- Navbar : état au scroll -------------------- */
  function setupNavScroll() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var ticking = false;
    function update() {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* --------------------- Menu mobile (burger) ---------------------
     Correctif : le menu glisse à l'ouverture ET se referme proprement.
     - transform animé dans les deux sens (jamais display:none)
     - fermeture au clic sur un lien, sur le voile, ou via Échap
     - verrouillage du défilement du corps quand le menu est ouvert
  ------------------------------------------------------------------ */
  function setupMobileMenu() {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("navBurger");
    var menu = document.getElementById("navMenu");
    var scrim = document.getElementById("navScrim");
    if (!nav || !burger || !menu || !scrim) return;

    var scrimTimer = null;

    function openMenu() {
      nav.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Fermer le menu");
      document.body.style.overflow = "hidden";

      if (scrimTimer) { clearTimeout(scrimTimer); scrimTimer = null; }
      scrim.hidden = false;
      // forcer un reflow pour que la transition d'opacité s'applique
      void scrim.offsetWidth;
      scrim.classList.add("is-visible");
    }

    function closeMenu() {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Ouvrir le menu");
      document.body.style.overflow = "";

      scrim.classList.remove("is-visible");
      // masquer le voile une fois la transition terminée
      scrimTimer = window.setTimeout(function () {
        scrim.hidden = true;
      }, 350);
    }

    function toggleMenu() {
      if (nav.classList.contains("is-open")) closeMenu();
      else openMenu();
    }

    burger.addEventListener("click", toggleMenu);
    scrim.addEventListener("click", closeMenu);

    // Fermer en cliquant sur un lien du menu
    menu.addEventListener("click", function (e) {
      var target = e.target;
      if (target && target.closest && target.closest("a")) closeMenu();
    });

    // Échap pour fermer
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) closeMenu();
    });

    // Si on repasse en mode bureau, on referme proprement
    var mq = window.matchMedia("(min-width: 881px)");
    var onChange = function (e) { if (e.matches && nav.classList.contains("is-open")) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange); // anciens Safari
  }

  /* -------------------- Apparitions au scroll -------------------- */
  function setupReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    // Appliquer le délai d'échelonnement éventuel
    items.forEach(function (el) {
      var d = el.getAttribute("data-delay");
      if (d) el.style.setProperty("--d", d);
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ----------------- Barres de langues animées ----------------- */
  function setupLangBars() {
    var langs = Array.prototype.slice.call(document.querySelectorAll(".lang"));
    if (!langs.length) return;

    if (!("IntersectionObserver" in window)) {
      langs.forEach(function (el) { el.classList.add("is-shown"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-shown");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    langs.forEach(function (el) { io.observe(el); });
  }

  /* ------------------- Lien actif (scrollspy) ------------------- */
  function setupScrollSpy() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("main section[id]")
    );
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) === "#") map[href.slice(1)] = link;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          var active = map[entry.target.id];
          if (active) active.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Contact : assemblage sûr des coordonnées ---------- */
  function setupContact() {
    var email = EMAIL[0] + "@" + EMAIL[1];

    var emailEl = document.getElementById("contactEmail");
    if (emailEl) {
      emailEl.setAttribute("href", "mailto:" + email);
      setValue(emailEl, email);
    }

    var phoneEl = document.getElementById("contactPhone");
    if (phoneEl) {
      phoneEl.setAttribute("href", "tel:" + PHONE_INTL);
      setValue(phoneEl, PHONE_DISPLAY);
    }

    var liEl = document.getElementById("contactLinkedin");
    if (liEl) liEl.setAttribute("href", LINKEDIN_URL);

    var liTop = document.getElementById("linkedinTop");
    if (liTop) liTop.setAttribute("href", LINKEDIN_URL);
  }

  // Insère un texte en toute sécurité (textContent, jamais innerHTML)
  function setValue(anchor, text) {
    var span = anchor.querySelector(".contact__value");
    if (span) span.textContent = text;
  }

  /* -------- Photo : repli sur les initiales si introuvable -------- */
  function setupPhotoFallback() {
    var img = document.getElementById("profilePhoto");
    if (!img) return;
    var hide = function () { img.style.display = "none"; };
    img.addEventListener("error", hide);
    // si l'image n'a pas de dimension chargée, on masque (fichier absent)
    if (img.complete && img.naturalWidth === 0) hide();
  }
})();
