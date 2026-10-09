/* =========================================================
   CHARACTER.JS — Cursor tracking & Blink for SpongeBob & Patrick
   ========================================================= */

(function () {

  'use strict';

  /* =======================================================
     ELEMENTS & STATE
     ======================================================= */

  let character = null;
  let enterBtn = null;

  let sbPupilLeft = null;
  let sbPupilRight = null;
  let patPupilLeft = null;
  let patPupilRight = null;

  let pupils = [];

  let mouseX = 0;
  let mouseY = 0;
  let isHoveringBtn = false;

  const CONFIG = {
    lookDownY: 8 // المسافة التي ينظر إليها لأسفل عند الهوفر على زر الاستكشاف
  };

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* =======================================================
     CURSOR TRACKING
     ======================================================= */

  function updateMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleTouchMove(e) {
    if (e.touches.length) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }

  /* =======================================================
     ANIMATION LOOP
     ======================================================= */

  function animate() {
    if (!character) return;

    pupils.forEach((item) => {
      if (!item.el) return;

      if (isHoveringBtn) {
        // النظر للأسفل اتجاه زر CTA
        item.el.style.transform = `translate(0px, ${CONFIG.lookDownY}px)`;
        return;
      }

      const rect = item.el.parentElement.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = mouseX - eyeCenterX;
      const deltaY = mouseY - eyeCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const dist = Math.min(Math.hypot(deltaX, deltaY) / 250, 1);

      const moveX = Math.cos(angle) * item.maxRange * dist;
      const moveY = Math.sin(angle) * item.maxRange * dist;

      item.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    requestAnimationFrame(animate);
  }

  /* =======================================================
     BLINK EFFECT
     ======================================================= */

  function blink() {
    const activePupils = pupils.map(p => p.el).filter(Boolean);

    activePupils.forEach((pupil) => {
      pupil.style.transition = 'opacity .06s ease';
      pupil.style.opacity = '0';
    });

    setTimeout(() => {
      activePupils.forEach((pupil) => {
        pupil.style.opacity = '1';
      });
    }, 110);
  }

  function scheduleBlink() {
    const delay = 3500 + Math.random() * 4000;

    setTimeout(() => {
      if (!document.hidden) {
        blink();
      }
      scheduleBlink();
    }, delay);
  }

  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {
    character = document.getElementById('characterWrapper');
    enterBtn = document.getElementById('enterBtn');

    sbPupilLeft = document.getElementById('sbPupilLeft');
    sbPupilRight = document.getElementById('sbPupilRight');
    patPupilLeft = document.getElementById('patPupilLeft');
    patPupilRight = document.getElementById('patPupilRight');

    if (!character || !sbPupilLeft || !sbPupilRight) {
      return;
    }

    pupils = [
      { el: sbPupilLeft, maxRange: 11 },
      { el: sbPupilRight, maxRange: 11 },
      { el: patPupilLeft, maxRange: 7 },
      { el: patPupilRight, maxRange: 7 }
    ];

    if (!prefersReducedMotion) {
      document.addEventListener('mousemove', updateMousePosition);
      document.addEventListener('touchmove', handleTouchMove, { passive: true });

      if (enterBtn) {
        enterBtn.addEventListener('mouseenter', () => { isHoveringBtn = true; });
        enterBtn.addEventListener('mouseleave', () => { isHoveringBtn = false; });
      }

      scheduleBlink();
    }

    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();