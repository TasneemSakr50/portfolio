/* =========================================================
   LANG.JS
   English / Arabic

   The page layout NEVER flips. <html> stays dir="ltr" so the
   characters and sections keep the same positions in both
   languages. Only the text itself gets dir="rtl" in Arabic.
   ========================================================= */

(function () {

  'use strict';


  /* =======================================================
     STATE
     ======================================================= */

  const STORAGE_KEY =
    'tasneem-portfolio-lang';

  const DEFAULT_LANG =
    'en';


  let langToggle = null;
  let langOptions = [];

  let currentLang = null;


  const body =
    document.body;

  const html =
    document.documentElement;


  /* =======================================================
     TRANSLATABLE ELEMENTS
     ======================================================= */

  function getTranslatableElements() {

    return document.querySelectorAll(
      '[data-en][data-ar]'
    );

  }


  /* =======================================================
     SWITCH
     ======================================================= */

  function switchLanguage(lang) {

    if (
      lang !== 'en' &&
      lang !== 'ar'
    ) {
      lang = DEFAULT_LANG;
    }

    currentLang = lang;


    html.lang = lang;

    body.classList.toggle(
      'lang-ar',
      lang === 'ar'
    );


    getTranslatableElements()
      .forEach((element) => {

        const text =
          element.getAttribute(
            `data-${lang}`
          );

        if (text !== null) {

          element.textContent = text;

          /* direction applies to the text only, not the layout */
          element.setAttribute(
            'dir',
            lang === 'ar' ? 'rtl' : 'ltr'
          );

        }

      });


    langOptions.forEach((option) => {

      const active =
        option.getAttribute('data-lang') === lang;

      option.classList.toggle(
        'active',
        active
      );

    });


    try {

      localStorage.setItem(
        STORAGE_KEY,
        lang
      );

    } catch (error) {
      /* Ignore storage errors */
    }

  }


  /* =======================================================
     GET SAVED
     ======================================================= */

  function getSavedLanguage() {

    try {

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (
        saved === 'en' ||
        saved === 'ar'
      ) {

        return saved;

      }

    } catch (error) {
      /* Ignore */
    }


    return DEFAULT_LANG;

  }


  /* =======================================================
     TOGGLE
     ======================================================= */

  function handleToggle(event) {

    const clickedOption =
      event.target.closest(
        '.lang-option'
      );


    if (clickedOption) {

      switchLanguage(
        clickedOption.getAttribute(
          'data-lang'
        )
      );

      return;

    }


    switchLanguage(
      currentLang === 'en'
        ? 'ar'
        : 'en'
    );

  }


  /* =======================================================
     BIND NAVBAR
     ======================================================= */

  function bindNavbar() {

    langToggle =
      document.getElementById('langToggle');

    langOptions =
      document.querySelectorAll('.lang-option');


    if (!langToggle) return;


    langToggle.removeEventListener(
      'click',
      handleToggle
    );

    langToggle.addEventListener(
      'click',
      handleToggle
    );

  }


  /* =======================================================
     INIT
     ======================================================= */

  function init() {

    bindNavbar();

    switchLanguage(
      currentLang || getSavedLanguage()
    );

  }


  /* =======================================================
     NAVBAR INJECTED LATER
     (uses the saved / current language, never html.lang,
      otherwise a saved Arabic choice gets overwritten)
     ======================================================= */

  document.addEventListener(
    'navbar:ready',
    () => {

      bindNavbar();

      switchLanguage(
        currentLang || getSavedLanguage()
      );

    }
  );


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
