const dessertSection = document.getElementById("desserts");
const cartSection = document.getElementById("cart-section");
// const cardImage = document.querySelector(".card__image");
// const cardButton = document.querySelector(".card__button");
// const cardButtonImage = document.querySelector(".card__button img");
const cartQuantity = document.querySelector(".cart-quantity");
const confirmButton = document.querySelector(".confirm-button");
const orderConfirmation = document.getElementById("order-confirmation");

document.addEventListener("DOMContentLoaded", () => {
  fetch("./data.json")
    .then(response => response.json())
    .then(data => {
      data.forEach((dessert, index) => {
        dessert.id = index + 1;
      });
      renderDesserts(data);
    })
    .catch(error => {
      console.error("Erro ao carregar os dados:", error);
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
      let quantity = 1;

      card.innerHTML = `
        <img class="card__image" src="${dessert.image.mobile}" alt="${dessert.name}">
        <div class="quality__control">
          <button class="quantity__button decrement">
            <img src="assets/images/icon-decrement-quantity.svg" alt="Minus icon">
          </button>
          <span class="quantity-display">${quantity}</span>
          <button class="quantity__button increment">
            <img src="assets/images/icon-increment-quantity.svg" alt="Plus icon">
          </button>
        </div>
      `;

      const decrementButton = card.querySelector(".decrement");
      const incrementButton = card.querySelector(".increment");
      const quantityDisplay = card.querySelector(".quantity-display");

      incrementButton.addEventListener("click", () => {
        quantity++;
        quantityDisplay.textContent = quantity;
        updateCart(dessert, quantity);
      });

      decrementButton.addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          quantityDisplay.textContent = quantity;
          updateCart(dessert, quantity);
        } else {
          card.innerHTML = `
            <img class="card__image" src="${dessert.image.mobile}" alt="${dessert.name}">
            <button class="card__button" aria-label="Add ${dessert.name} to cart">
              <img src="assets/images/icon-add-to-cart.svg" alt="Add to cart icon">
              Add to Cart
            </button>
          `;

          const newButton = card.querySelector(".card__button");
          newButton.addEventListener("click", () => {
            let quantity = 1;

            card.innerHTML = `
              <img class="card__image" src="${dessert.image.mobile}" alt="${dessert.name}">
              <div class="quality__control">
                <button class="quantity__button decrement">
                  <img src="assets/images/icon-decrement-quantity.svg" alt="Minus icon">
                </button>
                <span class="quantity-display">${quantity}</span>
                <button class="quantity__button increment">
                  <img src="assets/images/icon-increment-quantity.svg" alt="Plus icon">
                </button>
              </div>
            `;
          });

          // activateAddToCartButtons(desserts);
          removeFromCart(dessert.id);
        }
      });

      updateCart(dessert, quantity);
    });
  })
}

let cart = {};

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

confirmButton.addEventListener("click", () => {
  dessertSection.style.display = "none";
  cartSection.style.display = "none";
  orderConfirmation.style.display = "flex";
});

function confirmOrder() {
  dessertSection.style.display = "none";
  cartSection.style.display = "none";
  orderConfirmation.style.display = "flex";
}

function startNewOrder() {
  orderConfirmation.style.display = "none";
  dessertSection.style.display = "";
  cartSection.style.display = "";
}