import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllProducts, getProductById, getProductsByCategory, getFeaturedProducts } from '../api/product'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const featuredProducts = ref([])
  const product = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  })

  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await getAllProducts(params)
      
      if (response.success && response.data) {
        products.value = response.data.content
        pagination.value = {
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi tải sản phẩm'
      products.value = []
    } finally {
      loading.value = false
    }
  }


  const fetchFeaturedList = async () => {
    // Không set loading chung để tránh làm nháy toàn trang
    try {
      const response = await getFeaturedProducts()
      if (response.success && response.data) {
        featuredProducts.value = response.data
      }
    } catch (err) {
      console.error('Lỗi tải sản phẩm nổi bật:', err)
      featuredProducts.value = []
    }
  }

  const fetchProductById = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await getProductById(id)
      
      if (response.success && response.data) {
        product.value = response.data
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi tải chi tiết sản phẩm'
      product.value = null
    } finally {
      loading.value = false
    }
  }

  const fetchProductsByCategory = async (categoryId, params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await getProductsByCategory(categoryId, params)
      
      if (response.success && response.data) {
        products.value = response.data.content
        pagination.value = {
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi tải sản phẩm'
      products.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    featuredProducts,
    product,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchFeaturedList,
    fetchProductById,
    fetchProductsByCategory,
  }
})
