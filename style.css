/* ---------- ROOT VARIABLES ---------- */
:root {
  --bg-main: #f6f7f4;
  --bg-accent: #e3ede6;
  --text-main: #1f2d27;
  --accent: #2f7a57;

  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --anim-fast: 200ms;
  --anim-medium: 350ms;
}

/* ---------- BASE ---------- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg-main);
  color: var(--text-main);
  line-height: 1.7;
}

/* ---------- NAVBAR ---------- */
.navbar {
  position: sticky;
  top: 0;
  height: 80px;
  background: rgba(246, 247, 244, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6%;
  z-index: 100;
}

.logo {
  font-size: 1.2rem;
  letter-spacing: 0.08em;
}

nav a {
  margin-left: 24px;
  text-decoration: none;
  color: var(--text-main);
  font-weight: 500;
}

/* ---------- HERO SECTIONS ---------- */
.hero {
  min-height: calc(100vh - 80px);
  padding: 8vh 6%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-primary {
  background: linear-gradient(
      rgba(246,247,244,0.92),
      rgba(246,247,244,0.92)
    ),
    url("https://images.unsplash.com/photo-1604909052743-94e838986d24");
  background-size: cover;
}

.hero-secondary,
.hero-tertiary {
  background: var(--bg-accent);
}

.hero h2,
.hero h3 {
  max-width: 720px;
}

.hero p {
  max-width: 720px;
  margin-top: 16px;
}

/* ---------- BUTTONS ---------- */
.btn,
.btn-outline {
  display: inline-block;
  margin-top: 32px;
  padding: 12px 28px;
  border-radius: 24px;
  text-decoration: none;
  font-weight: 500;
  transition: transform var(--anim-fast) var(--ease-standard),
              box-shadow var(--anim-fast) var(--ease-standard),
              background-color var(--anim-fast) var(--ease-standard),
              color var(--anim-fast) var(--ease-standard);
}

.btn {
  background: var(--accent);
  color: white;
}

.btn-outline {
  border: 1px solid var(--accent);
  color: var(--accent);
}

.btn:hover,
.btn-outline:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

/* ---------- PRODUCTS ---------- */
.products {
  padding: 10vh 6%;
  background: #fff;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

.product-card {
  background: #fff;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.04);
  transition: transform var(--anim-medium) var(--ease-standard),
              box-shadow var(--anim-medium) var(--ease-standard);
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 40px rgba(0,0,0,0.08);
}

.price {
  font-weight: 600;
  margin-top: 8px;
}

/* ---------- FOOTER ---------- */
footer {
  padding: 40px 6%;
  background: var(--bg-accent);
  font-size: 0.9rem;
}

/* ---------- REVEAL ANIMATION ---------- */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--anim-medium) var(--ease-standard),
              transform var(--anim-medium) var(--ease-standard);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ---------- ACCESSIBILITY ---------- */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* ---------- MOBILE ---------- */
@media (max-width: 768px) {
  nav a {
    margin-left: 16px;
  }

  .hero {
    padding: 10vh 8%;
  }
}
