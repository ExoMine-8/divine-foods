/**
 * The Divine Foods — Frontend Interaction Script
 * Purpose:
 * - Progressive reveal of sections
 * - Scroll-gated access to products
 * - Subtle quality-of-life animations
 * - Mobile-safe, no external dependencies
 */

document.addEventListener("DOMContentLoaded", () => {
  const productSection = document.querySelector(".products");
  const heroBlocks = document.querySelectorAll(".hero-block");

  // Safety check
  if (!productSection || heroBlocks.length === 0) return;

  /* ---------------------------------------
     1️⃣ Reveal hero blocks smoothly on scroll
  ---------------------------------------- */

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  heroBlocks.forEach((block) => {
    revealObserver.observe(block);
  });

  /* ---------------------------------------
     2️⃣ Lock products until user scrolls
  ---------------------------------------- */

  let productsUnlocked = false;

  const unlockProducts = () => {
    if (productsUnlocked) return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Require user to scroll ~70% of hero experience
    if (scrollPosition / documentHeight > 0.72) {
      productSection.classList.remove("hidden");
      productSection.classList.add("revealed");
      productsUnlocked = true;
    }
  };

  window.addEventListener("scroll", unlockProducts);

  /* ---------------------------------------
     3️⃣ Smooth anchor scrolling (QoL)
  ---------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* ---------------------------------------
     4️⃣ Micro interaction: navbar shadow
  ---------------------------------------- */

  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
    } else {
      navbar.style.boxShadow = "none";
    }
  });
});

