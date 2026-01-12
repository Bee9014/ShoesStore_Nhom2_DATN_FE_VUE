<template>
  <div class="product-page">
    <main class="product-container">
      <aside class="sidebar">
        <h3 class="sidebar-title">DANH MỤC SẢN PHẨM</h3>
        
        <ul class="category-list">
          <li 
            :class="{ active: !selectedCategory }"
            @click="selectCategory(null)"
          >
            <span>Tất cả sản phẩm</span>
          </li>
          <li 
            v-for="category in categories" 
            :key="category.categoryId || category.id"
            :class="{ active: selectedCategory === (category.categoryId || category.id) }"
            @click="selectCategory(category.categoryId || category.id)"
          >
            <span>{{ category.categoryName || category.name || 'Danh mục' }}</span>
          </li>
        </ul>
      </aside>

      <div class="main-content">
        <div class="page-header">
          <div class="breadcrumb">
            <router-link to="/">Trang chủ</router-link>
            <span>/</span>
            <span>{{ pageTitle }}</span>
          </div>
          <h1>{{ pageTitle }}</h1>
          <p class="result-count" v-if="!loading">
            {{ totalProducts }} sản phẩm
          </p>
        </div>

        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>

        <div v-else-if="products.length === 0" class="empty-state">
          <p>Không tìm thấy sản phẩm nào</p>
          <button @click="clearFilters" class="btn-clear">Xóa bộ lọc</button>
        </div>

        <div v-else class="products-section">
          <div class="products-grid">
            <ProductCard 
              v-for="product in products" 
              :key="product.productId"
              :product="product"
            />
          </div>

          <div class="pagination" v-if="totalPages > 1">
            <button 
              class="page-btn"
              :disabled="currentPage <= 0"
              @click="goToPage(currentPage - 1)"
            >
              Trước
            </button>
            
            <button 
              v-for="page in displayPages"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page + 1 }}
            </button>
            
            <button 
              class="page-btn"
              :disabled="currentPage >= totalPages - 1"
              @click="goToPage(currentPage + 1)"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { getBestSellersPaged, searchProducts, getProductsByCategory } from '../api/product'
import { getAllCategories } from '../api/category'

const route = useRoute()
const router = useRouter()

const products = ref([])
const categories = ref([])
const loading = ref(false)
const selectedCategory = ref(null)
const currentPage = ref(0)
const pageSize = ref(12)
const totalProducts = ref(0)
const totalPages = ref(0)

const pageTitle = computed(() => {
  if (route.query.search) {
    return `Kết quả tìm kiếm: "${route.query.search}"`
  }
  if (selectedCategory.value) {
    // Sửa logic tìm kiếm category Name để hiển thị đúng tiêu đề
    const category = categories.value.find(c => (c.categoryId || c.id) === selectedCategory.value)
    return category ? (category.categoryName || category.name) : 'Danh mục sản phẩm'
  }
  return 'Sản phẩm bán chạy'
})

const displayPages = computed(() => {
  const pages = []
  const maxDisplay = 5
  let start = Math.max(0, currentPage.value - 2)
  let end = Math.min(totalPages.value - 1, start + maxDisplay - 1)
  
  if (end - start < maxDisplay - 1) {
    start = Math.max(0, end - maxDisplay + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const safePage = Math.max(0, currentPage.value)
    let response = null
    
    if (route.query.search) {
      response = await searchProducts(route.query.search, safePage, pageSize.value)
    }
    else if (selectedCategory.value) {
      response = await getProductsByCategory(selectedCategory.value, {
        page: safePage,
        size: pageSize.value
      })
    }
    else {
      response = await getBestSellersPaged(safePage, pageSize.value)
    }
    
    if (response && response.success && response.data) {
      products.value = response.data.content || []
      totalProducts.value = response.data.totalElements || 0
      totalPages.value = response.data.totalPages || 0
      currentPage.value = response.data.number !== undefined ? response.data.number : safePage
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await getAllCategories()
    // LOG để kiểm tra dữ liệu thực tế lần nữa
    console.log('API Dữ liệu danh mục:', response)
    
    if (response && response.success && response.data) {
      // ÉP lấy mảng content nếu có, nếu không lấy trực tiếp data
      const rawData = response.data.content || response.data
      // Đảm bảo categories là mảng
      categories.value = Array.isArray(rawData) ? rawData : []
      console.log('Mảng danh mục sau khi xử lý:', categories.value)
    }
  } catch (error) {
    console.error('❌ Lỗi tải danh mục:', error)
  }
}

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 0
  router.push({
    path: '/products',
    query: categoryId ? { category: categoryId } : {}
  })
}

const goToPage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchProducts()
  }
}

const clearFilters = () => {
  selectedCategory.value = null
  currentPage.value = 0
  router.push({ path: '/products' })
}

onMounted(async () => {
  await fetchCategories()
  if (route.query.category) {
    selectedCategory.value = parseInt(route.query.category)
  }
  fetchProducts()
})

watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    selectedCategory.value = parseInt(newQuery.category)
  } else if (!newQuery.search) {
    selectedCategory.value = null
  }
  currentPage.value = 0
  fetchProducts()
}, { deep: true })
</script>

<style scoped>
/* GIỮ NGUYÊN CSS CỦA BẠN VÀ FIX LỖI HIỂN THỊ CHỮ */
.product-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.product-container {
  flex: 1;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
  padding: 30px 5%;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.sidebar {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff5000;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fff;
  border: 1px solid #eee; /* Thêm viền nhẹ để dễ nhìn */
}

/* ÉP MÀU CHỮ HIỂN THỊ RÕ RÀNG */
.category-list li span {
  color: #333 !important; /* Màu đen đậm cho dễ đọc */
  font-weight: 500;
  display: block;
  font-size: 14px;
}

.category-list li:hover {
  background-color: #fff5f0;
}

.category-list li:hover span {
  color: #ff5000 !important;
}

.category-list li.active {
  background-color: #ff5000 !important;
  border-color: #ff5000;
}

.category-list li.active span {
  color: #ffffff !important; /* Chữ trắng rõ trên nền cam */
  font-weight: bold;
}

.main-content {
  min-height: 500px;
}

.page-header {
  margin-bottom: 30px;
}

.breadcrumb {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.breadcrumb a {
  color: #ff5000;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span {
  margin: 0 8px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.result-count {
  color: #666;
  font-size: 14px;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff5000;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.btn-clear {
  padding: 12px 30px;
  background-color: #ff5000;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-clear:hover {
  background-color: #e64500;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 30px 0;
}

.page-btn {
  padding: 10px 16px;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  min-width: 45px;
}

.page-btn:hover:not(:disabled) {
  background-color: #ff5000;
  color: white;
  border-color: #ff5000;
}

.page-btn.active {
  background-color: #ff5000;
  color: white;
  border-color: #ff5000;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .product-container {
    grid-template-columns: 200px 1fr;
    gap: 20px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
    padding: 20px 3%;
  }
  
  .sidebar {
    position: static;
    margin-bottom: 20px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style>