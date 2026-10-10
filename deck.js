/* ============================================================
   Shared deck engine for "Python in the Real World" slides.
   Fade-only transitions. No dot nav, no prev/next buttons.
   Navigation: click left 30% = back, click rest = forward.
   Keyboard: Left/Up/Backspace = back, Right/Down/Space/Enter = forward.

   Cross-file chaining: a topic file can set window.DECK_NEXT / .DECK_PREV
   (file name strings) BEFORE this script loads. Pressing "next" on the
   last slide of a topic then navigates to DECK_NEXT; pressing "back" on
   the first slide navigates to DECK_PREV, landing on *its* last slide via
   a "#last" hash so backing up across topics feels continuous instead of
   dropping you on topic N-1's slide 1. If a neighbor isn't set (e.g. the
   last-built topic has no next one yet), next/prev simply stays put.
   ============================================================ */
(function () {
  var deck = document.getElementById('deck');
  var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
  var fillEl = document.getElementById('progressFill');

  var index = 0;

  function activate(i) {
    index = Math.min(slides.length - 1, Math.max(0, i));
    slides.forEach(function (s, j) { s.classList.toggle('is-active', j === index); });
    fillEl.style.width = ((index + 1) / slides.length * 100) + '%';
  }

  function next() {
    if (index === slides.length - 1) {
      if (window.DECK_NEXT) { window.location.href = window.DECK_NEXT; }
      return;
    }
    activate(index + 1);
  }
  function prev() {
    if (index === 0) {
      if (window.DECK_PREV) { window.location.href = window.DECK_PREV + '#last'; }
      return;
    }
    activate(index - 1);
  }

  deck.addEventListener('click', function (e) {
    if (e.target.closest('a, button')) { return; } /* let real links/buttons act normally */
    var x = e.clientX / window.innerWidth;
    if (x < 0.3) { prev(); } else { next(); }
  });

  /* ---------- jump menu: hamburger toggle, top-right, lives outside #deck
     so its clicks never reach the click-to-navigate handler above ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var menuPanel = document.getElementById('menuPanel');
  if (menuToggle && menuPanel) {
    var closeMenu = function () {
      menuPanel.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    menuToggle.addEventListener('click', function () {
      var open = menuPanel.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuPanel) { closeMenu(); return; }
    if (menuPanel && menuPanel.classList.contains('is-open')) { return; } /* don't navigate slides while the menu is open */
    var fwd = ['ArrowRight', 'ArrowDown', ' ', 'Enter', 'j', 'PageDown'];
    var back = ['ArrowLeft', 'ArrowUp', 'Backspace', 'k', 'PageUp'];
    if (fwd.indexOf(e.key) > -1) { e.preventDefault(); next(); }
    if (back.indexOf(e.key) > -1) { e.preventDefault(); prev(); }
  });

  activate(window.location.hash === '#last' ? slides.length - 1 : 0);
})();
