const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 49.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },

  {
    id: 2,
    name: "Smart Watch",
    price: 79.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },

  {
    id: 3,
    name: "Running Shoes",
    price: 59.99,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },

  {
    id: 4,
    name: "Classic Sunglasses",
    price: 29.99,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
  },

  {
    id: 5,
    name: "Face Cream",
    price: 24.99,
    category: "beauty",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8",
  },

  {
    id: 6,
    name: "Perfume",
    price: 39.99,
    category: "beauty",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601",
  },

  {
    id: 7,
    name: "Modern Chair",
    price: 89.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657",
  },

  {
    id: 8,
    name: "Table Lamp",
    price: 34.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
  },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const productsContainer = document.getElementById("productsContainer");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

const cartSidebar = document.getElementById("cartSidebar");

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

const cartCount = document.getElementById("cartCount");

const wishlistCount = document.getElementById("wishlistCount");

const overlay = document.getElementById("overlay");

const toast = document.getElementById("toast");

const themeBtn = document.getElementById("themeBtn");

/* Display Products */

function displayProducts(list = products) {
  productsContainer.innerHTML = "";

  if (list.length === 0) {
    productsContainer.innerHTML = "<h2>No products found.</h2>";

    return;
  }

  list.forEach((product) => {
    const isWishlisted = wishlist.includes(product.id);

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <span class="category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="price">
                    $${product.price.toFixed(2)}
                </div>

                <div class="product-buttons">

                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                    <button
                        class="wishlist ${isWishlisted ? "active" : ""}"
                        onclick="toggleWishlist(${product.id})"
                    >
                        ${isWishlisted ? "❤️" : "♡"}
                    </button>

                </div>

            </div>

        `;

    productsContainer.appendChild(card);
  });
}

/* Add To Cart */

function addToCart(id) {
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: id,
      quantity: 1,
    });
  }

  saveCart();

  showToast("Product added to cart 🛒");
}

/* Save Cart */

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
}

/* Render Cart */

function renderCart() {
  cartItems.innerHTML = "";

  let total = 0;

  let count = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);

    total += product.price * item.quantity;

    count += item.quantity;

    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="cart-item-info">

                <strong>${product.name}</strong>

                <p>
                    $${product.price.toFixed(2)}
                </p>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${product.id}, -1)"
                    >
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${product.id}, 1)"
                    >
                        +
                    </button>

                </div>

                <span
                    class="remove"
                    onclick="removeFromCart(${product.id})"
                >
                    Remove
                </span>

            </div>

        `;

    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);

  cartCount.textContent = count;
}

/* Change Quantity */

function changeQuantity(id, change) {
  const item = cart.find((item) => item.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((item) => item.id !== id);
  }

  saveCart();
}

/* Remove Cart Item */

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  saveCart();

  showToast("Product removed");
}

/* Wishlist */

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((item) => item !== id);

    showToast("Removed from wishlist");
  } else {
    wishlist.push(id);

    showToast("Added to wishlist ❤️");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  wishlistCount.textContent = wishlist.length;

  displayProducts();
}

/* Search */

searchInput.addEventListener("input", filterProducts);

/* Category */

categoryFilter.addEventListener("change", filterProducts);

function filterProducts() {
  const search = searchInput.value.toLowerCase();

  const category = categoryFilter.value;

  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search);

    const matchesCategory = category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filtered);
}

/* Cart Open */

document.getElementById("cartBtn").addEventListener("click", () => {
  cartSidebar.classList.add("open");

  overlay.classList.add("show");
});

/* Cart Close */

function closeCart() {
  cartSidebar.classList.remove("open");

  overlay.classList.remove("show");
}

document.getElementById("closeCart").addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

/* Checkout */

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty!");

    return;
  }

  cart = [];

  saveCart();

  closeCart();

  showToast("Order placed successfully! 🎉");
});

/* Dark Mode */

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const darkMode = document.body.classList.contains("dark");

  localStorage.setItem("darkMode", darkMode);

  themeBtn.textContent = darkMode ? "☀️" : "🌙";
});

/* Load Theme */

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");

  themeBtn.textContent = "☀️";
}

/* Toast */

function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

/* Initial Load */

displayProducts();

renderCart();

wishlistCount.textContent = wishlist.length;
