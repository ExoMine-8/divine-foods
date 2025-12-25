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
  // Hero 3D Parallax grid with stars retained
  const hero = document.querySelector('.hero-parallax');
  if (hero) {
    const layer = document.createElement('div');
    layer.className = 'parallax-3d';
    hero.appendChild(layer);

    const dots = [];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      const size = Math.random() * 6 + 4; // 4px - 10px
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const depth = Math.random() * 120 - 60; // -60 to 60
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${left}%`;
      dot.style.top = `${top}%`;
      dot.dataset.depth = depth.toFixed(2);
      layer.appendChild(dot);
      dots.push(dot);
    }

    let rafId = null;
    let targetX = 0, targetY = 0;
    const onMove = (x, y) => {
      targetX = (x - window.innerWidth / 2) / (window.innerWidth / 2);
      targetY = (y - window.innerHeight / 2) / (window.innerHeight / 2);
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };
    const update = () => {
      rafId = null;
      const rotX = targetY * -6; // tilt up/down
      const rotY = targetX * 6;  // tilt left/right
      layer.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      for (const d of dots) {
        const depth = parseFloat(d.dataset.depth);
        const tx = targetX * depth;
        const ty = targetY * depth;
        d.style.transform = `translate3d(${tx}px, ${ty}px, ${depth}px)`;
      }
    };
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('deviceorientation', (e) => {
      // Basic mobile tilt support
      const x = (e.gamma || 0) / 45; // left-right
      const y = (e.beta || 0) / 45;  // front-back
      onMove((x + 1) * window.innerWidth / 2, (y + 1) * window.innerHeight / 2);
    });
  }

  // Typewriter hero heading
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
