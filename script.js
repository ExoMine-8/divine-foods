document.addEventListener("DOMContentLoaded", () => {
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
    { threshold: 0.25 }
  );

  animated.forEach(el => observer.observe(el));
});


