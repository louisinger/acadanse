const PHONE = '+33663838262';
const PHONE_LABEL = '06 63 83 82 62';
const EMAIL = 'acadanse.guenange@gmail.com';
const INSTAGRAM = 'https://www.instagram.com/explore/tags/acadanse57/';
const FACEBOOK = 'https://www.facebook.com/search/top?q=Aca%20Danse%20Gu%C3%A9nange';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Centre+Social+Louise+Michel+1+rue+Mozart+57310+Gu%C3%A9nange';

const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" ${extra}>${d}</svg>`;
const ICON = {
  pin: svg('<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/>'),
  phone: svg('<circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M9.2 6.6c.3-.1.7 0 .9.3l1.1 2c.2.3.1.7-.1 1l-.8.8c.5 1.2 1.6 2.4 2.9 2.9l.8-.8c.3-.3.7-.3 1-.1l2 1.1c.3.2.4.6.3.9-.4 1.3-1.6 2-2.8 1.8-3.6-.6-6.5-3.5-7.1-7.1-.2-1.2.5-2.4 1.8-2.8Z" fill="var(--icon-bg, #000)"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2"/>'),
  insta: svg('<rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor"/><circle cx="12" cy="12" r="4" fill="none" stroke="var(--icon-bg, #000)" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.2" fill="var(--icon-bg, #000)"/>'),
  fb: svg('<circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M13.3 23v-8.3h2.6l.4-3.1h-3v-2c0-.9.3-1.5 1.6-1.5h1.6V5.3a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.3H7.5v3.1h2.6V23" fill="var(--icon-bg, #000)"/>'),
};

const NAV = [
  ['Tarifs', 'tarifs.html'], ['Planning', 'planning.html'], ['Danses', 'danses.html'],
  ['Activités', 'activites.html'], ['Galas', 'galas.html'], ['Festivals', 'galas.html#festivals'], ['Accueil', 'index.html'],
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const img = name => `assets/img/${name}.webp`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const here = location.pathname.split('/').pop() || 'index.html';

function chrome() {
  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip" href="#main">Aller au contenu</a>
    <header class="site-header">
      <div class="bar">
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span></button>
        <a class="brand" href="index.html" aria-label="Aca Danse, accueil"><span>Aca</span><img src="assets/img/logo.webp" alt="" width="44" height="44"><span>Danse</span></a>
        <div class="quick">
          <a href="index.html#contact" aria-label="Où sommes-nous ?">${ICON.pin}</a>
          <a href="tel:${PHONE}" aria-label="Appeler le ${PHONE_LABEL}">${ICON.phone}</a>
        </div>
        <nav class="menu" id="menu" aria-label="Navigation principale">
          ${NAV.map(([t, h]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
        </nav>
      </div>
    </header>`);
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="site-footer">
      <a class="f-brand" href="index.html"><img src="assets/img/logo.webp" alt="" width="64" height="64" loading="lazy"><span>Aca’ Danse</span></a>
      <a href="mailto:${EMAIL}">${ICON.mail}${EMAIL}</a>
      <a href="${INSTAGRAM}" target="_blank" rel="noopener">${ICON.insta}#acadanse57</a>
      <a href="${FACEBOOK}" target="_blank" rel="noopener">${ICON.fb}Aca Danse</a>
    </footer>`);

  const btn = document.querySelector('.menu-btn');
  const bar = document.querySelector('.bar');
  const toggle = open => {
    bar.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  btn.addEventListener('click', () => toggle(!bar.classList.contains('open')));
  document.addEventListener('click', e => { if (!bar.contains(e.target)) toggle(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { toggle(false); } });
  document.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => toggle(false)));

  // Header shrinks once the page is scrolled.
  const onScroll = () => document.body.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function reveal(root = document) {
  const els = root.querySelectorAll('.reveal:not(.in)');
  if (reduced || !('IntersectionObserver' in window)) return els.forEach(el => el.classList.add('in'));
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  els.forEach(el => io.observe(el));
}

// Scroll-snap carousel: builds dots + prev/next for a .carousel containing a .track.
function carousel(root, { start = 0 } = {}) {
  const track = root.querySelector('.track');
  const items = [...track.children];
  const dots = root.querySelector('.dots');
  if (!dots || items.length < 2) return;
  dots.innerHTML = items.map((_, i) => `<button type="button" aria-label="Photo ${i + 1} sur ${items.length}"></button>`).join('');
  const go = i => {
    const it = items[(i + items.length) % items.length];
    track.scrollTo({ left: it.offsetLeft - (track.clientWidth - it.clientWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
  };
  [...dots.children].forEach((d, i) => d.addEventListener('click', () => go(i)));
  root.querySelectorAll('[data-dir]').forEach(b => b.addEventListener('click', () => go(active + +b.dataset.dir)));
  let active = -1;
  const update = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    items.forEach((it, i) => {
      if (Math.abs(it.offsetLeft + it.clientWidth / 2 - mid) < Math.abs(items[best].offsetLeft + items[best].clientWidth / 2 - mid)) best = i;
    });
    if (best === active) return;
    active = best;
    items.forEach((it, i) => it.classList.toggle('is-active', i === best));
    [...dots.children].forEach((d, i) => d.toggleAttribute('aria-current', i === best));
  };
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', update);
  // Hide controls when everything already fits.
  const fits = () => root.classList.toggle('fits', track.scrollWidth <= track.clientWidth + 2);
  new ResizeObserver(fits).observe(track);
  if (start) {
    const it = items[start];
    track.scrollLeft = it.offsetLeft - (track.clientWidth - it.clientWidth) / 2;
  }
  update();
}

const profCard = name => PROFS[name]
  ? `<figure class="prof"><img src="${img(PROFS[name])}" alt="${esc(name)}" loading="lazy"><figcaption>${esc(name)}</figcaption></figure>`
  : `<figure class="prof prof-empty"><div><img src="assets/img/logo.webp" alt="" loading="lazy"></div><figcaption>${esc(name)}</figcaption></figure>`;

const sessionCard = ([title, day, time, prof], showTitle = true) => `
  <div class="session reveal">
    ${showTitle ? `<strong>${esc(title)}</strong>` : ''}
    <span>${esc(day)} · ${esc(time)}${prof ? ` · avec ${esc(prof)}` : ''}</span>
  </div>`;

const PAGES = {
  home() {
    // Intro "Let's Dance !" once per visit.
    let seen = false;
    try { seen = sessionStorage.getItem('intro'); sessionStorage.setItem('intro', 1); } catch {}
    if (!seen && !reduced && !location.hash) {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="intro" aria-hidden="true">
          <div class="intro-wedge"></div>
          <div class="intro-logo"><span>Aca</span><img src="assets/img/logo.webp" alt=""><span>Danse</span></div>
          <p class="intro-text">Let’s Dance !</p>
        </div>`);
      const intro = document.querySelector('.intro');
      const close = () => { intro.classList.add('out'); setTimeout(() => intro.remove(), 800); };
      intro.addEventListener('click', close);
      setTimeout(close, 2200);
    }

    // Side dots follow the section in view.
    const sections = [...document.querySelectorAll('main > section')];
    const dots = document.querySelector('.side-dots');
    dots.innerHTML = sections.map(s => `<a href="#${s.id}" aria-label="${esc(s.dataset.label)}"></a>`).join('');
    const links = [...dots.children];
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = sections.indexOf(e.target);
      links.forEach((l, j) => l.toggleAttribute('aria-current', i === j));
      dots.classList.toggle('on-light', e.target.classList.contains('light'));
    }), { threshold: 0.5 });
    sections.forEach(s => io.observe(s));

    carousel(document.querySelector('.about-gallery'));
  },

  list() {
    const kind = document.body.dataset.kind;
    document.getElementById('list').innerHTML = COURSES.filter(c => c.kind === kind).map((c, i) => `
      <a class="pill-card reveal" style="--d:${i % 4}" href="cours.html?c=${c.slug}">
        <img src="${img(c.img || 'card-' + c.slug)}" alt="" style="object-position: 50% ${c.pos ?? 50}%" loading="${i < 3 ? 'eager' : 'lazy'}">
        <span>${esc(c.name)}</span>
      </a>`).join('');
  },

  cours() {
    const slug = new URLSearchParams(location.search).get('c');
    const c = COURSES.find(x => x.slug === slug);
    const main = document.getElementById('main');
    if (!c) {
      main.innerHTML = `<div class="wrap empty"><h1>Cours introuvable</h1><p><a class="btn btn-dark" href="danses.html">Voir les danses</a> <a class="btn btn-dark" href="activites.html">Voir les activités</a></p></div>`;
      return;
    }
    document.title = `${c.name} — Aca Danse`;
    const same = COURSES.filter(x => x.kind === c.kind);
    const i = same.indexOf(c);
    const prev = same[(i - 1 + same.length) % same.length];
    const next = same[(i + 1) % same.length];
    const back = c.kind === 'danse' ? ['danses.html', 'Toutes les danses'] : ['activites.html', 'Toutes les activités'];
    const profs = [...new Set(c.sessions.map(s => s[3]).filter(Boolean))].sort((a, b) => !PROFS[a] - !PROFS[b]);
    main.innerHTML = `
      <div class="wrap">
        <a class="back" href="${back[0]}">← ${back[1]}</a>
        <article class="fiche">
          <div class="fiche-text reveal">
            <h1>${esc(c.name)}</h1>
            ${c.desc.map(p => `<p>${esc(p)}</p>`).join('')}
          </div>
          <div class="fiche-profs carousel reveal">
            <div class="track">${profs.map(profCard).join('')}</div>
            <div class="dots"></div>
          </div>
        </article>
        <section class="horaires" aria-labelledby="h-horaires">
          <h2 id="h-horaires">Horaires</h2>
          <div class="sessions">${c.sessions.map(s => sessionCard(s)).join('')}</div>
          <p class="ctas reveal">
            <a class="btn btn-dark" href="tarifs.html#${c.kind === 'danse' ? 'enfants' : 'bien-etre'}">Voir les tarifs</a>
            <a class="btn btn-dark" href="tel:${PHONE}">Réserver un cours d’essai</a>
          </p>
        </section>
        ${c.gallery ? `
        <section class="carousel photo-gallery reveal" aria-label="Photos">
          <div class="track">${c.gallery.map(g => `<img src="${img(g)}" alt="" loading="lazy">`).join('')}</div>
          <div class="dots"></div>
        </section>` : ''}
        <nav class="fiche-nav" aria-label="Autres cours">
          <a href="cours.html?c=${prev.slug}">← ${esc(prev.name)}</a>
          <a href="cours.html?c=${next.slug}">${esc(next.name)} →</a>
        </nav>
      </div>`;
    main.querySelectorAll('.carousel').forEach(el => carousel(el));
  },

  planning() {
    const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const mins = t => { const [h, m] = t.split('–')[0].trim().split('h'); return +h * 60 + +m; };
    const chips = document.querySelector('.chips');
    const out = document.getElementById('sessions');
    chips.innerHTML = `<a href="#tous" data-slug="tous">Tous les cours</a>` +
      COURSES.map(c => `<a href="#${c.slug}" data-slug="${c.slug}">${esc(c.short)}</a>`).join('');
    const show = () => {
      const slug = location.hash.slice(1) || 'tous';
      const c = COURSES.find(x => x.slug === slug);
      chips.querySelectorAll('a').forEach(a => a.toggleAttribute('aria-current', a.dataset.slug === (c ? slug : 'tous')));
      if (c) {
        out.innerHTML = `<div class="sessions">${c.sessions.map(s => sessionCard(s)).join('')}</div>
          <p class="ctas"><a class="btn btn-dark" href="cours.html?c=${c.slug}">Découvrir le cours ${esc(c.short)}</a></p>`;
      } else {
        const all = COURSES.flatMap(c => c.sessions.map(s => [s, c]));
        out.innerHTML = DAYS.map(day => {
          const list = all.filter(([s]) => s[1] === day).sort((a, b) => mins(a[0][2]) - mins(b[0][2]));
          return list.length ? `<section class="day"><h2>${day}</h2><div class="sessions">${list.map(([s, c]) =>
            `<a class="session reveal" href="#${c.slug}"><strong>${esc(s[0])}</strong><span>${esc(s[2])}${s[3] ? ` · avec ${esc(s[3])}` : ''}</span></a>`).join('')}</div></section>` : '';
        }).join('');
      }
      reveal(out);
    };
    addEventListener('hashchange', () => { show(); chips.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center' }); });
    show();
  },

  tarifs() {
    const root = document.querySelector('.tarifs');
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const select = (id, focus) => {
      if (!tabs.some(t => t.dataset.tab === id)) id = tabs[0].dataset.tab;
      root.dataset.tab = id;
      tabs.forEach(t => {
        const on = t.dataset.tab === id;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
        document.getElementById('p-' + t.dataset.tab).hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { select(t.dataset.tab); history.replaceState(null, '', '#' + t.dataset.tab); });
      t.addEventListener('keydown', e => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (d) select(tabs[(i + d + tabs.length) % tabs.length].dataset.tab, true);
      });
    });
    select(location.hash.slice(1));
  },

  galas() {
    carousel(document.querySelector('.coverflow'), { start: 1 });
  },
};

chrome();
PAGES[document.body.dataset.page]?.();
reveal();
