
document.addEventListener('DOMContentLoaded', () => {
    // --- Existing setup code from previous steps... ---

    const productListContainer = document.getElementById('product-list-container');

    const renderProducts = () => {
        productListContainer.innerHTML = '';
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-card__image">
                <div class="product-card__info">
                    <h4 class="product-card__title">${product.title}</h4>
                    <p class="product-card__price">Rs ${product.price}</p>
                    <p class="product-card__category">${product.category}</p>
                </div>
                <div class="product-card__actions">
                    <button class="btn btn-sm btn-edit" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger" data-index="${index}">Delete</button>
                </div>
            `;
            productListContainer.appendChild(card);
        });
    };

    productListContainer.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('btn-danger')) { // Delete
            if (confirm('Are you sure you want to delete this product?')) {
                products.splice(index, 1);
                localStorage.setItem('products', JSON.stringify(products));
                renderProducts();
            }
        } else if (e.target.classList.contains('btn-edit')) { // Edit
            const product = products[index];
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-title').value = product.title;
            document.getElementById('product-label').value = product.label;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-edit-index').value = index;
            document.getElementById('product-submit-btn').textContent = 'Update Product';
            productForm.scrollIntoView();
        }
    });

    // --- Rest of the JavaScript code from previous steps... ---

    renderProducts(); // Initial render
});
