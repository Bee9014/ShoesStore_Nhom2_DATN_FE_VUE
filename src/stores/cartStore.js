import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  
  // Load from localStorage on init
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    }
  }
  
  // Save to localStorage
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }
  
  // Computed
  const cartCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })
  
  // Actions
  const addToCart = (product, size, color, quantity = 1, variantId = null,  variantPrice = null) => {
    // IMPORTANT: variantId is REQUIRED for order creation
    // If not provided, use productId as fallback (temporary solution)
    const actualVariantId = variantId || product.variantId || product.productId
    const actualPrice = variantPrice || product.basePrice
    
    const existingItem = items.value.find(
      item => item.variantId === actualVariantId
    )
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        productId: product.productId,
        variantId: actualVariantId, // ✅ Store actual variantId
        name: product.name || product.title,
        price: actualPrice,
        imageUrl: product.imageUrl || product.defaultImage,
        size,
        color,
        quantity,
        productCode: product.productCode,
      })
    }
    
    saveCart()
  }
  
  const removeFromCart = (variantId) => {
    const index = items.value.findIndex(item => item.variantId === variantId)
    
    if (index > -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }
  
  const updateQuantity = (variantId, quantity) => {
    const item = items.value.find(item => item.variantId === variantId)
    
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeFromCart(variantId)
      } else {
        saveCart()
      }
    }
  }
  
  const clearCart = () => {
    items.value = []
    saveCart()
  }
  
  // Initialize
  loadCart()
  
  return {
    items,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
  }
})
