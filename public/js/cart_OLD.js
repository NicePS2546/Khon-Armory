// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.discountCodes = {
            'KHON10': { discount: 0.10, description: 'ส่วนลด 10%' },
            'FIRST20': { discount: 0.20, description: 'ส่วนลด 20% สำหรับลูกค้าใหม่' },
            'ARMORY15': { discount: 0.15, description: 'ส่วนลด 15%' }
        };
        this.appliedDiscount = null;
        this.shippingFee = 500; // ค่าจัดส่งคงที่
        this.freeShippingThreshold = 100000; // จัดส่งฟรีเมื่อซื้อครบ 100,000 บาท
        this.currentEditingItem = null;
        
        this.init();
    }

    init() {
        this.renderCart();
        this.bindEvents();
        this.updateSummary();
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const cartData = JSON.parse(localStorage.getItem('khonArmoryCart') || '[]');
            return cartData;
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('khonArmoryCart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add item to cart
    addItem(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.cart.push({
                ...item,
                quantity: item.quantity || 1,
                addedAt: Date.now()
            });
        }
        
        this.saveCart();
        this.renderCart();
        this.updateSummary();
    }

    // Remove item from cart
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
        this.updateSummary();
        
        // Show success message
        this.showMessage('ลบสินค้าออกจากตะกร้าแล้ว', 'success');
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
            this.updateSummary();
        }
    }

    // Clear entire cart
    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('คุณต้องการล้างสินค้าทั้งหมดในตะกร้าหรือไม่?')) {
            this.cart = [];
            this.appliedDiscount = null;
            this.saveCart();
            this.renderCart();
            this.updateSummary();
            this.showMessage('ล้างตะกร้าสินค้าแล้ว', 'success');
        }
    }

    // Calculate totals
    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const shipping = subtotal >= this.freeShippingThreshold ? 0 : this.shippingFee;
        
        let discount = 0;
        if (this.appliedDiscount) {
            discount = subtotal * this.appliedDiscount.discount;
        }
        
        const total = subtotal + shipping - discount;
        
        return {
            subtotal,
            totalItems,
            shipping,
            discount,
            total: Math.max(0, total)
        };
    }

    // Render cart items
    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCartMessage = document.getElementById('emptyCart');
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCartMessage.classList.remove('hidden');
            return;
        }
        
        emptyCartMessage.classList.add('hidden');
        
        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors" data-item-id="${item.id}">
                <div class="flex items-center space-x-4">
                    <!-- Product Image -->
                    <div class="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img src="${item.image || '/api/placeholder/80/80'}" 
                             alt="${item.name}" 
                             class="w-full h-full object-cover">
                    </div>
                    
                    <!-- Product Info -->
                    <div class="flex-1">
                        <h4 class="font-semibold text-lg mb-1">${item.name}</h4>
                        <p class="text-gray-400 text-sm mb-2">${item.description || ''}</p>
                        <div class="flex items-center space-x-4">
                            <span class="text-red-500 font-bold text-lg">฿${item.price.toLocaleString()}</span>
                            <span class="text-gray-400">× ${item.quantity}</span>
                        </div>
                    </div>
                    
                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-2">
                        <button onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})" 
                                class="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus text-sm"></i>
                        </button>
                        <button onclick="cartManager.openQuantityModal('${item.id}')" 
                                class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-center min-w-[40px] transition-colors">
                            ${item.quantity}
                        </button>
                        <button onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})" 
                                class="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
                            <i class="fas fa-plus text-sm"></i>
                        </button>
                    </div>
                    
                    <!-- Total Price -->
                    <div class="text-right">
                        <div class="font-bold text-lg text-red-500">
                            ฿${(item.price * item.quantity).toLocaleString()}
                        </div>
                    </div>
                    
                    <!-- Remove Button -->
                    <button onclick="cartManager.removeItem('${item.id}')" 
                            class="text-red-400 hover:text-red-300 transition-colors ml-4">
                        <i class="fas fa-trash text-lg"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Update order summary
    updateSummary() {
        const totals = this.calculateTotals();
        
        document.getElementById('totalItems').textContent = `${totals.totalItems} ชิ้น`;
        document.getElementById('subtotal').textContent = `฿${totals.subtotal.toLocaleString()}`;
        document.getElementById('shipping').textContent = totals.shipping === 0 ? 'ฟรี' : `฿${totals.shipping.toLocaleString()}`;
        document.getElementById('total').textContent = `฿${totals.total.toLocaleString()}`;
        
        // Update checkout button state
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (this.cart.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<i class="fas fa-shopping-cart mr-2"></i>ไม่มีสินค้าในตะกร้า';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = '<i class="fas fa-credit-card mr-2"></i>ดำเนินการสั่งซื้อ';
        }
        
        // Show free shipping message
        if (totals.subtotal >= this.freeShippingThreshold) {
            this.showShippingMessage('🎉 คุณได้รับจัดส่งฟรี!', 'success');
        } else {
            const remaining = this.freeShippingThreshold - totals.subtotal;
            this.showShippingMessage(`ซื้อเพิ่มอีก ฿${remaining.toLocaleString()} เพื่อรับจัดส่งฟรี`, 'info');
        }
    }

    // Apply discount code
    applyDiscount(code) {
        const discount = this.discountCodes[code.toUpperCase()];
        const messageElement = document.getElementById('discountMessage');
        
        if (discount) {
            this.appliedDiscount = discount;
            this.updateSummary();
            this.showDiscountMessage(`✅ ${discount.description} ถูกนำมาใช้แล้ว`, 'success');
            document.getElementById('discountCode').value = '';
        } else {
            this.showDiscountMessage('❌ รหัสส่วนลดไม่ถูกต้อง', 'error');
        }
    }

    // Open quantity modal
    openQuantityModal(itemId) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (!item) return;
        
        this.currentEditingItem = itemId;
        document.getElementById('modalQuantity').value = item.quantity;
        document.getElementById('quantityModal').classList.remove('hidden');
    }

    // Close quantity modal
    closeQuantityModal() {
        document.getElementById('quantityModal').classList.add('hidden');
        this.currentEditingItem = null;
    }

    // Confirm quantity change
    confirmQuantityChange() {
        const newQuantity = parseInt(document.getElementById('modalQuantity').value);
        if (this.currentEditingItem && newQuantity > 0) {
            this.updateQuantity(this.currentEditingItem, newQuantity);
            this.closeQuantityModal();
        }
    }

    // Show message
    showMessage(message, type = 'info') {
        // Create toast message
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 
            'bg-blue-600'
        }`;
        toast.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    // Show shipping message
    showShippingMessage(message, type) {
        const shippingElement = document.getElementById('shipping');
        const parent = shippingElement.parentElement;
        
        // Remove existing shipping message
        const existingMessage = parent.querySelector('.shipping-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Add new shipping message
        const messageDiv = document.createElement('div');
        messageDiv.className = `shipping-message text-xs mt-1 ${type === 'success' ? 'text-green-400' : 'text-blue-400'}`;
        messageDiv.textContent = message;
        parent.appendChild(messageDiv);
    }

    // Show discount message
    showDiscountMessage(message, type) {
        const messageElement = document.getElementById('discountMessage');
        messageElement.className = `text-sm mt-2 ${type === 'success' ? 'text-green-400' : 'text-red-400'}`;
        messageElement.textContent = message;
        messageElement.classList.remove('hidden');
        
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 3000);
    }

    // Checkout process
    checkout() {
        if (this.cart.length === 0) {
            this.showMessage('ไม่มีสินค้าในตะกร้า', 'error');
            return;
        }
        
        const totals = this.calculateTotals();
        
        // Simple checkout simulation
        const confirmed = confirm(`ยืนยันการสั่งซื้อ?\n\nยอดรวม: ฿${totals.total.toLocaleString()}\nจำนวนสินค้า: ${totals.totalItems} ชิ้น`);
        
        if (confirmed) {
            this.showMessage('กำลังดำเนินการสั่งซื้อ...', 'info');
            
            setTimeout(() => {
                this.cart = [];
                this.appliedDiscount = null;
                this.saveCart();
                this.renderCart();
                this.updateSummary();
                this.showMessage('สั่งซื้อสำเร็จ! ขอบคุณสำหรับการสั่งซื้อ', 'success');
            }, 2000);
        }
    }

    // Bind events
    bindEvents() {
        // Clear cart button
        document.getElementById('clearCart')?.addEventListener('click', () => {
            this.clearCart();
        });

        // Apply discount button
        document.getElementById('applyDiscount')?.addEventListener('click', () => {
            const code = document.getElementById('discountCode').value.trim();
            if (code) {
                this.applyDiscount(code);
            }
        });

        // Discount code input - apply on Enter
        document.getElementById('discountCode')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const code = e.target.value.trim();
                if (code) {
                    this.applyDiscount(code);
                }
            }
        });

        // Checkout button
        document.getElementById('checkoutBtn')?.addEventListener('click', () => {
            this.checkout();
        });

        // Quantity modal events
        document.getElementById('cancelQuantity')?.addEventListener('click', () => {
            this.closeQuantityModal();
        });

        document.getElementById('confirmQuantity')?.addEventListener('click', () => {
            this.confirmQuantityChange();
        });

        // Quantity modal input controls
        document.getElementById('decreaseQty')?.addEventListener('click', () => {
            const input = document.getElementById('modalQuantity');
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        });

        document.getElementById('increaseQty')?.addEventListener('click', () => {
            const input = document.getElementById('modalQuantity');
            const currentValue = parseInt(input.value);
            if (currentValue < 99) {
                input.value = currentValue + 1;
            }
        });

        // Close modal when clicking outside
        document.getElementById('quantityModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'quantityModal') {
                this.closeQuantityModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeQuantityModal();
            }
        });
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// Helper function to add items to cart from other pages
window.addToCart = function(product) {
    if (window.cartManager) {
        window.cartManager.addItem(product);
        window.cartManager.showMessage('เพิ่มสินค้าลงตะกร้าแล้ว', 'success');
    }
};