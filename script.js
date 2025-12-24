// Parallax
const layer = document.getElementById("parallaxLayer");
window.addEventListener("scroll",()=>layer.style.transform=`translateY(${window.scrollY*0.15}px)`);

// Products (placeholders)
const products=[
  {name:"Premium Almonds", price:"₹750 / kg", description:"Rich, crunchy almonds."},
  {name:"Handpicked Cashews", price:"₹820 / kg", description:"Superior taste cashews."},
  {name:"Golden Raisins", price:"₹420 / kg", description:"Hygienically packed raisins."}
];
const container=document.getElementById("product-list");
const phoneNumber="918489201098"; // your WhatsApp

products.forEach(p=>{
  const msg=encodeURIComponent(`I want to order ${p.name} (${p.price})`);
  container.innerHTML+=`
    <div class="product-card">
      <h4>${p.name}</h4>
      <p>${p.description}</p>
      <span class="price">${p.price}</span>
      <a class="cta" href="https://wa.me/${phoneNumber}?text=${msg}">Order on WhatsApp</a>
    </div>
  `;
});
