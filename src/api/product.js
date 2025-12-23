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
