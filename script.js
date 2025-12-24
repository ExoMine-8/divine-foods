// Scroll reveal (ultra-lightweight)
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach(el => observer.observe(el));

// WhatsApp helper
function openWhatsApp() {
  const phone = "918489201098"; // correct format
  const msg = encodeURIComponent(
    "Hello, I'm interested in your products."
  );
  window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
}
