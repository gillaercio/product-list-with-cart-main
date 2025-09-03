const confirmButton = document.querySelector(".confirm-button");
const dessertSection = document.getElementById("desserts");
const cartSection = document.getElementById("cart-section");
const orderConfirmation = document.getElementById("order-confirmation");

function showSection(sectionToShow) {
  [dessertSection, cartSection, orderConfirmation].forEach(section => {
    section.classList.remove("active");
  });

  sectionToShow.classList.add("active");
}

// window.addEventListener("DOMContentLoaded", () => {
//   showSection(dessertSection);
// });

confirmButton.addEventListener("click", () => {
  // dessertSection.style.display = "none";
  // cartSection.style.display = "none";
  // orderConfirmation.style.display = "flex";
  showSection(orderConfirmation);
});

function startNewOrder() {
  // orderConfirmation.style.display = "none";
  // dessertSection.style.display = "";
  // cartSection.style.display = "";
  cart = [];
  updateCart();
  showSection(dessertSection);
}