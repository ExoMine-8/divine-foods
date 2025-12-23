// Scroll reveal
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
});

reveals.forEach(r => observer.observe(r));

// Products
const products = [
  {
    name: "Almonds",
    price: "₹750 / kg",
    description: "Premium quality almonds.",
  },
  {
    name: "Cashews",
    price: "₹820 / kg",
    description: "Handpicked cashews.",
  },
  {
    name: "Raisins",
    price: "₹420 / kg",
    description: "Cleaned and hygienically packed.",
  }
];

const container = document.getElementById("product-list");
const phone = "918489201098";

if (container) {
  products.forEach(p => {
    const msg = encodeURIComponent(`I want to order ${p.name} (${p.price})`);
    container.innerHTML += `
      <div class="product-card">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p>${p.price}</p>
        <a class="btn" href="https://wa.me/${phone}?text=${msg}">Order</a>
      </div>
    `;
  });
}



