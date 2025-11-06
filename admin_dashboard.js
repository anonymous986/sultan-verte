
document.addEventListener('DOMContentLoaded', () => {
    // --- General Setup ---
    const navLinks = document.querySelectorAll('.sidebar__nav-item');
    const tabs = document.querySelectorAll('.tab-content');

    // Tab navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');

            if (target) {
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                tabs.forEach(tab => tab.classList.remove('active'));
                link.classList.add('active');
                document.getElementById(target).classList.add('active');
            }
        });
    });

    // --- Data Initialization ---
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let users = JSON.parse(localStorage.getItem('users')) || [
        { name: "John Doe", email: "john.doe@example.com", joined: "2024-01-15" },
        { name: "Jane Smith", email: "jane.smith@example.com", joined: "2024-02-20" }
    ];
    const orders = [
        { id: "#1234", customer: "John Doe", date: "2024-07-28", total: "Rs 3,500", status: "Shipped", items: [{ name: "Back Printed (Porsche)", qty: 1, price: "Rs 1999" }, { name: "Classic White Tee", qty: 1, price: "Rs 1501" }] },
        { id: "#1235", customer: "Jane Smith", date: "2024-07-28", total: "Rs 1,999", status: "Pending", items: [{ name: "Back Printed (Porsche)", qty: 1, price: "Rs 1999" }] }
    ];

    // --- Element References ---
    const productForm = document.getElementById('product-form');
    const productListContainer = document.getElementById('product-list-container');
    const productSubmitBtn = document.getElementById('product-submit-btn');
    const productEditIndex = document.getElementById('product-edit-index');
    
    const userForm = document.getElementById('user-form');
    const userTableBody = document.getElementById('user-table-body');

    const orderTableBody = document.getElementById('order-table-body');
    const orderModal = document.getElementById('order-modal');
    const closeModal = document.querySelector('.close-button');

    // --- Product Management (Card Layout) ---
    const renderProducts = () => {
        productListContainer.innerHTML = '';
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image || './assets/asset1.png'}" alt="${product.title}" class="product-card__image">
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

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = productEditIndex.value;
        const imageFile = document.getElementById('product-image').files[0];

        const productData = {
            // If there is an image, create a URL for it, otherwise use existing or placeholder.
            image: imageFile ? URL.createObjectURL(imageFile) : (index ? products[index].image : './assets/asset1.png'),
            category: document.getElementById('product-category').value,
            title: document.getElementById('product-title').value,
            label: document.getElementById('product-label').value,
            price: document.getElementById('product-price').value,
        };

        if (index) { // Editing
            products[index] = productData;
        } else { // Adding
            products.push(productData);
        }

        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        productForm.reset();
        productSubmitBtn.textContent = 'Add Product';
        productEditIndex.value = '';
    });

    productListContainer.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('btn-danger')) {
            if (confirm('Are you sure you want to delete this product?')) {
                products.splice(index, 1);
                localStorage.setItem('products', JSON.stringify(products));
                renderProducts();
            }
        } else if (e.target.classList.contains('btn-edit')) {
            const product = products[index];
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-title').value = product.title;
            document.getElementById('product-label').value = product.label;
            document.getElementById('product-price').value = product.price;
            productEditIndex.value = index;
            productSubmitBtn.textContent = 'Update Product';
            productForm.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- User Management ---
    const renderUsers = () => {
        userTableBody.innerHTML = '';
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${1000 + index}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.joined}</td>
                <td>
                    <button class="btn btn-sm btn-danger" data-index="${index}">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    };

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            joined: new Date().toISOString().slice(0, 10)
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        renderUsers();
        userForm.reset();
    });

    userTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-danger')) {
            const index = e.target.getAttribute('data-index');
            if (confirm('Are you sure you want to delete this user?')) {
                users.splice(index, 1);
                localStorage.setItem('users', JSON.stringify(users));
                renderUsers();
            }
        }
    });

    // --- Order Management ---
    const renderOrders = () => {
        orderTableBody.innerHTML = '';
        orders.forEach((order, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${order.total}</td>
                <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
                <td><button class="btn btn-sm btn-view" data-index="${index}">View</button></td>
            `;
            orderTableBody.appendChild(row);
        });
    };
    
    orderTableBody.addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-view')) {
            const index = e.target.getAttribute('data-index');
            const order = orders[index];
            
            document.getElementById('modal-order-id').textContent = order.id;
            document.getElementById('modal-customer').textContent = order.customer;
            document.getElementById('modal-date').textContent = order.date;
            document.getElementById('modal-total').textContent = order.total;
            document.getElementById('modal-status').textContent = order.status;
            
            const itemsList = document.getElementById('modal-items');
            itemsList.innerHTML = '';
            order.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} (Qty: ${item.qty}) - ${item.price}`;
                itemsList.appendChild(li);
            });
            
            orderModal.style.display = 'block';
        }
    });

    closeModal.onclick = () => {
        orderModal.style.display = "none";
    }
    window.onclick = (event) => {
        if (event.target == orderModal) {
            orderModal.style.display = "none";
        }
    }

    // --- Initial Render ---
    renderProducts();
    renderUsers();
    renderOrders();
});
