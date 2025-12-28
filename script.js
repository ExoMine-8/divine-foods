const products = [
  {
    name: "Almonds",
    price: "₹750 / kg",
    desc: "Premium grade, nutrient-rich almonds.",
    img: "assets/almond.jpg"
  },
  {
    name: "Cashews",
    price: "₹820 / kg",
    desc: "Handpicked cashews with natural sweetness.",
    img: "assets/cashew.jpg"
  },
  {
    name: "Pistachios",
    price: "₹995 / kg",
    desc: "Carefully sourced, vibrant and fresh.",
    img: "assets/pistachio.jpg"
  }
];

<<<<<<< HEAD
const container = document.getElementById("product-list");
const phoneNumber = "918489201098"; // correct WhatsApp format

products.forEach(p => {
  container.innerHTML += `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}" style="width:100%; border-radius:8px;">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <p style="font-weight:700;">${p.price}</p>
      <a class="btn" href="https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        `Hello! I'd like to order ${p.name} at ${p.price}.`
      )}">Order on WhatsApp</a>
    </div>
  `;
=======
document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'df_cart';
  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  };
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const cartCount = () => getCart().reduce((n, i) => n + (i.qty || 1), 0);
  const setCartCount = () => {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = cartCount() ? `(${cartCount()})` : '';
  };
  const addToCart = (item) => {
    const cart = getCart();
    const idx = cart.findIndex(i => i.name === item.name);
    if (idx >= 0) cart[idx].qty = (cart[idx].qty || 1) + 1;
    else cart.push({ ...item, qty: 1 });
    saveCart(cart);
    setCartCount();
  };
  const updateQty = (name, delta) => {
    const cart = getCart().map(i => i.name === name ? { ...i, qty: Math.max(0, (i.qty || 1) + delta) } : i)
      .filter(i => i.qty > 0);
    saveCart(cart);
    setCartCount();
    renderCart();
  };
  const removeItem = (name) => {
    const cart = getCart().filter(i => i.name !== name);
    saveCart(cart);
    setCartCount();
    renderCart();
  };

  const visitedStory = localStorage.getItem('visitedStory') === 'true';
  const path = location.pathname.toLowerCase();
  const isStory = /(^|\/)(story|story\.html)$/.test(path);
  const isProducts = /(^|\/)(products|products\.html)$/.test(path);
  const isCart = /(^|\/)(cart|cart\.html)$/.test(path);

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
          <img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy" decoding="async" fetchpriority="low">
          <div class="product-info">
            <h3>${p.name}</h3>
            <span class="product-price">${p.price}</span>
            <p>${p.desc}</p>
            <a class="btn" href="https://wa.me/${phoneNumber}?text=${encodeURIComponent(
              `Hello! I'd like to order ${p.name} at ${p.price}.`
            )}" target="_blank" aria-label="Order ${p.name} on WhatsApp">Order on WhatsApp</a>
            <button class="btn" aria-label="Add ${p.name} to cart" data-add="${p.name}">Add to Cart</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
    container.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-add');
        const item = products.find(i => i.name === name);
        if (item) addToCart({ name: item.name, price: item.price });
      });
    });
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

  // Cart page render
  const renderCart = () => {
    const root = document.getElementById('cart-container');
    if (!root) return;
    const items = getCart();
    if (!items.length) {
      root.innerHTML = `<p style="text-align:center;">Your cart is empty. <a href="products.html">Browse products</a>.</p>`;
      document.getElementById('cart-summary').textContent = '';
      return;
    }
    let total = 0;
    root.innerHTML = items.map(i => {
      const priceNum = parseInt((i.price.match(/\d+/) || ['0'])[0], 10);
      const line = priceNum * (i.qty || 1);
      total += line;
      return `
        <div class="product-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; margin-bottom:10px;">
          <div>
            <strong>${i.name}</strong><br>
            <span class="product-price">${i.price}</span>
          </div>
          <div>
            <button class="btn" aria-label="Decrease ${i.name} quantity" data-dec="${i.name}" style="padding:6px 12px;">-</button>
            <span style="margin:0 10px;">${i.qty || 1}</span>
            <button class="btn" aria-label="Increase ${i.name} quantity" data-inc="${i.name}" style="padding:6px 12px;">+</button>
            <button class="btn" aria-label="Remove ${i.name} from cart" data-rem="${i.name}" style="padding:6px 12px; background:#b91c1c;">Remove</button>
          </div>
        </div>
      `;
    }).join('');
    document.getElementById('cart-summary').textContent = `Subtotal: ₹${total} (approx)`;
    root.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => updateQty(b.getAttribute('data-dec'), -1)));
    root.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => updateQty(b.getAttribute('data-inc'), +1)));
    root.querySelectorAll('[data-rem]').forEach(b => b.addEventListener('click', () => removeItem(b.getAttribute('data-rem'))));
  };

  setCartCount();
  if (isCart) renderCart();
>>>>>>> c1dbd70 (Cart basics: localStorage persistence, quantity controls, navbar count; add Cart page; product images lazy-loading and Add to Cart button)
});

