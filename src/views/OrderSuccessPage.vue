<template>
  <div class="order-success-page">
    <div class="success-container">
      <div class="success-icon">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="#4CAF50"/>
          <path d="M25 40L35 50L55 30" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <h1 class="success-title">Đặt hàng thành công!</h1>
      
      <p class="success-message">
        Cảm ơn bạn đã đặt hàng. Chúng tôi đã nhận được đơn hàng của bạn.
      </p>
      
      <div class="order-info">
        <p class="order-id">Mã đơn hàng: <strong>#{{ orderId }}</strong></p>
        <p class="order-note">
          Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
        </p>
      </div>
      
      <div class="action-buttons">
        <router-link :to="`/orders/${orderId}`" class="btn-primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3Z" stroke="currentColor" stroke-width="2"/>
            <path d="M10 7V10L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Xem chi tiết đơn hàng
        </router-link>
        
        <router-link to="/orders" class="btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/>
            <line x1="9" y1="21" x2="9" y2="9" stroke="currentColor" stroke-width="2"/>
          </svg>
          Xem đơn hàng của tôi
        </router-link>
        
        <router-link to="/" class="btn-secondary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10H17M3 10L8 5M3 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Tiếp tục mua sắm
        </router-link>
      </div>
      
      <div class="additional-info">
        <h3>Thông tin hữu ích</h3>
        <ul>
          <li>📧 Email xác nhận đã được gửi đến hộp thư của bạn</li>
          <li>📱 Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi"</li>
          <li>🚚 Thời gian giao hàng dự kiến: 2-5 ngày làm việc</li>
          <li>💳 Thanh toán khi nhận hàng (COD)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderId = computed(() => route.params.orderId)
const loading = ref(false)

onMounted(() => {
  // Verify orderId exists
  if (!orderId.value) {
    router.push('/')
  }
})
</script>

<style scoped>
.order-success-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 5%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.success-container {
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.success-icon {
  margin-bottom: 30px;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-title {
  font-size: 32px;
  font-weight: 900;
  color: #333;
  margin-bottom: 16px;
}

.success-message {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.order-info {
  background-color: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.order-id {
  font-size: 20px;
  color: #333;
  margin-bottom: 12px;
}

.order-id strong {
  color: #ff5000;
  font-weight: 900;
}

.order-note {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #ff5000;
  color: white;
}

.btn-primary:hover {
  background-color: #e04500;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 80, 0, 0.3);
}

.btn-secondary {
  background-color: white;
  color: #333;
  border: 2px solid #ddd;
}

.btn-secondary:hover {
  background-color: #f8f9fa;
  border-color: #ff5000;
  color: #ff5000;
}

.additional-info {
  border-top: 2px solid #f0f0f0;
  padding-top: 30px;
  text-align: left;
}

.additional-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.additional-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.additional-info li {
  padding: 10px 0;
  color: #666;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 768px) {
  .success-container {
    padding: 40px 24px;
  }
  
  .success-title {
    font-size: 24px;
  }
  
  .success-message {
    font-size: 16px;
  }
  
  .order-id {
    font-size: 18px;
  }
}
</style>
