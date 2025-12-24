// Product placeholders
const products = [
  {
    name: "Premium Almonds",
    price: "₹750 / kg",
    description: "Rich, crunchy almonds sourced from certified farms."
  },
  {
    name: "Handpicked Cashews",
    price: "₹820 / kg",
    description: "Superior taste cashews."
  },
  {
    name: "Golden Raisins",
    price: "₹420 / kg",
    description: "Hygienically packed raisins."
  }
];

const container = document.getElementById("product-list");
const phoneNumber = "918489201098";

if (container) {
  products.forEach(p => {
    const message = encodeURIComponent(`I want to order ${p.name} (${p.price})`);
    container.innerHTML += `
      <div class="product-card reveal">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <span class="price">${p.price}</span>
        <a class="btn" href="https://wa.me/${phoneNumber}?text=${message}">
          Order on WhatsApp
        </a>
      </div>
    `;
  });
}

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));

// WhatsApp helper
function openWhatsApp() {
  window.open(`https://wa.me/${phoneNumber}`, "_blank");
}

