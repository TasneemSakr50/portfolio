/* =========================================================
   NAVBAR.JS
   Shared navbar component — injected on every page.
   ========================================================= */

(function () {

  'use strict';


  /* =======================================================
     CONTACT LINKS
     ======================================================= */

  const CONTACT_LINKS = [

    {
      href: 'mailto:tasneemsakr87@gmail.com',
      label: 'Email',
      labelAr: 'الإيميل',
      external: false
    },

    {
      href: 'https://www.linkedin.com/in/tasneem-sakr-002794250/',
      label: 'LinkedIn',
      external: true
    },

    {
      href: 'https://www.behance.net/tasneemsakr322004',
      label: 'Bēhance',
      external: true
    }

  ];


  function renderContactLink(link) {

    const external =
      link.external
        ? ' target="_blank" rel="noopener noreferrer"'
        : '';

    const labelAttrs =
      link.labelAr
        ? ` data-en="${link.label}" data-ar="${link.labelAr}"`
        : '';

    return `
      <a
        href="${link.href}"
        class="nav-link"
        aria-label="${link.label}"${external}
      >
        <span class="nav-link-label"${labelAttrs}>${link.label}</span>
      </a>
    `;

  }


  /* =======================================================
     TEMPLATE
     ======================================================= */

  const NAV_TEMPLATE = `
    <a href="index.html" class="nav-logo" aria-label="Home">
      <img
        src="images/10.png"
        alt="TMS Logo"
        class="nav-logo-img"
        width="88"
        height="48"
        loading="eager"
        decoding="async"
      >
    </a>

    <div class="nav-actions">

      <!-- Desktop links -->
      <div class="nav-links-desktop">
        ${CONTACT_LINKS.map(renderContactLink).join('')}
      </div>

      <!-- Mobile: زر القائمة -->
      <button
        class="nav-contact-toggle"
        id="navContactToggle"
        type="button"
        aria-label="Contact menu"
        aria-expanded="false"
      >
        <span class="nav-contact-dot"></span>
        <span class="nav-contact-dot"></span>
        <span class="nav-contact-dot"></span>
      </button>

      <!-- Mobile: القائمة المنسدلة -->
      <div class="nav-contact-menu" id="navContactMenu">
        ${CONTACT_LINKS.map(renderContactLink).join('')}
      </div>

      <a
        href="Tasneem_Sakr_CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="nav-cv"
      >
        CV
      </a>

      <button
        class="lang-toggle"
        id="langToggle"
        type="button"
        aria-label="Switch language"
      >
        <span class="lang-option active" data-lang="en">EN</span>
        <span class="lang-divider">|</span>
        <span class="lang-option" data-lang="ar">AR</span>
      </button>

    </div>
  `;


  /* =======================================================
     INJECT
     ======================================================= */

  function injectNavbar() {

    const placeholder =
      document.querySelector('[data-navbar]');


    if (!placeholder) return;


    placeholder.innerHTML = NAV_TEMPLATE;


    /* Notify lang.js that navbar is ready */

    document.dispatchEvent(
      new CustomEvent('navbar:ready')
    );


    /* ===== Toggle mobile contact menu ===== */

    const toggle =
      document.getElementById('navContactToggle');

    const menu =
      document.getElementById('navContactMenu');


    if (toggle && menu) {

      toggle.addEventListener('click', (event) => {

        event.stopPropagation();

        const isOpen =
          menu.classList.toggle('open');

        toggle.classList.toggle('active', isOpen);

        toggle.setAttribute(
          'aria-expanded',
          isOpen ? 'true' : 'false'
        );

      });


      /* إغلاق القائمة لو ضغط بره */
      document.addEventListener('click', (event) => {

        if (!menu.classList.contains('open')) return;

        if (menu.contains(event.target)) return;
        if (toggle.contains(event.target)) return;

        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');

      });


      /* إغلاق القائمة لما تضغط رابط */
      menu.querySelectorAll('.nav-link').forEach((link) => {

        link.addEventListener('click', () => {

          menu.classList.remove('open');
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');

        });

      });

    }

  }


  /* =======================================================
     INIT
     ======================================================= */

  function init() {

    injectNavbar();

  }


  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      init
    );

  } else {

    init();

  }

})();