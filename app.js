(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var IMG = 'assets/img/';
  var VID = 'assets/video/';

  // Gallery items; w/h keep each file's real aspect ratio.
  var photos = [
    { cat: 'iron', name: 'iron-scrap-pile', w: 416, h: 900, lw: 739, lh: 1600, alt: 'انبوه آهن‌آلات کهنه، بشکهٔ زنگ‌زده، چوکات فلزی و قطعات بایسکل و موترسایکل' },
    { cat: 'iron', name: 'iron-scrap-tires', w: 416, h: 900, lw: 739, lh: 1600, alt: 'آهن‌آلات کهنه، تایر و چرخ موترسایکل در کنار بوجی‌های پر' },
    { cat: 'aluminum', name: 'aluminum-hard', w: 502, h: 900, lw: 1072, lh: 1920, alt: 'ارمنه سخت: رینگ‌های کهنهٔ ارمنه‌ای روی هم در محوطه' },
    { cat: 'battery', name: 'batteries', w: 720, h: 540, lw: 1600, lh: 1200, alt: 'باتری‌های مستعمل موتر کنار هم روی ترازو' },
    { cat: 'battery', name: 'batteries-scale', w: 675, h: 900, lw: 1500, lh: 2000, alt: 'باتری‌های مستعمل روی ترازوی دیجیتال مجموعه' },
    { cat: 'copper', file: 'copper-brass.jpg', w: 512, h: 512, lw: 512, lh: 512, alt: 'اتصالات برنجی زردرنگ در کنار سیم‌های مسی' },
    { cat: 'plastic', name: 'plastic-containers', w: 416, h: 900, lw: 739, lh: 1600, alt: 'گیلن‌ها و ظروف پلاستیکی کهنه، بیشتر به رنگ زرد' },
    { cat: 'plastic', name: 'plastic-bottles-yard', w: 416, h: 900, lw: 739, lh: 1600, alt: 'انبوه بوتل‌های پلاستیکی و بوجی‌های زرد در محوطه' },
    { cat: 'plastic', name: 'plastic-bottles-close', w: 416, h: 900, lw: 739, lh: 1600, alt: 'نمای نزدیک بوتل‌های پلاستیکی سبز و سفید' },
    { cat: 'shoes', name: 'shoes-1', w: 675, h: 900, lw: 1500, lh: 2000, alt: 'انبوه چپلک و کفش‌های مستعمل' },
    { cat: 'shoes', name: 'shoes-2', w: 675, h: 900, lw: 1500, lh: 2000, alt: 'چپلک و کفش‌های مستعمل به رنگ‌های مختلف' },
    { cat: 'yard', name: 'baled-cans-truck', w: 720, h: 405, lw: 1600, lh: 900, alt: 'بسته‌های فشرده‌شدهٔ قوطی بارشده روی لاری' },
    { cat: 'yard', name: 'baled-cans-truck-worker', w: 720, h: 405, lw: 1600, lh: 900, alt: 'کارگر در حال چیدن بسته‌های فشرده‌شدهٔ قوطی روی لاری' },
    { cat: 'yard', name: 'truck-loading', w: 416, h: 900, lw: 739, lh: 1600, alt: 'بارگیری قطعات فلزی کهنه روی موتر باربری آبی در محوطه' },
    { cat: 'yard', name: 'baled-cans-wall', w: 720, h: 405, lw: 1600, lh: 900, alt: 'دیوار بلندی از بسته‌های فشرده‌شدهٔ قوطی در انبار مجموعه' }
  ];

  // Videos: original files, loaded only when the visitor presses play.
  var videos = [
    { cat: 'aluminum', file: 'web/metal-1.mp4', poster: 'metal-1.jpg', w: 1920, h: 1072, label: 'ویدیو: ارمنه نرم در محوطه' },
    { cat: 'shoes', file: 'web/shoes.mp4', poster: 'shoes.jpg', w: 1072, h: 1920, label: 'ویدیو: انبوه چپلک و کفش‌های مستعمل' },
    { cat: 'yard', file: 'web/yard-walk.mp4', poster: 'yard-walk.jpg', w: 1920, h: 1072, label: 'ویدیو: نمایی از محوطه و بارگیری اجناس' },
    { cat: 'aluminum', file: 'web/metal-2.mp4', poster: 'metal-2.jpg', w: 1072, h: 1920, label: 'ویدیو: نمای نزدیک ارمنه نرم' }
  ];

  var grid = document.getElementById('gallery-grid');
  var status = document.getElementById('gallery-status');

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    for (var k in attrs) { if (attrs[k] != null) n.setAttribute(k, attrs[k]); }
    (children || []).forEach(function (c) { n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  // Interleave photos and videos so "همه" mixes media types.
  var items = [];
  var vi = 0;
  photos.forEach(function (p, i) {
    items.push({ type: 'photo', data: p, index: i });
    if (i % 3 === 2 && vi < videos.length) items.push({ type: 'video', data: videos[vi++] });
  });
  while (vi < videos.length) items.push({ type: 'video', data: videos[vi++] });

  items.forEach(function (it) {
    var li;
    if (it.type === 'photo') {
      var p = it.data;
      var img = el('img', { src: IMG + (p.file || p.name + '-800.jpg'), width: p.w, height: p.h, alt: p.alt, loading: 'lazy', decoding: 'async' });
      var btn = el('button', { type: 'button', 'class': 'tile', 'aria-label': 'نمایش بزرگ: ' + p.alt, 'data-index': it.index }, [img]);
      li = el('li', { 'data-cat': p.cat }, [btn]);
    } else {
      var v = it.data;
      var video = el('video', {
        controls: '', preload: 'none', playsinline: '', poster: v.poster ? VID + 'posters/' + v.poster : null,
        width: v.w, height: v.h, 'aria-label': v.label
      }, [el('source', { src: VID + v.file, type: 'video/mp4' })]);
      video.style.aspectRatio = v.w + ' / ' + v.h;
      var box = el('div', { 'class': 'video-box', style: 'position:relative' }, [video, el('span', { 'class': 'badge', 'aria-hidden': 'true' }, ['ویدیو'])]);
      li = el('li', { 'data-cat': v.cat + ' video' }, [box, el('span', { 'class': 'video-cap' }, [v.label])]);
    }
    grid.appendChild(li);
  });

  // Only one video plays at a time.
  grid.addEventListener('play', function (e) {
    grid.querySelectorAll('video').forEach(function (v) { if (v !== e.target) v.pause(); });
  }, true);

  // Filters
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  function applyFilter(f) {
    var shown = 0;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === f)); });
    Array.prototype.forEach.call(grid.children, function (li) {
      var cats = li.getAttribute('data-cat').split(' ');
      var on = f === 'all' || cats.indexOf(f) !== -1;
      li.hidden = !on;
      if (!on) { var v = li.querySelector('video'); if (v) v.pause(); }
      if (on) shown++;
    });
    status.textContent = shown + ' مورد نمایش داده شد';
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { applyFilter(c.dataset.filter); }); });
  document.querySelectorAll('[data-filter-link]').forEach(function (a) {
    a.addEventListener('click', function () { applyFilter(a.getAttribute('data-filter-link')); });
  });

  // Lightbox (photos only)
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('figcaption');
  var current = 0;
  var lastFocus = null;

  function visiblePhotoIndexes() {
    return Array.prototype.filter.call(grid.querySelectorAll('.tile'), function (b) { return !b.closest('li').hidden; })
      .map(function (b) { return +b.dataset.index; });
  }
  function show(i) {
    var p = photos[i];
    current = i;
    lbImg.src = IMG + (p.file || p.name + '-1600.jpg');
    lbImg.width = p.lw; lbImg.height = p.lh;
    lbImg.alt = p.alt;
    lbCap.textContent = p.alt;
  }
  function step(d) {
    var list = visiblePhotoIndexes();
    var pos = list.indexOf(current);
    show(list[(pos + d + list.length) % list.length]);
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    if (lb.open) { if (typeof lb.close === 'function') lb.close(); else lb.removeAttribute('open'); }
  }
  lb.addEventListener('close', function () {
    document.body.style.overflow = '';
    lbImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  });
  grid.addEventListener('click', function (e) {
    var t = e.target.closest('.tile');
    if (t) open(+t.dataset.index);
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  // RTL: "next" sits on the left
  lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
  lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
  // Click outside the image closes
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb-inner') || e.target.tagName === 'FIGURE') close();
  });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft') step(1);
    else if (e.key === 'ArrowRight') step(-1);
  });

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-list');
  function setMenu(openIt) {
    toggle.setAttribute('aria-expanded', String(openIt));
    toggle.querySelector('.sr').textContent = openIt ? 'بستن منو' : 'باز کردن منو';
    list.classList.toggle('open', openIt);
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  list.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (toggle.getAttribute('aria-expanded') === 'true' && !e.target.closest('.nav')) setMenu(false);
  });
  window.matchMedia('(min-width: 921px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  // The host injects a fixed "Powered by Netlify" badge at the bottom edge; lift the
  // mobile call bar above it so both stay tappable.
  function liftCallbar() {
    var badge = document.getElementById('nl-badge-frame');
    var h = 0;
    if (badge) {
      if (!badge.dataset.watched && 'ResizeObserver' in window) {
        badge.dataset.watched = '1';
        new ResizeObserver(liftCallbar).observe(badge);
      }
      // The badge pill is ~64px tall; its frame can report a larger box on iOS,
      // so lift by the pill height only and don't depend on innerHeight.
      var r = badge.getBoundingClientRect();
      h = r.height ? Math.min(Math.ceil(r.height), 72) : 64;
    }
    document.documentElement.style.setProperty('--badge-h', h + 'px');
  }
  new MutationObserver(liftCallbar).observe(document.body, { childList: true });
  window.addEventListener('resize', liftCallbar);
  setTimeout(liftCallbar, 1500);
  liftCallbar();

  // Highlight current section in the menu
  var links = Array.prototype.slice.call(list.querySelectorAll('a'));
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id); if (a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'true'); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['home', 'products', 'gallery', 'about', 'contact'].forEach(function (id) { secObs.observe(document.getElementById(id)); });

    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); revObs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (n) { revObs.observe(n); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });
  }
})();
