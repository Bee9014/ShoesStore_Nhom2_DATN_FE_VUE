import api from '../utils/api'

/**
 * Voucher API Service
 */

/**
 * Kiểm tra và áp dụng voucher
 * @param {Object} params - { code, total, userId }
 * @returns {Promise} API response
 */
export const applyVoucher = async (params) => {
    const response = await api.get('/api/v1/vouchers/apply', { params })
    return response.data
}

/**
 * Lấy danh sách voucher hợp lệ cho đơn hàng
 * @param {number} total - Tổng tiền đơn hàng
 * @returns {Promise} API response
 */
export const getValidVouchers = async (total) => {
    const response = await api.get('/api/v1/vouchers/valid', {
        params: { total }
    })
    return response.data
} // Missing export default? No, imported as { applyVoucher } usually. But order.js had default. I will add default too.

export default {
    applyVoucher,
    getValidVouchers
}
