# 🚀 ShoeStore Vue - Setup Guide

## ✅ **HOÀN THÀNH!**

Đã tạo hoàn chỉnh Vue.js frontend project cho ShoeStore với architecture VitaminCode pattern.

---

## 📁 **STRUCTURE ĐÃ TẠO:**

```
shoeStore_vue/
├── src/
│   ├── api/                    # API layer
│   │   ├── auth.js            # Auth APIs
│   │   └── product.js         # Product APIs
│   ├── assets/
│   │   └── main.css           # Global styles
│   ├── components/            # Reusable components
│   │   ├── Header.vue         # Header với navigation
│   │   ├── Footer.vue         # Footer
│   │   └── ProductCard.vue    # Product card component
│   ├── layouts/
│   │   └── DefaultLayout.vue  # Layout với Header + Footer
│   ├── router/
│   │   └── index.js           # Vue Router config
│   ├── stores/                # Pinia stores
│   │   ├── authStore.js       # Auth state management
│   │   └── productStore.js    # Product state management
│   ├── utils/
│   │   └── api.js             # Axios instance config
│   ├── views/                 # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.vue      # Login page
│   │   │   └── RegisterPage.vue   # Register page
│   │   ├── HomePage.vue           # Home page with products
│   │   └── ProductDetail.vue      # Product detail page
│   ├── App.vue                # Root component
│   └── main.js                # Entry point
├── package.json               # Dependencies
└── vite.config.js            # Vite config
```

---

## 📦 **DEPENDENCIES:**

```json
{
  "vue": "^3.5.25",
  "vue-router": "^4.5.1",
  "pinia": "^2.2.8",
  "axios": "^1.7.9",
  "lucide-vue-next": "^0.468.0"
}
```

---

## 🎯 **FEATURES ĐÃ TẠO:**

### **1. Authentication System**
- ✅ Login page with form validation
- ✅ Register page with full fields
- ✅ Auth store with Pinia
- ✅ JWT token management (localStorage + axios interceptors)
- ✅ Logout functionality

### **2. Product Management**
- ✅ Homepage with product grid
- ✅ Product list with pagination
- ✅ Product detail page with:
  - Image gallery
  - Size selection
  - Color selection
  - Quantity controls
  - Add to cart & Buy now buttons
- ✅ Product store with Pinia

### **3. Layout & Components**
- ✅ Header component với:
  - Logo & navigation
  - Search bar
  - User actions (login/logout)
  - Icons (search, user, cart)
- ✅ Footer component với:
  - Company info
  - Support links
  - Social media icons
- ✅ ProductCard component reusable
- ✅ DefaultLayout wrapping pages

### **4. Routing**
- ✅ Vue Router configured
- ✅ Routes:
  - `/` - Homepage
  - `/login` - Login page
  - `/register` - Register page
  - `/products/:id` - Product detail
- ✅ Navigation guards
- ✅ Dynamic page titles

### **5. State Management**
- ✅ Pinia stores:
  - authStore - User authentication
  - productStore - Product data
- ✅ Reactive state
- ✅ Actions for API calls
- ✅ Error handling

### **6. API Integration**
- ✅ Axios instance với baseURL
- ✅ Request interceptor (add auth token)
- ✅ Response interceptor (handle 401)
- ✅ API endpoints:
  - Auth: login, register, logout, getCurrentUser
  - Product: getAll, getById, search, byCategory

---

## 🚀 **SETUP INSTRUCTIONS:**

### **Step 1: Install Dependencies**
```bash
cd D:\DUANTOTNGHIEP\shoeStore_vue
npm install
# hoặc
pnpm install
```

### **Step 2: Run Development Server**
```bash
npm run dev
# hoặc
pnpm dev
```

Mở browser: `http://localhost:5173`

### **Step 3: Build for Production**
```bash
npm run build
```

---

## 🔗 **API ENDPOINTS MAPPING:**

Frontend sẽ connect với backend Spring Boot tại `http://localhost:8080`

### **Auth APIs:**
- POST `/api/v1/auth/login` - Login
- POST `/api/v1/auth/register` - Register
- POST `/api/v1/auth/logout` - Logout
- GET `/api/v1/auth/me` - Get current user

### **Product APIs:**
- GET `/api/v1/products` - Get all products (with pagination)
- GET `/api/v1/products/{id}` - Get product by ID
- GET `/api/v1/products/search/name?name=...` - Search by name

---

## 🎨 **DESIGN PATTERNS APPLIED:**

### **1. VitaminCode Architecture**
- ✅ Layered structure (API → Store → View)
- ✅ Composition API with `<script setup>`
- ✅ Pinia for state management
- ✅ Centralized API configuration

### **2. Component Organization**
- `components/` - Reusable UI components
- `layouts/` - Layout wrappers
- `views/` - Page components (routed)

### **3. Store Pattern**
```javascript
// Pinia store structure
export const useStore = defineStore('name', () => {
  const state = ref(...)        // State
  const actions = () => {}       // Actions
  return { state, actions }      // Export
})
```

### **4. API Layer Separation**
```javascript
// api/product.js
export const getAllProducts = async (params) => {
  const response = await api.get('/api/v1/products', { params })
  return response.data
}
```

### **5. Route Meta**
```javascript
{
  path: '/login',
  meta: {
    title: 'Đăng nhập',
    layout: 'auth'
  }
}
```

---

## 📝 **TODO NEXT:**

### **Cần làm thêm:**
1. ⏳ **Copy images** từ folder "DỰ ÁN SHOP GIÀY" vào `public/`
2. ⏳ **Test authentication** flow
3. ⏳ **Test product listing** và pagination
4. ⏳ **Implement Cart** functionality
   - CartStore
   - CartPage
   - Add/Remove from cart
5. ⏳ **Implement Checkout** flow
6. ⏳ **Add Category filter** on HomePage
7. ⏳ **Add Search** functionality
8. ⏳ **User Profile** page
9. ⏳ **Order History** page
10. ⏳ **Responsive design** improvements

---

## 🔧 **CONFIGURATION:**

### **API Base URL**
Nếu backend chạy ở port khác, update trong `src/utils/api.js`:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080',  // Change here
  //...
})
```

### **Router Base URL**
Nếu deploy subdirectory, update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-subdirectory/',
})
```

---

## 🎉 **COMPLETED FEATURES:**

- ✅ Vue 3 + Vite setup
- ✅ Vue Router với nested routes
- ✅ Pinia state management
- ✅ Axios API integration
- ✅ Login/Register pages
- ✅ Homepage với product grid
- ✅ Product detail page
- ✅ Header/Footer components
- ✅ Authentication flow
- ✅ Product browsing
- ✅ Responsive layout
- ✅ Error handling
- ✅ Loading states

---

## 📞 **API RESPONSE FORMAT:**

Backend trả về format:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": { ... }
}
```

Frontend xử lý trong stores:
```javascript
if (response.success && response.data) {
  // Handle success
} else {
  // Handle error
}
```

---

## 🌟 **BEST PRACTICES ĐÃ ÁP DỤNG:**

1. ✅ **Component-based architecture**
2. ✅ **Composition API** (modern Vue 3)
3. ✅ **State management** với Pinia
4. ✅ **API layer separation**
5. ✅ **Route-based code splitting**
6. ✅ **Error handling** centralized
7. ✅ **Loading states** for UX
8. ✅ **Responsive design**
9. ✅ **SEO-friendly** (page titles)
10. ✅ **Security** (JWT in localStorage + axios interceptors)

---

## 💡 **TIPS:**

### **Development:**
```bash
# Hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

### **Debugging:**
- Vue DevTools extension
- Check console for errors
- Check Network tab for API calls
- Check localStorage for token

---

## 📚 **RESOURCES:**

- Vue 3 Docs: https://vuejs.org/
- Vue Router: https://router.vuejs.org/
- Pinia: https://pinia.vuejs.org/
- Axios: https://axios-http.com/
- Lucide Icons: https://lucide.dev/

---

**Date Created:** 2025-12-09
**Framework:** Vue 3 + Vite
**State Management:** Pinia
**Routing:** Vue Router
**HTTP Client:** Axios
**Icons:** Lucide Vue Next

🎉 **Frontend is ready to connect with Spring Boot backend!**
