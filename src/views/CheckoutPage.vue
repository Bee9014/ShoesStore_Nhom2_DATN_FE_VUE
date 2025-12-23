<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <h1 class="page-title">THANH TOÁN</h1>
      
      <div v-if="cartStore.items.length === 0" class="empty-message">
        <p>Giỏ hàng của bạn đang trống.</p>
        <router-link to="/" class="btn-primary">Quay lại mua sắm</router-link>
      </div>
      
      <div v-else class="checkout-content">
        
        <div class="checkout-form">
          <div class="form-section">
            <h2><MapPin :size="20" /> Thông tin giao hàng</h2>
            
            <div class="form-group">
              <label>Họ và tên <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="formData.fullname" 
                placeholder="Ví dụ: Nguyễn Văn A"
                :class="{ 'error': errors.fullname }"
              >
              <span v-if="errors.fullname" class="error-msg">Vui lòng nhập họ tên</span>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Số điện thoại <span class="required">*</span></label>
                <input 
                  type="tel" 
                  v-model="formData.phone" 
                  placeholder="Ví dụ: 0912345678"
                  :class="{ 'error': errors.phone }"
                >
                <span v-if="errors.phone" class="error-msg">Vui lòng nhập số điện thoại</span>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="formData.email" placeholder="Nhập email để nhận thông báo">
              </div>
            </div>
            
            <div class="form-group">
              <label>Địa chỉ nhận hàng <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="formData.address" 
                placeholder="Số nhà, tên đường, phường/xã"
                :class="{ 'error': errors.address }"
              >
              <span v-if="errors.address" class="error-msg">Vui lòng nhập địa chỉ</span>
            </div>

            <div class="form-group">
               <label>Tỉnh/Thành phố <span class="required">*</span></label>
               <select v-model="formData.city" :class="{ 'error': errors.city }">
                 <option value="">-- Chọn Tỉnh/Thành phố --</option>
                 <option value="Hà Nội">Hà Nội</option>
                 <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                 <option value="Đà Nẵng">Đà Nẵng</option>
                 <option value="Hải Phòng">Hải Phòng</option>
                 <option value="Cần Thơ">Cần Thơ</option>
               </select>
               <span v-if="errors.city" class="error-msg">Vui lòng chọn thành phố</span>
           </div>
            
            <div class="form-group">
              <label>Ghi chú</label>
              <textarea v-model="formData.note" rows="2" placeholder="Ví dụ: Giao hàng giờ hành chính"></textarea>
            </div>
          </div>
          
          <div class="form-section">
            <h2><CreditCard :size="20" /> Phương thức thanh toán</h2>
            
            <div class="payment-methods">
              <label class="payment-option" :class="{ active: formData.paymentMethod === 'cod' }">
                <input type="radio" name="payment" value="cod" v-model="formData.paymentMethod">
                <div class="payment-content">
                  <div class="icon-box"><Truck :size="24" /></div>
                  <div class="text-box">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <p>Bạn chỉ phải thanh toán khi đã nhận được hàng</p>
                  </div>
                </div>
              </label>
              
              <label class="payment-option" :class="{ active: formData.paymentMethod === 'vnpay' }">
                <input type="radio" name="payment" value="vnpay" v-model="formData.paymentMethod">
                <div class="payment-content">
                  <div class="icon-box"><QrCode :size="24" /></div>
                  <div class="text-box">
                    <strong>Thanh toán qua VNPAY</strong>
                    <p>Quét mã QR hoặc dùng thẻ ATM nội địa / Visa</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <div class="order-summary">
          <h3>Đơn hàng ({{ cartStore.cartCount }} sản phẩm)</h3>
          
          <div class="order-items-list">
            <div v-for="item in cartStore.items" :key="item.variantId" class="order-item">
               <div class="item-img">
                <img :src="getImageUrl(item.imageUrl || '/placeholder-shoe.jpg')" :alt="item.name">
                <span class="qty-badge">{{ item.quantity }}</span>
              </div>
              <div class="item-details">
                <p class="name">{{ item.name }}</p>
                <p class="variant">Size: {{ item.size }} • {{ item.color }}</p>
              </div>
              <div class="item-price">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="cost-row">
            <span>Tạm tính</span>
            <span>{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
          <div class="cost-row">
            <span>Phí vận chuyển</span>
            <span>{{ formatPrice(shippingFee) }}</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="cost-row total">
            <span>Tổng cộng</span>
            <span class="total-price">{{ formatPrice(totalAmount) }}</span>
          </div>
          
          <button class="btn-checkout" @click="handlePlaceOrder" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>
              {{ formData.paymentMethod === 'vnpay' ? 'THANH TOÁN VNPAY' : 'ĐẶT HÀNG NGAY' }}
            </span>
          </button>
          
          <router-link to="/cart" class="link-back">← Quay lại giỏ hàng</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Truck, CreditCard, QrCode, MapPin } from 'lucide-vue-next'
import { getImageUrl } from '@/helpers/userHelper'

// Import Stores
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

// Import API
import { createOrder } from '../api/order' 
import { createVNPayPayment } from '../api/payment' // Import hàm thanh toán

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// State
const loading = ref(false)
const shippingFee = ref(30000)
const errors = reactive({
  fullname: false,
  phone: false,
  address: false,
  city: false
})

const formData = reactive({
  fullname: authStore.user?.fullname || '',
  phone: authStore.user?.phone || '',
  email: authStore.user?.email || '',
  address: '',
  city: '',
  note: '',
  paymentMethod: 'cod', // Mặc định chọn COD
})

// Computed
const totalAmount = computed(() => cartStore.cartTotal + shippingFee.value)

// Helper: Format tiền tệ
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

// Helper: Validate Form
const validateForm = () => {
  let isValid = true
  Object.keys(errors).forEach(key => errors[key] = false)

  if (!formData.fullname.trim()) { errors.fullname = true; isValid = false }
  if (!formData.phone.trim()) { errors.phone = true; isValid = false }
  if (!formData.address.trim()) { errors.address = true; isValid = false }
  if (!formData.city) { errors.city = true; isValid = false }

  return isValid
}

// --- LOGIC ĐẶT HÀNG CHÍNH ---
const handlePlaceOrder = async () => {
  // 1. Validate Form
  if (!validateForm()) return
  
  // 2. Check Auth
  if (!authStore.user?.userId) {
    alert('Vui lòng đăng nhập để tiếp tục!')
    router.push('/login')
    return
  }

  loading.value = true

  try {
    // --- BƯỚC 1: TẠO ĐƠN HÀNG (PENDING) ---
    const orderPayload = {
      buyerId: authStore.user.userId,
      shippingFullname: formData.fullname,
      shippingPhone: formData.phone,
      shippingAddress: `${formData.address}, ${formData.city}`,
      shippingCity: formData.city,
      shippingCountry: 'Vietnam',
      note: formData.note,
      shippingFee: shippingFee.value,
      paymentMethod: formData.paymentMethod.toUpperCase(),
      items: cartStore.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price
      }))
    }

    // Gọi API tạo đơn hàng
    const orderRes = await createOrder(orderPayload)

    // orderRes có thể là { success: true, ... } hoặc { data: { success: true... } }
    // Tùy vào cách viết api/order.js của bạn. 
    // Mình giả định api/order.js cũng đã trả về response.data như api/payment.js
    
    // Kiểm tra cấu trúc response (cho chắc chắn)
    const orderData = orderRes.success ? orderRes : orderRes.data;

    if (orderData && orderData.success) {
      const orderId = orderData.data.orderId

      // --- BƯỚC 2: XỬ LÝ THANH TOÁN ---
      
      // CASE 1: COD
      if (formData.paymentMethod === 'cod') {
        cartStore.clearCart()
        router.push(`/orders/${orderId}/success`)
      
      // CASE 2: VNPAY
      } else if (formData.paymentMethod === 'vnpay') {
        try {
          const vnpayPayload = {
            orderId: orderId,
            amount: totalAmount.value,
            // Tự động lấy domain hiện tại
            returnUrl: window.location.origin + '/shoestore/payment-result',
            orderInfo: `Thanh toán đơn hàng #${orderId}`,
            payerId: authStore.user.userId
          }

          // Gọi API (đã được bóc .data trong file api/payment.js)
          const resData = await createVNPayPayment(vnpayPayload) 

          // Logic kiểm tra trực tiếp
          if (resData.success && resData.data.paymentUrl) {
            // Chuyển hướng sang VNPay
            window.location.href = resData.data.paymentUrl
          } else {
            alert('Lỗi tạo cổng thanh toán: ' + (resData.message || 'Unknown error'))
            loading.value = false
          }
        } catch (vnpayError) {
          console.error('VNPay Error:', vnpayError)
          alert('Không thể kết nối đến cổng thanh toán VNPay.')
          loading.value = false
        }
      }

    } else {
      alert('Đặt hàng thất bại: ' + (orderData.message || 'Lỗi không xác định'))
      loading.value = false
    }

  } catch (error) {
    console.error('System Error:', error)
    alert('Có lỗi xảy ra trong quá trình xử lý.')
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  background-color: #f3f4f6;
  min-height: 100vh;
  padding: 40px 0;
  font-family: 'Inter', sans-serif;
}

.checkout-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #111;
  margin-bottom: 30px;
  text-transform: uppercase;
  text-align: center;
}

.empty-message {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
}

/* Layout 2 cột */
.checkout-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
}

/* Form bên trái */
.form-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.form-section h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #4b5563;
}

.required { color: #ef4444; }

input, select, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #ff5000;
  box-shadow: 0 0 0 3px rgba(255, 80, 0, 0.1);
}

input.error, select.error {
  border-color: #ef4444;
}

.error-msg {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
  display: block;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.payment-option:hover { border-color: #fdba74; }

.payment-option.active {
  border-color: #ff5000;
  background-color: #fff7ed;
}

.payment-option input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.payment-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.icon-box {
  color: #ff5000;
  margin-top: 2px;
}

.text-box strong { display: block; color: #111; font-size: 15px; }
.text-box p { font-size: 13px; color: #6b7280; margin: 4px 0 0; }

/* Tóm tắt đơn hàng bên phải */
.order-summary {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.order-summary h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
}

.order-items-list {
  max-height: 350px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 5px;
}

.order-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.item-img {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #eee;
}

.item-img img { width: 100%; height: 100%; object-fit: cover; }

.qty-badge {
  position: absolute;
  top: 0; right: 0;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-bottom-left-radius: 6px;
}

.item-details { flex: 1; }
.item-details .name { font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.item-details .variant { font-size: 12px; color: #9ca3af; }

.item-price { font-size: 14px; font-weight: 600; color: #111; }

.divider { height: 1px; background: #e5e7eb; margin: 16px 0; }

.cost-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #4b5563;
}

.cost-row.total {
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin-top: 10px;
}

.total-price { color: #ff5000; }

.btn-checkout {
  width: 100%;
  background: #ff5000;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s;
}

.btn-checkout:hover:not(:disabled) { background: #ea580c; }
.btn-checkout:disabled { opacity: 0.7; cursor: not-allowed; }

.link-back {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #6b7280;
  font-size: 13px;
  text-decoration: none;
}
.link-back:hover { color: #ff5000; text-decoration: underline; }

.spinner {
  display: inline-block;
  width: 20px; height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive Mobile */
@media (max-width: 768px) {
  .checkout-content { grid-template-columns: 1fr; }
  .order-summary { position: static; order: -1; margin-bottom: 20px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>