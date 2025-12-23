<template>
  <div class="auth-page">
    <Header />
    
    <main class="auth-container">
      <form class="auth-form" @submit.prevent="handleLogin">
        <h2>ĐĂNG NHẬP TÀI KHOẢN</h2>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div class="input-group">
          <label for="username">Tên đăng nhập hoặc Email</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            required
            placeholder="Nhập tên đăng nhập..."
          >
        </div>
        
        <div class="input-group">
          <label for="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            placeholder="Nhập mật khẩu..."
          >
        </div>
        
        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP' }}
        </button>
        
        <div class="form-footer">
          <a href="#">Quên mật khẩu?</a>
          <span>|</span>
          <router-link to="/register">Đăng ký tài khoản mới</router-link>
        </div>
      </form>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const result = await authStore.loginUser(formData.value.username, formData.value.password)
    
    if (result.success) {
      router.push('/')
    } else {
      errorMessage.value = result.message || 'Đăng nhập thất bại'
    }
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra. Vui lòng thử lại!'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.auth-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px 5%;
  min-height: 80vh;
  background-color: #f8f8f8;
}

.auth-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-form h2 {
  font-size: 20px;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
}

.error-message {
  background-color: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.input-group {
  text-align: left;
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.input-group input:focus {
  border-color: #ff5000;
}

.auth-button {
  width: 100%;
  padding: 12px;
  background-color: #ff5000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.auth-button:hover:not(:disabled) {
  background-color: #e64500;
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  margin-top: 20px;
  font-size: 13px;
  color: #555;
}

.form-footer a {
  color: #ff5000;
  font-weight: bold;
}

.form-footer a:hover {
  text-decoration: underline;
}

.form-footer span {
  margin: 0 10px;
}
</style>
