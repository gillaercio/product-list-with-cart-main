const dessertSection = document.getElementById("desserts");
const cartSection = document.getElementById("cart-section");
const cardImage = document.querySelector(".card__image");
const cardButton = document.querySelector(".card__button");
const cardButtonImage = document.querySelector(".card__button img");
const cartQuantity = document.querySelector(".cart-quantity");
const confirmButton = document.querySelector(".confirm-button");
const orderConfirmation = document.getElementById("order-confirmation");

let quantity = 1;

function addToCart() {
  const container = document.querySelector(".card__product");

  // cardButtonImage.style.display = "none";
  cardButtonImage.style.visibility = "hidden";
  container.innerHTML = `
    <div class="quantity__control">
      <button class="quantity__button" onclick="decreaseQuantity()">
        <img src="assets/images/icon-decrement-quantity.svg" alt="Minus icon">
      </button>
      <span class="quantity-display" id="quantity">${quantity}</span>
      <button class="quantity__button" onclick="increaseQuantity()">
        <img src="assets/images/icon-increment-quantity.svg" alt="Plus icon">
      </button>
    </div>
  `;
}

function increaseQuantity() {
  quantity++;
  // cardButtonImage.style.display = "none";
  updateQuantityDisplay();
}

function decreaseQuantity() {
  if (quantity > 1) {
    quantity--;
  } else {
    // cardButtonImage.style.display = "none";
    resetToAddButton();
  }
  updateQuantityDisplay();
}

function updateQuantityDisplay() {
  document.getElementById("quantity").textContent = quantity;
}

function resetToAddButton() {
  const container = document.querySelectorAll(".card__product");
  quantity = 1;
  container.innerHTML = `
    <button class="card__button" aria-label="Add Waffle with Berries to cart" onclick="addToCart()">
      <img src="assets/images/icon-add-to-cart.svg" alt="Add to cart icon">
      Add to Cart
    </button>
  `;
}

cardButton.addEventListener("click", () => {
  cardImage.style.borderColor = "var(--Red)";
});

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