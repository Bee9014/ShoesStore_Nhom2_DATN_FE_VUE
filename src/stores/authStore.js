import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, register, logout, getCurrentUser } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('accessToken'))
  const isAuthenticated = ref(!!token.value)

  // Load user from localStorage on init
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch (e) {
      console.error('Failed to parse saved user:', e)
    }
  }

  const loginUser = async (username, password) => {
    try {
      const response = await login(username, password)
      
      if (response.success && response.data) {
        token.value = response.data.accessToken
        user.value = response.data.user
        isAuthenticated.value = true
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.user)) // ✅ Save user to localStorage
        return { success: true }
      }
      
      return { success: false, message: response.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại',
      }
    }
  }

  const registerUser = async (userData) => {
    try {
      const response = await register(userData)
      return response.success
        ? { success: true, message: response.message }
        : { success: false, message: response.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng ký thất bại',
      }
    }
  }

  const logoutUser = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      isAuthenticated.value = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user') // ✅ Remove user from localStorage
    }
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return
    
    try {
      const response = await getCurrentUser()
      if (response.success && response.data) {
        user.value = response.data
        isAuthenticated.value = true
        localStorage.setItem('user', JSON.stringify(response.data)) // ✅ Save user to localStorage
      }
    } catch (error) {
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
