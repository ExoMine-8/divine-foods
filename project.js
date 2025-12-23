const phoneNumber = "918489201098"; // COUNTRY CODE, NO +

const products = [
  {
    name: "Premium California Almonds",
    description: "Crunchy almonds sourced from certified growers.",
    price: "Available in 250g / 500g / 1kg"
  },
  {
    name: "Whole Cashew Nuts (W320)",
    description: "High-grade cashews, hygienically packed.",
    price: "Available in 250g / 500g / 1kg"
  },
  {
    name: "Golden Raisins",
    description: "Naturally sweet, consistent quality raisins.",
    price: "Available in 500g / 1kg"
  },
  {
    name: "Festive Combo Packs",
    description: "Curated assortments for gifting.",
    price: "Launching Soon"
  }
];

const container = document.getElementById("product-list");

products.forEach(product => {
  const msg = encodeURIComponent(
    `Hello, I am interested in ${product.name}`
  );

  container.innerHTML += `
    <div class="product-card">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">${product.price}</p>
      <a class="btn" href="https://wa.me/${phoneNumber}?text=${msg}">
        Enquire on WhatsApp
      </a>
    </div>
  `;
});


