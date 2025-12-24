/* HERO SLIDESHOW */
const hero = document.querySelector(".hero");
const heroImages = [
  "https://images.unsplash.com/photo-1604908177522-429bf5f7c23a",
  "https://images.unsplash.com/photo-1615484477778-ca3b77940c25",
  "https://images.unsplash.com/photo-1586201375754-1421e16c98d8"
];

let index = 0;
hero.style.backgroundImage = `url(${heroImages[0]})`;

setInterval(() => {
  index = (index + 1) % heroImages.length;
  hero.style.backgroundImage = `url(${heroImages[index]})`;
}, 6000);

/* VISIT BUTTON */
document.getElementById("visitPage").onclick = () => {
  document.getElementById("story")
    .scrollIntoView({ behavior: "smooth" });
};

/* UNLOCK PRODUCTS */
const products = document.getElementById("products");
const productsLink = document.querySelector(".products-link");

window.addEventListener("scroll", () => {
  const marker = document.querySelector(".story-end");
  if (marker.getBoundingClientRect().top < window.innerHeight) {
    products.classList.remove("locked");
    productsLink.classList.remove("disabled");
  }
});
