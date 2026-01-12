import { ref } from 'vue'

/**
 * Composable để xử lý validation errors từ backend
 * Sử dụng cho các form với validation
 * 
 * @returns {Object} - Chứa errors object và helper functions
 */
export function useValidationErrors() {
  // Object chứa lỗi cho từng field
  const errors = ref({})
  
  /**
   * Set lỗi validation từ API response
   * @param {Object} errorData - Map<String, String> từ backend
   * 
   * Backend format:
   * {
   *   "fullName": "Họ tên không được để trống",
   *   "email": "Email sai định dạng"
   * }
   */
  const setErrors = (errorData) => {
    errors.value = errorData || {}
  }
  
  /**
   * Clear tất cả errors
   */
  const clearErrors = () => {
    errors.value = {}
  }
  
  /**
   * Clear error của một field cụ thể
   * @param {String} fieldName - Tên field cần clear
   */
  const clearFieldError = (fieldName) => {
    if (errors.value[fieldName]) {
      delete errors.value[fieldName]
    }
  }
  
  /**
   * Kiểm tra xem một field có lỗi không
   * @param {String} fieldName - Tên field
   * @returns {Boolean}
   */
  const hasError = (fieldName) => {
    return !!errors.value[fieldName]
  }
  
  /**
   * Lấy error message của một field
   * @param {String} fieldName - Tên field
   * @returns {String|null}
   */
  const getError = (fieldName) => {
    return errors.value[fieldName] || null
  }
  
  /**
   * Xử lý error response từ Axios
   * Tự động phân biệt validation error (400) vs server error (500)
   * 
   * @param {Object} error - Axios error object
   * @returns {String} - General error message
   */
  const handleApiError = (error) => {
    console.log('[useValidationErrors] Handling error:', error)
    
    // Check if it's an axios error with response
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      
      console.log('[useValidationErrors] Status:', status, 'Data:', data)
      
      // Validation errors (400)
      if (status === 400 && data.data && typeof data.data === 'object') {
        console.log('[useValidationErrors] Setting validation errors:', data.data)
        setErrors(data.data)
        return data.message || 'Dữ liệu không hợp lệ'
      }
      
      // Other API errors
      return data.message || 'Có lỗi xảy ra từ máy chủ'
    }
    
    // Check custom error format (from authStore)
    if (error.isApiError && error.data) {
      console.log('[useValidationErrors] Custom API error:', error.data)
      if (error.data.data && typeof error.data.data === 'object') {
        setErrors(error.data.data)
        return error.data.message || 'Dữ liệu không hợp lệ'
      }
    }
    
    // Network errors or other errors
    console.log('[useValidationErrors] Generic error:', error.message)
    return error.message || 'Có lỗi xảy ra. Vui lòng thử lại!'
  }
  
  return {
    errors,
    setErrors,
    clearErrors,
    clearFieldError,
    hasError,
    getError,
    handleApiError,
  }
}
