const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

function renderCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartDiv = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');

  if (cart.length === 0) {
    emptyCartDiv.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }

  emptyCartDiv.style.display = 'none';
  cartContent.style.display = 'grid';
  cartItemsContainer.innerHTML = '';

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item__image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="cart-item__details">
        <h4>${item.title}</h4>
        <p>${item.label}</p>
        <p class="cart-item__price">$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item__actions">
        <div class="quantity-controls">
          <button class="quantity-btn decrease-btn" data-id="${item.id}">
            <i class="ri-subtract-line"></i>
          </button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn increase-btn" data-id="${item.id}">
            <i class="ri-add-line"></i>
          </button>
        </div>
        <button class="remove-btn" data-id="${item.id}">
          <i class="ri-delete-bin-line"></i> Remove
        </button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  attachCartActionListeners();
  updateCartSummary();
}

function attachCartActionListeners() {
  document.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      updateQuantity(id, 1);
    });
  });

  document.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      updateQuantity(id, -1);
    });
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      removeFromCart(id);
    });
  });
}

function updateQuantity(id, change) {
  const cart = getCart();
  const item = cart.find(item => item.id === id);
  
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart(cart);
      renderCart();
    }
  }
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
  showToast('Item removed from cart');
}

function updateCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();
  
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      showToast('Checkout feature coming soon!');
    });
  }
});
