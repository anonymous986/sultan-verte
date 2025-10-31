document.addEventListener('DOMContentLoaded', () => {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    window.location.href = 'products.html';
    return;
  }
  
  // Load product details
  const product = findProductById(productId);
  
  if (!product) {
    window.location.href = 'products.html';
    return;
  }
  
  // Update page content
  document.getElementById('product-image').src = product.image;
  document.getElementById('product-image').alt = product.title;
  document.getElementById('product-title').textContent = product.title;
  document.getElementById('product-label').textContent = product.label;
  document.getElementById('product-price').textContent = `Rs ${product.price.toFixed(2)}`;
  document.getElementById('breadcrumb-product').textContent = product.title;
  
  // Update description if available
  if (product.description) {
    document.getElementById('product-description').textContent = product.description;
  }
  
  // Update page title
  document.title = `${product.title} | Sultan Verite`;
  
  // Quantity controls
  const quantityInput = document.getElementById('quantity');
  const decreaseBtn = document.getElementById('decrease-qty');
  const increaseBtn = document.getElementById('increase-qty');
  const addToCartBtn = document.getElementById('add-to-cart-main');
  
  decreaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });
  
  increaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
  
  // Add to cart functionality
  addToCartBtn.addEventListener('click', () => {
    // Validate and sanitize quantity input
    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
      quantityInput.value = 1;
    }
    
    // Add to cart with specified quantity
    addToCart(product, quantity);
    
    // Show success feedback
    addToCartBtn.innerHTML = '<i class="ri-check-line"></i> Added to Cart!';
    addToCartBtn.classList.add('success');
    
    setTimeout(() => {
      addToCartBtn.innerHTML = '<i class="ri-shopping-cart-line"></i> Add to Cart';
      addToCartBtn.classList.remove('success');
    }, 2000);
  });
  
  // Update cart count
  updateCartCount();
});
