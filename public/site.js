/* CoachDW.com home page behaviour: menu, pop-ups, carousel, welcome box,
   WhatsApp demo chat, typing banners and text fitting. No libraries. */
(function () {
  'use strict';

  // ---- Settings you might want to change ----------------------------------
  var CONFIG = {
    members: 0,                 // Skool members so far (shown in the final call to action once above 0)
    welcomeEveryVisit: false,   // true = welcome pop-up on every visit; false = first visit only
    carouselSeconds: 6,         // time each slide of the top carousel shows
    bannerSpeed: 15             // letters per second for the typing banners
  };
  // -------------------------------------------------------------------------

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function show(name, on) { qsa('[data-if="' + name + '"]').forEach(function (el) { el.hidden = !on; }); }
  function ref(name) { return qs('[data-ref="' + name + '"]'); }

  // ===== Menu and pop-ups ===================================================
  var state = { menu: false, tt: null, about: false, video: false, welcome: false };

  function setMenu(on) {
    state.menu = on;
    show('showMenu', on);
    var mn = qs('#mnav'); if (mn) { mn.classList.toggle('open', on); }
    var b = qs('[data-action="toggleMenu"]');
    if (b) { b.setAttribute('aria-expanded', on ? 'true' : 'false'); b.setAttribute('aria-label', on ? 'Close menu' : 'Menu'); }
  }
  function setTT(k) {
    state.tt = k;
    show('showApp', k === 'app'); show('showIlog', k === 'ilog'); show('showWa', k === 'wa');
  }
  function setAbout(on) { state.about = on; show('showAbout', on); }
  function setVideo(on) { state.video = on; show('showVideo', on); }

  var actions = {
    toggleMenu: function () { setMenu(!state.menu); },
    closeMenu: function () { setMenu(false); },
    openApp: function (e) { e.preventDefault(); setTT('app'); },
    openIlog: function (e) { e.preventDefault(); setTT('ilog'); },
    openWa: function (e) { e.preventDefault(); setTT('wa'); },
    closeTT: function () { setTT(null); },
    openAbout: function (e) { e.preventDefault(); setAbout(true); },
    closeAbout: function () { setAbout(false); },
    openVideo: function (e) { e.preventDefault(); setVideo(true); },
    closeVideo: function () { setVideo(false); },
    closeWelcome: function () { closeWelcome(); },
    openWelcome: function (e) { if (e) { e.preventDefault(); } openWelcome(); }
  };
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!el) { return; }
    var fn = actions[el.getAttribute('data-action')];
    if (fn) { fn(e); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    if (state.welcome) { closeWelcome(); }
    else if (state.tt) { setTT(null); }
    else if (state.about) { setAbout(false); }
    else if (state.video) { setVideo(false); }
    else if (state.menu) { setMenu(false); }
  });

  // ===== Back-to-top button =================================================
  var topOn = false;
  function onScrollTop() {
    var on = window.scrollY > 600;
    if (on !== topOn) { topOn = on; show('showTop', on); }
  }
  window.addEventListener('scroll', onScrollTop, { passive: true });
  onScrollTop();

  // ===== Top carousel (ME section) ==========================================
  var slide = 1, slideTimer = null;
  function setSlide(n) {
    slide = n;
    qsa('[data-slide]').forEach(function (el) {
      var on = el.getAttribute('data-slide') === String(n);
      el.style.opacity = on ? '1' : '0';
      el.style.pointerEvents = on ? 'auto' : 'none';
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    qsa('[data-slide-link]').forEach(function (el) {
      el.setAttribute('tabindex', el.getAttribute('data-slide-link') === String(n) ? '0' : '-1');
    });
    qsa('[data-dot]').forEach(function (el) {
      var on = el.getAttribute('data-dot') === String(n);
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
      var bar = el.querySelector('span');
      if (bar) { bar.style.background = on ? '#cc0000' : '#6e6e6e'; }
    });
  }
  function startCarousel() {
    if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
    if (reduceMotion) { return; }
    slideTimer = setInterval(function () {
      if (state.video) { return; }
      setSlide(slide === 2 ? 1 : 2);
    }, CONFIG.carouselSeconds * 1000);
  }
  qsa('[data-dot]').forEach(function (el) {
    el.addEventListener('click', function () { setSlide(Number(el.getAttribute('data-dot'))); startCarousel(); });
  });
  startCarousel();

  // ===== Welcome pop-up =====================================================
  var W_TEXT = 'Welcome...';
  var wN = 0, wBlink = false, wSlide = 1;
  var wTextEl = qs('[data-w-text]'), wCursorEl = qs('[data-w-cursor]');
  function drawWelcome() {
    if (wTextEl) { wTextEl.textContent = W_TEXT.slice(0, wN); }
    if (wCursorEl) { wCursorEl.style.opacity = wBlink ? '0' : '1'; }
    qsa('[data-w-img]').forEach(function (img) {
      img.style.opacity = img.getAttribute('data-w-img') === String(wSlide) ? '1' : '0';
    });
  }
  function openWelcome() {
    state.welcome = true; wN = reduceMotion ? W_TEXT.length : 0; wSlide = 1; wBlink = false;
    drawWelcome();
    show('showWelcome', true);
  }
  window.cdwWelcomeOpen = function () { return state.welcome; };
  function closeWelcome() {
    state.welcome = false;
    show('showWelcome', false);
    try { window.localStorage.setItem('cdw_welcome_seen', '1'); } catch (e) {}
  }
  (function scheduleWelcome() {
    var seen = false;
    try { seen = window.localStorage.getItem('cdw_welcome_seen') === '1'; } catch (e) {}
    if (seen && !CONFIG.welcomeEveryVisit) { return; }
    // Opens when the hero finishes its first round (hero.js calls cdwWelcomeAuto),
    // or 2 seconds after the first scroll, whichever comes first (25-second fallback).
    var opened = false, landTimer, scrollTimer;
    function openNow() {
      if (opened) { return; }
      opened = true;
      clearTimeout(landTimer); clearTimeout(scrollTimer);
      window.removeEventListener('scroll', onFirstScroll);
      openWelcome();
    }
    function onFirstScroll() {
      window.removeEventListener('scroll', onFirstScroll);
      scrollTimer = setTimeout(openNow, 2000);
    }
    window.addEventListener('scroll', onFirstScroll, { passive: true });
    landTimer = setTimeout(openNow, 25000);
    window.cdwWelcomeAuto = openNow;
  })();
  setInterval(function () { if (state.welcome && wN < W_TEXT.length) { wN++; wBlink = false; drawWelcome(); } }, 140);
  setInterval(function () { if (state.welcome && wN >= W_TEXT.length) { wBlink = !wBlink; drawWelcome(); } }, 500);

  // ===== WhatsApp demo chat (plays like a screen recording, then loops) =====
  var WA_SCRIPT = [
    ['b', 'Morning Danny Boy, happy Friday.\n\nToday is **PUSH**\nSquat · Shoulder Press · Chest Press · Dips\n\nHow many days since your last session?'],
    ['u', '2'],
    ['b', 'How do you feel, 1 to 5? Anything to flag?'],
    ['u', '4. Slept well, left shoulder a bit tight'],
    ['card', ''],
    ['b', '**SQUAT** · Back Squat\nSet 1: 45 kg x 10-12\nSet 2: 67.5 kg x 8-10\nSet 3: **90 kg** to strict technical failure\n\nLast time: 5. Beat it.'],
    ['u', '6'],
    ['b', '6 at 90 kg. One better than last time.\nWeight holds. Chase 7 next session.'],
    ['b', '**SHOULDER PRESS** · BB Overhead Press\nSet 3: **60 kg** to strict technical failure\n\nLast time: 6. Beat it.'],
    ['u', '7'],
    ['b', 'The Magnificent 7.\nNext session goes up to **62.5 kg**.'],
    ['b', '**Session done.** Just one more rep.\nSee you Monday for PULL.']
  ];
  var wa = { n: 0, typing: false, field: '' };

  function waMessageEl(m) {
    var el = document.createElement('div');
    if (m[0] === 'card') {
      el.style.cssText = "flex: none; align-self: flex-start; width: 72%; background: #0a0a0a; color: #cc0000; font-family: 'Special Elite', 'Courier New', monospace; text-align: center; padding: 5cqw 2cqw 4cqw; border-radius: 1.8cqw; font-size: 1.35em; line-height: 1.1";
      el.appendChild(document.createTextNode("LET'S F**KING GO"));
      var tag = document.createElement('span');
      tag.style.cssText = 'display: block; color: #ffffff; font-size: 1.1em; margin-top: 1.5cqw';
      tag.textContent = '#LFG';
      el.appendChild(tag);
      return el;
    }
    var mine = m[0] === 'u';
    el.style.cssText = 'flex: none; align-self: ' + (mine ? 'flex-end' : 'flex-start') +
      '; max-width: 84%; background: ' + (mine ? '#d9fdd3' : '#ffffff') +
      '; border-radius: ' + (mine ? '2.6cqw 2.6cqw 0.6cqw 2.6cqw' : '2.6cqw 2.6cqw 2.6cqw 0.6cqw') +
      '; padding: 1.8cqw 2.6cqw 1.4cqw; white-space: pre-line; box-shadow: 0 0.3cqw 0.3cqw rgba(0,0,0,.12)';
    m[1].split('**').forEach(function (t, k) {
      var s = document.createElement('span');
      s.style.fontWeight = k % 2 ? '700' : '400';
      s.textContent = t;
      el.appendChild(s);
    });
    return el;
  }
  function waTypingEl() {
    var el = document.createElement('div');
    el.style.cssText = 'flex: none; align-self: flex-start; background: #ffffff; border-radius: 2.6cqw; padding: 3cqw 3.4cqw; display: flex; gap: 1.2cqw';
    [1, 0.6, 0.3].forEach(function (op) {
      var d = document.createElement('span');
      d.style.cssText = 'width: 1.8cqw; height: 1.8cqw; border-radius: 50%; background: #667781; opacity: ' + op;
      el.appendChild(d);
    });
    return el;
  }
  function drawWa() {
    qsa('[data-wa-msgs]').forEach(function (box) {
      box.textContent = '';
      WA_SCRIPT.slice(0, wa.n).forEach(function (m) { box.appendChild(waMessageEl(m)); });
      if (wa.typing) { box.appendChild(waTypingEl()); }
    });
    qsa('[data-wa-status]').forEach(function (el) { el.textContent = wa.typing ? 'typing...' : 'online'; });
    qsa('[data-wa-field]').forEach(function (el) {
      el.textContent = wa.field || 'Message';
      el.style.color = wa.field ? '#111b21' : '#667781';
    });
  }
  (function startWa() {
    if (reduceMotion) { wa.n = WA_SCRIPT.length; drawWa(); return; }
    var steps = [];
    WA_SCRIPT.forEach(function (m, k) {
      if (m[0] === 'b') {
        steps.push({ typing: true, ms: Math.min(1400, 600 + m[1].length * 6) });
        steps.push({ n: k + 1, ms: Math.min(2600, 1000 + m[1].length * 12) });
      } else if (m[0] === 'u') {
        for (var c = 1; c <= m[1].length; c++) { steps.push({ field: m[1].slice(0, c), ms: 70 }); }
        steps.push({ field: m[1], ms: 350 });
        steps.push({ n: k + 1, field: '', ms: 600 });
      } else {
        steps.push({ n: k + 1, ms: 1600 });
      }
    });
    steps.push({ hold: true, ms: 3500 });
    var i = 0;
    function run() {
      if (i >= steps.length) { i = 0; wa = { n: 0, typing: false, field: '' }; drawWa(); setTimeout(run, 700); return; }
      var s = steps[i++];
      wa.typing = !!s.typing;
      if (s.n !== undefined) { wa.n = s.n; }
      if (s.field !== undefined) { wa.field = s.field; }
      drawWa();
      setTimeout(run, s.ms);
    }
    drawWa();
    setTimeout(run, 800);
  })();

  // ===== Typing banners =====================================================
  var SIGN_OFF = 'F**K FAKE. GET REAL. RESULTS.';
  var measureCtx = null;
  function initBanner(box) {
    var raw = box.getAttribute('data-line') || '';
    var segs = raw.split('**').map(function (t, k) { return { text: t, style: k % 2 ? 'red' : 'plain', line: true }; })
      .filter(function (x) { return x.text.length; });
    if (segs.length) { segs[segs.length - 1].gap = true; }
    var script = segs.concat([
      { text: 'F**K ', style: 'plain' }, { text: 'FAKE', style: 'fake' }, { text: '. GET ', style: 'plain' },
      { text: 'REAL', style: 'real' }, { text: '. ', style: 'plain' }, { text: 'RESULTS.', style: 'results' }
    ]);
    var total = script.reduce(function (n, p) { return n + p.text.length; }, 0);
    var lineLen = segs.reduce(function (a, x) { return a + x.text.length; }, 0);
    var b = { n: 0, wait: 0, on: true, done: false, started: false, timer: null };
    var track, cursor;

    function sizeText() {
      var cs = window.getComputedStyle(box);
      var avail = box.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      if (avail <= 0) { return; }
      if (!measureCtx) { measureCtx = document.createElement('canvas').getContext('2d'); }
      measureCtx.font = "700 100px 'Special Elite', 'Courier New', monospace";
      var perPx = measureCtx.measureText(SIGN_OFF).width / 100 + 0.62;
      box.style.fontSize = Math.max(12, Math.floor((avail / perPx) * 0.97)) + 'px';
    }
    function fit() {
      if (!track) { return; }
      var cs = window.getComputedStyle(box);
      var room = box.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      var over = track.offsetWidth - room;
      track.style.transform = 'translateX(' + (over > 0 ? -over : 0) + 'px)';
    }
    function draw() {
      box.textContent = '';
      cursor = document.createElement('span');
      cursor.className = 'sb-cursor';
      cursor.style.opacity = b.on ? '1' : '0';
      if (b.done) {
        track = null;
        var frozen = document.createElement('div');
        frozen.className = 'sb-frozen';
        frozen.setAttribute('aria-hidden', 'true');
        frozen.innerHTML = '<span>F**K <span class="sb-fake">FAKE</span>. GET <span class="sb-real">REAL</span>. <span class="sb-red">RESULTS.</span></span>';
        frozen.firstChild.appendChild(cursor);
        box.appendChild(frozen);
        return;
      }
      track = document.createElement('div');
      track.className = 'sb-track';
      track.setAttribute('aria-hidden', 'true');
      var left = b.n;
      script.forEach(function (p) {
        if (left <= 0) { return; }
        var shown = p.text.slice(0, left);
        left -= shown.length;
        var s = document.createElement('span');
        s.textContent = shown;
        if (p.style === 'red' || p.style === 'results') { s.className = 'sb-red'; }
        if (p.style === 'fake') { s.className = 'sb-fake'; }
        if (p.style === 'real') { s.className = 'sb-real'; }
        s.style.fontWeight = p.line ? '400' : '700';
        if (p.gap && shown.length === p.text.length) { s.style.paddingRight = '0.6em'; }
        track.appendChild(s);
      });
      track.appendChild(cursor);
      box.appendChild(track);
      fit();
    }
    function stop() { if (b.timer) { clearInterval(b.timer); b.timer = null; } }
    function tick() {
      if (b.wait > 0) { b.wait--; return; }
      b.n++;
      if (b.n >= total) { stop(); b.n = total; b.on = true; b.done = true; draw(); return; }
      b.on = true;
      b.wait = b.n === lineLen ? Math.round(CONFIG.bannerSpeed * 0.6) : 0;
      draw();
    }
    function restart() {
      stop();
      if (reduceMotion) { b.n = total; b.done = true; b.on = true; draw(); return; }
      b.n = 0; b.wait = 0; b.on = true; b.done = false; draw();
      b.timer = setInterval(tick, Math.max(15, 1000 / CONFIG.bannerSpeed));
    }

    // Cursor blinks all the time.
    setInterval(function () { b.on = !b.on; if (cursor) { cursor.style.opacity = b.on ? '1' : '0'; } }, 500);
    sizeText();
    draw();
    // Type it out each time it scrolls into view; reset when it leaves.
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !b.started) { b.started = true; restart(); }
          else if (!e.isIntersecting && b.started) { b.started = false; stop(); b.n = 0; b.wait = 0; b.on = true; b.done = false; draw(); }
        });
      }, { threshold: [0, 0.6] }).observe(box);
    } else {
      b.started = true; restart();
    }
    return { resize: function () { sizeText(); fit(); } };
  }
  var banners = qsa('.sb').map(initBanner);

  // ===== Text fitting and header height ======================================
  function fitPair(box, txt, padded) {
    if (!box || !txt) { return; }
    var avail = box.clientWidth;
    if (padded) {
      var cs = window.getComputedStyle(box);
      avail = (avail - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0)) * 0.95;
    }
    var w = txt.offsetWidth;
    if (!w || avail <= 0) { return; }
    var cur = parseFloat(window.getComputedStyle(txt).fontSize) || 36;
    var next = Math.max(12, cur * avail / w);
    if (Math.abs(next - cur) > 0.5) { txt.style.fontSize = next.toFixed(1) + 'px'; }
  }
  function layout() {
    // "Join the Tribe" bar runs edge to edge; "One system, three formats" runs margin to margin.
    fitPair(ref('joinBox'), ref('joinText'), true);
    fitPair(ref('strapBox'), ref('strapText'), false);
    // Jump links land each section's top line on the header's red line.
    var h = ref('header');
    if (h) { document.documentElement.style.setProperty('--hdr', h.offsetHeight + 'px'); }
    banners.forEach(function (bn) { bn.resize(); });
  }
  window.addEventListener('resize', layout);
  layout();
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(layout); }

  // ===== Members count in the final call to action ==========================
  var membersEl = qs('[data-members]');
  if (membersEl && CONFIG.members > 0) {
    membersEl.textContent = CONFIG.members.toLocaleString('en-GB') + ' already in. ';
  }
})();
