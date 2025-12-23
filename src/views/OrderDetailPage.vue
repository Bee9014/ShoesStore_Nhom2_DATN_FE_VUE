<template>
  <div class="order-detail-page">
    <div class="container">
      <!-- Back Button -->
      <button @click="goBack" class="back-btn">
        <ArrowLeft :size="20" />
        Quay lại danh sách đơn hàng
      </button>
      
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Đang tải chi tiết đơn hàng...</p>
      </div>
      
      <!-- Error -->
      <div v-else-if="error" class="error-container">
        <XCircle :size="60" class="error-icon" />
        <h2>Không thể tải đơn hàng</h2>
        <p>{{ error }}</p>
        <button @click="goBack" class="btn-primary">Quay lại</button>
      </div>
      
      <!-- Order Detail -->
      <div v-else-if="order" class="order-detail">
        <!-- Header -->
        <div class="detail-header">
          <div class="header-left">
            <h1>Đơn hàng #{{ order.orderId }}</h1>
            <span class="order-date">Đặt ngày {{ formatDate(order.orderDate) }}</span>
          </div>
          <span :class="['status-badge', getStatusClass(order.status)]">
            {{ getStatusLabel(order.status) }}
          </span>
        </div>
        
        <!-- Order Timeline -->
        <div class="order-timeline">
          <h2>Trạng thái đơn hàng</h2>
          <div class="timeline">
            <div
              v-for="(step, index) in timelineSteps"
              :key="index"
              :class="['timeline-step', { active: step.active, completed: step.completed }]"
            >
              <div class="step-icon">
                <component :is="step.icon" :size="24" />
              </div>
              <div class="step-content">
                <h3>{{ step.title }}</h3>
                <p v-if="step.date">{{ step.date }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Order Items -->
        <div class="order-items-section">
          <h2>Sản phẩm đã đặt</h2>
          <div class="items-list">
            <div
              v-for="item in orderItems"
              :key="item.orderItemId"
              class="order-item"
            >
              <div class="item-image">
                <Package :size="40" />
              </div>
              <div class="item-info">
                <h3>{{ item.productNameSnapshot }}</h3>
                <p class="item-quantity">Số lượng: {{ item.quantity }}</p>
              </div>
              <div class="item-price">
                <p class="unit-price">{{ formatPrice(item.unitPrice) }}</p>
                <p class="total-price">{{ formatPrice(item.totalPrice) }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Shipping Info -->
        <div class="info-grid">
          <div class="info-card">
            <h2>Thông tin giao hàng</h2>
            <div class="info-row">
              <User :size="18" />
              <span>{{ order.shippingFullname }}</span>
            </div>
            <div class="info-row">
              <Phone :size="18" />
              <span>{{ order.shippingPhone }}</span>
            </div>
            <div class="info-row">
              <MapPin :size="18" />
              <span>{{ order.shippingAddress }}, {{ order.shippingCity }}</span>
            </div>
            <div v-if="order.note" class="info-row">
              <FileText :size="18" />
              <span>{{ order.note }}</span>
            </div>
          </div>
          
          <!-- Payment Summary -->
          <div class="info-card">
            <h2>Thanh toán</h2>
            <div class="payment-row">
              <span>Tạm tính:</span>
              <span>{{ formatPrice(order.totalAmount) }}</span>
            </div>
            <div class="payment-row">
              <span>Giảm giá:</span>
              <span class="discount">-{{ formatPrice(order.discountAmount) }}</span>
            </div>
            <div class="payment-row">
              <span>Phí vận chuyển:</span>
              <span>{{ formatPrice(shippingFee) }}</span>
            </div>
            <div class="payment-row total">
              <span>Tổng cộng:</span>
              <strong>{{ formatPrice(order.finalAmount) }}</strong>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="order-actions">
          <button
            v-if="canCancelOrder"
            @click="handleCancelOrder"
            class="btn-cancel"
          >
            <XCircle :size="20" />
            Hủy đơn hàng
          </button>
          <button @click="handleReorder" class="btn-reorder">
            <ShoppingCart :size="20" />
            Đặt lại đơn hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  FileText,
  ShoppingCart,
  XCircle,
  Clock,
  Truck,
  CheckCircle,
  Box
} from 'lucide-vue-next'
import { getOrderDetail, cancelOrder } from '../api/order'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const order = ref(null)
const orderItems = ref([])
const loading = ref(false)
const error = ref(null)
const shippingFee = ref(30000)

const canCancelOrder = computed(() => {
  return order.value && (order.value.status === 'PENDING' || order.value.status === 'pending')
})

const timelineSteps = computed(() => {
  if (!order.value) return []
  
  const status = order.value.status.toUpperCase()
  
  return [
    {
      icon: Clock,
      title: 'Đơn hàng đã đặt',
      date: formatDate(order.value.orderDate),
      active: true,
      completed: true,
    },
    {
      icon: Box,
      title: 'Đang xử lý',
      date: status !== 'PENDING' ? formatDate(order.value.createdAt) : null,
      active: status !== 'PENDING',
      completed: status !== 'PENDING',
    },
    {
      icon: Truck,
      title: 'Đang giao hàng',
      date: status === 'SHIPPING' || status === 'DELIVERED' ? formatDate(order.value.updatedAt) : null,
      active: status === 'SHIPPING' || status === 'DELIVERED',
      completed: status === 'DELIVERED',
    },
    {
      icon: CheckCircle,
      title: 'Đã giao hàng',
      date: status === 'DELIVERED' ? formatDate(order.value.updatedAt) : null,
      active: status === 'DELIVERED',
      completed: status === 'DELIVERED',
    },
  ]
})

const fetchOrderDetail = async () => {
  loading.value = true
  error.value = null
  
  try {
    const orderId = route.params.orderId
    const response = await getOrderDetail(orderId)
    
    if (response.success) {
      order.value = response.data.order
      orderItems.value = response.data.items || []
    } else {
      error.value = response.message || 'Không thể tải thông tin đơn hàng'
    }
  } catch (err) {
    console.error('Error fetching order detail:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải đơn hàng'
  } finally {
    loading.value = false
  }
}

const handleCancelOrder = async () => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
    return
  }
  
  try {
    const response = await cancelOrder(order.value.orderId, authStore.user.userId)
    
    if (response.success) {
      alert('Hủy đơn hàng thành công!')
      fetchOrderDetail() // Refresh
    } else {
      alert('Không thể hủy đơn hàng: ' + response.message)
    }
  } catch (err) {
    console.error('Error cancelling order:', err)
    alert('Có lỗi xảy ra: ' + (err.message || 'Vui lòng thử lại!'))
  }
}

const handleReorder = () => {
  if (!orderItems.value || orderItems.value.length === 0) {
    alert('Không thể đặt lại đơn hàng: Không có sản phẩm')
    return
  }
  
  // TODO: Add items to cart from order
  // For now, just redirect to home
  alert('Tính năng đặt lại đơn hàng sẽ được cập nhật sớm!')
  router.push('/')
}

const goBack = () => {
  router.push('/orders')
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status) => {
  const labels = {
    'PENDING': 'Chờ xử lý',
    'pending': 'Chờ xử lý',
    'SHIPPING': 'Đang giao',
    'shipping': 'Đang giao',
    'DELIVERED': 'Đã giao',
    'delivered': 'Đã giao',
    'CANCELLED': 'Đã hủy',
    'cancelled': 'Đã hủy',
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'PENDING': 'status-pending',
    'pending': 'status-pending',
    'SHIPPING': 'status-shipping',
    'shipping': 'status-shipping',
    'DELIVERED': 'status-delivered',
    'delivered': 'status-delivered',
    'CANCELLED': 'status-cancelled',
    'cancelled': 'status-cancelled',
  }
  return classes[status] || ''
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail-page {
  min-height: 80vh;
  padding: 40px 5%;
  background-color: #f8f8f8;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 30px;
  transition: all 0.3s;
}

.back-btn:hover {
  border-color: #ff5000;
  color: #ff5000;
}

/* Loading & Error */
.loading-container,
.error-container {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff5000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  color: #c00;
  margin-bottom: 20px;
}

.error-container h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.error-container p {
  color: #666;
  margin-bottom: 30px;
}

.btn-primary {
  padding: 12px 30px;
  background-color: #ff5000;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background-color: #e64500;
}

/* Order Detail */
.order-detail {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  background: white;
  border-radius: 8px;
}

.header-left h1 {
  font-size: 28px;
  font-weight: 900;
  color: #333;
  margin-bottom: 8px;
}

.order-date {
  font-size: 14px;
  color: #666;
}

.status-badge {
  padding: 10px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-shipping {
  background: #cfe2ff;
  color: #084298;
}

.status-delivered {
  background: #d1e7dd;
  color: #0f5132;
}

.status-cancelled {
  background: #f8d7da;
  color: #842029;
}

/* Timeline */
.order-timeline {
  background: white;
  padding: 30px;
  border-radius: 8px;
}

.order-timeline h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #333;
}

.timeline {
  display: flex;
  gap: 30px;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 30px;
  right: 30px;
  height: 2px;
  background: #eee;
  z-index: 0;
}

.timeline-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 1;
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  border: 3px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  transition: all 0.3s;
}

.timeline-step.active .step-icon {
  border-color: #ff5000;
  background: #fff5f2;
  color: #ff5000;
}

.timeline-step.completed .step-icon {
  border-color: #00a651;
  background: #e8f5e9;
  color: #00a651;
}

.step-content {
  text-align: center;
}

.step-content h3 {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.step-content p {
  font-size: 12px;
  color: #666;
}

/* Order Items */
.order-items-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
}

.order-items-section h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
}

.item-image {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.item-quantity {
  font-size: 14px;
  color: #666;
}

.item-price {
  text-align: right;
}

.unit-price {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.total-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff5000;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.info-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
}

.info-card h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 15px;
  color: #666;
}

.payment-row.total {
  padding-top: 20px;
  margin-top: 15px;
  border-top: 2px solid #eee;
  font-size: 18px;
  color: #333;
}

.payment-row.total strong {
  font-size: 24px;
  color: #ff5000;
}

.discount {
  color: #00a651;
}

/* Actions */
.order-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-reorder {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  color: #c00;
  border: 2px solid #c00;
}

.btn-cancel:hover {
  background: #c00;
  color: white;
}

.btn-reorder {
  background: #ff5000;
  color: white;
}

.btn-reorder:hover {
  background: #e64500;
}

@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .timeline {
    flex-direction: column;
    gap: 20px;
  }
  
  .timeline::before {
    left: 30px;
    right: auto;
    top: 30px;
    bottom: 30px;
    width: 2px;
    height: auto;
  }
  
  .timeline-step {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }
  
  .step-content {
    text-align: left;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .order-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-price {
    width: 100%;
    text-align: center;
  }
  
  .order-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-reorder {
    width: 100%;
    justify-content: center;
  }
}
</style>
