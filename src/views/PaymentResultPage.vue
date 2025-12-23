<template>
  <div class="payment-result-container">
    <div v-if="loading" class="loading-box">
      <div class="spinner"></div>
      <p>Đang xác thực giao dịch với VNPay...</p>
    </div>

    <div v-else class="result-box">
      <div v-if="isSuccess" class="success-content">
        <div class="icon-circle success-icon">
          <Check :size="50" />
        </div>
        <h2>Thanh toán thành công!</h2>
        <p>Mã giao dịch: <b>{{ txnRef }}</b></p>
        <p class="desc">{{ message }}</p>
        
        <div class="actions">
          <router-link to="/orders" class="btn-primary">Xem đơn hàng</router-link>
          <router-link to="/" class="btn-secondary">Về trang chủ</router-link>
        </div>
      </div>

      <div v-else class="error-content">
        <div class="icon-circle error-icon">
          <X :size="50" />
        </div>
        <h2>Thanh toán thất bại</h2>
        <p class="error-msg">{{ message }}</p>
        <p v-if="txnRef">Mã giao dịch: <b>{{ txnRef }}</b></p>
        
        <div class="actions">
          <router-link to="/checkout" class="btn-primary">Thử lại</router-link>
          <router-link to="/" class="btn-secondary">Về trang chủ</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Check, X } from 'lucide-vue-next';
import { checkVNPayCallback } from '../api/payment';
import { useCartStore } from '../stores/cartStore'; // 👇 1. Import Store giỏ hàng

const route = useRoute();
const cartStore = useCartStore(); // 👇 2. Khởi tạo store

const loading = ref(true);
const isSuccess = ref(false);
const message = ref('');
const txnRef = ref('');

onMounted(async () => {
  const params = route.query;
  txnRef.value = params.vnp_TxnRef || '';

  if (!params.vnp_ResponseCode) {
    loading.value = false;
    isSuccess.value = false;
    message.value = 'Không tìm thấy thông tin giao dịch.';
    return;
  }

  try {
    const res = await checkVNPayCallback(params);
    
    if (res.success) {
      isSuccess.value = true;
      message.value = res.message || 'Giao dịch đã được ghi nhận.';
      
      //clear gio hang
      cartStore.clearCart(); 
      
    } else {
      isSuccess.value = false;
      message.value = res.message || 'Giao dịch bị từ chối hoặc có lỗi.';
    }
  } catch (error) {
    console.error('Callback Error:', error);
    isSuccess.value = false;
    if (error.response && error.response.data) {
        message.value = error.response.data.message || 'Lỗi xác thực giao dịch.';
    } else {
        message.value = 'Không thể kết nối đến máy chủ.';
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>

.payment-result-container {
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  padding: 40px 20px;
}

.result-box, .loading-box {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.success-icon { background-color: #d1fae5; color: #059669; }
.error-icon { background-color: #fee2e2; color: #dc2626; }

h2 { margin-bottom: 12px; color: #111; font-weight: 800; font-size: 24px; }
p { color: #6b7280; margin-bottom: 10px; line-height: 1.5; }
.desc { margin-bottom: 30px; }
.error-msg { color: #dc2626; font-weight: 500; margin-bottom: 30px; }

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary { background: #ff5000; color: white; }
.btn-primary:hover { background: #ea580c; }

.btn-secondary { background: #f3f4f6; color: #374151; }
.btn-secondary:hover { background: #e5e7eb; }

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ff5000;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>