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
    img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Cashews",
    price: "₹820 / kg",
    description: "Handpicked cashews.",
    img: "assets/cashews.webp?v=2"
  },
  {
    name: "Raisins",
    price: "₹420 / kg",
    description: "Cleaned and hygienically packed.",
    img: "assets/mixed-nuts.jpg?v=2"
  }
];

const container = document.getElementById("product-list");
const phone = "918489201098";

if (container) {
  products.forEach(p => {
    const msg = encodeURIComponent(`I want to order ${p.name} (${p.price})`);
    container.innerHTML += `
      <div class="product-card">
        ${p.img ? `<img src="${p.img}" alt="${p.name}" class="product-img">` : ''}
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p>${p.price}</p>
        <a class="btn" href="https://wa.me/${phone}?text=${msg}">Order</a>
      </div>
    `;
  });
}



