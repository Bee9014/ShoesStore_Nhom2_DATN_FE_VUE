<template>
  <div class="checkout-page">
    <div class="checkout-container">

      <div v-if="cartStore.items.length === 0" class="empty-state">
        <div class="empty-icon">🛒</div>
        <h2>Giỏ hàng trống</h2>
        <p>Hãy chọn thêm sản phẩm để tiến hành thanh toán nhé.</p>
        <router-link to="/" class="btn-primary">Tiếp tục mua sắm</router-link>
      </div>

      <div v-else class="checkout-layout">

        <div class="checkout-left">
          <h1 class="page-title">Thanh toán</h1>

          <div class="card-section">
            <h2 class="section-title">
              <div class="icon-circle">
                <MapPin :size="18" />
              </div>
              Thông tin giao hàng
            </h2>

            <div class="form-grid">
              <div class="form-group full-width">
                <label>Họ và tên <span class="req">*</span></label>
                <input type="text" v-model="formData.fullname" placeholder="Nhập họ tên người nhận"
                  :class="{ 'error': errors.fullname }">
                <small v-if="errors.fullname" class="err-text">Vui lòng nhập họ tên</small>
              </div>

              <div class="form-group">
                <label>Số điện thoại <span class="req">*</span></label>
                <input type="tel" v-model="formData.phone" placeholder="Ví dụ: 0912345678"
                  :class="{ 'error': errors.phone }">
                <small v-if="errors.phone" class="err-text">Nhập SĐT hợp lệ</small>
              </div>

              <div class="form-group">
                <label>Email (Tùy chọn)</label>
                <input type="email" v-model="formData.email" placeholder="Nhập email nhận hóa đơn">
              </div>

              <div class="form-group full-width">
                <label>Địa chỉ cụ thể <span class="req">*</span></label>
                <input type="text" v-model="formData.address" placeholder="Số nhà, ngõ, tên đường..."
                  :class="{ 'error': errors.address }">
                <small v-if="errors.address" class="err-text">Vui lòng nhập địa chỉ</small>
              </div>

              <div class="form-group full-width">
                <label>Tỉnh/Thành phố <span class="req">*</span></label>
                <div class="select-wrapper">
                  <select v-model="formData.city" :class="{ 'error': errors.city }">
                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>
                <small v-if="errors.city" class="err-text">Vui lòng chọn thành phố</small>
              </div>

              <div class="form-group full-width">
                <label>Ghi chú đơn hàng</label>
                <textarea v-model="formData.note" rows="2"
                  placeholder="Ví dụ: Gọi trước khi giao, giao giờ hành chính..."></textarea>
              </div>
            </div>
          </div>

          <div class="card-section">
            <h2 class="section-title">
              <div class="icon-circle">
                <CreditCard :size="18" />
              </div>
              Phương thức thanh toán
            </h2>

            <div class="payment-grid">
              <label class="payment-card" :class="{ active: formData.paymentMethod === 'cod' }">
                <input type="radio" name="payment" value="cod" v-model="formData.paymentMethod">
                <div class="pay-icon">
                  <Truck :size="24" />
                </div>
                <div class="pay-info">
                  <strong>COD</strong>
                  <span>Thanh toán khi nhận hàng</span>
                </div>
                <div class="check-mark" v-if="formData.paymentMethod === 'cod'">✔</div>
              </label>

              <label class="payment-card" :class="{ active: formData.paymentMethod === 'vnpay' }">
                <input type="radio" name="payment" value="vnpay" v-model="formData.paymentMethod">
                <div class="pay-icon">
                  <QrCode :size="24" />
                </div>
                <div class="pay-info">
                  <strong>VNPAY</strong>
                  <span>Ví điện tử / Thẻ ATM</span>
                </div>
                <div class="check-mark" v-if="formData.paymentMethod === 'vnpay'">✔</div>
              </label>
            </div>
          </div>

          <router-link to="/cart" class="back-link mobile-only">← Quay lại giỏ hàng</router-link>
        </div>

        <div class="checkout-right">
          <div class="summary-card">
            <h3>Đơn hàng ({{ cartStore.cartCount }})</h3>

            <div class="summary-items">
              <div v-for="item in cartStore.items" :key="item.variantId" class="s-item">
                <div class="s-img">
                  <img :src="getImageUrl(item.imageUrl || '/placeholder-shoe.jpg')" :alt="item.name">
                  <span class="s-qty">{{ item.quantity }}</span>
                </div>
                <div class="s-info">
                  <div class="s-name">{{ item.name }}</div>
                  <div class="s-meta">{{ item.size }} / {{ item.color }}</div>
                </div>
                <div class="s-price">
                  <div v-if="appliedVoucher" class="price-col">
                    <span class="old">{{ formatPrice(item.price * item.quantity) }}</span>
                    <span class="new">{{ formatPrice(getLineItemPrice(item)) }}</span>
                  </div>
                  <div v-else>{{ formatPrice(item.price * item.quantity) }}</div>
                </div>
              </div>
            </div>

            <div class="voucher-wrapper">
              <div v-if="!appliedVoucher" class="voucher-input-group">
                <div class="icon">
                  <Ticket :size="16" />
                </div>
                <button class="btn-trigger-voucher" @click="openVoucherModal">Chọn hoặc nhập mã ưu đãi</button>
              </div>

              <div v-else class="voucher-applied">
                <div class="va-left">
                  <Ticket :size="16" class="va-icon" />
                  <span class="va-code">{{ appliedVoucher.code }}</span>
                </div>
                <button class="btn-remove-voucher" @click="removeVoucher">Gỡ bỏ</button>
              </div>
              <div v-if="appliedVoucher" class="va-success-text">
                Đã áp dụng mã giảm giá
              </div>
            </div>

            <div class="divider"></div>

            <div class="calc-row">
              <span>Tạm tính</span>
              <span>{{ formatPrice(cartStore.cartTotal) }}</span>
            </div>
            <div class="calc-row">
              <span>Phí vận chuyển</span>
              <span>{{ formatPrice(shippingFee) }}</span>
            </div>
            <div class="calc-row discount" v-if="appliedVoucher">
              <span>Giảm giá</span>
              <span>-{{ formatPrice(discountAmount) }}</span>
            </div>

            <div class="divider"></div>

            <div class="total-row">
              <span>Tổng cộng</span>
              <span class="total-amount">{{ formatPrice(totalAmount) }}</span>
            </div>

            <button class="btn-place-order" @click="handlePlaceOrder" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>
                {{ formData.paymentMethod === 'vnpay' ? 'THANH TOÁN VNPAY' : 'ĐẶT HÀNG' }}
              </span>
            </button>

            <router-link to="/cart" class="back-link desktop-only">← Quay lại giỏ hàng</router-link>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showVoucherModal" class="modal-backdrop" @click="showVoucherModal = false">
      <div class="modal-panel" @click.stop>
        <div class="modal-head">
          <h3>ShoeStore Voucher</h3>
          <button @click="showVoucherModal = false">
            <X :size="24" />
          </button>
        </div>

        <div class="modal-search-bar">
          <input type="text" v-model="voucherCode" placeholder="Nhập mã voucher" @keyup.enter="handleApplyVoucher">
          <button @click="handleApplyVoucher" :disabled="!voucherCode">ÁP DỤNG</button>
        </div>

        <div class="modal-body-scroll">
          <div v-if="voucherList.length === 0" class="empty-list">
            Không có mã giảm giá khả dụng.
          </div>

          <div v-else class="ticket-list">
            <div v-for="v in voucherList" :key="v.voucherId" class="ticket" :class="{ 'disabled': !v.eligible }"
              @click="selectFromList(v)">
              <div class="ticket-stub">
                <Ticket :size="24" color="white" />
              </div>
              <div class="ticket-content">
                <div class="tc-code">{{ v.code }}</div>
                <div class="tc-desc">{{ v.description }}</div>
                <div class="tc-meta">
                  <span v-if="!v.eligible" class="tc-reason">{{ v.reason }}</span>
                  <span v-else class="tc-valid">HSD: {{ new Date(v.endDate).toLocaleDateString('vi-VN') }}</span>
                </div>
              </div>
              <div class="ticket-radio">
                <div class="radio-circle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Truck, CreditCard, QrCode, MapPin, Ticket, X } from 'lucide-vue-next'
import { getImageUrl } from '@/helpers/userHelper'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { createOrder } from '../api/order'
import { createVNPayPayment } from '../api/payment'
import { applyVoucher, getValidVouchers } from '../api/voucher'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const loading = ref(false)
const shippingFee = ref(30000)
const errors = reactive({ fullname: false, phone: false, address: false, city: false })

const formData = reactive({
  fullname: authStore.user?.fullName || '',
  phone: authStore.user?.phone || '',
  email: authStore.user?.email || '',
  address: '',
  city: '',
  note: '',
  paymentMethod: 'cod',
})

// Voucher State
const voucherCode = ref('')
const appliedVoucher = ref(null)
const showVoucherModal = ref(false)
const voucherList = ref([])

// Computed
const discountAmount = computed(() => appliedVoucher.value ? appliedVoucher.value.discountAmount : 0)
const totalAmount = computed(() => {
  const total = cartStore.cartTotal + shippingFee.value - discountAmount.value
  return total > 0 ? total : 0
})

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const getLineItemPrice = (item) => {
  const originalTotal = item.price * item.quantity;
  if (!appliedVoucher.value || !cartStore.cartTotal) return originalTotal;
  const ratio = appliedVoucher.value.discountAmount / cartStore.cartTotal;
  return originalTotal - (originalTotal * ratio);
}

const validateForm = () => {
  let isValid = true
  Object.keys(errors).forEach(key => errors[key] = false)
  if (!formData.fullname.trim()) { errors.fullname = true; isValid = false }
  if (!formData.phone.trim()) { errors.phone = true; isValid = false }
  if (!formData.address.trim()) { errors.address = true; isValid = false }
  if (!formData.city) { errors.city = true; isValid = false }
  return isValid
}

const handleApplyVoucher = async () => {
  if (!voucherCode.value) return alert('Vui lòng nhập mã voucher');
  if (!authStore.user?.userId) return alert('Vui lòng đăng nhập');
  try {
    const res = await applyVoucher({ code: voucherCode.value, total: cartStore.cartTotal, userId: authStore.user?.userId })
    if (res.success) { appliedVoucher.value = res.data; showVoucherModal.value = false; }
    else { alert(res.message); appliedVoucher.value = null; }
  } catch (e) { alert(e.response?.data?.message || 'Mã không hợp lệ'); }
}

const removeVoucher = () => { appliedVoucher.value = null; voucherCode.value = ''; }

const openVoucherModal = async () => {
  showVoucherModal.value = true;
  try {
    const res = await getValidVouchers(cartStore.cartTotal);
    if (res.success) voucherList.value = res.data;
  } catch (e) { console.error(e); }
}

const selectFromList = (v) => {
  if (!v.eligible) return;
  voucherCode.value = v.code;
  handleApplyVoucher();
}

const handlePlaceOrder = async () => {
  if (!validateForm()) return
  if (!authStore.user?.userId) return router.push('/login')
  loading.value = true

  try {
    const orderPayload = {
      userId: authStore.user?.userId,
      shippingFullname: formData.fullname,
      shippingPhone: formData.phone,
      shippingAddress: `${formData.address}, ${formData.city}`,
      shippingCity: formData.city,
      note: formData.note,
      shippingFee: shippingFee.value,
      paymentMethod: formData.paymentMethod.toUpperCase(),
      voucherId: appliedVoucher.value?.voucherId || null,
      items: cartStore.items.map(item => ({ variantId: item.variantId, quantity: item.quantity, price: item.price }))
    }

    const orderRes = await createOrder(orderPayload)
    const orderData = orderRes.success ? orderRes : orderRes.data;

    if (orderData && orderData.success) {
      const orderId = orderData.data.orderId
      if (formData.paymentMethod === 'cod') {
        cartStore.clearCart()
        router.push(`/orders/${orderId}/success`)
      } else if (formData.paymentMethod === 'vnpay') {
        const vnpayPayload = {
          orderId: orderId,
          amount: totalAmount.value,
          returnUrl: window.location.origin + '/shoestore/payment-result',
          orderInfo: `Thanh toán đơn hàng #${orderId}`,
          payerId: authStore.user.userId
        }
        const resData = await createVNPayPayment(vnpayPayload)
        if (resData.success && resData.data.paymentUrl) {
          window.location.href = resData.data.paymentUrl
        } else {
          alert('Lỗi tạo cổng thanh toán VNPay'); loading.value = false
        }
      }
    } else {
      alert(orderData.message || 'Lỗi tạo đơn'); loading.value = false
    }
  } catch (error) {
    console.error(error); alert('Lỗi hệ thống'); loading.value = false
  }
}
</script>

<style scoped>
/* GENERAL LAYOUT */
.checkout-page {
  background-color: #f8fafc;
  /* Lighter cleaner gray */
  min-height: 100vh;
  padding: 40px 0;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 24px;
  color: #0f172a;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* LAYOUT GRID */
.checkout-layout {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  /* Left wider */
  gap: 32px;
  align-items: start;
}

/* CARDS STYLING */
.card-section,
.summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  border: 1px solid #f1f5f9;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-circle {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff5000;
}

/* FORM ELEMENTS */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.full-width {
  grid-column: span 2;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #475569;
}

.req {
  color: #ef4444;
}

.form-group input,
.form-group textarea,
.select-wrapper select {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  background: #fff;
}

.form-group input:focus,
.form-group textarea:focus,
.select-wrapper select:focus {
  border-color: #ff5000;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 80, 0, 0.1);
}

.err-text {
  font-size: 11px;
  color: #ef4444;
  margin-top: 4px;
  display: block;
}

.error {
  border-color: #ef4444 !important;
}

/* PAYMENT GRID */
.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.payment-card {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-card:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.payment-card.active {
  border-color: #ff5000;
  background: #fff7ed;
}

.payment-card input {
  position: absolute;
  opacity: 0;
}

.pay-icon {
  color: #64748b;
}

.active .pay-icon {
  color: #ff5000;
}

.pay-info {
  display: flex;
  flex-direction: column;
}

.pay-info strong {
  font-size: 14px;
  color: #0f172a;
}

.pay-info span {
  font-size: 12px;
  color: #64748b;
}

.check-mark {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  color: #ff5000;
  font-weight: bold;
}

/* RIGHT COLUMN (STICKY) */
.checkout-right {
  position: sticky;
  top: 20px;
}

.summary-card h3 {
  font-size: 18px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}

.summary-items {
  max-height: 40vh;
  overflow-y: auto;
  margin-bottom: 20px;
}

.s-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.s-img {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
  position: relative;
}

.s-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.s-qty {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #64748b;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
}

.s-info {
  flex: 1;
}

.s-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
}

.s-meta {
  font-size: 12px;
  color: #94a3b8;
}

.s-price {
  font-size: 14px;
  font-weight: 600;
  text-align: right;
}

.price-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price-col .old {
  text-decoration: line-through;
  color: #94a3b8;
  font-size: 11px;
}

.price-col .new {
  color: #ef4444;
}

/* VOUCHER INTEGRATED */
.voucher-wrapper {
  margin-bottom: 20px;
}

.voucher-input-group {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.voucher-input-group:hover {
  border-color: #ff5000;
}

.btn-trigger-voucher {
  background: none;
  border: none;
  font-size: 14px;
  color: #0f172a;
  flex: 1;
  text-align: left;
  cursor: pointer;
}

.voucher-applied {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  padding: 8px 12px;
  border-radius: 6px;
}

.va-left {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #059669;
}

.va-code {
  font-weight: 700;
  font-size: 14px;
}

.btn-remove-voucher {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
}

.va-success-text {
  font-size: 12px;
  color: #059669;
  margin-top: 4px;
  text-align: right;
}

/* TOTALS */
.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 16px 0;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 8px;
  color: #475569;
}

.discount {
  color: #059669;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.total-amount {
  font-size: 20px;
  color: #ff5000;
}

.btn-place-order {
  width: 100%;
  background: #ff5000;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 24px;
  transition: 0.2s;
  box-shadow: 0 4px 6px -1px rgba(255, 80, 0, 0.2);
}

.btn-place-order:hover:not(:disabled) {
  background: #ea580c;
  transform: translateY(-1px);
}

.btn-place-order:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #64748b;
  font-size: 13px;
  text-decoration: none;
}

.back-link:hover {
  color: #ff5000;
}

/* MODAL STYLES */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-panel {
  background: #f8fafc;
  width: 90%;
  max-width: 450px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.modal-head {
  background: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.modal-head h3 {
  margin: 0;
  font-size: 16px;
}

.modal-search-bar {
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 8px;
}

.modal-search-bar input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
}

.modal-search-bar button {
  background: #0f172a;
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
}

.modal-body-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.ticket {
  background: white;
  border-radius: 8px;
  display: flex;
  margin-bottom: 12px;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  transition: 0.2s;
  overflow: hidden;
}

.ticket:hover {
  border-color: #ff5000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.ticket.disabled {
  opacity: 0.6;
  cursor: default;
}

.ticket-stub {
  background: #ff5000;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px dashed #f8fafc;
}

.ticket-content {
  flex: 1;
  padding: 12px;
}

.tc-code {
  font-weight: 700;
  font-size: 14px;
}

.tc-desc {
  font-size: 12px;
  color: #64748b;
  margin: 4px 0;
}

.tc-reason {
  font-size: 11px;
  color: #ef4444;
  font-weight: 600;
}

.tc-valid {
  font-size: 11px;
  color: #94a3b8;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-right {
    position: static;
    order: -1;
  }

  .mobile-only {
    display: block;
  }

  .desktop-only {
    display: none;
  }
}

@media (min-width: 901px) {
  .mobile-only {
    display: none;
  }

  .desktop-only {
    display: block;
  }
}
</style>