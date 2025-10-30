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

let currentImageData = null;

const productImageInput = document.getElementById('product-image');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const removeImageBtn = document.getElementById('remove-image');
const imageUploadLabel = document.querySelector('.image-upload-label');

productImageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      currentImageData = event.target.result;
      previewImg.src = currentImageData;
      imagePreview.style.display = 'block';
      imageUploadLabel.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

removeImageBtn.addEventListener('click', () => {
  currentImageData = null;
  productImageInput.value = '';
  imagePreview.style.display = 'none';
  imageUploadLabel.style.display = 'flex';
});

const productCategorySelect = document.getElementById('product-category');
const descriptionGroup = document.getElementById('description-group');

productCategorySelect.addEventListener('change', () => {
  if (productCategorySelect.value === 'bestSelling') {
    descriptionGroup.style.display = 'block';
  } else {
    descriptionGroup.style.display = 'none';
  }
});

const productForm = document.getElementById('product-form');

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const category = document.getElementById('product-category').value;
  const title = document.getElementById('product-title').value;
  const label = document.getElementById('product-label').value;
  const description = document.getElementById('product-description').value;
  const price = parseFloat(document.getElementById('product-price').value);
  
  if (!currentImageData) {
    showToast('Please upload an image');
    return;
  }

  const newProduct = {
    id: 'custom_' + Date.now(),
    image: currentImageData,
    title: title,
    label: label,
    price: price
  };

  if (category === 'bestSelling') {
    newProduct.description = description || 'Featured product';
  }

  let customProducts = localStorage.getItem('customProducts');
  customProducts = customProducts ? JSON.parse(customProducts) : { arrivals: [], favorites: [], allProducts: [] };

  if (category === 'arrivals') {
    customProducts.arrivals.push(newProduct);
  } else if (category === 'favorites') {
    customProducts.favorites.push(newProduct);
  } else if (category === 'bestSelling') {
    customProducts.bestSelling = newProduct;
  } else if (category === 'allProducts') {
    if (!customProducts.allProducts) {
      customProducts.allProducts = [];
    }
    customProducts.allProducts.push(newProduct);
  }

  localStorage.setItem('customProducts', JSON.stringify(customProducts));

  showToast('Product added successfully!');
  productForm.reset();
  currentImageData = null;
  imagePreview.style.display = 'none';
  imageUploadLabel.style.display = 'flex';
  descriptionGroup.style.display = 'none';

  renderCustomProducts();
});

function renderCustomProducts() {
  const customProductsList = document.getElementById('custom-products-list');
  const clearAllBtn = document.getElementById('clear-all-btn');
  
  let customProducts = localStorage.getItem('customProducts');
  customProducts = customProducts ? JSON.parse(customProducts) : { arrivals: [], favorites: [], allProducts: [] };

  const allProducts = [
    ...customProducts.arrivals.map(p => ({ ...p, category: 'arrivals' })),
    ...customProducts.favorites.map(p => ({ ...p, category: 'favorites' })),
    ...(customProducts.allProducts || []).map(p => ({ ...p, category: 'allProducts' }))
  ];

  if (customProducts.bestSelling) {
    allProducts.push({ ...customProducts.bestSelling, category: 'bestSelling' });
  }

  if (allProducts.length === 0) {
    customProductsList.innerHTML = '<p class="no-products">No custom products added yet.</p>';
    clearAllBtn.style.display = 'none';
    return;
  }

  clearAllBtn.style.display = 'block';
  customProductsList.innerHTML = '';

  allProducts.forEach(product => {
    const categoryNames = {
      'arrivals': 'New Arrivals',
      'favorites': 'Favourites',
      'bestSelling': 'Best Selling',
      'allProducts': 'Products Page'
    };
    
    const productItem = document.createElement('div');
    productItem.className = 'custom-product-item';
    productItem.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="custom-product-info">
        <h4>${product.title}</h4>
        <p>${product.label}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <span class="category-badge">${categoryNames[product.category]}</span>
      </div>
      <button class="delete-product-btn" data-id="${product.id}" data-category="${product.category}">
        Delete
      </button>
    `;
    customProductsList.appendChild(productItem);
  });

  document.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const category = btn.getAttribute('data-category');
      deleteProduct(id, category);
    });
  });
}

function deleteProduct(id, category) {
  let customProducts = localStorage.getItem('customProducts');
  customProducts = customProducts ? JSON.parse(customProducts) : { arrivals: [], favorites: [], allProducts: [] };

  if (category === 'arrivals') {
    customProducts.arrivals = customProducts.arrivals.filter(p => p.id !== id);
  } else if (category === 'favorites') {
    customProducts.favorites = customProducts.favorites.filter(p => p.id !== id);
  } else if (category === 'bestSelling') {
    delete customProducts.bestSelling;
  } else if (category === 'allProducts') {
    customProducts.allProducts = customProducts.allProducts.filter(p => p.id !== id);
  }

  localStorage.setItem('customProducts', JSON.stringify(customProducts));
  showToast('Product deleted successfully!');
  renderCustomProducts();
}

document.getElementById('clear-all-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all custom products? This cannot be undone.')) {
    localStorage.setItem('customProducts', JSON.stringify({ arrivals: [], favorites: [], allProducts: [] }));
    showToast('All custom products cleared!');
    renderCustomProducts();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderCustomProducts();
  updateCartCount();
});
