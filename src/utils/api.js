import axios from 'axios'

const api = axios.create({
  // Lưu ý: Nếu tất cả API của bạn đều bắt đầu bằng /api/v1, 
  // hãy thêm nó vào baseURL để các file service viết gọn hơn.
  baseURL: 'http://localhost:8080', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// --- INTERCEPTOR CHO REQUEST ---
// Tự động thêm Token vào Header của mọi yêu cầu nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// --- INTERCEPTOR CHO RESPONSE ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kiểm tra nếu có phản hồi từ server
    if (error.response) {
      const { status, config } = error.response

      // Xử lý lỗi 401 (Unauthorized)
      if (status === 401) {
        // Kiểm tra xem đây có phải là request đăng nhập không
        // Chúng ta không muốn chuyển hướng (redirect) khi người dùng nhập sai mật khẩu
        const isLoginRequest = config.url.includes('/auth/login')

        if (!isLoginRequest) {
          // Chỉ đăng xuất và chuyển hướng nếu KHÔNG phải lỗi từ trang login
          console.warn('Phiên đăng nhập hết hạn hoặc không hợp lệ. Đang chuyển hướng...')
          
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')

          // Tránh vòng lặp chuyển hướng nếu đã ở trang login
          if (window.location.pathname !== '/shoestore/login') {
            window.location.href = '/shoestore/login'
          }
        }
      }
      
      // Bạn có thể xử lý thêm lỗi 403 (Forbidden) hoặc 500 tại đây nếu cần
    } else if (error.request) {
      // Lỗi do không kết nối được đến server (timeout hoặc server die)
      console.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra network.')
    }

    // Luôn trả về Promise.reject để code ở Store/Page có thể dùng try-catch/handleApiError
    return Promise.reject(error)
  }
)

export default api