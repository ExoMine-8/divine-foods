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
