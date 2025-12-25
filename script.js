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
  const productsLinks = document.querySelectorAll('a[href="products.html"]');
  productsLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      if (!localStorage.getItem('visitedStory')) {
        e.preventDefault();
        window.location.href = 'story.html';
      }
    });
  });
  if (location.pathname.endsWith('story.html')) {
    localStorage.setItem('visitedStory', 'true');
  }
  if (location.pathname.endsWith('products.html') && !visitedStory) {
    window.location.href = 'story.html';
    return;
  }

  const hero = document.querySelector('.hero-parallax');
  if (hero) {
    const layer = document.createElement('div');
    layer.className = 'parallax-3d';
    hero.appendChild(layer);

    const dots = [];
    const count = 35;
    const rect = hero.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'dot';
      const size = Math.random() * 6 + 4;
      const depth = Math.random() * 120 - 60;
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const vx = (Math.random() - 0.5) * 0.25;
      const vy = (Math.random() - 0.5) * 0.25;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${(x / rect.width) * 100}%`;
      el.style.top = `${(y / rect.height) * 100}%`;
      el.dataset.depth = String(depth);
      layer.appendChild(el);
      dots.push({ el, x, y, vx, vy, depth, size });
    }

    let mx = null, my = null, targetX = 0, targetY = 0;
    const repelRadius = 120;
    const repelStrength = 10;
    const friction = 0.96;
    const drift = () => {
      const rotX = (targetY) * -6;
      const rotY = (targetX) * 6;
      layer.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      for (const d of dots) {
        if (mx !== null && my !== null) {
          const dx = d.x - mx;
          const dy = d.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < repelRadius && dist > 0.001) {
            const force = (repelRadius - dist) / repelRadius * repelStrength;
            d.vx += (dx / dist) * force;
            d.vy += (dy / dist) * force;
          }
        }
        d.vx *= friction;
        d.vy *= friction;
        d.x += d.vx + Math.sin(d.depth * 0.01) * 0.1;
        d.y += d.vy + Math.cos(d.depth * 0.01) * 0.1;
        if (d.x < 0) d.x += rect.width;
        if (d.x > rect.width) d.x -= rect.width;
        if (d.y < 0) d.y += rect.height;
        if (d.y > rect.height) d.y -= rect.height;
        const tx = targetX * d.depth;
        const ty = targetY * d.depth;
        d.el.style.left = `${(d.x / rect.width) * 100}%`;
        d.el.style.top = `${(d.y / rect.height) * 100}%`;
        d.el.style.transform = `translate3d(${tx}px, ${ty}px, ${d.depth}px)`;
      }
      requestAnimationFrame(drift);
    };
    requestAnimationFrame(drift);
    const vid = document.querySelector('.hero-video');
    if (vid) {
      vid.playbackRate = 0.5;
    }
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });
    window.addEventListener('mouseleave', () => { mx = null; my = null; });
    window.addEventListener('deviceorientation', (e) => {
      const x = (e.gamma || 0) / 45;
      const y = (e.beta || 0) / 45;
      targetX = x;
      targetY = y;
    });
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
