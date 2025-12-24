// Lightweight parallax (desktop only)
if (window.innerWidth > 768) {
  window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero");
    const offset = window.scrollY * 0.3;
    hero.style.backgroundPositionY = `${offset}px`;
  });
}

