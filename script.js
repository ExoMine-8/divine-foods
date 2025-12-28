// Products data
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
      // Optional: Show confirmation
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
  // NOTIFICATION HELPER
  // ========================================
  
  const showNotification = (message) => {
    // Simple notification (you can enhance this with a modal/toast)
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

  // Mark story as visited
  if (isStory) {
    try {
      localStorage.setItem(STORY_KEY, 'true');
    } catch (e) {
      console.warn('Cannot save story visit state');
    }
  }

  // Track story link clicks
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

  // Redirect to story if not visited and trying to access products
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
    
    // Add to cart button handlers
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
  
  // Add reveal class to additional elements
  document.querySelectorAll('section > div, .section-title, .footer-col').forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });

  // ========================================
  // MOUSE PARALLAX EFFECT (LIGHTWEIGHT)
  // ========================================
  
  (() => {
    let rafId = null;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let idleTimeout = null;

    const animate = () => {
      const ease = 0.12;
      mouseX += (targetX - mouseX) * ease;
      mouseY += (targetY - mouseY) * ease;

      const dx = (mouseX - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (mouseY - window.innerHeight / 2) / (window.innerHeight / 2);

      const style = document.documentElement.style;
      style.setProperty('--beads-pos1', `${-dx * 160}px ${-dy * 160}px`);
      style.setProperty('--beads-pos2', `${-dx * 260}px ${-dy * 260}px`);
      style.setProperty('--beads-pos3', `${-dx * 360}px ${-dy * 360}px`);
      style.setProperty('--beads-pos4', `${-dx * 460}px ${-dy * 460}px`);

      rafId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
      
      if (idleTimeout) {
        clearTimeout(idleTimeout);
      }
      
      idleTimeout = setTimeout(() => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }, 1200);
    };

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      startAnimation();
    }, { passive: true });
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
      return;
    }

    let subtotal = 0;
    
    const cartHTML = items.map(item => {
      const priceMatch = item.price.match(/\d+/);
      const priceNum = priceMatch ? parseInt(priceMatch[0], 10) : 0;
      const lineTotal = priceNum * (item.qty || 1);
      subtotal += lineTotal;

      return `
        <div class="product-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; margin-bottom:10px;">
          <div>
            <strong>${item.name}</strong><br>
            <span class="product-price">${item.price}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button 
              class="btn" 
              aria-label="Decrease ${item.name} quantity" 
              data-dec="${item.name}" 
              style="padding:6px 12px;"
            >-</button>
            <span style="min-width:30px; text-align:center;">${item.qty || 1}</span>
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
              style="padding:6px 12px; background:#b91c1c; margin-left:8px;"
            >Remove</button>
          </div>
        </div>
      `;
    }).join('');

    cartRoot.innerHTML = cartHTML;
    document.getElementById('cart-summary').textContent = `Subtotal: ₹${subtotal} (approx)`;

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

// Add CSS for notification animation
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
`;
document.head.appendChild(style);
