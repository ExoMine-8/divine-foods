// ========================================
// INTERACTIVE HOMEPAGE EFFECTS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================
  // 1. ANIMATED PARTICLES
  // ========================================
  (() => {
    if (prefersReducedMotion) return;

    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = isMobile ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      const startX = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 5;
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${startX}%;
        animation: float ${duration}s ${delay}s infinite ease-in-out;
        opacity: ${Math.random() * 0.5 + 0.3};
      `;
      
      particlesContainer.appendChild(particle);
    }
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
  // 10. PARALLAX SCROLL EFFECT
  // ========================================
  (() => {
    if (isMobile || prefersReducedMotion) return;

    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      
      heroSection.style.transform = `translateY(${rate}px)`;
    }, { passive: true });
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

  const applyTheme = (theme) => {
    const root = document.documentElement;
    const body = document.body;
    root.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
  };

  const storedTheme = localStorage.getItem('divineTheme');
  const initialTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
  applyTheme(initialTheme);

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('divineTheme', next);
      applyTheme(next);
    });
  }

  console.log('🎨 Interactive homepage loaded!');
});
