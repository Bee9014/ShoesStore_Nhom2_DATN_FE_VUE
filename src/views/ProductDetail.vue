<template>
  <div class="product-detail-page">
    <div v-if="productStore.loading" class="loading">
      <div class="spinner"></div> Đang tải chi tiết sản phẩm...
    </div>
    
    <div v-else-if="productStore.error" class="error">
      {{ productStore.error }}
    </div>
    
    <div v-else-if="productStore.product" class="product-detail-container">
      <div class="breadcrumb">
        <router-link to="/">Trang chủ</router-link>
        <span>/</span>
        <span>{{ productStore.product.title }}</span>
      </div>

      <div class="product-detail-content">
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
              :class="{ active: (selectedImage || productStore.product.defaultImage) === img }"
            >
              <img :src="getImageUrl(img || '/placeholder-shoe.jpg')" alt="Thumbnail">
            </div>
          </div>
        </div>

        <div class="product-info-detail">
          <div class="title-row">
            <h1 class="product-title">{{ productStore.product.title }}</h1>
            <span v-if="!productStore.product.isActive" class="inactive-status">Ngừng kinh doanh</span>
          </div>
          
          <div class="product-code">
            Mã sản phẩm: <strong>{{ productStore.product.productCode }}</strong>
          </div>
          
          <div class="product-price">
            <span class="price-current">
              {{ formatPrice(currentVariant ? currentVariant.price : productStore.product.basePrice) }}
            </span>
          </div>
          
          <div class="product-description">
            <h3>Mô tả sản phẩm:</h3>
            <p>{{ productStore.product.description || 'Chưa có mô tả chi tiết' }}</p>
          </div>
          
          <div class="color-selection" v-if="uniqueColors.length > 0">
            <h3>Chọn màu sắc: <span v-if="selectedColor" class="selected-text">{{ selectedColor }}</span></h3>
            <div class="color-options">
              <button
                v-for="color in uniqueColors"
                :key="color"
                @click="selectColor(color)"
                :class="{ active: selectedColor === color }"
                class="color-btn"
              >
                {{ color }}
              </button>
            </div>
          </div>
          
          <div class="size-selection" v-if="availableSizes.length > 0">
            <h3>Chọn kích cỡ: <span v-if="selectedSize" class="selected-text">{{ selectedSize }}</span></h3>
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
          
          <div class="quantity-selection">
            <h3>Số lượng:</h3>
            <div class="quantity-controls">
              <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <input type="number" v-model.number="quantity" min="1" max="99" readonly>
              <button @click="increaseQuantity" :disabled="quantity >= 99">+</button>
            </div>
            <p v-if="currentVariant" class="stock-info">
                (Còn lại: {{ currentVariant.stockQty }} sản phẩm)
            </p>
          </div>
          
          <div class="action-buttons">
            <button 
              class="btn-add-to-cart" 
              @click="addToCart"
              :disabled="isAddToCartDisabled"
            >
              <ShoppingCart :size="20" />
              {{ getAddToCartButtonText }}
            </button>
            
            <button 
              class="btn-buy-now" 
              @click="buyNow"
              :disabled="isAddToCartDisabled"
            >
              MUA NGAY
            </button>
          </div>
          
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
import { ref, computed, onMounted, watch } from 'vue'
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
const selectedColor = ref(null)
const selectedSize = ref(null)
const quantity = ref(1)

// --- 1. LOGIC ẢNH ---
const productImages = computed(() => {
  const imgs = [];
  if (productStore.product?.defaultImage) {
    imgs.push(productStore.product.defaultImage);
  }
  if (productStore.product?.variants) {
    productStore.product.variants.forEach(v => {
      if (v.image && v.image.trim() !== '' && !imgs.includes(v.image)) {
        imgs.push(v.image);
      }
    });
  }
  return imgs.length > 0 ? imgs : [productStore.product?.defaultImage || '/placeholder-shoe.jpg'];
});

// --- 2. LOGIC MÀU (CÓ LOG) ---
const uniqueColors = computed(() => {
  const variants = productStore.product?.variants || [];
  
  // LOG VARIANT GỐC
  console.log("🔥 Raw Variants from API:", variants);

  if (variants.length === 0) return [];

  const colors = variants
    .map(v => v.color ? String(v.color).trim() : null)
    .filter(c => c !== null && c !== '');
    
  const result = [...new Set(colors)].sort();
  
  // LOG MÀU SAU KHI LỌC
  console.log("🔥 Filtered Colors:", result);
  return result; 
});

// --- 3. LOGIC SIZE (CÓ LOG) ---
const availableSizes = computed(() => {
  const variants = productStore.product?.variants || [];
  if (variants.length === 0) return [];
  
  let sizes = [];

  if (!selectedColor.value) {
    sizes = variants.map(v => v.size);
  } else {
    sizes = variants
      .filter(v => v.color && String(v.color).trim() === selectedColor.value)
      .map(v => v.size);
  }

  const result = [...new Set(sizes)]
    .filter(s => s !== null && s !== undefined && String(s).trim() !== '')
    .sort((a, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        return (!isNaN(numA) && !isNaN(numB)) ? numA - numB : String(a).localeCompare(String(b));
    });

  // LOG SIZE SAU KHI LỌC
  console.log(`🔥 Filtered Sizes (Color: ${selectedColor.value || 'All'}):`, result);
  return result;
});

// --- 4. TÌM BIẾN THỂ ---
const currentVariant = computed(() => {
  const variants = productStore.product?.variants || [];
  const variant = variants.find(v => {
    const vColor = v.color ? String(v.color).trim() : '';
    const vSize = v.size ? String(v.size).trim() : '';
    return vColor === selectedColor.value && vSize === String(selectedSize.value).trim();
  });
  
  if (selectedColor.value && selectedSize.value) {
      console.log("🔥 Found Variant:", variant);
  }
  return variant;
});

// --- HELPER FUNCTIONS ---
const selectColor = (color) => {
    console.log("👉 User selected color:", color);
    selectedColor.value = color;
    selectedSize.value = null; 
}


const formatPrice = (price) => {
  if (!price) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const increaseQuantity = () => { if (quantity.value < 99) quantity.value++ }
const decreaseQuantity = () => { if (quantity.value > 1) quantity.value-- }

const isAddToCartDisabled = computed(() => {
    if (!productStore.product?.isActive) return true;
    if (!selectedColor.value || !selectedSize.value) return true;
    if (currentVariant.value && currentVariant.value.stockQty <= 0) return true;
    return false;
})

const getAddToCartButtonText = computed(() => {
    if (!productStore.product?.isActive) return 'NGỪNG KINH DOANH';
    if (!selectedColor.value || !selectedSize.value) return 'CHỌN MÀU & SIZE';
    if (currentVariant.value && currentVariant.value.stockQty <= 0) return 'HẾT HÀNG';
    return 'THÊM VÀO GIỎ HÀNG';
})

// --- ACTIONS ---
const addToCart = () => {
  if (isAddToCartDisabled.value) return;

  if (!currentVariant.value) {
    alert('Có lỗi: Không tìm thấy phiên bản sản phẩm này!');
    return;
  }

   cartStore.addToCart(
       productStore.product,
       selectedSize.value,
       selectedColor.value,
       quantity.value,
       currentVariant.value.variantId,
       currentVariant.value.price  // ✅ THÊM DÒNG NÀY
     )
  
  alert('Đã thêm vào giỏ hàng thành công!')
}

const buyNow = () => {
  if (isAddToCartDisabled.value) return;
  addToCart();
  router.push('/cart');
}

// --- LIFECYCLE ---
onMounted(async () => {
  console.log("🚀 Mounted ProductDetailPage, ID:", route.params.id);
  const productId = route.params.id
  await productStore.fetchProductById(productId)
  
  console.log("🚀 Product Loaded:", productStore.product);
  
  if (productStore.product) {
    selectedImage.value = productStore.product.defaultImage
  }
})

watch(selectedColor, (newColor) => {
    if (!newColor) return;
    const variantWithImage = productStore.product?.variants?.find(v => 
        v.color && String(v.color).trim() === newColor && v.image
    );
    if (variantWithImage) {
        selectedImage.value = variantWithImage.image;
    }
});

watch(() => route.params.id, () => {
    selectedColor.value = null;
    selectedSize.value = null;
    quantity.value = 1;
})
</script>

<style scoped>
/* CSS giữ nguyên */
.product-detail-page { padding: 40px 5%; min-height: 60vh; }
.loading, .error { text-align: center; padding: 60px; font-size: 18px; }
.error { color: #c00; }
.breadcrumb { font-size: 14px; margin-bottom: 30px; color: #666; }
.breadcrumb a { color: #ff5000; }
.breadcrumb span { margin: 0 8px; }

.product-detail-content { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
.product-images { display: flex; flex-direction: column; gap: 20px; }
.main-image { width: 100%; height: 500px; border: 1px solid #eee; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #f8f8f8; position: relative; }
.main-image img { width: 100%; height: 100%; object-fit: contain; }
.inactive-badge { position: absolute; top: 20px; left: 20px; background-color: rgba(255, 80, 0, 0.95); color: white; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; z-index: 10; }

.thumbnail-images { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
.thumbnail { width: 80px; height: 80px; flex-shrink: 0; border: 2px solid #eee; border-radius: 4px; overflow: hidden; cursor: pointer; transition: border-color 0.3s; }
.thumbnail:hover, .thumbnail.active { border-color: #ff5000; }
.thumbnail img { width: 100%; height: 100%; object-fit: cover; }

.product-info-detail { display: flex; flex-direction: column; gap: 20px; }
.title-row { display: flex; align-items: center; gap: 15px; flex-wrap: wrap; }
.product-title { font-size: 28px; font-weight: bold; color: #333; }
.inactive-status { background-color: #999; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
.product-code { font-size: 14px; color: #666; }
.product-price { display: flex; align-items: center; gap: 15px; }
.price-current { font-size: 32px; font-weight: bold; color: #ff5000; }
.price-original { font-size: 20px; color: #999; text-decoration: line-through; }
.product-description p { color: #666; line-height: 1.8; }

.size-selection h3, .color-selection h3, .quantity-selection h3, .product-features h3 { font-size: 16px; margin-bottom: 10px; }
.selected-text { color: #ff5000; font-weight: bold; margin-left: 5px; }
.stock-info { font-size: 13px; color: #28a745; margin-top: 5px; font-weight: 500; }

.size-options, .color-options { display: flex; gap: 10px; flex-wrap: wrap; }
.size-btn, .color-btn { padding: 10px 20px; border: 2px solid #ddd; background: white; border-radius: 4px; cursor: pointer; transition: all 0.2s; min-width: 50px; }
.size-btn:hover, .color-btn:hover { border-color: #ffaa80; }
.size-btn.active, .color-btn.active { border-color: #ff5000; color: #ff5000; font-weight: bold; background-color: #fff9f5; }

.quantity-controls { display: flex; align-items: center; gap: 0; border: 1px solid #ddd; width: fit-content; border-radius: 4px; overflow: hidden; }
.quantity-controls button { width: 40px; height: 40px; border: none; background: #f9f9f9; font-size: 18px; cursor: pointer; transition: background 0.2s; }
.quantity-controls button:hover:not(:disabled) { background: #eee; }
.quantity-controls input { width: 50px; height: 40px; text-align: center; border: none; border-left: 1px solid #ddd; border-right: 1px solid #ddd; font-weight: bold; }

.action-buttons { display: flex; gap: 15px; margin-top: 20px; }
.btn-add-to-cart, .btn-buy-now { flex: 1; padding: 15px; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; }
.btn-add-to-cart { background-color: #fff; color: #ff5000; border: 2px solid #ff5000; }
.btn-add-to-cart:hover:not(:disabled) { background-color: #ff5000; color: white; }
.btn-buy-now { background-color: #ff5000; color: white; }
.btn-buy-now:hover:not(:disabled) { background-color: #e64500; }
.btn-add-to-cart:disabled, .btn-buy-now:disabled { background-color: #e0e0e0; color: #999; border-color: #e0e0e0; cursor: not-allowed; }

.product-features ul { list-style: none; padding: 0; }
.product-features li { padding: 8px 0; color: #666; }

@media (max-width: 768px) {
  .product-detail-content { grid-template-columns: 1fr; }
  .action-buttons { flex-direction: column; }
}
.spinner { border: 4px solid #f3f3f3; border-top: 4px solid #ff5000; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 10px auto; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>