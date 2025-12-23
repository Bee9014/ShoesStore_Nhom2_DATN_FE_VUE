# ✅ FRONTEND VUE - CẬP NHẬT FILTER isActive

**Ngày:** 2025-12-21  
**Trạng Thái:** ✅ HOÀN THÀNH  
**Files Sửa:** 3 files (HomePage.vue, ProductCard.vue, ProductDetail.vue)

---

## 🎯 MỤC TIÊU

Tích hợp filter `isActive` mới từ backend API vào Vue frontend:
1. Mặc định chỉ hiển thị sản phẩm đang bán (isActive=true)
2. Thêm toggle để user có thể xem tất cả sản phẩm
3. Hiển thị badge "NGỪNG BÁN" cho sản phẩm inactive
4. Disable nút mua hàng cho sản phẩm inactive

---

## 📊 CÁC THAY ĐỔI

### **File 1: HomePage.vue** ✅

**Thêm tính năng:**
- ✅ Toggle checkbox "Chỉ hiển thị sản phẩm đang bán" (mặc định: bật)
- ✅ Gửi parameter `isActive=true` khi filter bật
- ✅ Reset về trang 1 khi toggle filter

#### **Script Changes:**

```vue
<script setup>
import { onMounted, ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import ProductCard from '../components/ProductCard.vue'

const productStore = useProductStore()
const showOnlyActive = ref(true) // Mặc định chỉ hiển thị sản phẩm đang bán

onMounted(async () => {
  await loadProducts()
})

const loadProducts = async (page = 1) => {
  const params = { 
    page, 
    size: 12,
    isActive: showOnlyActive.value ? true : undefined // Chỉ gửi isActive=true nếu filter bật
  }
  await productStore.fetchProducts(params)
}

const changePage = async (page) => {
  await loadProducts(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleActiveFilter = async () => {
  await loadProducts(1) // Reset về trang 1 khi toggle filter
}
</script>
```

**Giải thích:**
- `showOnlyActive = ref(true)` → Mặc định bật filter
- `isActive: showOnlyActive.value ? true : undefined` → Chỉ gửi `isActive=true` khi filter bật, không gửi khi tắt (lấy tất cả)
- `toggleActiveFilter()` → Reset về trang 1 khi user toggle checkbox

#### **Template Changes:**

```vue
<section class="featured-products">
  <div class="section-header">
    <h2 class="section-title">SẢN PHẨM NỔI BẬT</h2>
    
    <!-- Filter Toggle -->
    <div class="filter-toggle">
      <label class="toggle-label">
        <input 
          type="checkbox" 
          v-model="showOnlyActive"
          @change="toggleActiveFilter"
          class="toggle-checkbox"
        />
        <span class="toggle-text">Chỉ hiển thị sản phẩm đang bán</span>
      </label>
    </div>
  </div>
  
  <!-- Product grid ... -->
</section>
```

#### **Style Changes:**

```css
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-title {
  font-size: 32px;
  font-weight: 900;
  color: #333;
  margin: 0;
}

.filter-toggle {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.toggle-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #ff5000;
}

.toggle-text {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}
```

---

### **File 2: ProductCard.vue** ✅

**Thêm tính năng:**
- ✅ Hiển thị badge "NGỪNG BÁN" thay vì "MỚI" cho sản phẩm inactive
- ✅ Overlay tối + text "Sản phẩm tạm ngừng" trên ảnh sản phẩm inactive
- ✅ Sửa field names: `name` → `title`, `imageUrl` → `defaultImage`

#### **Template Changes:**

```vue
<template>
  <div class="product-card" @click="goToDetail">
    <div class="card-header">
      <span class="badge">01 - 05.12.2025</span>
      <span class="tag-left" v-if="product.isActive">MỚI</span>
      <span class="tag-inactive" v-else>NGỪNG BÁN</span>
    </div>
    
    <div class="product-image">
      <img :src="product.defaultImage || '/placeholder-shoe.jpg'" :alt="product.title">
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
```

**Thay đổi:**
- `product.name` → `product.title` ✅
- `product.imageUrl` → `product.defaultImage` ✅
- Thêm conditional rendering cho tag: `v-if="product.isActive"` vs `v-else` ✅
- Thêm overlay khi `!product.isActive` ✅

#### **Style Changes:**

```css
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
  position: relative; /* ✅ Thêm */
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
```

---

### **File 3: ProductDetail.vue** ✅

**Thêm tính năng:**
- ✅ Badge "SẢN PHẨM TẠM NGỪNG KINH DOANH" trên ảnh chính
- ✅ Status badge "Ngừng kinh doanh" bên cạnh tiêu đề
- ✅ Disable nút "Thêm vào giỏ" và "Mua ngay" khi inactive
- ✅ Đổi text button khi inactive
- ✅ Sửa field names: `name` → `title`, `imageUrl` → `defaultImage`

#### **Template Changes:**

**1. Breadcrumb và Main Image:**
```vue
<!-- Breadcrumb -->
<div class="breadcrumb">
  <router-link to="/">Trang chủ</router-link>
  <span>/</span>
  <span>{{ productStore.product.title }}</span> <!-- ✅ Đổi từ name → title -->
</div>

<!-- Product Images -->
<div class="product-images">
  <div class="main-image">
    <img
      :src="selectedImage || productStore.product.defaultImage || '/placeholder-shoe.jpg'"
      :alt="productStore.product.title"
    >
    <!-- ✅ Badge inactive -->
    <div v-if="!productStore.product.isActive" class="inactive-badge">
      <span>SẢN PHẨM TẠM NGỪNG KINH DOANH</span>
    </div>
  </div>
  <!-- ... thumbnails ... -->
</div>
```

**2. Product Title với Status:**
```vue
<!-- Product Info -->
<div class="product-info-detail">
  <div class="title-row">
    <h1 class="product-title">{{ productStore.product.title }}</h1>
    <span v-if="!productStore.product.isActive" class="inactive-status">Ngừng kinh doanh</span>
  </div>
  
  <div class="product-code">
    Mã sản phẩm: <strong>{{ productStore.product.productCode }}</strong>
  </div>
  <!-- ... -->
</div>
```

**3. Action Buttons với Disabled State:**
```vue
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
```

**Tính năng:**
- `:disabled="!productStore.product.isActive"` → Disable buttons khi inactive
- Dynamic text: Đổi text button tùy theo status
- Icon vẫn hiển thị cho consistency

#### **Style Changes:**

```css
/* Main image với badge */
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
  position: relative; /* ✅ Thêm */
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

/* Title row với status */
.title-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.product-title {
  font-size: 32px;
  font-weight: 900;
  color: #333;
  margin: 0;
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

/* Buttons với disabled state */
.btn-add-to-cart,
.btn-buy-now {
  flex: 1;
  padding: 16px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-add-to-cart {
  background-color: #ff5000;
  color: white;
}

.btn-add-to-cart:hover:not(:disabled) {
  background-color: #e04500;
}

.btn-buy-now {
  background-color: #333;
  color: white;
}

.btn-buy-now:hover:not(:disabled) {
  background-color: #000;
}

/* ✅ Disabled state */
.btn-add-to-cart:disabled,
.btn-buy-now:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}
```

---

## 📊 BACKEND ↔ FRONTEND MAPPING

### **API Response (Backend):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "productId": 1,
        "categoryId": 1,
        "title": "Giày Nike Air Max",        // ✅ title (không phải name)
        "defaultImage": "/images/nike.jpg",  // ✅ defaultImage (không phải imageUrl)
        "basePrice": 1500000.00,             // ✅ BigDecimal
        "isActive": true,                    // ✅ Boolean (NEW FIELD)
        "status": "active",
        "brand": "Nike",
        "condition": "New",
        ...
      }
    ]
  }
}
```

### **Frontend Usage:**

```vue
<!-- ProductCard.vue -->
<img :src="product.defaultImage" :alt="product.title">
<p class="product-name">{{ product.title }}</p>
<p class="product-price">{{ formatPrice(product.basePrice) }}</p>
<span v-if="!product.isActive" class="tag-inactive">NGỪNG BÁN</span>

<!-- ProductDetail.vue -->
<h1>{{ productStore.product.title }}</h1>
<img :src="productStore.product.defaultImage">
<button :disabled="!productStore.product.isActive">
  {{ productStore.product.isActive ? 'MUA NGAY' : 'KHÔNG THỂ MUA' }}
</button>
```

---

## 🎯 USER EXPERIENCE

### **Khi Filter Bật (Default):**

1. User vào trang chủ
2. Checkbox "Chỉ hiển thị sản phẩm đang bán" được tick ✅
3. API call: `GET /api/v1/products?page=1&size=12&isActive=true`
4. Chỉ hiển thị sản phẩm có `isActive=true`
5. User chỉ thấy sản phẩm đang bán

### **Khi User Tắt Filter:**

1. User bỏ tick checkbox
2. API call: `GET /api/v1/products?page=1&size=12` (không có isActive)
3. Hiển thị TẤT CẢ sản phẩm (cả active và inactive)
4. Sản phẩm inactive có:
   - Badge "NGỪNG BÁN" (xám)
   - Overlay tối + text "Sản phẩm tạm ngừng" trên ảnh
   - Vẫn click được vào xem chi tiết

### **Khi Xem Chi Tiết Sản Phẩm Inactive:**

1. User click vào sản phẩm inactive
2. ProductDetail page hiển thị:
   - Badge "SẢN PHẨM TẠM NGỪNG KINH DOANH" trên ảnh
   - Status "Ngừng kinh doanh" bên cạnh tiêu đề (xám)
   - Button "THÊM VÀO GIỎ HÀNG" → Disabled, text đổi thành "SẢN PHẨM TẠM NGỪNG"
   - Button "MUA NGAY" → Disabled, text đổi thành "KHÔNG THỂ MUA"
   - Buttons có màu xám (#ccc), cursor not-allowed
3. User không thể thêm vào giỏ hàng

---

## 🧪 TESTING SCENARIOS

### **Test 1: Default Filter**

**Steps:**
1. Mở trang chủ: `http://localhost:3000/shoestore`
2. Kiểm tra checkbox "Chỉ hiển thị sản phẩm đang bán" → Phải tick ✅
3. Mở DevTools Network tab
4. Kiểm tra API call: `GET /api/v1/products?page=1&size=12&isActive=true`
5. Kiểm tra sản phẩm hiển thị → Chỉ có sản phẩm active

**Expected:**
- ✅ Checkbox mặc định bật
- ✅ API gửi `isActive=true`
- ✅ Chỉ hiển thị sản phẩm đang bán

---

### **Test 2: Toggle Filter Off**

**Steps:**
1. Ở trang chủ, bỏ tick checkbox
2. Kiểm tra API call mới: `GET /api/v1/products?page=1&size=12` (không có isActive)
3. Kiểm tra sản phẩm hiển thị → Có cả active và inactive

**Expected:**
- ✅ API không gửi parameter isActive
- ✅ Hiển thị tất cả sản phẩm
- ✅ Sản phẩm inactive có badge "NGỪNG BÁN"
- ✅ Sản phẩm inactive có overlay trên ảnh

---

### **Test 3: ProductCard Inactive Badge**

**Steps:**
1. Tắt filter để thấy sản phẩm inactive
2. Kiểm tra ProductCard của sản phẩm inactive:
   - Badge "NGỪNG BÁN" (xám) góc trên phải
   - Overlay tối trên ảnh
   - Text "Sản phẩm tạm ngừng" màu trắng, background cam
3. Hover vào card → Vẫn có hiệu ứng hover

**Expected:**
- ✅ Badge hiển thị đúng
- ✅ Overlay hiển thị rõ ràng
- ✅ Text dễ đọc
- ✅ Vẫn click được

---

### **Test 4: ProductDetail Inactive State**

**Steps:**
1. Click vào sản phẩm inactive
2. Kiểm tra ProductDetail page:
   - Badge "SẢN PHẨM TẠM NGỪNG KINH DOANH" trên ảnh chính
   - Status "Ngừng kinh doanh" bên cạnh tiêu đề
   - Button "THÊM VÀO GIỎ" disabled, text = "SẢN PHẨM TẠM NGỪNG"
   - Button "MUA NGAY" disabled, text = "KHÔNG THỂ MUA"
   - Buttons màu xám, không click được
3. Click vào buttons → Không có phản ứng

**Expected:**
- ✅ Badge và status hiển thị rõ
- ✅ Buttons bị disabled
- ✅ Text thay đổi đúng
- ✅ Không thể add to cart

---

### **Test 5: ProductDetail Active State**

**Steps:**
1. Click vào sản phẩm active
2. Kiểm tra ProductDetail page:
   - Không có badge "NGỪNG"
   - Không có status "Ngừng kinh doanh"
   - Button "THÊM VÀO GIỎ" enabled, màu cam
   - Button "MUA NGAY" enabled, màu đen
3. Click button → Hoạt động bình thường

**Expected:**
- ✅ Không hiển thị inactive badges
- ✅ Buttons enabled và hoạt động
- ✅ Có thể add to cart

---

### **Test 6: Pagination với Filter**

**Steps:**
1. Bật filter "Chỉ hiển thị sản phẩm đang bán"
2. Click trang 2, 3, 4...
3. Kiểm tra API calls:
   - `GET /api/v1/products?page=2&size=12&isActive=true`
   - `GET /api/v1/products?page=3&size=12&isActive=true`

**Expected:**
- ✅ Filter persist qua pagination
- ✅ API luôn gửi isActive=true
- ✅ Tất cả trang chỉ hiển thị active products

---

### **Test 7: Toggle Filter Reset Page**

**Steps:**
1. Vào trang 3 với filter bật
2. Tắt filter
3. Kiểm tra → Phải reset về trang 1

**Expected:**
- ✅ Page number reset về 1
- ✅ API call: `GET /api/v1/products?page=1&size=12`
- ✅ Scroll lên đầu trang

---

## 📱 RESPONSIVE DESIGN

### **Mobile View:**

```css
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .toggle-text {
    font-size: 14px;
  }
  
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .inactive-badge {
    font-size: 12px;
    padding: 8px 16px;
  }
  
  .inactive-text {
    font-size: 14px;
  }
}
```

---

## 💡 UX BEST PRACTICES

### **1. Default State:**
- ✅ Mặc định chỉ hiển thị sản phẩm đang bán
- ✅ User không bị confuse với sản phẩm không thể mua
- ✅ Cải thiện conversion rate

### **2. Transparency:**
- ✅ Badge rõ ràng cho inactive products
- ✅ Overlay không che khuất quá nhiều
- ✅ Text dễ hiểu ("Sản phẩm tạm ngừng" thay vì icon)

### **3. Accessibility:**
- ✅ Disabled buttons có contrast rõ ràng
- ✅ Cursor not-allowed khi hover disabled button
- ✅ Text thay đổi để giải thích tại sao disabled

### **4. Consistency:**
- ✅ Cùng màu cam (#ff5000) cho badges và buttons
- ✅ Cùng style cho status badges (rounded, padding)
- ✅ Consistent terminology: "Ngừng bán" vs "Tạm ngừng"

---

## 🚀 DEPLOYMENT

### **Build Frontend:**

```bash
cd D:\DUANTOTNGHIEP\shoeStore_vue
npm run build
```

### **Dev Server:**

```bash
npm run dev
```

**URL:** `http://localhost:3000/shoestore`

---

## 📝 API COMPATIBILITY

### **Backend Requirements:**

Backend API phải trả về:
- ✅ `title` field (không phải `name`)
- ✅ `defaultImage` field (không phải `imageUrl`)
- ✅ `basePrice` field (BigDecimal)
- ✅ `isActive` field (Boolean)
- ✅ Support filter parameter: `?isActive=true`

### **API Endpoints Used:**

```
GET /api/v1/products
GET /api/v1/products?isActive=true
GET /api/v1/products?isActive=false
GET /api/v1/products/{id}
```

---

## 📊 SUMMARY

| Aspect | Before | After |
|--------|--------|-------|
| **Default filter** | ❌ Hiển thị tất cả | ✅ Chỉ hiển thị active |
| **Inactive badge** | ❌ Không có | ✅ Badge "NGỪNG BÁN" |
| **Overlay** | ❌ Không có | ✅ Overlay + text warning |
| **Detail page** | ❌ Vẫn mua được | ✅ Disable buttons |
| **Button text** | ❌ Static text | ✅ Dynamic based on status |
| **Field names** | ❌ name, imageUrl | ✅ title, defaultImage |
| **Toggle filter** | ❌ Không có | ✅ User có thể toggle |

---

## ✅ CHECKLIST

### **HomePage.vue:**
- ✅ Thêm `showOnlyActive` ref
- ✅ Thêm `loadProducts()` function với isActive param
- ✅ Thêm `toggleActiveFilter()` function
- ✅ Thêm filter toggle UI
- ✅ Thêm CSS cho toggle

### **ProductCard.vue:**
- ✅ Đổi `product.name` → `product.title`
- ✅ Đổi `product.imageUrl` → `product.defaultImage`
- ✅ Thêm conditional badge (MỚI vs NGỪNG BÁN)
- ✅ Thêm inactive overlay
- ✅ Thêm CSS cho inactive states

### **ProductDetail.vue:**
- ✅ Đổi `product.name` → `product.title`
- ✅ Đổi `product.imageUrl` → `product.defaultImage`
- ✅ Thêm inactive badge trên ảnh chính
- ✅ Thêm inactive status badge ở tiêu đề
- ✅ Disable buttons khi inactive
- ✅ Dynamic button text
- ✅ Thêm CSS cho disabled state

---

## 🎉 KẾT LUẬN

**Frontend đã được cập nhật hoàn chỉnh để:**
1. ✅ Tích hợp filter isActive từ backend
2. ✅ Cải thiện UX với default filter
3. ✅ Hiển thị rõ ràng sản phẩm inactive
4. ✅ Ngăn user mua sản phẩm không available
5. ✅ Đồng bộ field names với backend mới

**Sẵn sàng deploy!** 🚀

---

**Files thay đổi:** 3  
**Lines thay đổi:** ~150  
**Breaking changes:** Không  
**User impact:** Positive (better UX)  

🎉 **FRONTEND UPDATE COMPLETE!**
