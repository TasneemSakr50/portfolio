/* =========================================================
   SCROLL.JS
   Journey paths + section reveal + progress dots
   ========================================================= */

(function () {

  'use strict';


  /* =======================================================
     PATHS
     ======================================================= */

  const pathContainers =
    document.querySelectorAll(
      '.path-container'
    );


  const pathData = [];


  pathContainers.forEach((container) => {

    const pathLine =
      container.querySelector(
        '.path-line'
      );

    const character =
      container.querySelector(
        '.path-character'
      );

    const arrow =
      container.querySelector(
        '.path-arrow'
      );

    const svg =
      container.querySelector(
        '.wave-path'
      );


    if (
      !pathLine ||
      !character ||
      !svg
    ) {
      return;
    }


    const totalLength =
      pathLine.getTotalLength();

    const viewBox =
      svg
        .getAttribute('viewBox')
        .split(' ')
        .map(Number);


    pathLine.style.strokeDasharray =
      `${totalLength} ${totalLength}`;

    pathLine.style.strokeDashoffset =
      totalLength;


    pathData.push({

      container,

      pathLine,

      character,

      arrow,

      viewBox,

      totalLength,

      progress: 0,

      targetProgress: 0

    });

  });


  /* =======================================================
     PATH PROGRESS
     ======================================================= */

  function calculateProgress(container) {

    const rect =
      container.getBoundingClientRect();


    const viewport =
      window.innerHeight;


    const start =
      viewport * .95;

    const end =
      viewport * .30;


    let progress =
      (start - rect.top) /
      (start - end);


    return Math.max(
      0,
      Math.min(1, progress)
    );

  }


  /* =======================================================
     UPDATE PATH
     ======================================================= */

  function updatePath(data) {

    data.progress +=
      (
        data.targetProgress -
        data.progress
      ) * .08;


    const offset =
      data.totalLength *
      (1 - data.progress);


    data.pathLine.style.strokeDashoffset =
      offset;


    const point =
      data.pathLine.getPointAtLength(
        data.totalLength *
        data.progress
      );


    const x =
      (point.x / data.viewBox[2]) * 100;

    const y =
      (point.y / data.viewBox[3]) * 100;


    data.character.style.left =
      `${x}%`;

    data.character.style.top =
      `${y}%`;


    /* CHARACTER VISIBILITY */

    if (data.progress < .06) {

      data.character.style.opacity =
        Math.min(
          data.progress / .06,
          1
        );

    }

    else if (data.progress > .90) {

      data.character.style.opacity =
        Math.max(
          0,
          1 -
          (
            (data.progress - .90) /
            .10
          )
        );

    }

    else {

      data.character.style.opacity = 1;

    }


    /* ARROW */

    if (data.arrow) {

      data.arrow.classList.toggle(
        'visible',
        data.progress > .92
      );

    }

  }


  /* =======================================================
     SECTION REVEAL
     ======================================================= */

  function initSectionObserver() {

    const sections =
      document.querySelectorAll(
        '.section'
      );


    if (!sections.length) return;


    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach((entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                'in-view'
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },

        {
          threshold: .05,
          rootMargin:
            '0px 0px -60px 0px'
        }

      );


    sections.forEach((section) => {

      section.classList.add(
        'fade-init'
      );

      observer.observe(section);

    });

  }


  /* =======================================================
     PROGRESS DOTS
     ======================================================= */

  function initProgress() {

    const dots =
      document.querySelectorAll(
        '.progress-dot'
      );


    if (!dots.length) return;


    const items = [];


    /* ===== نجمع الأقسام ونتعامل مع الكليك ===== */

    dots.forEach((dot) => {

      const id =
        dot.getAttribute(
          'data-target'
        );


      const section =
        document.getElementById(id);


      if (section) {

        items.push({
          dot,
          section
        });

      }


      dot.addEventListener(
        'click',
        (event) => {

          event.preventDefault();

          if (!section) return;

          section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

        }
      );

    });


    if (!items.length) return;


    /* ===== نحدد القسم النشط حسب مركز الشاشة ===== */

    function updateActiveDot() {

      /* مركز الشاشة بالنسبة للصفحة كلها */
      const viewportCenter =
        window.scrollY + window.innerHeight / 2;


      let closest =
        items[0];

      let minDistance =
        Infinity;


      items.forEach((item) => {

        const rect =
          item.section.getBoundingClientRect();


        /* مركز القسم بالنسبة للصفحة كلها */
        const sectionCenter =
          window.scrollY +
          rect.top +
          rect.height / 2;


        /* المسافة بين مركز القسم ومركز الشاشة */
        const distance =
          Math.abs(
            sectionCenter - viewportCenter
          );


        if (distance < minDistance) {

          minDistance = distance;
          closest = item;

        }

      });


      /* نطبق الـ active على الـ dot الصح */

      dots.forEach((dot) => {

        dot.classList.remove(
          'active'
        );

      });


      if (closest) {

        closest.dot.classList.add(
          'active'
        );

      }

    }


    /* ===== نربط الـ listeners ===== */

    window.addEventListener(
      'scroll',
      updateActiveDot,
      { passive: true }
    );


    window.addEventListener(
      'resize',
      updateActiveDot,
      { passive: true }
    );


    /* ===== أول مرة ===== */

    updateActiveDot();

  }


  /* =======================================================
     SMOOTH INTERNAL LINKS
     ======================================================= */

  function initSmoothLinks() {

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach((link) => {

        link.addEventListener(
          'click',
          (event) => {

            const id =
              link.getAttribute(
                'href'
              );


            if (
              !id ||
              id === '#'
            ) {
              return;
            }


            const target =
              document.querySelector(id);


            if (!target) {
              return;
            }


            event.preventDefault();


            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });


            /* move keyboard focus too (skip link) */
            if (!target.hasAttribute('tabindex')) {
              target.setAttribute('tabindex', '-1');
            }

            target.focus({ preventScroll: true });

          }
        );

      });

  }


  /* =======================================================
     ANIMATION LOOP
     ======================================================= */

  let rafId = null;
  let isRunning = false;


  function animate() {

    if (!isRunning) return;

    pathData.forEach((data) => {

      data.targetProgress =
        calculateProgress(
          data.container
        );


      updatePath(data);

    });


    rafId = requestAnimationFrame(animate);

  }


  function startAnimation() {

    if (isRunning) return;
    if (!pathData.length) return;

    isRunning = true;
    rafId = requestAnimationFrame(animate);

  }


  function stopAnimation() {

    isRunning = false;

    if (rafId) {

      cancelAnimationFrame(rafId);

      rafId = null;

    }

  }


  /* =======================================================
     VISIBILITY
     ======================================================= */

  function handleVisibilityChange() {

    if (document.hidden) {

      stopAnimation();

    } else {

      startAnimation();

    }

  }


  /* =======================================================
     INIT
     ======================================================= */

  function init() {

    initSectionObserver();

    initProgress();

    initSmoothLinks();


    /* Only start loop if paths exist */

    if (pathData.length) {

      startAnimation();

      document.addEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

    }

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