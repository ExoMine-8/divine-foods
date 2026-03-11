// ========================================
// DIVINE FOODS - NEW HOMEPAGE INTERACTION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. HERO FLOATING IMAGE PARALLAX
  (() => {
    const floatingImg = document.getElementById('floating-img');
    if (!floatingImg || prefersReducedMotion || isMobile) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      // Smooth movement tracking
      mouseX = (e.clientX / window.innerWidth - 0.5) * 50;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 50;
    });

    const animate = () => {
      // Easing for the bowl movement
      currentX += (mouseX - currentX) * 0.05; // Slower, smoother easing
      currentY += (mouseY - currentY) * 0.05;
      
      // Multi-axis rotation and translation for depth
      const rotation = currentX * 0.05; // Reduced rotation
      floatingImg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotation}deg)`;
      requestAnimationFrame(animate);
    };
    animate();
  })();

  // 2. HERO BACKGROUND PARTICLES (Subtle Stars)
  (() => {
    const container = document.getElementById('hero-particles');
    if (!container || prefersReducedMotion) return;

    const count = isMobile ? 15 : 40;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 3 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = 'rgba(212, 163, 115, 0.3)';
      particle.style.borderRadius = '50%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.left = Math.random() * 100 + '%';
      
      const duration = Math.random() * 3000 + 2000;
      const delay = Math.random() * 2000;
      
      particle.animate([
        { opacity: 0, transform: 'translateY(0)' },
        { opacity: 0.8, transform: 'translateY(-20px)' },
        { opacity: 0, transform: 'translateY(-40px)' }
      ], {
        duration: duration,
        delay: delay,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
      
      container.appendChild(particle);
    }
  })();

  // 3. SCROLL REVEAL FOR HEADLINE
  (() => {
    const headline = document.querySelector('.hero-headline');
    const subheadline = document.querySelector('.hero-subheadline');
    const cta = document.querySelector('.hero-cta-group');

    if (headline) headline.style.opacity = '0';
    if (subheadline) subheadline.style.opacity = '0';
    if (cta) cta.style.opacity = '0';

    setTimeout(() => {
      if (headline) {
        headline.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
        headline.style.opacity = '1';
        headline.style.transform = 'translateY(0)';
      }
    }, 200);

    setTimeout(() => {
      if (subheadline) {
        subheadline.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
        subheadline.style.opacity = '1';
        subheadline.style.transform = 'translateY(0)';
      }
    }, 400);

    setTimeout(() => {
      if (cta) {
        cta.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
        cta.style.opacity = '1';
        cta.style.transform = 'translateY(0)';
      }
    }, 600);
  })();

  // 4. STATS COUNTER ANIMATION (Re-used)
  (() => {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = { threshold: 0.5 };

    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target + (counter.dataset.target == "100" ? "%" : "+");
        }
      };
      update();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(c => observer.observe(c));
  })();

  // 5. SCROLL INDICATOR FADE
  window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = window.scrollY > 50 ? '0' : '0.6';
      scrollIndicator.style.pointerEvents = window.scrollY > 50 ? 'none' : 'auto';
    }
  }, { passive: true });
});
