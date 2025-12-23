<template>
  <div class="home-page">
    <section class="main-banner">
      <div class="banner-image-container">
        <img src="@/assets/img/Screenshot 2025-12-03 175826.png" alt="Giày Biti's Hunter" class="main-shoe-image">
      </div>

      <div class="banner-content">
        <h2 class="title-hunter">BITI'S HUNTER THẾ HỆ MỚI</h2>
        <div class="deal-text">
          <p>DEAL LƯƠNG VỀ</p>
          <p>SĂN THÍCH MÊ</p>
        </div>
        
        <div class="discount-area">
          <div class="date-tag-inline">01-05<br>12.2025</div>
          <div class="discount-details">
            <h1>12%</h1>
            <p>MUA 2 GIẢM</p>
          </div>
        </div>
        
        <div class="voucher-list">
          <div class="voucher">
            <p>VOUCHER TIỀN MẶT</p>
            <p class="voucher-value">120K</p>
            <p>CHO ĐƠN TỪ 999K</p>
          </div>
          <div class="voucher">
            <p>VOUCHER TIỀN MẶT</p>
            <p class="voucher-value">80K</p>
            <p>CHO ĐƠN TỪ 699K</p>
          </div>
          <div class="voucher">
            <p>VOUCHER TIỀN MẶT</p>
            <p class="voucher-value">40K</p>
            <p>CHO ĐƠN TỪ 395K</p>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products" v-if="productStore.featuredProducts.length > 0">
      <div class="section-header">
        <h2 class="section-title">SẢN PHẨM NỔI BẬT</h2>
      </div>

      <div class="product-grid">
        <ProductCard
          v-for="product in productStore.featuredProducts"
          :key="'feat-' + product.productId"
          :product="product"
        />
      </div>
    </section>
    
    <div v-else-if="productStore.loading" class="loading">
       <div class="spinner"></div> Đang tải sản phẩm nổi bật...
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'
import ProductCard from '../components/ProductCard.vue'

const productStore = useProductStore()

onMounted(async () => {
  await productStore.fetchFeaturedList()
})
</script>

<style scoped>
/* === BANNER CHÍNH === */
.main-banner {
  background-color: #ff5000;
  width: 100%;
  color: white;
  padding: 40px 5%;
  position: relative;
  overflow: hidden;
  min-height: 450px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* KHU VỰC HÌNH ẢNH (Absolute positioning) */
.banner-image-container {
  position: absolute;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 45%;
  text-align: center;
}

.main-shoe-image {
  max-width: 100%;
  height: auto;
  display: block;
}

/* KHU VỰC CHỨA CHỮ VÀ ƯU ĐÃI */
.banner-content {
  width: 55%;
  position: relative;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.title-hunter {
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 20px;
}

.deal-text p {
  font-size: 40px;
  font-weight: 900;
  line-height: 1.1;
}

/* KHU VỰC 12% VÀ NGÀY */
.discount-area {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.date-tag-inline {
  background-color: white;
  color: #ff5000;
  padding: 15px 8px;
  border-radius: 50% 50% 50% 0;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  line-height: 1.2;
  border: 3px solid #ff5000;
  height: fit-content;
}

.discount-details h1 {
  font-size: 100px;
  font-weight: 900;
  line-height: 1;
}

.discount-details p {
  font-size: 18px;
  font-weight: bold;
  margin-top: -10px;
}

/* VOUCHER LIST */
.voucher-list {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.voucher {
  background-color: white;
  color: #ff5000;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 11px;
  font-weight: bold;
  min-width: 120px;
}

.voucher-value {
  font-size: 24px;
  font-weight: 900;
  margin: 8px 0;
}

/* MEDIA QUERY: Mobile responsive */
@media (max-width: 768px) {
  .main-banner {
    flex-direction: column;
    text-align: center;
    padding-top: 150px;
  }
  
  .banner-image-container {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
  }
  
  .banner-content {
    width: 100%;
    align-items: center;
  }
  
  .discount-area {
    justify-content: center;
  }
  
  .voucher-list {
    justify-content: center;
    flex-wrap: wrap;
  }
}

/* --- PRODUCT SECTION STYLES (Giữ nguyên) --- */
.featured-products {
  padding: 60px 5%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 900;
  color: #333;
  margin: 0;
  text-transform: uppercase;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

/* Spinner đơn giản cho đẹp */
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff5000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>