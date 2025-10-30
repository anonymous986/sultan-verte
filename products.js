const defaultProducts = {
  arrivals: [
    {
      id: 'arr1',
      image: 'assets/asset1.png',
      title: 'Drop Shoulder T-shirts',
      label: 'New Collection',
      price: 29.99
    },
    {
      id: 'arr2',
      image: 'assets/asset5.png',
      title: 'Back Printed',
      label: 'Limited Edition',
      price: 34.99
    },
    {
      id: 'arr3',
      image: 'assets/asset6.png',
      title: 'Back/Front Printed',
      label: 'Premium Design',
      price: 39.99
    }
  ],
  favorites: [
    {
      id: 'fav1',
      image: 'assets/asset7.png',
      title: 'Trending on Instagram',
      label: 'Hot Item',
      price: 32.99
    },
    {
      id: 'fav2',
      image: 'assets/asset2.png',
      title: 'All under $40',
      label: 'Best Value',
      price: 24.99
    }
  ],
  bestSelling: {
    id: 'best1',
    image: 'assets/asset2.png',
    title: 'Back Printed (Porsche)',
    description: 'Our signature back printed t-shirt featuring an exclusive Porsche design. Premium quality cotton with vibrant prints.',
    price: 44.99
  },
  allProducts: []
};

function loadProducts() {
  const storedProducts = localStorage.getItem('customProducts');
  if (storedProducts) {
    const customProducts = JSON.parse(storedProducts);
    return {
      arrivals: [...defaultProducts.arrivals, ...(customProducts.arrivals || [])],
      favorites: [...defaultProducts.favorites, ...(customProducts.favorites || [])],
      bestSelling: customProducts.bestSelling || defaultProducts.bestSelling,
      allProducts: [...defaultProducts.allProducts, ...(customProducts.allProducts || [])]
    };
  }
  return defaultProducts;
}

function getBestSelling() {
  const products = loadProducts();
  return products.bestSelling;
}

function setBestSelling(product) {
  let customProducts = localStorage.getItem('customProducts');
  customProducts = customProducts ? JSON.parse(customProducts) : { arrivals: [], favorites: [], allProducts: [] };
  customProducts.bestSelling = product;
  localStorage.setItem('customProducts', JSON.stringify(customProducts));
}

function saveCustomProducts(products) {
  localStorage.setItem('customProducts', JSON.stringify(products));
}

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  saveCart(cart);
  showToast('Added to Cart!');
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function renderArrivalCards() {
  const products = loadProducts();
  const arrivalGrid = document.querySelector('.arrival__grid');
  
  if (!arrivalGrid) return;
  
  arrivalGrid.innerHTML = '';
  
  products.arrivals.forEach(product => {
    const card = document.createElement('div');
    card.className = 'arrival__card';
    card.innerHTML = `
      <div class="arrival__image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="arrival__content">
        <div>
          <h4>${product.title}</h4>
          <p class="product__label">${product.label}</p>
          <p class="product__price">$${product.price.toFixed(2)}</p>
        </div>
        <div class="card__actions">
          <button class="add-to-cart-btn" data-product-id="${product.id}">
            <i class="ri-shopping-cart-line"></i>
          </button>
        </div>
      </div>
    `;
    arrivalGrid.appendChild(card);
  });

  attachCartListeners();
}

function renderFavoriteCards() {
  const products = loadProducts();
  const favoriteGrid = document.querySelector('.favourite__grid');
  
  if (!favoriteGrid) return;
  
  favoriteGrid.innerHTML = '';
  
  products.favorites.forEach(product => {
    const card = document.createElement('div');
    card.className = 'favourite__card';
    card.innerHTML = `
      <div class="favourite__image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="favourite__content">
        <div>
          <h4>${product.title}</h4>
          <p class="product__label">${product.label}</p>
          <p class="product__price">$${product.price.toFixed(2)}</p>
        </div>
        <div class="card__actions">
          <button class="add-to-cart-btn" data-product-id="${product.id}">
            <i class="ri-shopping-cart-line"></i>
          </button>
        </div>
      </div>
    `;
    favoriteGrid.appendChild(card);
  });

  attachCartListeners();
}

function attachCartListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = button.getAttribute('data-product-id');
      const product = findProductById(productId);
      if (product) {
        addToCart(product);
        button.classList.add('added');
        setTimeout(() => button.classList.remove('added'), 600);
      }
    });
  });
}

function findProductById(id) {
  const products = loadProducts();
  let product = products.arrivals.find(p => p.id === id);
  if (!product) {
    product = products.favorites.find(p => p.id === id);
  }
  if (!product) {
    product = products.allProducts.find(p => p.id === id);
  }
  if (!product && products.bestSelling && products.bestSelling.id === id) {
    product = products.bestSelling;
  }
  return product;
}

function renderBestSelling() {
  const bestSelling = getBestSelling();
  const saleImage = document.querySelector('.sale__image img');
  const saleTitle = document.querySelector('.sale__content h2 span');
  const saleDescription = document.querySelector('.sale__content p');
  const salePrice = document.querySelector('.sale__price');
  const saleBtn = document.querySelector('.sale__btn .btn');
  
  if (saleImage && bestSelling) {
    saleImage.src = bestSelling.image;
    saleImage.alt = bestSelling.title;
  }
  
  if (saleTitle && bestSelling) {
    saleTitle.textContent = bestSelling.title.toUpperCase();
  }
  
  if (saleDescription && bestSelling) {
    saleDescription.textContent = bestSelling.description;
  }
  
  if (salePrice && bestSelling) {
    salePrice.textContent = `$${bestSelling.price.toFixed(2)}`;
  }
  
  if (saleBtn && bestSelling) {
    saleBtn.setAttribute('data-product-id', bestSelling.id);
    saleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(bestSelling);
      saleBtn.classList.add('added');
      setTimeout(() => saleBtn.classList.remove('added'), 600);
    });
  }
}

function renderAllProducts() {
  const products = loadProducts();
  const productsGrid = document.querySelector('.products__grid');
  
  if (!productsGrid) return;
  
  productsGrid.innerHTML = '';
  
  const allItems = [
    ...products.arrivals,
    ...products.favorites,
    ...products.allProducts
  ];
  
  if (allItems.length === 0) {
    productsGrid.innerHTML = '<p class="no-products" style="text-align: center; padding: 3rem; color: var(--text-light);">No products available yet.</p>';
    return;
  }
  
  allItems.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product__card';
    card.innerHTML = `
      <div class="product__image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product__content">
        <h4>${product.title}</h4>
        <p class="product__label">${product.label}</p>
        <p class="product__price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart-btn" data-product-id="${product.id}">
          <i class="ri-shopping-cart-line"></i> Add to Cart
        </button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  attachCartListeners();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    renderArrivalCards();
    renderFavoriteCards();
    renderBestSelling();
    renderAllProducts();
    updateCartCount();
  });
}
