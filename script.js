// Product List
const products = [
    { id: 1, name: "Hammer", price: 15.99 },
    { id: 2, name: "Screwdriver Set", price: 22.50 },
    { id: 3, name: "Electric Drill", price: 89.99 },
    { id: 4, name: "Wrench Set", price: 35.00 },
    { id: 5, name: "Pliers", price: 10.50 },
    { id: 6, name: "Tape Measure", price: 8.99 },
    { id: 7, name: "Cordless Saw", price: 120.00 },
    { id: 8, name: "Level Tool", price: 12.75 },
    { id: 9, name: "Chisel Set", price: 28.40 },
    { id: 10, name: "Workbench", price: 150.00 },
    { id: 11, name: "Angle Grinder", price: 79.99 },
    { id: 12, name: "Ladder", price: 90.00 },
    { id: 13, name: "Bolt Cutter", price: 45.60 },
    { id: 14, name: "Wire Stripper", price: 14.25 },
    { id: 15, name: "Safety Gloves", price: 5.99 },
    { id: 16, name: "Welding Mask", price: 49.99 },
    { id: 17, name: "Nail Gun", price: 110.00 },
    { id: 18, name: "Sledgehammer", price: 37.99 },
    { id: 19, name: "Work Light", price: 27.50 },
    { id: 20, name: "Air Compressor", price: 175.00 },
];

// List of Featured Products (Pick Any 5)
const featuredProductIds = [1, 3, 7, 10, 15];

function loadFeaturedProducts() {
    const container = document.getElementById("featured-products");
    if (!container) return; // Ensure it only runs on the home page

    featuredProductIds.forEach(id => {
        let product = products.find(p => p.id === id);
        if (product) {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");
            productDiv.innerHTML = `
                <h2>${product.name}</h2>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            container.appendChild(productDiv);
        }
    });

}

// Load Products into Products Page
function loadProducts() {
    const container = document.getElementById("product-container");
    if (!container) return; // Ensure it runs only on the products page

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(productDiv);
    });
}

// Cart Functions
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
    let cart = getCart();
    let product = products.find(p => p.id === productId);
    
    let existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(`${product.name} added to cart!`);

    // Push add_to_cart event to dataLayer
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
            items: [{
                item_id: product.id,
                item_name: product.name,
                price: product.price,
                quantity: 1
            }]
        }
    });
}


// Load Cart Items on Cart Page

function loadCartItems() {
    const cartContainer = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("cart-total");
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let cart = getCart();
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
            <p>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(itemDiv);
    });

    totalDisplay.textContent = total.toFixed(2);
    document.getElementById("checkout-btn").disabled = cart.length === 0;

    // Push view_cart event to dataLayer
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        event: "view_cart",
        ecommerce: {
            items: cart.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        }
    });
}

// Remove Item from Cart
// function removeFromCart(productId) {
//     let cart = getCart().filter(item => item.id !== productId);
//     saveCart(cart);
//     loadCartItems();
// }
function removeFromCart(productId) {
    let cart = getCart();
    let item = cart.find(i => i.id === productId);
    if (!item) return;

    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    loadCartItems();

    // Push remove_from_cart event to dataLayer
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        event: "remove_from_cart",
        ecommerce: {
            items: [{
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }]
        }
    });
}

function clearCart() {
    localStorage.removeItem("cart"); // Clear cart data from localStorage
    const cartContainer = document.getElementById("cart-items"); // Correct container ID
    const totalDisplay = document.getElementById("cart-total");

    if (cartContainer) {
        cartContainer.innerHTML = "<p>Your cart is now empty.</p>"; // Update UI
    }

    if (totalDisplay) {
        totalDisplay.textContent = "0.00"; // Reset total amount
    }

    document.getElementById("checkout-btn").disabled = true; // Disable checkout button
}


// Checkout Page
function loadCheckoutItems() {
    const checkoutContainer = document.getElementById("checkout-items");
    const totalDisplay = document.getElementById("checkout-total");
    if (!checkoutContainer) return;

    checkoutContainer.innerHTML = "";
    let cart = getCart();
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("checkout-item");
        itemDiv.innerHTML = `
            <p>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</p>
        `;
        checkoutContainer.appendChild(itemDiv);
    });

    totalDisplay.textContent = total.toFixed(2);
    document.getElementById("buy-now").disabled = cart.length === 0;

    // **GA4 eCommerce Tracking - Begin Checkout**
    dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
            items: cart.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        }
    });
}

// Place Order
function placeOrder() {
    let cart = getCart();
    if (cart.length === 0) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let orderDate = new Date().toLocaleString();
    let totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    orders.push({ date: orderDate, total: totalAmount.toFixed(2), items: cart });
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart"); // Clear cart after purchase
    window.location.href = "confirmation.html";

    // **GA4 eCommerce Tracking - Purchase**
    dataLayer.push({
        event: "purchase",
        ecommerce: {
            transaction_id: `ORD-${Date.now()}`,
            value: totalAmount.toFixed(2),
            currency: "USD",
            items: cart.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        }
    });
}

// Load Order History on Orders Page
function loadOrders() {
    const ordersContainer = document.getElementById("order-history");
    if (!ordersContainer) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    ordersContainer.innerHTML = "";

    if (orders.length === 0) {
        ordersContainer.innerHTML = "<p>No past orders found.</p>";
        return;
    }

    orders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order");
        orderDiv.innerHTML = `
            <h3>Order Date: ${order.date}</h3>
            <p>Total: $${order.total}</p>
            <ul>
                ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>`).join("")}
            </ul>
        `;
        ordersContainer.appendChild(orderDiv);
    });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedProducts();
    loadProducts();
    loadCartItems();
    loadCheckoutItems();
    loadOrders();
});
