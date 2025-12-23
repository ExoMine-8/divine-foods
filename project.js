const phoneNumber = "8489201098"; // replace later

const products = [
  {
    name: "Premium California Almonds",
    description:
      "Uniform-sized almonds sourced from certified growers, known for crunch and rich flavour.",
    price: "₹— / kg"
  },
  {
    name: "Whole Cashew Nuts (W320)",
    description:
      "High-grade cashews, carefully sorted and hygienically packed for consistent quality.",
    price: "₹— / kg"
  },
  {
    name: "Golden Raisins",
    description:
      "Naturally sweet, cleaned and processed raisins with no artificial additives.",
    price: "₹— / kg"
  },
  {
    name: "Jumbo Afghan Black Raisins",
    description:
      "Large, sun-dried raisins with deep flavour and soft texture.",
    price: "₹— / kg"
  },
  {
    name: "Signature Mixed Dry Fruits",
    description:
      "A balanced blend of premium nuts curated for daily consumption.",
    price: "Launching Soon"
  },
  {
    name: "Festive Gift Combo Packs",
    description:
      "Thoughtfully packed assortments designed for gifting and celebrations.",
    price: "Coming Soon"
  }
];

const container = document.getElementById("product-list");

products.forEach(product => {
  const message = encodeURIComponent(
    `Hello, I am interested in ${product.name}`
  );

  container.innerHTML += `
    <div class="product-card">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">${product.price}</p>
      <a class="btn" href="https://wa.me/${phoneNumber}?text=${message}">
        Enquire on WhatsApp
      </a>
    </div>
  `;
});

