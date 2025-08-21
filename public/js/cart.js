// Cart Functions for Khon Armory
// ===============================

// Sample cart data

let cartItems = [];
const getSession = async () => {
  const session = await fetch("/session-status");
  const sessionData = await session.json();
  const user = sessionData.user;

  return user;
};

const getCartItems = async () => {
  const user = await getSession();
  const getItem = await fetch("/cart/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: user.id,
    }),
  });
  const data = await getItem.json();
  cartItems = data.products;
};

async function addToCart(u_id) {
  const res = await fetch("/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 1, productId }), // userId from session
  });

  const data = await res.json();
  if (data.success) {
    alert("Added to cart!");
  } else {
    alert("Error adding item.");
  }
}

async function loadCart(items) {
  //   const res = await fetch("/cart");
  //   const items = await res.json();

  const container = document.getElementById("cartItems");
  container.innerHTML = ""; // clear before rendering

  items.forEach((item) => {
    const total = item.qty * item.price;

    const html = `
      <div class="bg-gray-800 rounded-lg p-6 flex items-center space-x-6 transform hover:scale-105 transition-transform">
        <div class="flex-shrink-0">
          <img src="${item.img || "https://via.placeholder.com/100"}"
               alt="${item.name}"
               class="w-20 h-20 rounded-lg object-cover">
        </div>
        
        <div class="flex-1">
          <h3 class="text-lg font-bold mb-2">${item.name}</h3>
          <p class="text-gray-400 text-sm mb-2">${item.description || ""}</p>
          <div class="flex items-center space-x-2">
            <span class="text-red-500 font-bold text-xl">฿${item.price.toLocaleString()}</span>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button onclick="changeQuantityOld(${item.id}, -1)" 
                  class="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
            <i class="fas fa-minus text-sm"></i>
          </button>
          <span class="font-bold text-lg w-8 text-center" id="qty-${item.id}">${
      item.qty
    }</span>
          <button onclick="changeQuantityOld(${item.id}, 1)" 
                  class="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
            <i class="fas fa-plus text-sm"></i>
          </button>
        </div>

        <div class="text-right">
          <div class="text-xl font-bold text-red-500 mb-2">฿${total.toLocaleString()}</div>
          <button onclick="removeItem(${item.id})" 
                  class="text-red-400 hover:text-red-300 transition-colors">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", html);
  });
}

// quantity handler
async function changeQuantity(product_id, delta) {
  await fetch(`/cart/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, delta }),
  });
  loadCart();
}

// remove handler
async function removeItem(product_id) {
  await fetch(`/cart/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id }),
  });
  loadCart();
}

// Discount settings
const DISCOUNT_CODES = {
  TACTICAL05: { rate: 0.05, description: "ลด 5%" },
  MILITARY10: { rate: 0.1, description: "ลด 10%" },
  NEWBIE20: { rate: 0.2, description: "ลด 20%" },
};

let appliedDiscount = { code: "TACTICAL05", rate: 0.05 }; // Pre-applied discount

// Change quantity function
async function changeQuantityOld(itemId, change) {
  const item = cartItems.find((item) => item.id === itemId);
  if (!item) return;

  const newQuantity = item.qty + change;

  // Validate quantity limits
  if (newQuantity < 1) {
    showErrorMessage("จำนวนสินค้าต้องมากกว่า 0");
    return;
  }
  if (newQuantity > 99) {
    showErrorMessage("จำนวนสินค้าสูงสุด 99 ชิ้น");
    return;
  }

  // Update backend
  await fetch(`/cart/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: item.id, u_id: item.u_id, change }),
  });

  // Update local cart
  item.qty = newQuantity;

  // Update quantity in DOM
  const qtyEl = document.getElementById(`qty-${itemId}`);
  if (qtyEl) qtyEl.textContent = item.qty;

  // Update item total price
  const itemTotalEl = document
    .querySelector(`[onclick="removeItem(${itemId})"]`)
    ?.closest(".bg-gray-800")
    ?.querySelector(".text-right .text-xl");

  if (itemTotalEl) {
    const price = item.price || 0;
    itemTotalEl.textContent = `฿${(price * item.qty).toLocaleString()}`;
  }

  updateOrderSummary();
  showSuccessMessage("อัพเดทจำนวนสำเร็จ!");
}

// Remove item function
function removeItem(itemId) {
  const item = cartItems.find((item) => item.id === itemId);
  if (!item) return;

  if (confirm(`คุณต้องการลบ "${item.name}" จากตะกร้าหรือไม่?`)) {
    // Remove from array
    cartItems = cartItems.filter((item) => item.id !== itemId);

    // Remove from DOM
    const itemElement = document
      .querySelector(`[onclick="removeItem(${itemId})"]`)
      .closest(".bg-gray-800");
    itemElement.style.transform = "translateX(-100%)";
    itemElement.style.opacity = "0";

    setTimeout(() => {
      itemElement.remove();

      // Check if cart is empty
      if (cartItems.length === 0) {
        showEmptyCart();
      }
    }, 300);

    updateOrderSummary();
    showSuccessMessage("ลบสินค้าสำเร็จ!");
  }
}

// Show empty cart
function showEmptyCart() {
  document.getElementById("cartItems").innerHTML = `
        <div class="bg-gray-800 rounded-lg p-12 text-center transform transition-all duration-500 opacity-0 scale-95" 
             style="animation: fadeInScale 0.5s ease-out forwards;">
            <i class="fas fa-shopping-cart text-gray-600 text-6xl mb-6"></i>
            <h3 class="text-2xl font-bold mb-4">ตะกร้าของคุณว่างเปล่า</h3>
            <p class="text-gray-400 mb-6">เพิ่มสินค้าในตะกร้าเพื่อดำเนินการต่อ</p>
            <a href="index.html" class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-block transform hover:scale-105">
                <i class="fas fa-arrow-left mr-2"></i>กลับไปช้อปปิ้ง
            </a>
        </div>
    `;
}

// Update order summary
function updateOrderSummary() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  let discount = 0;
  let discountDisplay = "฿0";

  if (appliedDiscount && subtotal > 0) {
    discount = subtotal * appliedDiscount.rate;
    discountDisplay = `-฿${discount.toLocaleString()}`;
  }

  const total = subtotal - discount;

  // Free shipping for orders over 100,000
  const shippingCost = subtotal >= 100000 ? 0 : 500;
  const finalTotal = total + shippingCost;

  // Update DOM elements
  document.getElementById("totalItems").textContent = `${totalItems} ชิ้น`;
  document.getElementById(
    "subtotal"
  ).textContent = `฿${subtotal.toLocaleString()}`;

  const discountElement = document.getElementById("discount");
  if (discountElement) {
    discountElement.textContent = discountDisplay;
    discountElement.className =
      discount > 0
        ? "font-semibold text-green-500"
        : "font-semibold text-gray-500";
  }

  const shippingElement = document.getElementById("shipping");
  if (shippingElement) {
    shippingElement.textContent =
      shippingCost === 0 ? "ฟรี" : `฿${shippingCost}`;
    shippingElement.className =
      shippingCost === 0 ? "font-semibold text-green-500" : "font-semibold";
  }

  document.getElementById(
    "total"
  ).textContent = `฿${finalTotal.toLocaleString()}`;

  // Disable checkout if cart is empty
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.disabled = totalItems === 0;
    checkoutBtn.className =
      totalItems === 0
        ? "w-full bg-gray-600 py-4 rounded-lg font-bold text-lg cursor-not-allowed opacity-50"
        : "w-full bg-red-600 hover:bg-red-700 py-4 rounded-lg font-bold text-lg transition-colors transform hover:scale-105";
  }
}

// Apply discount code
function applyDiscountCode() {
  const codeInput = document.getElementById("discountCode");
  const messageElement = document.getElementById("discountMessage");
  const code = codeInput.value.trim().toUpperCase();

  if (!code) {
    showDiscountMessage("กรุณาใส่รหัสส่วนลด", "error");
    return;
  }

  if (DISCOUNT_CODES[code]) {
    appliedDiscount = { code: code, rate: DISCOUNT_CODES[code].rate };
    updateOrderSummary();
    showDiscountMessage(
      `ใช้รหัสส่วนลดสำเร็จ! ${DISCOUNT_CODES[code].description}`,
      "success"
    );

    // Style the input as success
    codeInput.className =
      "flex-1 bg-gray-700 text-white p-3 rounded-l-lg border border-green-500 focus:border-red-500 focus:outline-none";

    // Change apply button to success state
    const applyBtn = document.getElementById("applyDiscount");
    applyBtn.className =
      "bg-green-600 hover:bg-green-700 px-4 py-3 rounded-r-lg transition-colors";
    applyBtn.innerHTML = '<i class="fas fa-check"></i>';
  } else {
    showDiscountMessage("รหัสส่วนลดไม่ถูกต้อง", "error");
    codeInput.className =
      "flex-1 bg-gray-700 text-white p-3 rounded-l-lg border border-red-500 focus:border-red-500 focus:outline-none";
  }
}

// Show discount message
function showDiscountMessage(message, type) {
  const messageElement = document.getElementById("discountMessage");
  messageElement.className = `text-sm mt-2 ${
    type === "success" ? "text-green-500" : "text-red-500"
  }`;
  messageElement.innerHTML =
    type === "success"
      ? `<i class="fas fa-check-circle mr-2"></i>${message}`
      : `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
  messageElement.classList.remove("hidden");
}

// Show success message
function showSuccessMessage(message = "อัพเดทสำเร็จ!") {
  const successMsg = document.getElementById("successMessage");
  if (successMsg) {
    successMsg.querySelector("span").textContent = message;
    successMsg.classList.remove("translate-x-full");
    setTimeout(() => {
      successMsg.classList.add("translate-x-full");
    }, 3000);
  }
}

// Show error message
function showErrorMessage(message) {
  const errorMsg = document.createElement("div");
  errorMsg.className =
    "fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform";
  errorMsg.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(errorMsg);

  setTimeout(() => errorMsg.classList.remove("translate-x-full"), 100);
  setTimeout(() => {
    errorMsg.classList.add("translate-x-full");
    setTimeout(() => errorMsg.remove(), 300);
  }, 3000);
}

// Clear entire cart
function clearCart() {
  if (confirm("คุณต้องการล้างสินค้าทั้งหมดในตะกร้าหรือไม่?")) {
    cartItems = [];
    showEmptyCart();
    updateOrderSummary();
    showSuccessMessage("ล้างตะกร้าสำเร็จ!");

    // Reset discount
    appliedDiscount = null;
    const codeInput = document.getElementById("discountCode");
    const applyBtn = document.getElementById("applyDiscount");
    const messageElement = document.getElementById("discountMessage");

    if (codeInput) {
      codeInput.value = "";
      codeInput.className =
        "flex-1 bg-gray-700 text-white p-3 rounded-l-lg border border-gray-600 focus:border-red-500 focus:outline-none";
    }

    if (applyBtn) {
      applyBtn.className =
        "bg-red-600 hover:bg-red-700 px-4 py-3 rounded-r-lg transition-colors";
      applyBtn.innerHTML = '<i class="fas fa-check"></i>';
    }

    if (messageElement) {
      messageElement.classList.add("hidden");
    }
  }
}

// Proceed to checkout
function proceedToCheckout() {
  if (cartItems.length === 0) {
    showErrorMessage("ตะกร้าว่างเปล่า ไม่สามารถดำเนินการต่อได้");
    return;
  }

  // Show loading state
  const checkoutBtn = document.getElementById("checkoutBtn");
  const originalText = checkoutBtn.innerHTML;
  checkoutBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin mr-2"></i>กำลังดำเนินการ...';
  checkoutBtn.disabled = true;

  // Simulate checkout process
  setTimeout(() => {
    alert("เปลี่ยนเส้นทางไปหน้าชำระเงิน...");
    checkoutBtn.innerHTML = originalText;
    checkoutBtn.disabled = false;
    // Here you would typically redirect to checkout page
    // window.location.href = 'checkout.html';
  }, 1500);
}

// Initialize cart functionality
async function initializeCart() {
  await getCartItems(); // wait until cartItems is populated
  loadCart(cartItems); // render cart
  updateOrderSummary(); // update totals
  console.log(cartItems);
  // Event listeners
  const clearCartBtn = document.getElementById("clearCart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", proceedToCheckout);
  }

  const applyDiscountBtn = document.getElementById("applyDiscount");
  if (applyDiscountBtn) {
    applyDiscountBtn.addEventListener("click", applyDiscountCode);
  }

  const discountInput = document.getElementById("discountCode");
  if (discountInput) {
    discountInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        applyDiscountCode();
      }
    });
  }
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .cart-item-exit {
        transition: all 0.3s ease-out;
        transform: translateX(-100%);
        opacity: 0;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeCart);

// Export functions for potential use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    changeQuantity,
    removeItem,
    clearCart,
    updateOrderSummary,
    applyDiscountCode,
    proceedToCheckout,
  };
}
