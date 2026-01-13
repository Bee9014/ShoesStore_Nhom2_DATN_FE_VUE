<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1 class="page-title">GIỎ HÀNG CỦA BẠN</h1>

      <!-- Empty Cart -->
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <ShoppingCart :size="80" class="empty-icon" />
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <router-link to="/" class="btn-primary">
          Tiếp tục mua sắm
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div class="cart-header">
            <span>Sản phẩm</span>
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span>Tổng tiền</span>
            <span></span>
          </div>

          <CartItem v-for="item in cartStore.items" :key="item.variantId" :item="item" />
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <h3>Tóm tắt đơn hàng</h3>

          <div class="summary-row">
            <span>Tạm tính ({{ cartStore.cartCount }} sản phẩm):</span>
            <span class="amount">{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>

          <div class="summary-row">
            <span>Phí vận chuyển:</span>
            <span class="amount">{{ formatPrice(shippingFee) }}</span>
          </div>

          <div class="summary-row discount">
            <span>Giảm giá:</span>
            <span class="amount discount-amount">-{{ formatPrice(discount) }}</span>
          </div>

          <div class="divider"></div>

          <div class="summary-row total">
            <span>Tổng cộng:</span>
            <span class="amount">{{ formatPrice(totalAmount) }}</span>
          </div>

          <div class="voucher-input">
            <input type="text" placeholder="Nhập mã giảm giá" v-model="voucherCode">
            <button class="apply-btn" @click="applyVoucher">Áp dụng</button>
          </div>

          <router-link to="/checkout" class="checkout-btn">
            THANH TOÁN
          </router-link>

          <router-link to="/" class="continue-shopping">
            ← Tiếp tục mua sắm
          </router-link>

          <button class="clear-cart-btn" @click="clearCart">
            Xóa toàn bộ giỏ hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '../stores/cartStore'
import CartItem from '../components/CartItem.vue'

const cartStore = useCartStore()
const voucherCode = ref('')
const shippingFee = ref(30000) // 30k shipping
const discount = ref(0)

const totalAmount = computed(() => {
  return cartStore.cartTotal + shippingFee.value - discount.value
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const applyVoucher = () => {
  if (voucherCode.value.trim()) {
    // TODO: Call API to validate voucher
    // Mock discount
    if (voucherCode.value === 'DISCOUNT10') {
      discount.value = cartStore.cartTotal * 0.1
      alert('Áp dụng mã giảm giá thành công! Giảm 10%')
    } else {
      alert('Mã giảm giá không hợp lệ!')
    }
  }
}

const clearCart = () => {
  if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
    cartStore.clearCart()
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 80vh;
  padding: 40px 5%;
  background-color: #f8f8f8;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 28px;
  font-weight: 900;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
}

.empty-icon {
  color: #ccc;
  margin-bottom: 20px;
}

.empty-cart h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.empty-cart p {
  color: #666;
  margin-bottom: 30px;
}

.btn-primary {
  display: inline-block;
  padding: 12px 30px;
  background-color: #ff5000;
  color: white;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary:hover {
  background-color: #e64500;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
}

.cart-items {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.cart-header {
  display: grid;
  grid-template-columns: 100px 1fr 120px 150px 120px 50px;
  gap: 20px;
  padding: 15px 20px;
  background: #f8f8f8;
  border-radius: 4px;
  font-weight: 600;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

/* Cart Summary */
.cart-summary {
  background: white;
  padding: 25px;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.cart-summary h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 15px;
}

.summary-row span {
  color: #666;
}

.summary-row .amount {
  font-weight: 600;
  color: #333;
}

.summary-row.discount .discount-amount {
  color: #00a651;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 20px 0;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
}

.summary-row.total .amount {
  color: #ff5000;
  font-size: 22px;
}

.voucher-input {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.voucher-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.apply-btn {
  padding: 10px 20px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
}

.apply-btn:hover {
  background: #555;
}

.checkout-btn {
  display: block;
  width: 100%;
  padding: 15px;
  background: #ff5000;
  color: white;
  text-align: center;
  border-radius: 4px;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.checkout-btn:hover {
  background: #e64500;
}

.continue-shopping {
  display: block;
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.continue-shopping:hover {
  color: #ff5000;
}

.clear-cart-btn {
  width: 100%;
  padding: 10px;
  background: white;
  color: #c00;
  border: 1px solid #c00;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.clear-cart-btn:hover {
  background: #c00;
  color: white;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-header {
    display: none;
  }

  .cart-summary {
    position: static;
  }
}
</style>
