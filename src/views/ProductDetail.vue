<template>
  <div class="product-detail-page">
    <div v-if="productStore.loading" class="loading">
      Đang tải chi tiết sản phẩm...
    </div>
    
    <div v-else-if="productStore.error" class="error">
      {{ productStore.error }}
    </div>
    
    <div v-else-if="productStore.product" class="product-detail-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <router-link to="/">Trang chủ</router-link>
        <span>/</span>
        <span>{{ productStore.product.title }}</span>
      </div>

      <div class="product-detail-content">
        <!-- Product Images -->
        <div class="product-images">
          <div class="main-image">
            <img
              :src="getImageUrl(selectedImage || productStore.product.defaultImage || '/placeholder-shoe.jpg')"
              :alt="productStore.product.title"
            >
            <div v-if="!productStore.product.isActive" class="inactive-badge">
              <span>SẢN PHẨM TẠM NGỪNG KINH DOANH</span>
            </div>
          </div>
          
          <div class="thumbnail-images">
            <div
              class="thumbnail"
              v-for="(img, index) in productImages"
              :key="index"
              @click="selectedImage = img"
              :class="{ active: selectedImage === img }"
            >
              <img :src="getImageUrl(img)" :alt="`Hình ${index + 1}`">
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info-detail">
          <div class="title-row">
            <h1 class="product-title">{{ productStore.product.title }}</h1>
            <span v-if="!productStore.product.isActive" class="inactive-status">Ngừng kinh doanh</span>
          </div>
          
          <div class="product-code">
            Mã sản phẩm: <strong>{{ productStore.product.productCode }}</strong>
          </div>
          
          <div class="product-price">
            <span class="price-current">{{ formatPrice(productStore.product.basePrice) }}</span>
            <span v-if="productStore.product.originalPrice" class="price-original">
              {{ formatPrice(productStore.product.originalPrice) }}
            </span>
          </div>
          
          <div class="product-description">
            <h3>Mô tả sản phẩm:</h3>
            <p>{{ productStore.product.description || 'Chưa có mô tả chi tiết' }}</p>
          </div>
          
          <!-- Size Selection -->
          <div class="size-selection">
            <h3>Chọn kích cỡ:</h3>
            <div class="size-options">
              <button
                v-for="size in availableSizes"
                :key="size"
                @click="selectedSize = size"
                :class="{ active: selectedSize === size }"
                class="size-btn"
              >
                {{ size }}
              </button>
            </div>
          </div>
          
          <!-- Color Selection -->
          <div class="color-selection">
            <h3>Chọn màu sắc:</h3>
            <div class="color-options">
              <button
                v-for="color in availableColors"
                :key="color"
                @click="selectedColor = color"
                :class="{ active: selectedColor === color }"
                class="color-btn"
              >
                {{ color }}
              </button>
            </div>
          </div>
          
          <!-- Quantity -->
          <div class="quantity-selection">
            <h3>Số lượng:</h3>
            <div class="quantity-controls">
              <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <input type="number" v-model.number="quantity" min="1" max="99">
              <button @click="increaseQuantity" :disabled="quantity >= 99">+</button>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button 
              class="btn-add-to-cart" 
              @click="addToCart"
              :disabled="!productStore.product.isActive"
            >
              <ShoppingCart :size="20" />
              {{ productStore.product.isActive ? 'THÊM VÀO GIỎ HÀNG' : 'SẢN PHẨM TẠM NGỪNG' }}
            </button>
            <button 
              class="btn-buy-now" 
              @click="buyNow"
              :disabled="!productStore.product.isActive"
            >
              {{ productStore.product.isActive ? 'MUA NGAY' : 'KHÔNG THỂ MUA' }}
            </button>
          </div>
          
          <!-- Product Features -->
          <div class="product-features">
            <h3>Đặc điểm nổi bật:</h3>
            <ul>
              <li>✓ Chất liệu cao cấp, bền bỉ</li>
              <li>✓ Thiết kế hiện đại, năng động</li>
              <li>✓ Đế giày êm ái, chống trơn trượt</li>
              <li>✓ Phù hợp nhiều hoạt động</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCart } from 'lucide-vue-next'
import { useProductStore } from '../stores/productStore'
import { useCartStore } from '../stores/cartStore'
import { getImageUrl } from '@/helpers/userHelper'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const selectedImage = ref(null)
const selectedSize = ref(null)
const selectedColor = ref(null)
const quantity = ref(1)

const productImages = computed(() => {
  // Mock images - replace with real data
  return [
    productStore.product?.imageUrl || '/placeholder-shoe.jpg',
    '/shoe-img-2.jpg',
    '/shoe-img-3.jpg',
    '/shoe-img-4.jpg',
  ]
})

const availableSizes = ref([38, 39, 40, 41, 42, 43, 44, 45])
const availableColors = ref(['Đen', 'Trắng', 'Xám', 'Xanh'])

// Mock product variants - TODO: Replace with API call to fetch real variants
const productVariants = ref([
  { variantId: 1, size: 38, color: 'Đen', stockQty: 10 },
  { variantId: 2, size: 39, color: 'Đen', stockQty: 15 },
  { variantId: 3, size: 40, color: 'Đen', stockQty: 20 },
  { variantId: 4, size: 41, color: 'Đen', stockQty: 25 },
  { variantId: 5, size: 42, color: 'Đen', stockQty: 30 },
  { variantId: 6, size: 43, color: 'Đen', stockQty: 15 },
  { variantId: 7, size: 44, color: 'Đen', stockQty: 10 },
  { variantId: 8, size: 45, color: 'Đen', stockQty: 8 },
  { variantId: 9, size: 38, color: 'Trắng', stockQty: 8 },
  { variantId: 10, size: 39, color: 'Trắng', stockQty: 12 },
  { variantId: 11, size: 40, color: 'Trắng', stockQty: 18 },
  { variantId: 12, size: 41, color: 'Trắng', stockQty: 22 },
  { variantId: 13, size: 42, color: 'Trắng', stockQty: 25 },
  { variantId: 14, size: 43, color: 'Trắng', stockQty: 12 },
  { variantId: 15, size: 44, color: 'Trắng', stockQty: 8 },
  { variantId: 16, size: 45, color: 'Trắng', stockQty: 5 },
  { variantId: 17, size: 38, color: 'Xám', stockQty: 5 },
  { variantId: 18, size: 39, color: 'Xám', stockQty: 10 },
  { variantId: 19, size: 40, color: 'Xám', stockQty: 15 },
  { variantId: 20, size: 41, color: 'Xám', stockQty: 20 },
  { variantId: 21, size: 42, color: 'Xám', stockQty: 22 },
  { variantId: 22, size: 43, color: 'Xám', stockQty: 10 },
  { variantId: 23, size: 44, color: 'Xám', stockQty: 6 },
  { variantId: 24, size: 45, color: 'Xám', stockQty: 3 },
  { variantId: 25, size: 38, color: 'Xanh', stockQty: 6 },
  { variantId: 26, size: 39, color: 'Xanh', stockQty: 8 },
  { variantId: 27, size: 40, color: 'Xanh', stockQty: 12 },
  { variantId: 28, size: 41, color: 'Xanh', stockQty: 15 },
  { variantId: 29, size: 42, color: 'Xanh', stockQty: 18 },
  { variantId: 30, size: 43, color: 'Xanh', stockQty: 8 },
  { variantId: 31, size: 44, color: 'Xanh', stockQty: 5 },
  { variantId: 32, size: 45, color: 'Xanh', stockQty: 2 },
])

// Helper function to get variantId based on selected size and color
const getVariantId = (size, color) => {
  const variant = productVariants.value.find(
    v => v.size === size && v.color === color
  )
  
  if (!variant) {
    console.warn(`No variant found for size ${size}, color ${color}. Using productId as fallback.`)
    return productStore.product?.productId
  }
  
  return variant.variantId
}

onMounted(async () => {
  const productId = route.params.id
  await productStore.fetchProductById(productId)
  
  if (productStore.product) {
    selectedImage.value = productStore.product.imageUrl
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const increaseQuantity = () => {
  if (quantity.value < 99) quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const addToCart = () => {
  if (!selectedSize.value) {
    alert('Vui lòng chọn kích cỡ!')
    return
  }
  if (!selectedColor.value) {
    alert('Vui lòng chọn màu sắc!')
    return
  }
  
  if (!productStore.product) {
    alert('Không tìm thấy thông tin sản phẩm!')
    return
  }
  
  // ✅ FIXED: Get variantId based on selected size and color
  const variantId = getVariantId(selectedSize.value, selectedColor.value)
  
  // Add to cart with variantId
  cartStore.addToCart(
    productStore.product,
    selectedSize.value,
    selectedColor.value,
    quantity.value,
    variantId  // ← Pass variantId as 5th parameter
  )
  
  alert('Đã thêm vào giỏ hàng!')
}

const buyNow = () => {
  if (!selectedSize.value) {
    alert('Vui lòng chọn kích cỡ!')
    return
  }
  if (!selectedColor.value) {
    alert('Vui lòng chọn màu sắc!')
    return
  }
  
  if (!productStore.product) {
    alert('Không tìm thấy thông tin sản phẩm!')
    return
  }
  
  // ✅ FIXED: Get variantId based on selected size and color
  const variantId = getVariantId(selectedSize.value, selectedColor.value)
  
  // Add to cart with variantId
  cartStore.addToCart(
    productStore.product,
    selectedSize.value,
    selectedColor.value,
    quantity.value,
    variantId  // ← Pass variantId as 5th parameter
  )
  
  // Redirect to checkout
  router.push('/checkout')
}
</script>

<style scoped>
.product-detail-page {
  padding: 40px 5%;
  min-height: 60vh;
}

.loading,
.error {
  text-align: center;
  padding: 60px;
  font-size: 18px;
}

.error {
  color: #c00;
}

.breadcrumb {
  font-size: 14px;
  margin-bottom: 30px;
  color: #666;
}

.breadcrumb a {
  color: #ff5000;
}

.breadcrumb span {
  margin: 0 8px;
}

.product-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  width: 100%;
  height: 500px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inactive-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(255, 80, 0, 0.95);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.thumbnail-images {
  display: flex;
  gap: 10px;
}

.thumbnail {
  width: 100px;
  height: 100px;
  border: 2px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #ff5000;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.product-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.inactive-status {
  background-color: #999;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.product-code {
  font-size: 14px;
  color: #666;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 15px;
}

.price-current {
  font-size: 32px;
  font-weight: bold;
  color: #ff5000;
}

.price-original {
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
}

.product-description h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.product-description p {
  color: #666;
  line-height: 1.8;
}

.size-selection h3,
.color-selection h3,
.quantity-selection h3,
.product-features h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.size-options,
.color-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.size-btn,
.color-btn {
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.size-btn:hover,
.color-btn:hover,
.size-btn.active,
.color-btn.active {
  border-color: #ff5000;
  color: #ff5000;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  font-size: 20px;
  cursor: pointer;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-add-to-cart,
.btn-buy-now {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-add-to-cart {
  background-color: #fff;
  color: #ff5000;
  border: 2px solid #ff5000;
}

.btn-add-to-cart:hover:not(:disabled) {
  background-color: #ff5000;
  color: white;
}

.btn-buy-now {
  background-color: #ff5000;
  color: white;
}

.btn-buy-now:hover:not(:disabled) {
  background-color: #e64500;
}

.btn-add-to-cart:disabled,
.btn-buy-now:disabled {
  background-color: #ccc;
  color: #666;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.product-features ul {
  list-style: none;
  padding: 0;
}

.product-features li {
  padding: 8px 0;
  color: #666;
}

@media (max-width: 768px) {
  .product-detail-content {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
