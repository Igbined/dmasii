/* ═══════════════════════════════════════
DANIEL BALAȘ FAN SITE — main.js
═══════════════════════════════════════ */

/* ── Cursor glow ── */
const cglow = document.getElementById(‘cglow’);
document.addEventListener(‘mousemove’, e => {
cglow.style.left = e.clientX + ‘px’;
cglow.style.top  = e.clientY + ‘px’;
});

/* ── Navbar scroll state ── */
const nav = document.getElementById(‘nav’);
window.addEventListener(‘scroll’, () => {
nav.classList.toggle(‘scrolled’, scrollY > 70);
}, { passive: true });

/* ── Mobile menu ── */
const menuBtn  = document.getElementById(‘menu-btn’);
const menuIco  = document.getElementById(‘menu-ico’);
const mobileMenu = document.getElementById(‘mob-menu’);

menuBtn.addEventListener(‘click’, () => {
const isOpen = !mobileMenu.classList.contains(‘hidden’);
mobileMenu.classList.toggle(‘hidden’, isOpen);
menuIco.className = isOpen ? ‘fas fa-bars text-sm’ : ‘fas fa-xmark text-sm’;
});

document.querySelectorAll(’.mnl’).forEach(link => {
link.addEventListener(‘click’, () => {
mobileMenu.classList.add(‘hidden’);
menuIco.className = ‘fas fa-bars text-sm’;
});
});

/* ── Scroll reveal (IntersectionObserver) ── */
const revealObs = new IntersectionObserver(entries => {
entries.forEach(e => { if (e.isIntersecting) e.target.classList.add(‘vis’); });
}, { threshold: 0.1 });

document.querySelectorAll(’.rv, .rl, .rr’).forEach(el => revealObs.observe(el));

/* ── Donation progress bar ── */
const progBar = document.getElementById(‘pbar’);
if (progBar) {
const progObs = new IntersectionObserver(entries => {
if (entries[0].isIntersecting) {
setTimeout(() => { progBar.style.width = ‘64.8%’; }, 400);
progObs.disconnect();
}
}, { threshold: 0.6 });
progObs.observe(progBar);
}

/* ── Testimonial carousel ── */
const track  = document.getElementById(‘ttrack’);
const slides = […document.querySelectorAll(’.tslide’)];
const dotsEl = document.getElementById(‘tdots’);
let cur = 0, perView = 3, maxIdx = 0, autoTimer;

function getPerView() {
if (window.innerWidth < 768)  return 1;
if (window.innerWidth < 1024) return 2;
return 3;
}

function buildDots() {
if (!dotsEl) return;
dotsEl.innerHTML = ‘’;
for (let i = 0; i <= maxIdx; i++) {
const d = document.createElement(‘button’);
d.setAttribute(‘aria-label’, `Slide ${i + 1}`);
d.style.cssText = `width: ${i === cur ? '20px' : '8px'}; height: 8px; border-radius: 4px; background: ${i === cur ? '#d4a017' : 'rgba(255,255,255,.15)'}; border: none; cursor: pointer; transition: all .3s;`;
d.addEventListener(‘click’, () => goTo(i));
dotsEl.appendChild(d);
}
}

function updateDots() {
if (!dotsEl) return;
[…dotsEl.children].forEach((d, i) => {
d.style.width      = i === cur ? ‘20px’ : ‘8px’;
d.style.background = i === cur ? ‘#d4a017’ : ‘rgba(255,255,255,.15)’;
});
}

function goTo(idx) {
cur = Math.max(0, Math.min(idx, maxIdx));
track.style.transform = `translateX(-${(100 / perView) * cur}%)`;
updateDots();
clearInterval(autoTimer);
autoTimer = setInterval(() => goTo(cur < maxIdx ? cur + 1 : 0), 5000);
}

function initCarousel() {
perView = getPerView();
maxIdx  = Math.max(0, slides.length - perView);
slides.forEach(s => { s.style.width = `${100 / perView}%`; });
cur = Math.min(cur, maxIdx);
goTo(cur);
buildDots();
}

document.getElementById(‘tprev’)?.addEventListener(‘click’, () => goTo(cur - 1));
document.getElementById(‘tnext’)?.addEventListener(‘click’, () => goTo(cur + 1));
window.addEventListener(‘resize’, initCarousel, { passive: true });
initCarousel();

/* ── Booking form ── */
const bookForm = document.getElementById(‘bform’);
bookForm?.addEventListener(‘submit’, e => {
e.preventDefault();

const name    = document.getElementById(‘fn’);
const email   = document.getElementById(‘fe’);
const type    = document.getElementById(‘ft’);
const message = document.getElementById(‘fm’);

// Reset error states
bookForm.querySelectorAll(’.emsg’).forEach(m => m.classList.add(‘hidden’));
bookForm.querySelectorAll(’.ff’).forEach(f => f.style.borderColor = ‘’);

let valid = true;
const showErr = field => {
field.style.borderColor = ‘rgba(248,113,113,.5)’;
field.nextElementSibling?.classList?.remove(‘hidden’);
valid = false;
};

if (!name.value.trim())                                showErr(name);
if (!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email.value)) showErr(email);
if (!type.value)                                       showErr(type);
if (message.value.trim().length < 10)                 showErr(message);
if (!valid) return;

// Submitting state
const btn = document.getElementById(‘sbtn’);
const ico = document.getElementById(‘sico’);
const txt = document.getElementById(‘stxt’);
btn.disabled = true;
btn.style.opacity = ‘.65’;
ico.className = ‘fas fa-spinner fa-spin’;
txt.textContent = ‘Sending…’;

setTimeout(() => {
bookForm.querySelectorAll(‘input, select, textarea, button’).forEach(el => el.classList.add(‘hidden’));
document.getElementById(‘fsuccess’).classList.remove(‘hidden’);

```
// Pre-fill Smartsupp chat with the submitted request
openChat(
  `Hello! My name is ${name.value} (${email.value}). I'd like to book: ${type.value}. Details: ${message.value.substring(0, 100)}…`
);
```

}, 1500);
});

/* ══════════════════════════════════════
SMARTSUPP LIVE CHAT INTEGRATION
Replaces all payment / booking flows.
Every monetary action opens the chat
widget with a pre-filled context message
so the team can handle it personally.
══════════════════════════════════════ */
function openChat(prefilledMsg) {
if (typeof smartsupp === ‘function’) {
smartsupp(‘chat:open’);
if (prefilledMsg) {
smartsupp(‘chat:message’, prefilledMsg);
}
} else {
// Fallback: try clicking the widget button directly
const btn = document.querySelector(
‘#smartsupp-widget-container button, [data-smartsupp-widget], #chat-widget-container button’
);
if (btn) btn.click();
console.warn(‘Smartsupp not yet loaded. Message:’, prefilledMsg);
}
}
