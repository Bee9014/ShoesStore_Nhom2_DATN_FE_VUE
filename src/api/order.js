import api from '../utils/api'

/**
 * Order API Service
 */

/**
 * Tạo đơn hàng mới
 * @param {Object} orderData - Thông tin đơn hàng
 * @returns {Promise} API response
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/api/v1/orders', orderData)
  return response.data
}

/**
 * Lấy chi tiết đơn hàng
 * @param {number} orderId - ID đơn hàng
 * @returns {Promise} API response
 */
export const getOrderDetail = async (orderId) => {
  const response = await api.get(`/api/v1/orders/${orderId}`)
  return response.data
}

/**
 * Lấy danh sách đơn hàng của user
 * @param {Object} params - { userId, page, size }
 * @returns {Promise} API response
 */
export const getMyOrders = async (params = {}) => {
  const response = await api.get('/api/v1/orders/my-orders', { params })
  return response.data
}

/**
 * Hủy đơn hàng
 * @param {number} orderId - ID đơn hàng
 * @param {number} userId - ID user
 * @returns {Promise} API response
 */
export const cancelOrder = async (orderId, userId) => {
  const response = await api.put(`/api/v1/orders/${orderId}/cancel`, null, {
    params: { userId }
  })
  return response.data
}

/**
 * ADMIN: Lấy tất cả đơn hàng với filter
 * @param {Object} params - { status, searchTerm, page, size }
 * @returns {Promise} API response
 */
export const getAllOrders = async (params = {}) => {
  const response = await api.get('/api/v1/admin/orders', { params })
  return response.data
}

/**
 * ADMIN: Cập nhật trạng thái đơn hàng
 * @param {number} orderId - ID đơn hàng
 * @param {Object} data - { status }
 * @returns {Promise} API response
 */
export const updateOrderStatus = async (orderId, data) => {
  const response = await api.put(`/api/v1/admin/orders/${orderId}/status`, data)
  return response.data
}

export default {
  createOrder,
  getOrderDetail,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
}
