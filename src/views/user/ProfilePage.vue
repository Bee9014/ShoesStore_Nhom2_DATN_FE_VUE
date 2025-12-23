<template>
  <div class="profile-page">
    <div class="profile-container">
      <h1 class="page-title">THÔNG TIN CÁ NHÂN</h1>
      
      <div class="profile-content">
        <!-- Sidebar Menu -->
        <div class="profile-sidebar">
          <div class="user-info">
            <div class="avatar">
              <User :size="50" />
            </div>
            <h3>{{ authStore.user?.username || 'User' }}</h3>
            <p>{{ authStore.user?.email || 'user@example.com' }}</p>
          </div>
          
          <nav class="profile-menu">
            <button 
              :class="{ active: activeTab === 'info' }"
              @click="activeTab = 'info'"
            >
              <UserCircle :size="20" />
              Thông tin tài khoản
            </button>
            <button 
              :class="{ active: activeTab === 'orders' }"
              @click="activeTab = 'orders'"
            >
              <Package :size="20" />
              Đơn hàng của tôi
            </button>
            <button 
              :class="{ active: activeTab === 'address' }"
              @click="activeTab = 'address'"
            >
              <MapPin :size="20" />
              Địa chỉ nhận hàng
            </button>
            <button 
              :class="{ active: activeTab === 'password' }"
              @click="activeTab = 'password'"
            >
              <Lock :size="20" />
              Đổi mật khẩu
            </button>
          </nav>
          
          <button class="logout-btn" @click="handleLogout">
            <LogOut :size="20" />
            Đăng xuất
          </button>
        </div>
        
        <!-- Main Content -->
        <div class="profile-main">
          <!-- Account Info Tab -->
          <div v-if="activeTab === 'info'" class="tab-content">
            <h2>Thông tin tài khoản</h2>
            
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label>Tên đăng nhập</label>
                <input type="text" :value="authStore.user?.username" disabled>
              </div>
              
              <div class="form-group">
                <label>Họ và tên</label>
                <input type="text" v-model="profileData.fullname" required>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" v-model="profileData.email">
                </div>
                
                <div class="form-group">
                  <label>Số điện thoại</label>
                  <input type="tel" v-model="profileData.phone">
                </div>
              </div>
              
              <div class="form-group">
                <label>Ngày sinh</label>
                <input type="date" v-model="profileData.birthday">
              </div>
              
              <div class="form-group">
                <label>Giới tính</label>
                <div class="radio-group">
                  <label>
                    <input type="radio" value="male" v-model="profileData.gender">
                    Nam
                  </label>
                  <label>
                    <input type="radio" value="female" v-model="profileData.gender">
                    Nữ
                  </label>
                  <label>
                    <input type="radio" value="other" v-model="profileData.gender">
                    Khác
                  </label>
                </div>
              </div>
              
              <button type="submit" class="btn-primary">
                Cập nhật thông tin
              </button>
            </form>
          </div>
          
          <!-- Orders Tab -->
          <div v-else-if="activeTab === 'orders'" class="tab-content">
            <h2>Đơn hàng của tôi</h2>
            
            <div class="orders-filter">
              <button :class="{ active: orderStatus === 'all' }" @click="orderStatus = 'all'">
                Tất cả
              </button>
              <button :class="{ active: orderStatus === 'pending' }" @click="orderStatus = 'pending'">
                Chờ xác nhận
              </button>
              <button :class="{ active: orderStatus === 'processing' }" @click="orderStatus = 'processing'">
                Đang xử lý
              </button>
              <button :class="{ active: orderStatus === 'shipping' }" @click="orderStatus = 'shipping'">
                Đang giao
              </button>
              <button :class="{ active: orderStatus === 'completed' }" @click="orderStatus = 'completed'">
                Hoàn thành
              </button>
              <button :class="{ active: orderStatus === 'cancelled' }" @click="orderStatus = 'cancelled'">
                Đã hủy
              </button>
            </div>
            
            <div class="orders-list">
              <div class="empty-message" v-if="orders.length === 0">
                <Package :size="60" />
                <p>Chưa có đơn hàng nào</p>
              </div>
              
              <div v-else class="order-item" v-for="order in orders" :key="order.id">
                <div class="order-header">
                  <span class="order-code">Đơn hàng #{{ order.id }}</span>
                  <span :class="`order-status ${order.status}`">{{ getStatusText(order.status) }}</span>
                </div>
                
                <div class="order-products">
                  <div v-for="item in order.items" :key="item.id" class="order-product">
                    <img :src="getImageUrl(item.imageUrl)" :alt="item.name">
                    <div>
                      <p>{{ item.name }}</p>
                      <span>x{{ item.quantity }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="order-footer">
                  <span class="order-total">Tổng: {{ formatPrice(order.total) }}</span>
                  <button class="btn-secondary">Xem chi tiết</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Address Tab -->
          <div v-else-if="activeTab === 'address'" class="tab-content">
            <h2>Địa chỉ nhận hàng</h2>
            
            <div class="address-list">
              <div class="empty-message" v-if="addresses.length === 0">
                <MapPin :size="60" />
                <p>Chưa có địa chỉ nào</p>
                <button class="btn-primary" @click="showAddressForm = true">
                  Thêm địa chỉ mới
                </button>
              </div>
              
              <div v-else>
                <button class="btn-primary mb-3" @click="showAddressForm = true">
                  + Thêm địa chỉ mới
                </button>
                
                <div class="address-item" v-for="address in addresses" :key="address.id">
                  <div class="address-content">
                    <h4>{{ address.name }}</h4>
                    <p>{{ address.phone }}</p>
                    <p>{{ address.address }}, {{ address.district }}, {{ address.city }}</p>
                  </div>
                  <div class="address-actions">
                    <button class="btn-edit">Sửa</button>
                    <button class="btn-delete">Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Password Tab -->
          <div v-else-if="activeTab === 'password'" class="tab-content">
            <h2>Đổi mật khẩu</h2>
            
            <form @submit.prevent="changePassword" class="profile-form">
              <div class="form-group">
                <label>Mật khẩu hiện tại</label>
                <input type="password" v-model="passwordData.currentPassword" required>
              </div>
              
              <div class="form-group">
                <label>Mật khẩu mới</label>
                <input type="password" v-model="passwordData.newPassword" required minlength="6">
              </div>
              
              <div class="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input type="password" v-model="passwordData.confirmPassword" required>
              </div>
              
              <button type="submit" class="btn-primary">
                Đổi mật khẩu
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, UserCircle, Package, MapPin, Lock, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'
import { getImageUrl } from '@/helpers/userHelper'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('info')
const orderStatus = ref('all')
const showAddressForm = ref(false)

const profileData = ref({
  fullname: authStore.user?.fullname || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  birthday: '',
  gender: 'male',
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Mock data
const orders = ref([])
const addresses = ref([])

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipping: 'Đang giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  }
  return statusMap[status] || status
}

const updateProfile = async () => {
  // TODO: Call API to update profile
  alert('Cập nhật thông tin thành công!')
}

const changePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!')
    return
  }
  
  // TODO: Call API to change password
  alert('Đổi mật khẩu thành công!')
  passwordData.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

const handleLogout = async () => {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    await authStore.logoutUser()
    router.push('/login')
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 80vh;
  padding: 40px 5%;
  background-color: #f8f8f8;
}

.profile-container {
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

.profile-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

/* Sidebar */
.profile-sidebar {
  background: white;
  padding: 25px;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.user-info {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: #ff5000;
}

.user-info h3 {
  font-size: 18px;
  margin-bottom: 5px;
}

.user-info p {
  font-size: 14px;
  color: #666;
}

.profile-menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.profile-menu button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.profile-menu button:hover,
.profile-menu button.active {
  background: #fff5f2;
  color: #ff5000;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: none;
  border: 1px solid #c00;
  color: #c00;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 14px;
  width: 100%;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #c00;
  color: white;
}

/* Main Content */
.profile-main {
  background: white;
  padding: 30px;
  border-radius: 8px;
  min-height: 500px;
}

.tab-content h2 {
  font-size: 22px;
  margin-bottom: 25px;
  color: #333;
}

.profile-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:disabled {
  background: #f8f8f8;
  color: #999;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.btn-primary {
  padding: 12px 30px;
  background: #ff5000;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #e64500;
}

/* Orders */
.orders-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.orders-filter button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.orders-filter button.active,
.orders-filter button:hover {
  background: #ff5000;
  color: white;
  border-color: #ff5000;
}

.empty-message {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-message svg {
  color: #ddd;
  margin-bottom: 15px;
}

.order-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.order-code {
  font-weight: 600;
}

.order-status {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.order-status.pending {
  background: #fff5e6;
  color: #ff9800;
}

.order-status.completed {
  background: #e8f5e9;
  color: #4caf50;
}

.order-products {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.order-product {
  display: flex;
  gap: 10px;
  align-items: center;
}

.order-product img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  font-size: 18px;
  font-weight: 700;
  color: #ff5000;
}

.btn-secondary {
  padding: 8px 20px;
  background: white;
  color: #ff5000;
  border: 1px solid #ff5000;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #ff5000;
  color: white;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  .profile-sidebar {
    position: static;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
