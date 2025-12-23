import api from '../utils/api'

/**
 * 1. Tạo yêu cầu thanh toán VNPay
 * Dùng khi user bấm nút "Thanh toán VNPay"
 */
export const createVNPayPayment = async (data) => {
  // data: { orderId, amount, returnUrl, orderInfo }
  const response = await api.post('/api/v1/payments/vnpay/create-payment', data)
  console.log(response.data)
  return response.data
  
}

export const checkVNPayCallback = async (params) => {
  // params chính là toàn bộ query string mà VNPay trả về (vnp_Amount, vnp_ResponseCode...)
  const response = await api.get('/api/v1/payments/vnpay/callback', { params })
  console.log(response.data)
  return response.data
}