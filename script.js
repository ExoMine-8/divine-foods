const visitBtn = document.getElementById("visitBtn");
const productsSection = document.getElementById("products");
const productsLink = document.querySelector(".products-link");

visitBtn.addEventListener("click", () => {
  document.getElementById("story").scrollIntoView({ behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  const storyEnd = document.querySelector(".story-end");
  const rect = storyEnd.getBoundingClientRect();

  if (rect.top < window.innerHeight) {
    productsSection.classList.remove("locked");
    productsLink.classList.remove("disabled");
  }
});



