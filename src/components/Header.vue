<template>
  <header class="header">
    <div class="top-bar">
      <p>Hotline: 0966158666 (8h - 21h30) | Liên hệ hợp tác</p>
      <div class="user-actions">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/register">ĐĂNG KÝ</router-link>
          <span>|</span>
          <router-link to="/login">ĐĂNG NHẬP</router-link>
        </template>
        <template v-else>
          <span>Xin chào, {{ authStore.user?.username || 'User' }}</span>
          <span>|</span>
          <a href="#" @click.prevent="handleLogout">ĐĂNG XUẤT</a>
        </template>
      </div>
    </div>
    
    <nav class="main-nav">
      <div class="logo">
        <router-link to="/">
          <span class="logo-text">SHOESSTORE</span>
        </router-link>
      </div>
      
      <ul class="nav-links">
        <li><router-link to="/">TRANG CHỦ</router-link></li>
        <li><router-link to="/products">SẢN PHẨM</router-link></li>
        <li><a href="#">VỀ CHÚNG TÔI</a></li>
        <li><a href="#">NAM</a></li>
        <li><a href="#">NỮ</a></li>
        <li><a href="#">TEEN NAM</a></li>
        <li><a href="#">TEEN NỮ</a></li>
        <li><a href="#">BÉ TRAI</a></li>
        <li><a href="#">BÉ GÁI</a></li>
        <li><a href="#">PHỤ KIỆN</a></li>
      </ul>
      
      <div class="nav-icons">
        <input 
          type="text" 
          placeholder="Tìm kiếm..." 
          v-model="searchQuery" 
          @keyup.enter="handleSearch"
        >
        <Search :size="20" @click="handleSearch" style="cursor: pointer" />
        <router-link to="/orders" class="icon-link" v-if="authStore.isAuthenticated" title="Đơn hàng của tôi">
          <Package :size="20" />
        </router-link>
        <router-link to="/profile" class="icon-link" v-if="authStore.isAuthenticated" title="Tài khoản">
          <User :size="20" />
        </router-link>
        <router-link to="/cart" class="icon-link cart-icon" title="Giỏ hàng">
          <ShoppingCart :size="20" />
          <span v-if="cartStore.cartCount > 0" class="cart-badge">{{ cartStore.cartCount }}</span>
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, User, ShoppingCart, Package } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const searchQuery = ref('')

const handleSearch = () => {
  const keyword = searchQuery.value.trim()
  if (keyword) {
    // Redirect to products page with search query
    router.push({
      path: '/products',
      query: { search: keyword }
    })
    // Clear search input
    searchQuery.value = ''
  }
}

const handleLogout = async () => {
  await authStore.logoutUser()
  router.push('/login')
}
</script>

<style scoped>
.header {
  width: 100%;
  border-bottom: 1px solid #eee;
}

.top-bar {
  background-color: #f7f7f7;
  padding: 8px 5%;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #555;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-actions a {
  font-weight: 600;
  cursor: pointer;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5%;
}

.logo-text {
  font-size: 24px;
  font-weight: 900;
  color: #ff5000;
  letter-spacing: 1px;
}

.logo img {
  height: 50px;
}

.nav-links {
  display: flex;
  gap: 20px;
  font-size: 14px;
  font-weight: bold;
}

.nav-links a:hover {
  color: #ff5000;
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-icons input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
}

.icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: color 0.3s;
  position: relative;
}

.icon-link:hover {
  color: #ff5000;
}

.cart-icon {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff5000;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.nav-icons svg {
  cursor: pointer;
  color: #555;
  transition: color 0.3s;
}

.nav-icons svg:hover {
  color: #ff5000;
}
</style>
