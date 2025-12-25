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
    const parallaxOff =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!parallaxOff) {
      const layer2 = document.createElement('div');
      layer2.className = 'parallax-3d';
      pageHero.appendChild(layer2);
      const dots2 = [];
      const isMobile2 = window.matchMedia('(max-width: 560px)').matches;
      const count2 = isMobile2 ? 12 : 24;
      const rect2 = pageHero.getBoundingClientRect();
      for (let i = 0; i < count2; i++) {
        const el = document.createElement('span');
        el.className = 'dot';
        const size = Math.random() * 6 + 4;
        const depth = Math.random() * 120 - 60;
        const x = Math.random() * rect2.width;
        const y = Math.random() * rect2.height;
        const vx = (Math.random() - 0.5) * 0.15;
        const vy = (Math.random() - 0.5) * 0.15;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        const baseLeft = (x / rect2.width) * 100;
        const baseTop = (y / rect2.height) * 100;
        el.style.left = `${baseLeft}%`;
        el.style.top = `${baseTop}%`;
        el.dataset.depth = String(depth);
        layer2.appendChild(el);
        dots2.push({ el, baseLeft, baseTop, offX: 0, offY: 0, vx, vy, depth, size });
      }
      let mx2 = null, my2 = null, targetX2 = 0, targetY2 = 0;
      const repelRadius2 = 90;
      const repelStrength2 = 4;
      const friction2 = 0.97;
      const driftLimit2 = isMobile2 ? 24 : 36;
      const drift2 = () => {
        const rotX = (targetY2) * -6;
        const rotY = (targetX2) * 6;
        layer2.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        for (const d of dots2) {
          if (mx2 !== null && my2 !== null) {
            const dx = (d.baseLeft/100 * rect2.width + d.offX) - mx2;
            const dy = (d.baseTop/100 * rect2.height + d.offY) - my2;
            const dist = Math.hypot(dx, dy);
            if (dist < repelRadius2 && dist > 0.001) {
              const force = (repelRadius2 - dist) / repelRadius2 * repelStrength2;
              d.vx += (dx / dist) * force;
              d.vy += (dy / dist) * force;
            }
          }
          d.vx *= friction2;
          d.vy *= friction2;
          d.offX += d.vx + Math.sin(d.depth * 0.01) * 0.08;
          d.offY += d.vy + Math.cos(d.depth * 0.01) * 0.08;
          if (d.offX > driftLimit2) d.offX = driftLimit2;
          if (d.offX < -driftLimit2) d.offX = -driftLimit2;
          if (d.offY > driftLimit2) d.offY = driftLimit2;
          if (d.offY < -driftLimit2) d.offY = -driftLimit2;
          const tx = targetX2 * d.depth;
          const ty = targetY2 * d.depth;
          d.el.style.transform = `translate3d(${tx + d.offX}px, ${ty + d.offY}px, ${d.depth}px)`;
        }
        requestAnimationFrame(drift2);
      };
      requestAnimationFrame(drift2);
      window.addEventListener('mousemove', (e) => {
        mx2 = e.clientX - rect2.left;
        my2 = e.clientY - rect2.top;
        targetX2 = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        targetY2 = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      });
      window.addEventListener('mouseleave', () => { mx2 = null; my2 = null; });
      let lastOri2 = 0;
      window.addEventListener('deviceorientation', (e) => {
        const now = performance.now();
        if (now - lastOri2 < 100) return;
        lastOri2 = now;
        const x = (e.gamma || 0) / 45;
        const y = (e.beta || 0) / 45;
        targetX2 = x;
        targetY2 = y;
      });
    }
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

    const parallaxOff =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (parallaxOff) {
      const existing = hero.querySelector('.parallax-3d');
      if (existing) existing.remove();
      // Skip creating parallax layer on mobile/reduced-motion
    } else {
    const layer = document.createElement('div');
    layer.className = 'parallax-3d';
    hero.appendChild(layer);

    const dots = [];
    const isMobile = window.matchMedia('(max-width: 560px)').matches;
    const count = isMobile ? 14 : 28;
    const rect = hero.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'dot';
      const size = Math.random() * 6 + 4;
      const depth = Math.random() * 120 - 60;
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const vx = (Math.random() - 0.5) * 0.15;
      const vy = (Math.random() - 0.5) * 0.15;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      const baseLeft = (x / rect.width) * 100;
      const baseTop = (y / rect.height) * 100;
      el.style.left = `${baseLeft}%`;
      el.style.top = `${baseTop}%`;
      el.dataset.depth = String(depth);
      layer.appendChild(el);
      dots.push({ el, baseLeft, baseTop, offX: 0, offY: 0, vx, vy, depth, size });
    }

    let mx = null, my = null, targetX = 0, targetY = 0;
    const repelRadius = 90;
    const repelStrength = 4;
    const friction = 0.97;
    const driftLimit = isMobile ? 24 : 36;
    const drift = () => {
      const rotX = (targetY) * -6;
      const rotY = (targetX) * 6;
      layer.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      for (const d of dots) {
        if (mx !== null && my !== null) {
          const dx = (d.baseLeft/100 * rect.width + d.offX) - mx;
          const dy = (d.baseTop/100 * rect.height + d.offY) - my;
          const dist = Math.hypot(dx, dy);
          if (dist < repelRadius && dist > 0.001) {
            const force = (repelRadius - dist) / repelRadius * repelStrength;
            d.vx += (dx / dist) * force;
            d.vy += (dy / dist) * force;
          }
        }
        d.vx *= friction;
        d.vy *= friction;
        d.offX += d.vx + Math.sin(d.depth * 0.01) * 0.08;
        d.offY += d.vy + Math.cos(d.depth * 0.01) * 0.08;
        if (d.offX > driftLimit) d.offX = driftLimit;
        if (d.offX < -driftLimit) d.offX = -driftLimit;
        if (d.offY > driftLimit) d.offY = driftLimit;
        if (d.offY < -driftLimit) d.offY = -driftLimit;
        const tx = targetX * d.depth;
        const ty = targetY * d.depth;
        d.el.style.transform = `translate3d(${tx + d.offX}px, ${ty + d.offY}px, ${d.depth}px)`;
      }
      requestAnimationFrame(drift);
    };
    requestAnimationFrame(drift);
    if (vid) {
      vid.playbackRate = 0.5;
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {
          vid.muted = true;
          vid.play();
        });
      }
    }
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });
    window.addEventListener('mouseleave', () => { mx = null; my = null; });
    let lastOri = 0;
    window.addEventListener('deviceorientation', (e) => {
      const now = performance.now();
      if (now - lastOri < 100) return;
      lastOri = now;
      const x = (e.gamma || 0) / 45;
      const y = (e.beta || 0) / 45;
      targetX = x;
      targetY = y;
    });
    }
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
});
