/* =========================================================
   Nhận xét của đối tác / khách hàng.
   Section "Đối tác nói gì" tự hiện khi mảng này có dữ liệu.
   Chỉ thêm nhận xét THẬT, đã được người đó đồng ý công khai.
   Ví dụ:
   {
     quote: "Anh Đạt nắm bài toán rất nhanh và đề xuất giải pháp giúp chúng tôi tiết kiệm nhiều tháng phát triển.",
     name: "Họ tên",
     role: "Chức danh, Công ty",
     avatar: "assets/testimonials/ten-nguoi.jpg" // không bắt buộc
   }
   ========================================================= */
const TESTIMONIALS = [];

document.documentElement.classList.add('js');

/* ---------- Theme ---------- */
const root = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', next === 'dark' ? '#0d0e10' : '#f4f5f7');
  try { localStorage.setItem('theme', next); } catch (e) {}
});

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById('menuToggle');
const menu = document.getElementById('mobileMenu');
function setMenu(open) {
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.querySelector('i').className = open ? 'ph ph-x' : 'ph ph-list';
}
menuBtn.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

/* ---------- Nav border on scroll (sentinel, no scroll listener) ---------- */
const nav = document.querySelector('.nav');
const sentinel = document.createElement('div');
sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
document.body.prepend(sentinel);
new IntersectionObserver(([e]) => nav.classList.toggle('is-scrolled', !e.isIntersecting)).observe(sentinel);

/* ---------- Active nav link ---------- */
const links = [...document.querySelectorAll('.nav__links a')];
const byId = Object.fromEntries(links.map((a) => [a.getAttribute('href').slice(1), a]));
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => a.classList.remove('is-active'));
    byId[entry.target.id]?.classList.add('is-active');
  });
}, { rootMargin: '-45% 0px -50% 0px' });
Object.keys(byId).forEach((id) => { const el = document.getElementById(id); if (el) sectionObs.observe(el); });

/* ---------- Testimonials ---------- */
if (TESTIMONIALS.length) {
  const wrap = document.getElementById('quotes');
  wrap.innerHTML = TESTIMONIALS.map((t) => `
    <figure class="quote reveal">
      <blockquote>“${t.quote}”</blockquote>
      <figcaption>
        ${t.avatar ? `<img src="${t.avatar}" alt="" width="40" height="40" loading="lazy">` : ''}
        <div><strong>${t.name}</strong><span>${t.role}</span></div>
      </figcaption>
    </figure>`).join('');
  document.getElementById('testimonials').hidden = false;
}

/* ---------- Reveal on scroll (staggered per group) ---------- */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if (reduce || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-in'));
} else {
  revealEls.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
}

/* ---------- Count-up stats ---------- */
if (!reduce) {
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const dur = 1100;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => countObs.observe(el));
}

/* ---------- Contact form: validate, then open mail client ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const rules = {
  name: (v) => (v.trim() ? '' : 'Vui lòng nhập họ tên.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Email chưa đúng định dạng.'),
  message: (v) => (v.trim().length >= 10 ? '' : 'Nội dung cần ít nhất 10 ký tự.'),
};
const errId = { name: 'e-name', email: 'e-email', message: 'e-msg' };

function check(field) {
  const input = form.elements[field];
  const msg = rules[field](input.value);
  const err = document.getElementById(errId[field]);
  err.textContent = msg;
  input.closest('.field').classList.toggle('has-error', !!msg);
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  const help = input.dataset.help || '';
  input.setAttribute('aria-describedby', (msg ? `${help} ${errId[field]}` : help).trim());
  return !msg;
}
Object.keys(rules).forEach((f) => form.elements[f].addEventListener('blur', () => check(f)));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = Object.keys(rules).map(check).every(Boolean);
  if (!ok) {
    status.textContent = '';
    form.querySelector('.has-error input, .has-error textarea')?.focus();
    return;
  }
  const d = Object.fromEntries(new FormData(form));
  const subject = `Trao đổi hợp tác: ${d.name}${d.company ? ` (${d.company})` : ''}`;
  const body = `${d.message}\n\n---\n${d.name}\n${d.email}${d.company ? `\n${d.company}` : ''}`;
  window.location.href = `mailto:dat.le@fractal.vn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Ứng dụng email của bạn đang được mở với nội dung đã điền sẵn.';
});

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
