// ========================================
// DIVINE FOODS - SOURCE TO PACK JOURNEY
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. SVG PATH ANIMATION ON SCROLL
  (() => {
    const path = document.getElementById('journey-path');
    const container = document.querySelector('.journey-container');
    if (!path || !container) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    const updatePath = () => {
      const scrollPos = window.scrollY + (window.innerHeight * 0.4);
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      
      let progress = (scrollPos - containerTop) / containerHeight;
      progress = Math.min(Math.max(progress, 0), 1);
      
      const drawLength = pathLength * progress;
      path.style.strokeDashoffset = pathLength - drawLength;
    };

    window.addEventListener('scroll', updatePath, { passive: true });
    updatePath();
  })();

  // 2. STEP REVEAL ON SCROLL
  (() => {
    const steps = document.querySelectorAll('.journey-step');
    if (!steps.length) return;

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    steps.forEach(step => observer.observe(step));
  })();

  // 3. MICRO-INTERACTIONS (ICON BOUNCE)
  (() => {
    const steps = document.querySelectorAll('.journey-step');
    steps.forEach(step => {
      step.addEventListener('mouseenter', () => {
        const icon = step.querySelector('.step-icon');
        if (icon) {
          icon.style.transform = 'scale(1.2) rotate(10deg)';
          icon.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
      });
      step.addEventListener('mouseleave', () => {
        const icon = step.querySelector('.step-icon');
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
      });
    });
  })();
});
