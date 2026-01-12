import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, register, logout, getCurrentUser } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const user = ref(null)
  const token = ref(localStorage.getItem('accessToken'))
  const isAuthenticated = ref(!!token.value)

  // Khởi tạo user từ localStorage nếu có
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch (e) {
      console.error('Không thể giải mã dữ liệu người dùng cũ:', e)
      localStorage.removeItem('user')
    }
  }

  // --- ACTIONS ---

  /**
   * Xử lý Đăng nhập
   * Lưu ý: Không dùng try-catch để lỗi 401/400 bắn về Component xử lý hiển thị
   */
  const loginUser = async (username, password) => {
    // Để lỗi tự bay về Component bắt trong khối catch
    const response = await login(username, password)

    // Nếu API trả về success (thường là status 200)
    // Backend LoginResponseDto chỉ trả về { accessToken, refreshToken }
    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data

      // 1. Lưu Token trước
      token.value = accessToken
      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

      // 2. Gọi API lấy thông tin User ngay lập tức
      try {
        const userResp = await getCurrentUser()
        if (userResp.success && userResp.data) {
          const userData = userResp.data

          // Cập nhật State User
          user.value = userData
          isAuthenticated.value = true
          localStorage.setItem('user', JSON.stringify(userData))

          return { success: true }
        }
      } catch (err) {
        // Nếu lấy user thất bại (dù có token), coi như login chưa xong
        console.error('Login successful but failed to fetch user details:', err)
        logoutUser()
        return { success: false, message: 'Không thể lấy thông tin người dùng' }
      }
    }

    // Trường hợp hiếm: status 200 nhưng success = false (logic nghiệp vụ)
    return { success: false, message: response.message || 'Đăng nhập không thành công' }
  }

  /**
   * Xử lý Đăng ký
   * Giữ nguyên logic cũ: Cho phép lỗi trôi lên để useValidationErrors xử lý
   */
  const registerUser = async (userData) => {
    const response = await register(userData)

    if (response.success) {
      return { success: true, message: response.message }
    } else {
      // Ép kiểu về lỗi để Component catch được và parse lỗi validation
      const error = new Error(response.message || 'Đăng ký thất bại')
      error.response = { data: response }
      throw error
    }
  }

  /**
   * Xử lý Đăng xuất
   */
  const logoutUser = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Lỗi khi gọi API Logout:', error)
    } finally {
      // Luôn xóa sạch session dù API logout có lỗi hay không
      user.value = null
      token.value = null
      isAuthenticated.value = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    }
  }

  /**
   * Lấy thông tin user hiện tại (thường dùng khi F5 trang)
   */
  const fetchCurrentUser = async () => {
    if (!token.value) return

    try {
      const response = await getCurrentUser()
      if (response.success && response.data) {
        user.value = response.data
        isAuthenticated.value = true
        localStorage.setItem('user', JSON.stringify(response.data))
      }
    } catch (error) {
      // Nếu token hết hạn hoặc lỗi, thực hiện logout sạch sẽ
      console.warn('Phiên đăng nhập hết hạn')
      logoutUser()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    loginUser,
    registerUser,
    logoutUser,
    fetchCurrentUser,
  }
})