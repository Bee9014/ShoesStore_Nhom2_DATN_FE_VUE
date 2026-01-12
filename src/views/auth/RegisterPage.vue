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

        <div class="input-group" :class="{ 'has-error': hasError('username') }">
          <label for="username">Tên đăng nhập</label>
          <input type="text" id="username" v-model="formData.username" @input="clearFieldError('username')"
            placeholder="Nhập tên đăng nhập...">
          <span v-if="hasError('username')" class="field-error">
            {{ getError('username') }}
          </span>
        </div>

        <div class="input-group" :class="{ 'has-error': hasError('fullName') }">
          <label for="fullName">Họ và tên</label>
          <input type="text" id="fullName" v-model="formData.fullName" @input="clearFieldError('fullName')"
            placeholder="Nhập họ và tên...">
          <span v-if="hasError('fullName')" class="field-error">
            {{ getError('fullName') }}
          </span>
        </div>

        <div class="input-group" :class="{ 'has-error': hasError('email') }">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="formData.email" @input="clearFieldError('email')"
            placeholder="Nhập email...">
          <span v-if="hasError('email')" class="field-error">
            {{ getError('email') }}
          </span>
        </div>

        <div class="input-group" :class="{ 'has-error': hasError('phone') }">
          <label for="phone">Số điện thoại</label>
          <input type="tel" id="phone" v-model="formData.phone" @input="clearFieldError('phone')"
            placeholder="Nhập số điện thoại...">
          <span v-if="hasError('phone')" class="field-error">
            {{ getError('phone') }}
          </span>
        </div>

        <div class="input-group" :class="{ 'has-error': hasError('password') }">
          <label for="password">Mật khẩu</label>
          <input type="password" id="password" v-model="formData.password" @input="clearFieldError('password')"
            placeholder="Nhập mật khẩu...">
          <span v-if="hasError('password')" class="field-error">
            {{ getError('password') }}
          </span>
        </div>

        <div class="input-group">
          <label for="confirmPassword">Xác nhận Mật khẩu</label>
          <input type="password" id="confirmPassword" v-model="formData.confirmPassword"
            placeholder="Nhập lại mật khẩu...">
        </div>

        <div class="input-group checkbox-group">
          <input type="checkbox" id="agree" v-model="formData.agree">
          <label for="agree">Tôi đồng ý với <a href="#">Điều khoản Dịch vụ</a></label>
        </div>

        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'ĐANG ĐĂNG KÝ...' : 'ĐẶT KÝ' }}
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
import { useValidationErrors } from '../../composables/useValidationErrors'
import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()
const { errors, clearErrors, clearFieldError, hasError, getError, handleApiError } = useValidationErrors()

const formData = ref({
  username: '',
  fullName: '', // Đã đổi từ fullname -> fullName cho khớp Backend
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
  clearErrors()
   // Validation phía Client
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,6}$/;
  if (!emailPattern.test(formData.value.email)) {
    errorMessage.value = 'Email không hợp lệ! Vui lòng kiểm tra lại đuôi email (ví dụ: .com, .vn)'
    return
  }

 
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
      fullName: formData.value.fullName, // Đồng bộ key với DTO
      email: formData.value.email,
      phone: formData.value.phone,
      password: formData.value.password,
    })

    if (result.success) {
      successMessage.value = 'Đăng ký thành công! Đang chuyển hướng...'
      setTimeout(() => router.push('/login'), 2000)
    }
  } catch (error) {
    // Xử lý lỗi từ Server (Lỗi 400 Validation hoặc 500)
    const apiMessage = handleApiError(error)

    // Nếu có lỗi validation chi tiết trong data, handleApiError sẽ tự đổ vào object 'errors'
    // Nếu không có lỗi chi tiết, ta hiện message chung lên đầu form
    if (Object.keys(errors.value).length === 0) {
      errorMessage.value = apiMessage
    } else {
      errorMessage.value = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
    }
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
  background-color: #f8f8f8;
}

.auth-form {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.auth-form h2 {
  font-size: 20px;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.error-message {
  background-color: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  background-color: #efe;
  color: #0a0;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
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
  transition: border-color 0.3s;
}

.input-group input:focus {
  border-color: #ff5000;
  outline: none;
}

.input-group.has-error input {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.field-error {
  display: block;
  color: #dc3545;
  font-size: 13px;
  margin-top: 6px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.checkbox-group input {
  width: auto;
  margin-right: 8px;
}

.auth-button {
  width: 100%;
  padding: 14px;
  background-color: #ff5000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
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
  text-align: center;
  font-size: 14px;
}

.form-footer a {
  color: #ff5000;
  font-weight: bold;
  text-decoration: none;
}
</style>