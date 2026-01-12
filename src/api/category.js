import api from '../utils/api'

/**
 * Get all categories
 * @returns {Promise} API response with categories list
 */
export const getAllCategories = async () => {
  const response = await api.get('/api/v1/categories')
  return response.data
}

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise} API response with category details
 */
export const getCategoryById = async (id) => {
  const response = await api.get(`/api/v1/categories/${id}`)
  return response.data
}

export default {
  getAllCategories,
  getCategoryById
}
