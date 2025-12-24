const gate = document.getElementById("story-gate");
const enterBtn = document.getElementById("enter-site");
const productLinks = document.querySelectorAll(".locked");
const productSection = document.querySelector(".locked-section");

enterBtn.addEventListener("click", () => {
  gate.style.display = "none";

  productLinks.forEach(link => {
    link.classList.remove("locked");
    link.style.pointerEvents = "auto";
    link.style.opacity = "1";
  });

  productSection.classList.remove("locked-section");
});


