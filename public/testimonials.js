/* CoachDW testimonial module: arrows, position dots and the video pop-up. */
(function () {
  'use strict';

  document.querySelectorAll('[data-tm]').forEach(function (root) {
    var track = root.querySelector('.tm-track');
    var cards = Array.prototype.slice.call(track.children);
    var prev = root.querySelector('[data-tm-prev]');
    var next = root.querySelector('[data-tm-next]');
    var dotsBox = root.querySelector('.tm-dots');
    var modal = root.querySelector('.tm-modal');
    var player = root.querySelector('.tm-player');
    var modalTitle = root.querySelector('.tm-modal-title');
    var lastOpener = null;

    // ---- Dots, one per card ----
    var dots = cards.map(function (card, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tm-dot';
      b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      b.appendChild(document.createElement('span'));
      b.addEventListener('click', function () { scrollToCard(i); });
      dotsBox.appendChild(b);
      return b;
    });

    function step() {
      return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    }
    function current() {
      return Math.round(track.scrollLeft / Math.max(1, step()));
    }
    function scrollToCard(i) {
      track.scrollTo({ left: i * step(), behavior: 'smooth' });
    }
    function update() {
      var i = current();
      var max = track.scrollWidth - track.clientWidth - 2;
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
      // Hide the dots and arrows when every card already fits on screen.
      var allFit = track.scrollWidth <= track.clientWidth + 2;
      dotsBox.hidden = allFit;
      root.querySelector('.tm-arrows').hidden = allFit;
    }
    prev.addEventListener('click', function () { scrollToCard(Math.max(0, current() - 1)); });
    next.addEventListener('click', function () { scrollToCard(Math.min(cards.length - 1, current() + 1)); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();

    // ---- Video pop-up ----
    function openVideo(btn) {
      lastOpener = btn;
      var src = btn.getAttribute('data-video') || '';
      modalTitle.textContent = btn.getAttribute('data-title') || 'Client video';
      player.textContent = '';
      if (src) {
        var v = document.createElement('video');
        v.src = src;
        v.controls = true;
        v.playsInline = true;
        v.setAttribute('playsinline', '');
        var poster = btn.querySelector('img');
        if (poster) { v.poster = poster.getAttribute('src'); }
        player.appendChild(v);
        modal.hidden = false;
        var p = v.play();
        if (p && p.catch) { p.catch(function () {}); }
      } else {
        var empty = document.createElement('div');
        empty.className = 'tm-player-empty';
        empty.textContent = '[Client video goes here]';
        player.appendChild(empty);
        modal.hidden = false;
      }
      root.querySelector('.tm-close').focus();
    }
    function closeVideo() {
      var v = player.querySelector('video');
      if (v) { v.pause(); }
      player.textContent = '';
      modal.hidden = true;
      if (lastOpener) { lastOpener.focus(); }
    }
    root.querySelectorAll('.tm-video').forEach(function (btn) {
      btn.addEventListener('click', function () { openVideo(btn); });
    });
    root.querySelectorAll('[data-tm-close]').forEach(function (b) { b.addEventListener('click', closeVideo); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) { closeVideo(); }
    });
  });
})();
