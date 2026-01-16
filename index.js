// ========================================
// INTERACTIVE HOMEPAGE EFFECTS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================
  // 1. INTERACTIVE STARS (float + cursor repulsion)
  // ========================================
  (() => {
    if (prefersReducedMotion) return;

    const container = document.getElementById('particles');
    const hero = document.getElementById('hero-section');
    if (!container || !hero) return;

    const starCount = isMobile ? 16 : 32;
    const stars = [];

    const rect = () => container.getBoundingClientRect();

    for (let i = 0; i < starCount; i++) {
      const el = document.createElement('div');
      el.className = 'star-node';
      const r = rect();
      const x = Math.random() * r.width;
      const y = Math.random() * r.height;
      const driftAngle = Math.random() * Math.PI * 2;
      const speed = isMobile ? 0.03 : 0.06;
      const vx = Math.cos(driftAngle) * speed;
      const vy = Math.sin(driftAngle) * speed;
      stars.push({ el, x, y, vx, vy });
      container.appendChild(el);
    }

    let mouseX = null;
    let mouseY = null;

    hero.addEventListener('mousemove', (e) => {
      const r = rect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    });

    hero.addEventListener('mouseleave', () => {
      mouseX = null;
      mouseY = null;
    });

    const update = () => {
      const r = rect();
      const width = r.width;
      const height = r.height;
      const influenceRadius = isMobile ? 0 : 140;

      stars.forEach(star => {
        if (mouseX !== null && mouseY !== null && influenceRadius > 0) {
          const dx = star.x - mouseX;
          const dy = star.y - mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < influenceRadius && dist > 0.001) {
            const force = (influenceRadius - dist) / influenceRadius * 0.3;
            const nx = dx / dist;
            const ny = dy / dist;
            star.vx += nx * force;
            star.vy += ny * force;
          }
        }

        // gentle normalization so they keep drifting
        star.vx *= 0.96;
        star.vy *= 0.96;

        star.x += star.vx;
        star.y += star.vy;

        // wrap around edges
        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        star.el.style.transform = `translate3d(${star.x}px, ${star.y}px, 0) rotate(45deg)`;
      });

      requestAnimationFrame(update);
    };

    update();
  })();

  // ========================================
  // 2. CURSOR GLOW EFFECT (Desktop only)
  // ========================================
  (() => {
    if (isMobile || prefersReducedMotion) return;

    const cursorGlow = document.getElementById('cursor-glow');
    const hero = document.getElementById('hero-section');
    
    if (!cursorGlow || !hero) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    const animateGlow = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      
      currentX += dx * 0.1;
      currentY += dy * 0.1;
      
      cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      
      requestAnimationFrame(animateGlow);
    };
    
    animateGlow();
  })();

  // ========================================
  // 3. FLOATING PRODUCTS WITH PARALLAX
  // ========================================
  (() => {
    if (prefersReducedMotion) return;

    const floatingProducts = document.querySelectorAll('.product-float');
    if (!floatingProducts.length) return;

    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;

      if (!ticking) {
        requestAnimationFrame(() => {
          floatingProducts.forEach((product) => {
            const speed = parseFloat(product.dataset.speed) || 1;
            const x = mouseX * 50 * speed;
            const y = mouseY * 50 * speed;
            
            product.style.transform = `translate(${x}px, ${y}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });

    // Auto-float animation on mobile
    if (isMobile) {
      let offset = 0;
      const autoFloat = () => {
        offset += 0.01;
        floatingProducts.forEach((product, index) => {
          const y = Math.sin(offset + index) * 20;
          product.style.transform = `translateY(${y}px)`;
        });
        requestAnimationFrame(autoFloat);
      };
      autoFloat();
    }
  })();

  // ========================================
  // 4. TYPEWRITER EFFECT
  // ========================================
  (() => {
    const typewriterEl = document.querySelector('.typewrite-fast');
    if (!typewriterEl) return;

    const text = "Thoughtfully Packed.";
    let index = 0;
    const speed = 80;

    const type = () => {
      if (index < text.length) {
        typewriterEl.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    };

    setTimeout(type, 500);
  })();

  // ========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ========================================
  (() => {
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  })();

  // ========================================
  // 6. ANIMATED COUNTERS
  // ========================================
  (() => {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach(counter => animateCounter(counter));
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);
  })();

  // ========================================
  // 7. GRADIENT ANIMATION
  // ========================================
  (() => {
    if (prefersReducedMotion) return;

    const gradientBg = document.querySelector('.gradient-bg');
    if (!gradientBg) return;

    let hue = 220;
    const animateGradient = () => {
      hue = (hue + 0.2) % 360;
      gradientBg.style.filter = `hue-rotate(${hue}deg)`;
      requestAnimationFrame(animateGradient);
    };

    if (!isMobile) {
      animateGradient();
    }
  })();

  // ========================================
  // 8. SCROLL INDICATOR
  // ========================================
  (() => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
      } else {
        scrollIndicator.style.opacity = '1';
      }
    }, { passive: true });
  })();

  // ========================================
  // 9. BUTTON HOVER EFFECTS
  // ========================================
  (() => {
    const buttons = document.querySelectorAll('.btn-glow');
    
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
      });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  })();

  // ========================================
  // 11. CARD TILT EFFECT (Desktop)
  // ========================================
  (() => {
    if (isMobile || prefersReducedMotion) return;

    const cards = document.querySelectorAll('.preview-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  })();

  // ========================================
  // 12. SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  (() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  })();

  console.log('🎨 Interactive homepage loaded!');
});
