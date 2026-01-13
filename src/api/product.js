import api from '../utils/api'

export const getAllProducts = async (params = {}) => {
  const response = await api.get('/api/v1/products', { params })
  return response.data
}

export const getFeaturedProducts = async () => {
  // Gọi vào endpoint mới bạn đã tạo ở Backend
  const response = await api.get('/api/v1/products/featured')
  return response.data
}

export const getBestSellers = async () => {
  const response = await api.get('/api/v1/products/bestsellers')
  return response.data
}

/**
 * Get best sellers with pagination (max 50)
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size (default 12, max 50)
 */
export const getBestSellersPaged = async (page = 0, size = 12) => {
  const response = await api.get('/api/v1/products/bestsellers/paged', {
    params: { page, size }
  })
  return response.data
}

/**
 * Search products by brand or name
 * @param {string} keyword - Search keyword
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size (default 12)
 */
export const searchProducts = async (title, page = 0, size = 12) => {
  const response = await api.get('/api/v1/products', {
    params: { title, page, size }
  })
  // Endpoint products trả về PageResponse trực tiếp ở response.data.data
  // Tuy nhiên, api/product.js hàm searchProducts cũ trả về response.data 
  // (vì Controller cũ có thể trả về khác). 
  // API getAllProducts trả về ApiResponse<PageResponse>, nên data thực là response.data.data
  // Nhưng axios interceptor (nếu có) hoặc logic ở ProductPage cần cẩn thận.
  // Xem lại getAllProducts: return response.data

  // Controller getAllProducts returns ApiResponse<PageResponse>
  // Controller searchProducts returns ApiResponse<PageResponse>
  // Cấu trúc giống nhau. 
  return response.data
}

export const getProductById = async (id) => {
  const response = await api.get(`/api/v1/products/${id}`)
  return response.data
}

export const searchProductsByName = async (name) => {
  const response = await api.get('/api/v1/products/search/name', { params: { name } })
  return response.data
}

export const getProductsByCategory = async (categoryId, params = {}) => {
  const response = await api.get('/api/v1/products', {
    params: { ...params, categoryId },
  })
  return response.data
}
