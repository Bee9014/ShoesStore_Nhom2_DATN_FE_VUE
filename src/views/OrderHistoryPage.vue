<template>
  <div class="order-history-page">
    <div class="container">
      <h1 class="page-title">Đơn hàng của tôi</h1>
      
      <!-- Status Tabs -->
      <div class="status-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="selectTab(tab.value)"
          :class="['tab-btn', { active: currentTab === tab.value }]"
        >
          <component :is="tab.icon" :size="18" />
          <span>{{ tab.label }}</span>
          <span v-if="tab.count" class="count-badge">{{ tab.count }}</span>
        </button>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Đang tải đơn hàng...</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="empty-state">
        <Package :size="80" class="empty-icon" />
        <h2>Chưa có đơn hàng nào</h2>
        <p>{{ getEmptyMessage() }}</p>
        <router-link to="/" class="btn-primary">
          Tiếp tục mua sắm
        </router-link>
      </div>
      
      <!-- Orders List -->
      <div v-else class="orders-list">
        <div
          v-for="order in orders"
          :key="order.orderId"
          class="order-card"
          @click="goToDetail(order.orderId)"
        >
          <!-- Order Header -->
          <div class="order-header">
            <div class="order-info">
              <h3>Đơn hàng #{{ order.orderId }}</h3>
              <span class="order-date">{{ formatDate(order.orderDate) }}</span>
            </div>
            <span :class="['status-badge', getStatusClass(order.status)]">
              {{ getStatusLabel(order.status) }}
            </span>
          </div>
          
          <!-- Order Items Preview -->
          <div class="order-items-preview">
            <div class="item-summary">
              <Package :size="18" />
              <span>{{ order.itemCount || 'N/A' }} sản phẩm</span>
            </div>
          </div>
          
          <!-- Order Footer -->
          <div class="order-footer">
            <div class="order-total">
              <span>Tổng tiền:</span>
              <strong>{{ formatPrice(order.finalAmount) }}</strong>
            </div>
            <div class="order-actions">
              <button
                v-if="order.status === 'PENDING' || order.status === 'pending'"
                @click.stop="handleCancelOrder(order.orderId)"
                class="btn-cancel"
              >
                Hủy đơn
              </button>
              <button class="btn-detail">
                Xem chi tiết
                <ChevronRight :size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          <ChevronLeft :size="18" />
          Trước
        </button>
        
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="['page-number', { active: page === currentPage }]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          Sau
          <ChevronRight :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  List,
  ChevronRight,
  ChevronLeft
} from 'lucide-vue-next'
import { getMyOrders, cancelOrder } from '../api/order'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const currentTab = ref('all')
const orders = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalOrders = ref(0)

const statusTabs = ref([
  { value: 'all', label: 'Tất cả', icon: List, count: 0 },
  { value: 'pending', label: 'Chờ xử lý', icon: Clock, count: 0 },
  { value: 'shipping', label: 'Đang giao', icon: Truck, count: 0 },
  { value: 'delivered', label: 'Đã giao', icon: CheckCircle, count: 0 },
  { value: 'cancelled', label: 'Đã hủy', icon: XCircle, count: 0 },
])

const totalPages = computed(() => {
  return Math.ceil(totalOrders.value / pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const selectTab = (tabValue) => {
  currentTab.value = tabValue
  currentPage.value = 1
  fetchOrders()
}

const fetchOrders = async () => {
  console.log("👉 Current User:", authStore.user);
  if (!authStore.user || !authStore.user.userId) {
    router.push('/login')
    return
  }
  
  loading.value = true
  
  try {
    const params = {
      userId: authStore.user.userId,
      page: currentPage.value,
      size: pageSize.value,
    }
    
    // Add status filter if not "all"
    if (currentTab.value !== 'all') {
      params.status = currentTab.value.toUpperCase()
    }
    
    const response = await getMyOrders(params)
    
    if (response.success) {
      orders.value = response.data.content || []
      totalOrders.value = response.data.totalElements || 0
      
      // Update counts in tabs (mock - should come from API)
      updateTabCounts()
    } else {
      console.error('Failed to fetch orders:', response.message)
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    alert('Không thể tải danh sách đơn hàng: ' + (error.message || 'Vui lòng thử lại!'))
  } finally {
    loading.value = false
  }
}

const updateTabCounts = () => {
  // TODO: Get real counts from API
  // For now, just show total for "all" tab
  const allTab = statusTabs.value.find(t => t.value === 'all')
  if (allTab) {
    allTab.count = totalOrders.value
  }
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchOrders()
}

const goToDetail = (orderId) => {
  router.push(`/orders/${orderId}`)
}

const handleCancelOrder = async (orderId) => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
    return
  }
  
  try {
    const response = await cancelOrder(orderId, authStore.user.userId)
    
    if (response.success) {
      alert('Hủy đơn hàng thành công!')
      fetchOrders() // Refresh list
    } else {
      alert('Không thể hủy đơn hàng: ' + response.message)
    }
  } catch (error) {
    console.error('Error cancelling order:', error)
    alert('Có lỗi xảy ra khi hủy đơn hàng: ' + (error.message || 'Vui lòng thử lại!'))
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
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

const getEmptyMessage = () => {
  const messages = {
    all: 'Bạn chưa có đơn hàng nào',
    pending: 'Không có đơn hàng đang chờ xử lý',
    shipping: 'Không có đơn hàng đang giao',
    delivered: 'Không có đơn hàng đã giao',
    cancelled: 'Không có đơn hàng đã hủy',
  }
  return messages[currentTab.value] || 'Không có đơn hàng'
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-history-page {
  min-height: 80vh;
  padding: 40px 5%;
  background-color: #f8f8f8;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 28px;
  font-weight: 900;
  color: #333;
  margin-bottom: 30px;
}

/* Status Tabs */
.status-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  white-space: nowrap;
}

.tab-btn:hover {
  border-color: #ff5000;
  color: #ff5000;
}

.tab-btn.active {
  background: #ff5000;
  border-color: #ff5000;
  color: white;
}

.count-badge {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.tab-btn.active .count-badge {
  background: rgba(255, 255, 255, 0.2);
}

/* Loading */
.loading-container {
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
}

.empty-icon {
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
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

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #eee;
}

.order-card:hover {
  border-color: #ff5000;
  box-shadow: 0 4px 12px rgba(255, 80, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.order-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.order-date {
  font-size: 13px;
  color: #666;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
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

.order-items-preview {
  margin-bottom: 15px;
}

.item-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.order-total {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-total span {
  font-size: 13px;
  color: #666;
}

.order-total strong {
  font-size: 20px;
  color: #ff5000;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.btn-cancel,
.btn-detail {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-cancel {
  background: white;
  color: #c00;
  border: 1px solid #c00;
}

.btn-cancel:hover {
  background: #c00;
  color: white;
}

.btn-detail {
  background: #ff5000;
  color: white;
}

.btn-detail:hover {
  background: #e64500;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
}

.page-btn,
.page-number {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
}

.page-btn:hover:not(:disabled),
.page-number:hover {
  border-color: #ff5000;
  color: #ff5000;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number.active {
  background: #ff5000;
  border-color: #ff5000;
  color: white;
}

@media (max-width: 768px) {
  .order-header,
  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .order-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-detail {
    width: 100%;
    justify-content: center;
  }
}
</style>
