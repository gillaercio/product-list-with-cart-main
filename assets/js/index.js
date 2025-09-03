const confirmButton = document.querySelector(".confirm-button");
const dessertSection = document.getElementById("desserts");
const cartSection = document.getElementById("cart-section");
const orderConfirmation = document.getElementById("order-confirmation");

confirmButton.addEventListener("click", () => {
  dessertSection.style.display = "none";
  cartSection.style.display = "none";
  orderConfirmation.style.display = "flex";
});

function startNewOrder() {
  orderConfirmation.style.display = "none";
  dessertSection.style.display = "";
  cartSection.style.display = "";
}