<template>
  <div class="auth-page">
    <Header />
    
    <main class="auth-container">
      <form class="auth-form" @submit.prevent="handleRegister">
        <h2>TẠO TÀI KHOẢN MỚI</h2>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        
        <div class="input-group">
          <label for="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            required
            placeholder="Nhập tên đăng nhập..."
          >
        </div>
        
        <div class="input-group">
          <label for="fullname">Họ và tên</label>
          <input
            type="text"
            id="fullname"
            v-model="formData.fullname"
            required
            placeholder="Nhập họ và tên..."
          >
        </div>
        
        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            placeholder="Nhập email..."
          >
        </div>
        
        <div class="input-group">
          <label for="phone">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            required
            placeholder="Nhập số điện thoại..."
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
        
        <div class="input-group">
          <label for="confirmPassword">Xác nhận Mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            required
            placeholder="Nhập lại mật khẩu..."
          >
        </div>
        
        <div class="input-group checkbox-group">
          <input type="checkbox" id="agree" v-model="formData.agree" required>
          <label for="agree">Tôi đồng ý với <a href="#">Điều khoản Dịch vụ</a></label>
        </div>
        
        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'ĐANG ĐĂNG KÝ...' : 'ĐĂNG KÝ' }}
        </button>
        
        <div class="form-footer">
          <p>Đã có tài khoản? <router-link to="/login">Đăng nhập ngay</router-link></p>
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
  fullname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validate
  if (formData.value.password !== formData.value.confirmPassword) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp!'
    return
  }
  
  if (!formData.value.agree) {
    errorMessage.value = 'Vui lòng đồng ý với điều khoản dịch vụ!'
    return
  }
  
  loading.value = true
  
  try {
    const result = await authStore.registerUser({
      username: formData.value.username,
      fullname: formData.value.fullname,
      email: formData.value.email,
      phone: formData.value.phone,
      password: formData.value.password,
    })
    
    if (result.success) {
      successMessage.value = 'Đăng ký thành công! Chuyển đến trang đăng nhập...'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = result.message || 'Đăng ký thất bại'
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
  max-width: 450px;
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

.success-message {
  background-color: #efe;
  color: #0a0;
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

.input-group input[type="text"],
.input-group input[type="email"],
.input-group input[type="tel"],
.input-group input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.input-group input:focus {
  border-color: #ff5000;
}

.checkbox-group {
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-top: 15px;
  margin-bottom: 25px;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 8px;
  width: auto;
}

.checkbox-group label {
  margin-bottom: 0;
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
  font-size: 14px;
  color: #555;
}

.form-footer a {
  color: #ff5000;
  font-weight: bold;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>
