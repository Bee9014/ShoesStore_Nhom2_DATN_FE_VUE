<template>
  <div class="cart-item">
    <div class="item-image">
      <img :src="getImageUrl(item.imageUrl || '/placeholder-shoe.jpg')" :alt="item.name">
    </div>
    
    <div class="item-details">
      <h3 class="item-name">{{ item.name }}</h3>
      <p class="item-code">Mã: {{ item.productCode }}</p>
      <p class="item-variant">
        <span>Size: {{ item.size }}</span>
        <span class="separator">|</span>
        <span>Màu: {{ item.color }}</span>
      </p>
    </div>
    
    <div class="item-price">
      <p class="price">{{ formatPrice(item.price) }}</p>
    </div>
    
    <div class="item-quantity">
      <button 
        class="qty-btn" 
        @click="decreaseQuantity"
        :disabled="item.quantity <= 1"
      >
        -
      </button>
      <input 
        type="number" 
        v-model.number="localQuantity"
        @change="updateQuantity"
        min="1"
        max="99"
      >
      <button 
        class="qty-btn" 
        @click="increaseQuantity"
        :disabled="item.quantity >= 99"
      >
        +
      </button>
    </div>
    
    <div class="item-total">
      <p class="total-price">{{ formatPrice(item.price * item.quantity) }}</p>
    </div>
    
    <div class="item-actions">
      <button class="remove-btn" @click="removeItem" title="Xóa">
        <Trash2 :size="20" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { useCartStore } from '../stores/cartStore'
import { getImageUrl } from '@/helpers/userHelper'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const cartStore = useCartStore()
const localQuantity = ref(props.item.quantity)

watch(() => props.item.quantity, (newVal) => {
  localQuantity.value = newVal
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const increaseQuantity = () => {
  if (localQuantity.value < 99) {
    localQuantity.value++
    updateQuantity()
  }
}

const decreaseQuantity = () => {
  if (localQuantity.value > 1) {
    localQuantity.value--
    updateQuantity()
  }
}

const updateQuantity = () => {
  // ✅ FIXED: Use variantId instead of composite key
  cartStore.updateQuantity(props.item.variantId, localQuantity.value)
}

const removeItem = () => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
    // ✅ FIXED: Use variantId instead of composite key
    cartStore.removeFromCart(props.item.variantId)
  }
}
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 120px 150px 120px 50px;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.item-code {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.item-variant {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.separator {
  margin: 0 8px;
}

.item-price .price {
  font-size: 16px;
  font-weight: 600;
  color: #ff5000;
  margin: 0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 35px;
  height: 35px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.qty-btn:hover:not(:disabled) {
  background: #ff5000;
  color: white;
  border-color: #ff5000;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-quantity input {
  width: 50px;
  height: 35px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.item-total .total-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff5000;
  margin: 0;
}

.remove-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #fee;
  color: #c00;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.remove-btn:hover {
  background: #c00;
  color: white;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .item-image {
    margin: 0 auto;
  }
}
</style>
