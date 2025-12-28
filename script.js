// ========================================
// PRODUCT DATA
// ========================================
const products = [
  {
    name: "Almonds",
    price: "₹750 / kg",
    desc: "Premium grade, nutrient-rich almonds.",
    img: "assets/almond.jpg"
  },
  {
    name: "Cashews",
    price: "₹820 / kg",
    desc: "Handpicked cashews with natural sweetness.",
    img: "assets/cashew.jpg"
  },
  {
    name: "Pistachios",
    price: "₹995 / kg",
    desc: "Carefully sourced, vibrant and fresh.",
    img: "assets/pistachio.jpg"
  }
];

// ========================================
// MAIN INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'df_cart';
  const STORY_KEY = 'visitedStory';
  const THEME_KEY = 'theme';

  // ========================================
  // CART UTILITIES WITH ERROR HANDLING
  // ========================================
  
  const getCart = () => {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  };

  const saveCart = (cart) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Error saving cart:', error);
      alert('Unable to save cart. Your browser may have storage disabled.');
      return false;
    }
  };

  const cartCount = () => {
    return getCart().reduce((total, item) => total + (item.qty || 1), 0);
  };

  const setCartCount = () => {
    const el = document.getElementById('cart-count');
    if (el) {
      const count = cartCount();
      el.textContent = count ? `(${count})` : '';
    }
  };

  const addToCart = (item) => {
    const cart = getCart();
    const existingIndex = cart.findIndex(i => i.name === item.name);
    
    if (existingIndex >= 0) {
      cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    
    if (saveCart(cart)) {
      setCartCount();
      showNotification(`${item.name} added to cart!`);
    }
  };

  const updateQty = (name, delta) => {
    const cart = getCart()
      .map(item => {
        if (item.name === name) {
          return { ...item, qty: Math.max(0, (item.qty || 1) + delta) };
        }
        return item;
      })
      .filter(item => item.qty > 0);
    
    saveCart(cart);
    setCartCount();
    renderCart();
  };

  const removeItem = (name) => {
    const cart = getCart().filter(item => item.name !== name);
    saveCart(cart);
    setCartCount();
    renderCart();
  };

  // ========================================
  // WHATSAPP CHECKOUT
  // ========================================
  
  const generateWhatsAppCheckout = () => {
    const cart = getCart();
    if (!cart.length) {
      alert('Your cart is empty!');
      return;
    }

    let message = '🛒 *New Order from Divine Foods*\n\n';
    let total = 0;

    cart.forEach(item => {
      const priceMatch = item.price.match(/\d+/);
      const priceNum = priceMatch ? parseInt(priceMatch[0], 10) : 0;
      const lineTotal = priceNum * (item.qty || 1);
      total += lineTotal;
      
      message += `• ${item.name}\n`;
      message += `  Qty: ${item.qty || 1} × ${item.price}\n`;
      message += `  Subtotal: ₹${lineTotal}\n\n`;
    });

    message += `*Total: ₹${total}*\n\n`;
    message += 'Please confirm this order and provide delivery details.';

    const whatsappNumber = '918489201098';
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
  };

  // ========================================
  // NOTIFICATION HELPER
  // ========================================
  
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 90px;
      right: 20px;
      background: var(--accent);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  // ========================================
  // STORY VISIT TRACKING
  // ========================================
  
  const visitedStory = localStorage.getItem(STORY_KEY) === 'true';
  const path = location.pathname.toLowerCase();
  const isStory = /(^|\/)(story|story\.html)$/.test(path);
  const isProducts = /(^|\/)(products|products\.html)$/.test(path);
  const isCart = /(^|\/)(cart|cart\.html)$/.test(path);

  if (isStory) {
    try {
      localStorage.setItem(STORY_KEY, 'true');
    } catch (e) {
      console.warn('Cannot save story visit state');
    }
  }

  document.querySelectorAll('a').forEach(link => {
    try {
      const url = new URL(link.href, location.href);
      const linkPath = url.pathname.toLowerCase();
      
      if (/(^|\/)(story|story\.html)$/.test(linkPath)) {
        link.addEventListener('click', () => {
          try {
            localStorage.setItem(STORY_KEY, 'true');
          } catch (e) {
            console.warn('Cannot save story visit state');
          }
        });
      }
    } catch (e) {
      // Invalid URL, skip
    }
  });

  if (!visitedStory) {
    document.querySelectorAll('a').forEach(link => {
      try {
        const url = new URL(link.href, location.href);
        const linkPath = url.pathname.toLowerCase();
        
        if (/(^|\/)(products|products\.html)$/.test(linkPath)) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'story.html';
          });
        }
      } catch (e) {
        // Invalid URL, skip
      }
    });

    if (isProducts) {
      window.location.href = 'story.html';
      return;
    }
  }

  // ========================================
  // THEME TOGGLE
  // ========================================
  
  const applyTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('Cannot save theme preference');
    }
  };

  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    applyTheme(storedTheme);
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const updateToggleText = () => {
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    };
    
    updateToggleText();
    
    themeToggle.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      updateToggleText();
    });
  }

  // ========================================
  // TYPEWRITER EFFECT
  // ========================================
  
  const typewriterEl = document.querySelector('.typewrite span');
  if (typewriterEl) {
    const fullText = typewriterEl.getAttribute('data-text') || typewriterEl.textContent.trim();
    typewriterEl.textContent = '';
    let charIndex = 0;
    const typingSpeed = 45;
    
    const typeChar = () => {
      if (charIndex <= fullText.length) {
        typewriterEl.textContent = fullText.slice(0, charIndex);
        charIndex++;
        setTimeout(typeChar, typingSpeed);
      }
    };
    
    typeChar();
  }

  // ========================================
  // PRODUCTS RENDERING
  // ========================================
  
  const productContainer = document.getElementById("product-list");
  const whatsappNumber = "918489201098";

  if (productContainer) {
    let html = '';
    
    products.forEach(product => {
      const whatsappMsg = encodeURIComponent(
        `Hello! I'd like to order ${product.name} at ${product.price}.`
      );
      
      html += `
        <div class="product-card reveal">
          <img 
            src="${product.img}" 
            alt="${product.name}" 
            class="product-img" 
            loading="lazy" 
            decoding="async"
          >
          <div class="product-info">
            <h3>${product.name}</h3>
            <span class="product-price">${product.price}</span>
            <p>${product.desc}</p>
            <a 
              class="btn" 
              href="https://wa.me/${whatsappNumber}?text=${whatsappMsg}" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Order ${product.name} on WhatsApp"
            >
              Order on WhatsApp
            </a>
            <button 
              class="btn" 
              aria-label="Add ${product.name} to cart" 
              data-add="${product.name}"
            >
              Add to Cart
            </button>
          </div>
        </div>
      `;
    });
    
    productContainer.innerHTML = html;
    
    productContainer.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const productName = btn.getAttribute('data-add');
        const product = products.find(p => p.name === productName);
        if (product) {
          addToCart({ name: product.name, price: product.price });
        }
      });
    });
  }

  // ========================================
  // SCROLL REVEAL ANIMATION
  // ========================================
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
  document.querySelectorAll('section > div, .section-title, .footer-col').forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });

  // ========================================
  // OPTIMIZED CURSOR-REACTIVE BEADS
  // Mobile-friendly with performance optimization
  // ========================================
  
  (() => {
    // Only enable on desktop and if user hasn't opted out of animations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Skip on mobile or if user prefers reduced motion
    if (isMobile || prefersReducedMotion) {
      return;
    }

    const hero = document.querySelector('.hero-parallax');
    if (!hero) return;

    // Limit number of beads for performance
    const BEAD_COUNT = 15; // Reduced from potentially hundreds
    const REPEL_DISTANCE = 150;
    const REPEL_STRENGTH = 0.3;
    const RETURN_SPEED = 0.05;
    
    const beads = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId = null;
    let isActive = false;

    // Create beads
    for (let i = 0; i < BEAD_COUNT; i++) {
      const bead = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        originalX: 0,
        originalY: 0,
        vx: 0,
        vy: 0,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3,
        element: null
      };
      
      bead.originalX = bead.x;
      bead.originalY = bead.y;
      
      // Create DOM element
      const el = document.createElement('div');
      el.className = 'cursor-bead';
      el.style.cssText = `
        position: absolute;
        width: ${bead.size}px;
        height: ${bead.size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, ${bead.opacity});
        pointer-events: none;
        will-change: transform;
        box-shadow: 0 0 ${bead.size * 2}px rgba(255, 255, 255, ${bead.opacity * 0.5});
      `;
      
      bead.element = el;
      hero.appendChild(el);
      beads.push(bead);
    }

    // Animation loop
    const animate = () => {
      beads.forEach(bead => {
        // Calculate distance from cursor
        const dx = mouseX - bead.x;
        const dy = mouseY - bead.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repel if cursor is close
        if (distance < REPEL_DISTANCE && distance > 0) {
          const force = (REPEL_DISTANCE - distance) / REPEL_DISTANCE;
          bead.vx -= (dx / distance) * force * REPEL_STRENGTH;
          bead.vy -= (dy / distance) * force * REPEL_STRENGTH;
        }

        // Return to original position
        bead.vx += (bead.originalX - bead.x) * RETURN_SPEED;
        bead.vy += (bead.originalY - bead.y) * RETURN_SPEED;

        // Apply friction
        bead.vx *= 0.95;
        bead.vy *= 0.95;

        // Update position
        bead.x += bead.vx;
        bead.y += bead.vy;

        // Update DOM (use transform for better performance)
        bead.element.style.transform = `translate(${bead.x}px, ${bead.y}px)`;
      });

      if (isActive) {
        rafId = requestAnimationFrame(animate);
      }
    };

    // Throttled mouse move handler
    let moveTimeout;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isActive) {
        isActive = true;
        animate();
      }

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isActive = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }, 2000);
    };

    // Only track mouse on hero section
    hero.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Cleanup on page leave
    window.addEventListener('beforeunload', () => {
      if (rafId) cancelAnimationFrame(rafId);
      beads.forEach(bead => bead.element.remove());
    });
  })();

  // ========================================
  // CART PAGE RENDERING
  // ========================================
  
  const renderCart = () => {
    const cartRoot = document.getElementById('cart-container');
    if (!cartRoot) return;

    const items = getCart();
    
    if (!items.length) {
      cartRoot.innerHTML = `
        <p style="text-align:center;">
          Your cart is empty. <a href="products.html">Browse products</a>.
        </p>
      `;
      document.getElementById('cart-summary').textContent = '';
      
      // Hide checkout button
      const checkoutBtn = document.getElementById('whatsapp-checkout');
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      
      return;
    }

    let subtotal = 0;
    
    const cartHTML = items.map(item => {
      const priceMatch = item.price.match(/\d+/);
      const priceNum = priceMatch ? parseInt(priceMatch[0], 10) : 0;
      const lineTotal = priceNum * (item.qty || 1);
      subtotal += lineTotal;

      return `
        <div class="product-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; margin-bottom:10px; flex-wrap:wrap; gap:12px;">
          <div>
            <strong>${item.name}</strong><br>
            <span class="product-price">${item.price}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <button 
              class="btn" 
              aria-label="Decrease ${item.name} quantity" 
              data-dec="${item.name}" 
              style="padding:6px 12px;"
            >-</button>
            <span style="min-width:30px; text-align:center; font-weight:600;">${item.qty || 1}</span>
            <button 
              class="btn" 
              aria-label="Increase ${item.name} quantity" 
              data-inc="${item.name}" 
              style="padding:6px 12px;"
            >+</button>
            <button 
              class="btn" 
              aria-label="Remove ${item.name} from cart" 
              data-rem="${item.name}" 
              style="padding:6px 12px; background:#b91c1c;"
            >Remove</button>
          </div>
        </div>
      `;
    }).join('');

    cartRoot.innerHTML = cartHTML;
    document.getElementById('cart-summary').textContent = `Subtotal: ₹${subtotal} (approx)`;

    // Show checkout button
    const checkoutBtn = document.getElementById('whatsapp-checkout');
    if (checkoutBtn) {
      checkoutBtn.style.display = 'inline-block';
      checkoutBtn.onclick = generateWhatsAppCheckout;
    }

    // Attach event handlers
    cartRoot.querySelectorAll('[data-dec]').forEach(btn => {
      btn.addEventListener('click', () => {
        updateQty(btn.getAttribute('data-dec'), -1);
      });
    });

    cartRoot.querySelectorAll('[data-inc]').forEach(btn => {
      btn.addEventListener('click', () => {
        updateQty(btn.getAttribute('data-inc'), +1);
      });
    });

    cartRoot.querySelectorAll('[data-rem]').forEach(btn => {
      btn.addEventListener('click', () => {
        removeItem(btn.getAttribute('data-rem'));
      });
    });
  };

  // ========================================
  // INITIALIZATION
  // ========================================
  
  setCartCount();
  if (isCart) {
    renderCart();
  }
});

// ========================================
// ADD CSS FOR NOTIFICATION ANIMATION
// ========================================
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
  .btn-primary {
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%) !important;
    font-weight: 700;
  }
  .btn-primary:hover {
    background: linear-gradient(135deg, #128C7E 0%, #075E54 100%) !important;
  }
`;
document.head.appendChild(style);
