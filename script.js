const products = [
  {
    name: "Premium Almonds",
    price: "₹750 / kg",
    desc: "California almonds, rich in Vitamin E and essential oils. Perfect for snacking or baking.",
    img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Jumbo Cashews",
    price: "₹820 / kg",
    desc: "Handpicked, whole W320 grade cashews. Creamy, sweet, and crunchy.",
    img: "assets/cashews.webp?v=2"
  },
  {
    name: "Salted Pistachios",
    price: "₹995 / kg",
    desc: "Roasted and lightly salted pistachios. A heart-healthy snack with vibrant green kernels.",
    img: "assets/salted-pistachios.jpg?v=2"
  },
  {
    name: "Mixed Dry Fruits",
    price: "₹900 / kg",
    desc: "A balanced mix of almonds, cashews, raisins, and walnuts for your daily nutrition boost.",
    img: "assets/mixed-nuts.jpg?v=2"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const visitedStory = localStorage.getItem('visitedStory') === 'true';
  const path = location.pathname.toLowerCase();
  const isStory = /(^|\/)(story|story\.html)$/.test(path);
  const isProducts = /(^|\/)(products|products\.html)$/.test(path);

  // Mark Story as visited when on Story page
  if (isStory) {
    localStorage.setItem('visitedStory', 'true');
  }

  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    const existing = pageHero.querySelector('.parallax-3d');
    if (existing) existing.remove();
  }
  // Also mark Story as visited when clicking story links
  document.querySelectorAll('a').forEach(a => {
    try {
      const url = new URL(a.href, location.href);
      const p = url.pathname.toLowerCase();
      if ((/(^|\/)(story|story\.html)$/.test(p))) {
        a.addEventListener('click', () => {
          localStorage.setItem('visitedStory', 'true');
        });
      }
    } catch {}
  });

  // Intercept navigation to Products only if Story not yet visited
  if (!visitedStory) {
    document.querySelectorAll('a').forEach(a => {
      try {
        const url = new URL(a.href, location.href);
        const p = url.pathname.toLowerCase();
        if ((/(^|\/)(products|products\.html)$/.test(p))) {
          a.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'story.html';
          });
        }
      } catch {}
    });
    if (isProducts) {
      window.location.href = 'story.html';
      return;
    }
  }

  const hero = document.querySelector('.hero-parallax');
  if (hero) {
    const vid = document.querySelector('.hero-video');
    if (vid) { vid.remove(); }

    const existing = hero.querySelector('.parallax-3d');
    if (existing) existing.remove();
  }

  const typeEl = document.querySelector('.typewrite span');
  if (typeEl) {
    const full = typeEl.getAttribute('data-text') || typeEl.textContent.trim();
    typeEl.textContent = '';
    let i = 0;
    const speed = 45;
    const type = () => {
      if (i <= full.length) {
        typeEl.textContent = full.slice(0, i);
        i++;
        setTimeout(type, speed);
      }
    };
    type();
  }

  // Theme toggle
  const applyTheme = (t) => {
    document.body.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  };
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  }
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = (document.body.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      applyTheme(next);
      toggle.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';
    });
    toggle.textContent = (document.body.getAttribute('data-theme') === 'dark') ? 'Light Mode' : 'Dark Mode';
  }
  // Products Rendering
  const container = document.getElementById("product-list");
  const phoneNumber = "918489201098"; 

  if (container) {
    let html = '';
    products.forEach(p => {
      html += `
        <div class="product-card reveal">
          <img src="${p.img}" alt="${p.name}" class="product-img">
          <div class="product-info">
            <h3>${p.name}</h3>
            <span class="product-price">${p.price}</span>
            <p>${p.desc}</p>
            <a class="btn" href="https://wa.me/${phoneNumber}?text=${encodeURIComponent(
              `Hello! I'd like to order ${p.name} at ${p.price}.`
            )}" target="_blank">Order on WhatsApp</a>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  // Scroll Reveal Animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  // Observe elements with .reveal class
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
  // Also observe sections that might not have the class yet but should animate
  document.querySelectorAll('section > div, .section-title, .footer-col').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Lightweight mouse interaction for beads overlay (no parallax)
  (() => {
    let raf = null;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let tx = mx, ty = my;
    let idleTimer = null;
    const step = () => {
      // ease towards target
      const k = 0.12;
      mx += (tx - mx) * k;
      my += (ty - my) * k;
      const dx = (mx - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (my - window.innerHeight / 2) / (window.innerHeight / 2);
      const s = document.documentElement.style;
      s.setProperty('--beads-pos1', `${-dx * 160}px ${-dy * 160}px`);
      s.setProperty('--beads-pos2', `${-dx * 260}px ${-dy * 260}px`);
      s.setProperty('--beads-pos3', `${-dx * 360}px ${-dy * 360}px`);
      s.setProperty('--beads-pos4', `${-dx * 460}px ${-dy * 460}px`);
      raf = requestAnimationFrame(step);
    };
    const startLoop = () => {
      if (!raf) raf = requestAnimationFrame(step);
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { cancelAnimationFrame(raf); raf = null; }, 1200);
    };
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      startLoop();
    }, { passive: true });
  })();
});
