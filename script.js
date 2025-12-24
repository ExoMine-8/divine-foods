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
});
