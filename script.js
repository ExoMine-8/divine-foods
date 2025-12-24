document.addEventListener("DOMContentLoaded", () => {
  /* Reveal animations */
  const animated = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  animated.forEach(el => observer.observe(el));

  /* Parallax background */
  const bg = document.querySelector(".parallax-bg");

  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.15;
    bg.style.transform = `translateY(${offset}px)`;
  });
});
