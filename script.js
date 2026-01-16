const products = [
  {
    id: "almonds",
    name: "Almonds",
    price: 820,
    unit: "₹820 / kg",
    desc: "Premium grade almonds, hygienically packed.",
    img: "assets/m.jpg"
  },
  {
    id: "cashews",
    name: "Cashews",
    price: 850,
    unit: "₹850 / kg",
    desc: "Handpicked cashews with natural sweetness.",
    img: "assets/cashews.webp"
  },
  {
    id: "pistachios",
    name: "Salted Pistachios",
    price: 995,
    unit: "₹995 / kg",
    desc: "Carefully sourced, vibrant and fresh.",
    img: "assets/salted-pistachios.jpg"
  },
  {
    id: "mixed-nuts",
    name: "Mixed Nuts",
    price: 900,
    unit: "₹900 / kg",
    desc: "Balanced blend for everyday nutrition.",
    img: "assets/mixed-nuts.jpg"
  }
];

const phoneNumber = "918489201098";

function readCart() {
  try {
    const raw = localStorage.getItem("divineCart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem("divineCart", JSON.stringify(items));
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const cart = readCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  el.textContent = total > 0 ? `(${total})` : "";
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const cart = readCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, unit: product.unit, qty: 1 });
  }
  writeCart(cart);
  updateCartCount();
}

function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-price">${p.unit}</div>
        <div>
          <button class="btn" data-add-cart="${p.id}">Add to Cart</button>
        </div>
        <div>
          <a class="btn" href="https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            `Hello! I'd like to order ${p.name} at ${p.unit}.`
          )}" target="_blank" rel="noopener">Order on WhatsApp</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  container.addEventListener("click", e => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.getAttribute("data-add-cart");
    if (!id) return;
    e.preventDefault();
    addToCart(id);
  });
}

function renderCart() {
  const container = document.getElementById("cart-container");
  const summary = document.getElementById("cart-summary");
  if (!container || !summary) return;
  const cart = readCart();
  if (cart.length === 0) {
    container.textContent = "Your cart is empty.";
    summary.textContent = "";
    return;
  }
  container.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span>${item.name}</span>
      <span>Qty: ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
      <span>
        <button data-action="dec" data-id="${item.id}">-</button>
        <button data-action="inc" data-id="${item.id}">+</button>
        <button data-action="remove" data-id="${item.id}">Remove</button>
      </span>
    `;
    container.appendChild(row);
  });

  const lines = [];
  lines.push("Hello! I'd like to place an order:");
  lines.push("");
  cart.forEach(item => {
    lines.push(`- ${item.name} (${item.unit}) x ${item.qty} = ₹${item.price * item.qty}`);
  });
  lines.push("");
  lines.push(`Estimated total: ₹${total}`);

  const waText = encodeURIComponent(lines.join("\n"));
  const waUrl = `https://wa.me/${phoneNumber}?text=${waText}`;

  summary.innerHTML = `
    <div>Estimated total: ₹${total}</div>
    <div style="margin-top:12px;">
      <a class="btn" href="${waUrl}" target="_blank" rel="noopener">Checkout on WhatsApp</a>
    </div>
  `;

  container.addEventListener("click", e => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.getAttribute("data-action");
    const id = target.getAttribute("data-id");
    if (!action || !id) return;
    const current = readCart();
    const item = current.find(x => x.id === id);
    if (!item) return;
    if (action === "inc") item.qty += 1;
    if (action === "dec") item.qty = Math.max(1, item.qty - 1);
    if (action === "remove") {
      const idx = current.findIndex(x => x.id === id);
      if (idx !== -1) current.splice(idx, 1);
    }
    writeCart(current);
    renderCart();
    updateCartCount();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    }
  };

  const storedTheme = localStorage.getItem("divineTheme");
  const initialTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
  applyTheme(initialTheme);

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("divineTheme", next);
      applyTheme(next);
    });
  }

  renderProducts();
  renderCart();
  updateCartCount();
});
