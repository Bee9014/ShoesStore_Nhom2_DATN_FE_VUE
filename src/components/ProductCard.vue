<template>
  <div class="product-card" @click="goToDetail">
    <div class="card-header">
      <span class="badge">01 - 05.12.2025</span>
      <span class="tag-left" v-if="product.isActive">MỚI</span>
      <span class="tag-inactive" v-else>NGỪNG BÁN</span>
    </div>
    
    <div class="product-image">
      <img :src="getImageUrl(product.defaultImage)" :alt="product.title">
      
      <div v-if="!product.isActive" class="inactive-overlay">
        <span class="inactive-text">Sản phẩm tạm ngừng</span>
      </div>
    </div>
    
    <div class="product-info">
      <p class="product-name">{{ product.title }}</p>
      <p class="product-price-new">{{ formatPrice(product.basePrice) }}</p>
      
      <div class="discount-label" v-if="product.discount">
        <span class="percent">{{ product.discount }}%</span>
        <span class="value">{{ calculateDiscount(product.basePrice, product.discount) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// Đảm bảo đường dẫn import đúng với file helper bạn vừa tạo
import { getImageUrl } from '@/helpers/userHelper'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const calculateDiscount = (price, percent) => {
  const discount = (price * percent) / 100
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(discount)
}

const goToDetail = () => {
  // Điều hướng sang trang chi tiết
  router.push(`/products/${props.product.productId}`)
}
</script>

<style scoped>
/* Giữ nguyên CSS cũ của bạn */
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #fff;
}

.badge {
  background-color: #ff5000;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.tag-left {
  background-color: #00a651;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.tag-inactive {
  background-color: #999;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.product-image {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f8f8f8;
  position: relative;
}

.inactive-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.inactive-text {
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  background-color: rgba(255, 80, 0, 0.9);
  border-radius: 8px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  min-height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price-new {
  font-size: 18px;
  font-weight: bold;
  color: #ff5000;
  margin-bottom: 10px;
}

.discount-label {
  display: flex;
  gap: 10px;
  align-items: center;
}

.discount-label .percent {
  background-color: #ff5000;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.discount-label .value {
  font-size: 12px;
  color: #666;
}
</style>