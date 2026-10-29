/* Buy/sell tabs, request form, product-card filter, recycling steps.
   Everything runs in the browser: the form only prepares text; nothing is stored or sent. */
(function () {
  'use strict';

  var CONTACTS = {
    ahmad: { name: 'کربلایی احمد علیزاده', wa: '93772530980', waShow: '0772 530 980', tel: '0789995645', telShow: '0789 995 645' },
    esmail: { name: 'کربلایی اسماعیل علیزاده', wa: '93771601413', waShow: '0771 601 413', tel: '0771601413', telShow: '0771 601 413' }
  };

  var TYPES = {
    sell: {
      label: 'فروش جنس',
      hint: 'نوع و وضعیت جنس، مقدار تقریبی و محل بار را بنویسید تا هنگام تماس، نرخ و زمان بارگیری بررسی شود.',
      spec: 'وضعیت جنس', specPh: 'مثلاً تفکیک‌شده، مخلوط یا زنگ‌زده',
      place: 'محل بار', placePh: 'مثلاً کابل، کارتهٔ سه، نزدیک…',
      itemRequired: true, close: 'لطفاً دربارهٔ نرخ و زمان بارگیری با من هماهنگ کنید.'
    },
    buy: {
      label: 'خرید جنس',
      hint: 'نوع جنس، مشخصات یا اندازه، مقدار مورد نیاز و محل تحویل را بنویسید تا هنگام تماس، موجودی و نرخ بررسی شود.',
      spec: 'مشخصات یا اندازه', specPh: 'مثلاً ضخامت، طول یا نوع قطعه',
      place: 'محل تحویل', placePh: 'جایی که جنس باید برسد',
      itemRequired: true, close: 'لطفاً دربارهٔ موجودی و نرخ معلومات بدهید.'
    },
    loading: {
      label: 'هماهنگی بارگیری و ارسال به فابریکهٔ ذوب',
      hint: 'نوع و مقدار بار و محل آن را بنویسید تا هماهنگی بارگیری و ارسال به فابریکه بررسی شود. ذوب در فابریکه انجام می‌شود، نه در مجموعه.',
      spec: 'وضعیت بار', specPh: 'مثلاً تفکیک‌شده یا آمادهٔ بارگیری',
      place: 'محل بار', placePh: 'جایی که بار باید برداشته شود',
      itemRequired: true, close: 'لطفاً دربارهٔ زمان بارگیری و ارسال با من هماهنگ کنید.'
    },
    product: {
      label: 'معلومات دربارهٔ محصول',
      hint: 'محصول مورد نظر و مشخصات یا اندازهٔ لازم را بنویسید. نرخ و امکان تهیه هنگام تماس بررسی می‌شود.',
      spec: 'مشخصات یا اندازه', specPh: 'مثلاً نمرهٔ سیخ، اندازهٔ گادر یا ضخامت ورق',
      place: 'محل تحویل', placePh: 'در صورت نیاز',
      itemRequired: true, close: 'لطفاً دربارهٔ این محصول معلومات بدهید.'
    },
    general: {
      label: 'پرسش عمومی',
      hint: 'پرسش خود را در «توضیحات بیشتر» بنویسید. انتخاب جنس برای پرسش عمومی اختیاری است.',
      spec: 'وضعیت یا مشخصات جنس', specPh: '',
      place: 'محل', placePh: '',
      itemRequired: false, close: 'لطفاً جواب بدهید.'
    }
  };

  var $ = function (id) { return document.getElementById(id); };
  var form = $('req-form');
  if (!form) return;

  var f = {
    type: $('rq-type'), item: $('rq-item'), spec: $('rq-spec'), qty: $('rq-qty'), unit: $('rq-unit'),
    place: $('rq-place'), name: $('rq-name'), notes: $('rq-notes')
  };
  var hint = $('rq-hint');
  var result = $('req-result');
  var summary = $('rq-summary');
  var waBtn = $('rq-wa');
  var callBtn = $('rq-call');
  var copyStatus = $('rq-copy-status');

  function optText(sel) { var o = sel.options[sel.selectedIndex]; return o && o.value ? o.textContent : ''; }

  /* ---------- request form ---------- */
  function setLabel(labelEl, text) {
    labelEl.firstChild.nodeValue = text + ' ';
  }
  function applyType() {
    var t = TYPES[f.type.value];
    if (!t) {
      hint.textContent = 'نوع درخواست را انتخاب کنید تا راهنمای همان درخواست نمایش داده شود.';
      setLabel($('rq-spec-label'), 'وضعیت یا مشخصات جنس');
      setLabel($('rq-place-label'), 'محل جنس یا محل تحویل');
      f.spec.placeholder = ''; f.place.placeholder = '';
      return;
    }
    hint.textContent = t.hint;
    setLabel($('rq-spec-label'), t.spec);
    setLabel($('rq-place-label'), t.place);
    f.spec.placeholder = t.specPh;
    f.place.placeholder = t.placePh;
    $('rq-item-mark').textContent = t.itemRequired ? '(ضروری)' : '(اختیاری)';
    $('rq-notes-mark').textContent = f.type.value === 'general' ? '(ضروری)' : '(اختیاری)';
    clearErr(f.type);
    if (!t.itemRequired) clearErr(f.item);
  }
  f.type.addEventListener('change', applyType);

  function showErr(input, on) {
    var err = $(input.id + '-err');
    if (!err) return;
    err.hidden = !on;
    if (on) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
  function clearErr(input) { showErr(input, false); }
  [f.item, f.qty, f.notes].forEach(function (i) { i.addEventListener('input', function () { clearErr(i); }); });
  f.item.addEventListener('change', function () { clearErr(f.item); });

  // Accepts Persian/Arabic digits and the Persian decimal separator.
  function parseQty(s) {
    s = (s || '').trim()
      .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 1776); })
      .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); })
      .replace(/[٫،,]/g, '.');
    if (!s) return { empty: true };
    if (!/^\d+(\.\d+)?$/.test(s)) return { bad: true };
    var n = parseFloat(s);
    return n > 0 ? { value: s } : { bad: true };
  }

  function validate() {
    var firstBad = null;
    var t = TYPES[f.type.value];
    var badType = !t;
    showErr(f.type, badType); if (badType) firstBad = firstBad || f.type;
    var badItem = t && t.itemRequired && !f.item.value;
    showErr(f.item, !!badItem); if (badItem) firstBad = firstBad || f.item;
    var q = parseQty(f.qty.value);
    showErr(f.qty, !!q.bad); if (q.bad) firstBad = firstBad || f.qty;
    var badNotes = f.type.value === 'general' && !f.notes.value.trim();
    showErr(f.notes, badNotes); if (badNotes) firstBad = firstBad || f.notes;
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function buildText() {
    var t = TYPES[f.type.value];
    var lines = ['سلام علیکم،', 'این درخواست را از وب‌سایت آهن‌فروشی و ضایعات غرب کابل آماده کرده‌ام:', ''];
    lines.push('• نوع درخواست: ' + t.label);
    if (f.item.value) lines.push('• نوع جنس یا محصول: ' + optText(f.item));
    if (f.spec.value.trim()) lines.push('• ' + t.spec + ': ' + f.spec.value.trim());
    var q = parseQty(f.qty.value);
    if (q.value) lines.push('• مقدار تقریبی: ' + q.value + ' ' + f.unit.value);
    if (f.place.value.trim()) lines.push('• ' + t.place + ': ' + f.place.value.trim());
    if (f.name.value.trim()) lines.push('• نام: ' + f.name.value.trim());
    if (f.notes.value.trim()) lines.push('• توضیحات: ' + f.notes.value.trim());
    lines.push('', t.close);
    return lines.join('\n');
  }

  function who() { var r = form.ownerDocument.querySelector('input[name="who"]:checked'); return CONTACTS[r ? r.value : 'ahmad']; }
  function updateLinks() {
    var c = who();
    waBtn.href = 'https://wa.me/' + c.wa + '?text=' + encodeURIComponent(summary.value);
    $('rq-wa-label').textContent = 'بازکردن در واتساپ (' + c.waShow + ')';
    waBtn.setAttribute('aria-label', 'بازکردن متن در واتساپ ' + c.name + '، ' + c.waShow);
    callBtn.href = 'tel:' + c.tel;
    $('rq-call-label').textContent = 'تماس مستقیم (' + c.telShow + ')';
    callBtn.setAttribute('aria-label', 'تماس مستقیم با ' + c.name + '، ' + c.telShow);
  }
  summary.addEventListener('input', updateLinks);
  document.querySelectorAll('input[name="who"]').forEach(function (r) { r.addEventListener('change', updateLinks); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    summary.value = buildText();
    copyStatus.textContent = '';
    result.hidden = false;
    updateLinks();
    var title = $('req-result-title');
    title.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    title.focus({ preventScroll: true });
  });

  $('rq-edit').addEventListener('click', function () {
    form.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    f.type.focus({ preventScroll: true });
  });

  $('rq-copy').addEventListener('click', function () {
    var text = summary.value;
    function fallback() {
      summary.focus(); summary.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      copyStatus.textContent = ok ? 'متن کاپی شد.' : 'متن انتخاب شد؛ آن را با گزینهٔ کاپی دستگاه خود کاپی کنید.';
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { copyStatus.textContent = 'متن کاپی شد.'; }, fallback);
    } else fallback();
  });

  function reduceMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  // Open the form preset; values the visitor already typed stay as they are.
  function openRequest(opts) {
    if (opts.type) { f.type.value = opts.type; applyType(); }
    if (opts.item) { f.item.value = opts.item; clearErr(f.item); }
    var sec = $('request');
    sec.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    var target = opts.type && !opts.item ? f.item : (opts.item ? f.spec : f.type);
    setTimeout(function () { target.focus({ preventScroll: true }); }, reduceMotion() ? 0 : 450);
  }

  document.querySelectorAll('[data-open-request]').forEach(function (b) {
    b.addEventListener('click', function () { openRequest({ type: b.getAttribute('data-open-request') }); });
  });
  // Product card: choose the item; keep the request type if one is set, otherwise default to selling.
  document.querySelectorAll('[data-request-item]').forEach(function (b) {
    b.addEventListener('click', function () {
      openRequest({ item: b.getAttribute('data-request-item'), type: f.type.value ? null : 'sell' });
    });
  });
  document.querySelectorAll('[data-request-product]').forEach(function (b) {
    b.addEventListener('click', function () { openRequest({ type: 'product', item: b.getAttribute('data-request-product') }); });
  });

  /* ---------- tabs (buy / sell) and steps: shared keyboard handling ---------- */
  function keyNav(tabs, activate) {
    tabs.forEach(function (tab, i) {
      tab.addEventListener('keydown', function (e) {
        var n = tabs.length, j = null;
        // RTL: left arrow moves forward
        if (e.key === 'ArrowLeft') j = (i + 1) % n;
        else if (e.key === 'ArrowRight') j = (i - 1 + n) % n;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = n - 1;
        if (j === null) return;
        e.preventDefault();
        activate(j);
        tabs[j].focus();
      });
    });
  }

  var tradeTabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  function selectTrade(i) {
    tradeTabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tradeTabs.forEach(function (t, i) { t.addEventListener('click', function () { selectTrade(i); }); });
  keyNav(tradeTabs, selectTrade);

  /* ---------- product-card filter (independent from the gallery filter) ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('.cards > .card'));
  var cardChips = Array.prototype.slice.call(document.querySelectorAll('[data-card-filter]'));
  var count = $('card-count');
  function filterCards(g) {
    var shown = 0;
    cardChips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-card-filter') === g)); });
    cards.forEach(function (c) {
      var on = g === 'all' || c.getAttribute('data-group') === g;
      c.hidden = !on;
      if (on) shown++;
    });
    count.textContent = shown.toLocaleString('fa-AF') + ' جنس نمایش داده شد';
  }
  cardChips.forEach(function (c) { c.addEventListener('click', function () { filterCards(c.getAttribute('data-card-filter')); }); });
  filterCards('all');

  /* ---------- recycling journey ---------- */
  var ICONS = [
    '<svg viewBox="0 0 48 48"><path d="M8 34h32M12 34V22l8-6 8 6 8-6v18" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><circle cx="16" cy="40" r="3"/><circle cx="32" cy="40" r="3"/></svg>',
    '<svg viewBox="0 0 48 48"><path d="M4 14h24v20H4zM28 20h8l6 7v7H28z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><circle cx="12" cy="37" r="4"/><circle cx="35" cy="37" r="4"/></svg>',
    '<svg viewBox="0 0 48 48"><path d="M24 4c3 7 10 11 10 20a10 10 0 0 1-20 0c0-5 3-8 5-11 1 4 3 6 5 6-2-5 0-10 0-15z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M8 44h32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 48 48"><path d="M6 10h36v6H27v16h15v6H6v-6h15V16H6z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>'
  ];
  var STEPS = [
    { where: 'در محوطهٔ مجموعه', title: 'تفکیک و آماده‌سازی آهن',
      desc: 'آهن‌آلات کهنه از سایر اجناس جدا می‌شود و برای بارگیری آماده می‌شود. هرچه جنس بهتر تفکیک شده باشد، بارگیری و ارسال آسان‌تر است.',
      img: 'assets/img/iron-scrap-pile-800.jpg', w: 416, h: 900,
      alt: 'انبوه آهن‌آلات کهنه در محوطهٔ مجموعه', cap: 'عکس واقعی از محوطهٔ مجموعه' },
    { where: 'از مجموعه به فابریکه', title: 'بارگیری و ارسال',
      desc: 'آهن آماده‌شده بار موتر می‌شود و از مجموعه به فابریکهٔ ذوب فرستاده می‌شود.',
      img: 'assets/img/truck-loading-800.jpg', w: 416, h: 900,
      alt: 'بارگیری قطعات فلزی کهنه روی موتر باربری آبی در محوطهٔ مجموعه', cap: 'عکس واقعی: بارگیری در محوطهٔ مجموعه', gallery: true },
    { where: 'در فابریکهٔ ذوب', title: 'ذوب در فابریکه',
      desc: 'ذوب آهن در فابریکهٔ ذوب انجام می‌شود، نه در محوطهٔ مجموعه. فابریکه جدا از مجموعه است و آهن را برای تولید دوباره ذوب می‌کند.' },
    { where: 'در فابریکه و بازار ساخت‌وساز', title: 'تولید دوباره و استفاده در ساخت‌وساز',
      desc: 'در فابریکه از آهن ذوب‌شده محصولاتی مثل سیخ گول، گادر و ورق ساخته می‌شود که دوباره در ساخت‌وساز به کار می‌روند.' }
  ];
  var stepTabs = Array.prototype.slice.call(document.querySelectorAll('.steps [role="tab"]'));
  var cur = 0;
  function selectStep(i) {
    cur = i;
    var s = STEPS[i];
    stepTabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      t.classList.toggle('done', k < i);
    });
    $('step-panel').setAttribute('aria-labelledby', stepTabs[i].id);
    $('step-icon').innerHTML = ICONS[i];
    $('step-where').textContent = 'مرحلهٔ ' + (i + 1).toLocaleString('fa-AF') + ' از ۴ – ' + s.where;
    $('step-title').textContent = s.title;
    $('step-desc').textContent = s.desc;
    var media = $('step-media');
    if (s.img) {
      var img = $('step-img');
      img.src = s.img; img.width = s.w; img.height = s.h; img.alt = s.alt;
      $('step-cap').textContent = s.cap;
      media.hidden = false;
    } else media.hidden = true;
    $('step-gallery').hidden = !s.gallery;
    var next = $('step-next');
    next.textContent = i < STEPS.length - 1 ? 'مرحلهٔ بعد: ' + STEPS[i + 1].title : 'شروع دوباره از مرحلهٔ ۱';
  }
  stepTabs.forEach(function (t, i) { t.addEventListener('click', function () { selectStep(i); }); });
  keyNav(stepTabs, selectStep);
  $('step-next').addEventListener('click', function () { selectStep((cur + 1) % STEPS.length); });
  selectStep(0);
})();
