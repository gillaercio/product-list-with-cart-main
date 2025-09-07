const dessertSection = document.getElementById("desserts");
const cartSection = document.getElementById("cart-section");
const cartQuantity = document.querySelector(".cart-quantity");
const orderConfirmation = document.getElementById("order-confirmation");

let cart = {};
let dessertsData = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("./data.json")
    .then(response => response.json())
    .then(data => {
      data.forEach((dessert, index) => {
        dessert.id = index + 1;
      });
      dessertsData = data;
      renderDesserts(dessertsData);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
});

function renderDesserts(desserts) {
  const dessertsContainer = document.getElementById("desserts");
  dessertsContainer.innerHTML = "";

  desserts.forEach(dessert => {
    const card = document.createElement("div");
    card.classList.add("card__dessert");
    card.innerHTML = `
      <div class="card__product" data-id="${dessert.id}">
        <img class="card__image" src="${dessert.image.mobile}" alt="${dessert.name}">
        <button class="card__button" aria-label="Add ${dessert.name} to cart">
          <img src="assets/images/icon-add-to-cart.svg" alt="Add to cart icon">
          Add to Cart
        </button>
      </div>
      <div class="card__info">
        <span class="name-dessert">${dessert.category}</span>
        <span class="description-dessert">${dessert.name}</span>
        <span class="price-dessert">$${dessert.price.toFixed(2)}</span>
      </div>
    `;
    dessertsContainer.appendChild(card);
  });

  activateAddToCartButtons(desserts);
}

function activateAddToCartButtons(desserts) {
  const buttons = document.querySelectorAll(".card__button");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const card = this.closest(".card__product");
      const id = parseInt(card.dataset.id);
      const dessert = desserts.find(d => d.id === id);

      this.classList.add("selected");
      this.innerHTML = `
        <button class="quantity__button decrement">
          <img src="assets/images/icon-decrement-quantity.svg" alt="Minus icon">
        </button>
        <span class="quantity-display">1</span>
        <button class="quantity__button increment">
          <img src="assets/images/icon-increment-quantity.svg" alt="Plus icon">
        </button>
      `;
      // renderQuantityControls(card, dessert, desserts, 1);
      updateCart(dessert, 1);

      const incrementButton = this.querySelector(".increment");
      const decrementButton = this.querySelector(".decrement");
      const quantityDisplay = this.querySelector(".quantity-display");
      setupQuantityControls(incrementButton, decrementButton, quantityDisplay, dessert);
    });
  });
}

function setupQuantityControls(incrementButton, decrementButton, quantityDisplay, dessert) {
  incrementButton.addEventListener("click", () => {
    cart[dessert.id].quantity++;
    cart[dessert.id].total = cart[dessert.id].quantity * dessert.price;
    quantityDisplay.textContent = cart[dessert.id].quantity;
    // updateCart(dessert, quantity);
    renderCart();
  });

  decrementButton.addEventListener("click", () => {
    if (cart[dessert.id].quantity > 1) {
      cart[dessert.id].quantity--;
      cart[dessert.id].total = cart[dessert.id].quantity * dessert.price;
      quantityDisplay.textContent = cart[dessert.id].quantity;
      renderCart();
      // updateCart(dessert, quantity);
    } else {
      removeFromCart(dessert.id);
      resetCardButton(dessert.id);
    }
  });
}

function resetCardButton(dessertId) {
  const card = document.querySelector(`.card__product[data-id="${dessertId}"]`);
  const button = card.querySelector(".card__button");

  button.classList.remove("selected");
  button.innerHTML = `
    <img src="assets/images/icon-add-to-cart.svg" alt="Add to cart icon">
    Add to Cart
  `;

  const dessert = dessertsData.find(d => d.id === dessertId);

  button.addEventListener("click", function () {
    this.classList.add("selected");
    this.innerHTML = `
      <button class="quantity__button decrement">
        <img src="assets/images/icon-decrement-quantity.svg" alt="Minus icon">
      </button>
      <span class="quantity-display">1</span>
      <button class="quantity__button increment">
        <img src="assets/images/icon-increment-quantity.svg" alt="Plus icon">
      </button>
    `;
    updateCart(dessert, 1);

    const incrementButton = this.querySelector(".increment");
    const decrementButton = this.querySelector(".decrement");
    const quantityDisplay = this.querySelector(".quantity-display");
    
    setupQuantityControls(incrementButton, decrementButton, quantityDisplay, dessert);
  }, { once: true });
}

function updateCart(dessert, quantity) {
  cart[dessert.id] = {
    ...dessert,
    quantity,
    total: quantity * dessert.price
  };
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
  // renderDesserts(dessertsData);
  resetCardButton(id);
}

function renderCart() {
  const cartContainer = document.querySelector(".cart__full");
  const emptyCart = document.querySelector(".cart__empty");
  const quantitySpan = document.querySelector(".cart-quantity");

  const cartItems = Object.values(cart);

  if (cartItems.length === 0) {
    emptyCart.style.display = "flex";
    cartContainer.style.display = "none";
    quantitySpan.textContent = "0";
    return;
  }

  emptyCart.style.display = "none";
  cartContainer.style.display = "flex";
  quantitySpan.textContent = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  cartContainer.innerHTML = cartItems.map(item => `
    <div class="cart__item">
      <div class="cart__product">
        <span class="cart__product-name">${item.name}</span>
        <div class="cart__product-details">
          <span class="cart__product-quantity">${item.quantity}x</span>
          <span class="cart__product-price">@ $${item.price.toFixed(2)}</span>
          <span class="cart__product-total-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <button class="cart__remove-item" onclick="removeFromCart(${item.id})">
        <img src="assets/images/icon-remove-item.svg" alt="Remove item icon" class="cart__remove-item-icon">
      </button>
    </div>
    <hr>
  `).join("") + `
    <div class="cart__totals">
      <span class="cart__totals-label">Order Total</span>
      <span class="cart__totals-price">$${cartItems.reduce((acc, item) => acc + item.total, 0).toFixed(2)}</span>
    </div>
    <div class="cart__carbon-neutral">
      <img src="assets/images/icon-carbon-neutral.svg" alt="Carbon-neutral delivery-icon" class="cart__carbon-icon">
      <p>This is a <span class="cart__carbon-neutral-text">carbon-neutral</span> delivery</p>
    </div>
    <button class="confirm-button" onclick="confirmOrder()">Confirm Order</button>
  `;
}

function confirmOrder() {
  dessertSection.style.display = "none";
  cartSection.style.display = "none";
  orderConfirmation.style.display = "flex";
}

function startNewOrder() {
  orderConfirmation.style.display = "none";
  dessertSection.style.display = "";
  cartSection.style.display = "";
  cart = {};
  renderCart();
}

// confirmButton.addEventListener("click", () => {
//   dessertSection.style.display = "none";
//   cartSection.style.display = "none";
//   orderConfirmation.style.display = "flex";
// });