document.addEventListener('DOMContentLoaded', function() {

/* ================= PAGE LOADER ================= */
const loader = document.getElementById('pageLoader');
function hideLoader() {
  if (!loader) return;
  loader.style.transition = 'opacity 0.6s';
  loader.style.opacity = '0';
  setTimeout(() => { loader.style.display = 'none'; }, 700);
}
window.addEventListener('load', () => setTimeout(hideLoader, 800));
setTimeout(hideLoader, 2500);

/* ================= PARTICLES ================= */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;animation-duration:${Math.random()*10+8}s;animation-delay:${Math.random()*8}s;opacity:0;`;
    container.appendChild(p);
  }
}
createParticles();

/* ================= THEME TOGGLE ================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀' : '🌙';
  try { localStorage.setItem('agtg-theme', theme); } catch(e){}
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}
try { setTheme(localStorage.getItem('agtg-theme') || 'dark'); } catch(e) { setTheme('dark'); }

/* ================= LIVE TICKER ================= */
const tickerItems = [
  '🔴 LIVE — FAZE vs AGTG — 11:9 — MAP 2 ONGOING',
  '📅 JUN 14 — NaVi vs AGTG — 20:00 CET',
  '🏆 AGTG wins Budapest Open 2026!',
  '✅ AGTG def. Vitality 13-8 on Mirage',
  '⭐ AMIX awarded MVP at Budapest Open',
  '🆕 New player announcement coming soon...',
];
const ticker = document.getElementById('tickerContent');
if (ticker) {
  ticker.innerHTML = [...tickerItems, ...tickerItems].map(t => `<span style="padding:0 40px">${t}</span>`).join('');
}

/* ================= PLAYER DATA ================= */
const players = {
  amix:   { name:'AMIX',   role:'In-Game Leader', badge:'IGL',   rating:'1.17', kd:'1.25', hs:'54%', adr:'82', bio:'One of the most cerebral IGLs in the Hungarian scene. Known for creative strats and clutch decision-making.', maps:['Mirage','Inferno','Nuke'],    img:'assets/players/amix.png',  emoji:'🎮' },
  dryvyx: { name:'DRYVYX', role:'AWPer',           badge:'AWP',   rating:'1.09', kd:'1.18', hs:'38%', adr:'78', bio:'Deadly AWPer with cold nerves and exceptional positioning. Precise long-range elimination.',               maps:['Mirage','Ancient','Anubis'], img:'assets/players/dryvyx.png',emoji:'🎯' },
  cickany:{ name:'CICKÁNY',role:'Entry Fragger',   badge:'ENTRY', rating:'1.10', kd:'1.15', hs:'63%', adr:'85', bio:'Fearless entry fragger who opens sites with aggression and precision. High headshot percentage.',           maps:['Inferno','Mirage','Nuke'],   img:'assets/players/belta.png', emoji:'💥' }
};

/* ================= PLAYER MODAL ================= */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');

function openModal(key) {
  const p = players[key];
  if (!p || !modalOverlay) return;
  document.getElementById('modalName').textContent  = p.name;
  document.getElementById('modalRole').textContent  = p.role;
  document.getElementById('modalBadge').textContent = p.badge;
  document.getElementById('mRating').textContent    = p.rating;
  document.getElementById('mKD').textContent        = p.kd;
  document.getElementById('mHS').textContent        = p.hs;
  document.getElementById('mADR').textContent       = p.adr;
  document.getElementById('modalBio').textContent   = p.bio;
  const av = document.getElementById('modalAvatar');
  av.innerHTML = `<img src="${p.img}" alt="${p.name}" onerror="this.parentElement.textContent='${p.emoji}'">`;
  document.getElementById('modalMaps').innerHTML = p.maps.map(m=>`<span class="map-tag">${m}</span>`).join('');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (modalOverlay) modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.player-card[data-player]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.player));
});
if (modalClose)   modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ================= HAMBURGER ================= */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { navLinks.classList.remove('active'); hamburger.classList.remove('active'); });
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active'); hamburger.classList.remove('active');
    }
  });
}

/* ================= NAVBAR SCROLL ================= */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ================= SCROLL REVEAL ================= */
function triggerBars(el) {
  el.querySelectorAll('.stat-bar,.player-stat-fill,.map-bar').forEach(bar => {
    if (bar._animated) return;
    bar._animated = true;
    if (bar.dataset.width) setTimeout(() => { bar.style.width = bar.dataset.width+'%'; }, 250);
  });
}
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isDec  = target % 1 !== 0;
  const start  = performance.now();
  function update(t) {
    const p = Math.min((t-start)/1800,1);
    const e = 1-Math.pow(1-p,3);
    el.textContent = isDec ? (e*target).toFixed(2) : Math.floor(e*target);
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = isDec ? target.toFixed(2) : target;
  }
  requestAnimationFrame(update);
}
function triggerCounters(el) {
  el.querySelectorAll('[data-target]').forEach(c => {
    if (c._animated) return;
    c._animated = true;
    animateCounter(c);
  });
}

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.remove('hidden-init');
    e.target.classList.add('visible');
    triggerBars(e.target);
    triggerCounters(e.target);
  });
}, { threshold: 0.05 });

const upObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.remove('hidden-init');
    e.target.classList.add('visible');
    triggerBars(e.target);
    triggerCounters(e.target);
  });
}, { threshold: 0.02 });

setTimeout(() => {
  document.querySelectorAll('.reveal-section').forEach(el => { el.classList.add('hidden-init'); revealObs.observe(el); });
  document.querySelectorAll('.reveal-up').forEach(el => { el.classList.add('hidden-init'); upObs.observe(el); });
}, 100);

// Hero counters
setTimeout(() => {
  document.querySelectorAll('.hero-stat-num').forEach(el => {
    if (!el._animated) { el._animated = true; animateCounter(el); }
  });
}, 1200);

/* ================= COUNTDOWN ================= */
function updateCountdown() {
  const diff = new Date('2026-06-14T19:00:00Z') - new Date();
  const pad  = n => String(Math.max(0,Math.floor(n))).padStart(2,'0');
  const get  = id => document.getElementById(id);
  if (get('cdDays'))  get('cdDays').textContent  = pad(diff/86400000);
  if (get('cdHours')) get('cdHours').textContent = pad((diff%86400000)/3600000);
  if (get('cdMins'))  get('cdMins').textContent  = pad((diff%3600000)/60000);
  if (get('cdSecs'))  get('cdSecs').textContent  = pad((diff%60000)/1000);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ================= CURSOR GLOW ================= */
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let mx=0,my=0,gx=0,gy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  document.addEventListener('mouseleave', () => glow.style.opacity='0');
  document.addEventListener('mouseenter', () => glow.style.opacity='1');
  (function loop() { gx+=(mx-gx)*0.08; gy+=(my-gy)*0.08; glow.style.left=gx+'px'; glow.style.top=gy+'px'; requestAnimationFrame(loop); })();
}

/* ================= ACTIVE NAV ================= */
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) navItems.forEach(a => a.classList.toggle('active-nav', a.getAttribute('href')==='#'+e.target.id));
  });
}, { threshold: 0.35 }).observe ? document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) navItems.forEach(a => a.classList.toggle('active-nav', a.getAttribute('href')==='#'+e.target.id));
    });
  }, { threshold: 0.35 }).observe(s);
}) : null;

/* ================= NEWSLETTER ================= */
const form = document.getElementById('newsletterForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const inp = document.getElementById('emailInput');
    if (!inp || !inp.value.includes('@')) {
      if (inp) { inp.style.borderColor='rgba(255,80,80,.6)'; setTimeout(()=>inp.style.borderColor='',1500); }
      return;
    }
    form.style.display = 'none';
    const s = document.getElementById('newsletterSuccess');
    if (s) s.style.display = 'block';
  });
}

/* ================= MAP BLUEPRINT SCROLL REVEAL ================= */
const mapLayer = document.getElementById('mapBlueprintLayer');
const floatLayer = document.querySelector('.floating-elements-layer');
const heroHeight = window.innerHeight;
function updateMapVisibility() {
  const show = window.scrollY > heroHeight * 0.6;
  if (mapLayer)   mapLayer.classList.toggle('map-visible', show);
  if (floatLayer) floatLayer.classList.toggle('map-visible', show);
}
window.addEventListener('scroll', updateMapVisibility, { passive: true });
updateMapVisibility();

/* ================= PARALLAX ================= */
if (window.innerWidth > 768) {
  const hexGrid = document.getElementById('hexGrid');
  const farEls  = document.querySelectorAll('.parallax-far');
  const midEls  = document.querySelectorAll('.parallax-mid');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    farEls.forEach(el => el.style.transform=`translateY(${y*.08}px)`);
    midEls.forEach(el => el.style.transform=`translateY(${y*.15}px)`);
    if (hexGrid) hexGrid.style.transform=`translateY(${y*.12}px)`;
  }, { passive:true });
}

/* ================= LIGHT RAYS ================= */
document.querySelectorAll('.light-ray').forEach(r => {
  r.style.animationDuration = (Math.random()*8+6)+'s';
  r.style.animationDelay   = -(Math.random()*10)+'s';
});

}); // END DOMContentLoaded
