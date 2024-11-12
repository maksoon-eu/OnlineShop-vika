const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Registration successful');
                window.location.href = 'login.html';
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to register');
        }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Login successful');
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to log in');
        }
    });
}

function isInCart(id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.some((product) => product.id === id);
}

const productsContainer = document.getElementById('products');
if (productsContainer) {
    window.onload = async () => {
        try {
            const response = await fetch('/api/products', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const products = await response.json();
            products.forEach((product) => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <p>$${product.price}</p>
                    <button data-product-id="${product.id}" onclick="toggleCartProduct(${product.id}, '${product.name}', ${product.price})">
                        ${isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
                    </button>
                `;
                productsContainer.appendChild(productDiv);
            });
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };
}

function toggleCartProduct(id, name, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex((product) => product.id === id);

    if (productIndex === -1) {
        // Товар не в корзине, добавляем его
        cart.push({ id, name, price });
        alert('Product added to cart');
    } else {
        // Товар уже в корзине, удаляем его
        cart.splice(productIndex, 1);
        alert('Product removed from cart');
    }

    const cartCount = cart.length;
    document.getElementById('cart-count').textContent = cartCount;

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartButton(id); // Обновляем кнопку


    if (window.location.pathname === '/cart.html') {
        renderCart(); // Обновляем отображение корзины
    }
}

function updateCartButton(id) {
    const button = document.querySelector(`button[data-product-id="${id}"]`);
    if (button) {
        button.textContent = isInCart(id) ? 'Remove from Cart' : 'Add to Cart';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Теперь скрипт выполнится, когда DOM полностью загружен
    if (document.getElementById('cart')) {
        renderCart();
    }
});

function renderCart() {
    const cartContainer = document.getElementById('cart');
    const totalContainer = document.getElementById('total');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cartContainer.innerHTML = '';

    cart.forEach((product) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <h4><a href="product.html?id=${product.id}">${product.name}</a></h4>
            <p>$${product.price}</p>
            <button onclick="toggleCartProduct(${product.id}, '${product.name}', ${product.price})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
        total += product.price;
    });

    const cartCount = cart.length;
    document.getElementById('cart-count').textContent = cartCount;
    totalContainer.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
}

const productDetailsContainer = document.getElementById('product-details-container');
if (productDetailsContainer) {
    window.onload = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();

            if (response.ok) {
                productDetailsContainer.innerHTML = `
                    <h2>${product.name}</h2>
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <p>Price: $${product.price}</p>
                    <button data-product-id="${product.id}" onclick="toggleCartProduct(${product.id}, '${product.name}', ${product.price})">
                        ${isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
                    </button>
                `;
            } else {
                productDetailsContainer.innerHTML = `<p>Product not found.</p>`;
            }
        } catch (error) {
            console.error('Error loading product details:', error);
            productDetailsContainer.innerHTML = `<p>Failed to load product details.</p>`;
        }
    };
}

function isProductPage() {
    return window.location.pathname === 'pages/product.html';
}

// Функция для добавления заказа
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const order = {
            name,
            phone,
            products: cart,
            total: cart.reduce((sum, product) => sum + product.price, 0),
        };

        // Уведомление пользователя
        alert('Order placed successfully!');

        // Очистить корзину после оформления
        localStorage.removeItem('cart');

        // Перенаправить на главную страницу
        window.location.href = 'pages/index.html';
    });
}
