// Habitus – landing page
(function () {
  // --- mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  // --- hand-drawn circle (ten sam algorytm co w logo marki)
  function rng(seed) { var s = seed; return function () { return (s = (s * 16807) % 2147483647) / 2147483647; }; }
  function wobbly(cx, cy, r, seed) {
    var R = rng(seed), p1 = R() * 6.28, p2 = R() * 6.28, n = 36, d = '';
    for (var i = 0; i <= n; i++) {
      var a = (i / n) * Math.PI * 2;
      var rr = r * (1 + 0.035 * Math.sin(2 * a + p1) + 0.02 * Math.sin(5 * a + p2));
      d += (i ? ' L' : 'M') + (cx + rr * Math.cos(a)).toFixed(2) + ' ' + (cy + rr * Math.sin(a)).toFixed(2);
    }
    return d + 'Z';
  }

  // --- interaktywny tracker 30 dni
  var box = document.getElementById('heroTracker');
  var counter = document.getElementById('doneCount');
  var DONE = 12, TODAY = 13, TOTAL = 30;
  var card = box.closest('.page-card');

  // nakładka „Zaliczone!” – duży odręczny ptaszek po odhaczeniu wszystkich dni
  var badge = document.createElement('div');
  badge.className = 'complete';
  badge.setAttribute('aria-hidden', 'true');
  badge.innerHTML =
    '<svg viewBox="0 0 200 200">' +
      '<path class="c-ring" d="' + wobbly(100, 100, 78, 2027) + '"/>' +
      '<path class="c-check" d="M58 104 C70 114 80 126 88 138 C104 108 124 82 148 60"/>' +
    '</svg>' +
    '<p class="c-label">Zaliczone!</p>' +
    '<p class="c-sub">30 dni, 30 razy ✓</p>';
  card.appendChild(badge);
  var live = document.createElement('p');
  live.className = 'sr-only'; live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
  card.appendChild(live);

  function update() {
    var n = box.querySelectorAll('.day.done').length;
    counter.textContent = n;
    var complete = n === TOTAL;
    if (complete !== card.classList.contains('is-complete')) {
      card.classList.toggle('is-complete', complete);
      live.textContent = complete ? 'Zaliczone! Wszystkie 30 dni odhaczone.' : '';
    }
  }
  for (var d = 1; d <= 30; d++) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'day' + (d <= DONE ? ' done' : '') + (d === TODAY ? ' today' : '');
    b.setAttribute('aria-pressed', d <= DONE ? 'true' : 'false');
    b.setAttribute('aria-label', 'Dzień ' + d + (d === TODAY ? ' (dziś)' : ''));
    b.innerHTML = '<svg viewBox="0 0 44 44"><path class="fill" d="' + wobbly(22, 22, 14.5, d * 31 + 101) + '"/>' +
      '<path class="ring" d="' + wobbly(22, 22, 18, d * 17 + 7) + '"/><text class="n" x="22" y="22.5">' + d + '</text></svg>';
    b.addEventListener('click', function () {
      if (this.classList.contains('today')) {
        this.classList.remove('today'); this.classList.add('done');
      } else {
        this.classList.toggle('done');
      }
      this.setAttribute('aria-pressed', this.classList.contains('done'));
      update();
    });
    box.appendChild(b);
  }
  update();

  // --- film z prezenterem: własny przycisk odtwarzania
  var pv = document.getElementById('presentVideo');
  if (pv) {
    var frame = pv.closest('.present-frame');
    frame.querySelector('.play').addEventListener('click', function () {
      frame.classList.add('playing'); pv.controls = true; pv.play();
    });
  }

  // --- delikatne pojawianie się sekcji
  var els = document.querySelectorAll('.section .wrap > *, .line, .value, .steps li');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
