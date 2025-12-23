# ✅ FIX: Authentication Persistence Issue

**Date:** 2025-12-21  
**Issue:** User logged in but redirected to login when accessing `/orders`  
**Status:** ✅ FIXED

---

## 🐛 Problem

**Symptom:**
- User logged in successfully
- Token saved in localStorage
- When navigating to `/orders`, redirected to login page

**Root Cause:**
1. Router guard checks `token` in localStorage ✅ (works)
2. `OrderHistoryPage` checks `authStore.user` ❌ (fails on page refresh)
3. On page refresh, `authStore.user` = `null` even though token exists
4. OrderHistoryPage redirects to login because `!authStore.user`

**Code causing redirect:**
```javascript
// OrderHistoryPage.vue - fetchOrders()
if (!authStore.user || !authStore.user.userId) {
  router.push('/login')  // ← Redirects here!
  return
}
```

---

## ✅ Solution

Save and restore `user` object from localStorage, not just token.

### **Before (authStore.js):**

```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)  // ❌ Lost on page refresh
  const token = ref(localStorage.getItem('accessToken'))  // ✅ Persists
  const isAuthenticated = ref(!!token.value)
  
  const loginUser = async (username, password) => {
    // ...
    token.value = response.data.accessToken
    user.value = response.data.user  // ❌ Only in memory
    localStorage.setItem('accessToken', response.data.accessToken)
    // ❌ User NOT saved to localStorage
  }
})
```

### **After (Fixed):**

```javascript
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('accessToken'))
  const isAuthenticated = ref(!!token.value)

  // ✅ ADDED: Load user from localStorage on init
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
    } catch (e) {
      console.error('Failed to parse saved user:', e)
    }
  }

  const loginUser = async (username, password) => {
    // ...
    token.value = response.data.accessToken
    user.value = response.data.user
    isAuthenticated.value = true
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))  // ✅ Save user
  }
  
  const logoutUser = async () => {
    // ...
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')  // ✅ Remove user
  }
  
  const fetchCurrentUser = async () => {
    // ...
    user.value = response.data
    localStorage.setItem('user', JSON.stringify(response.data))  // ✅ Save user
  }
})
```

---

## 📊 Changes Made

| File | Changes | Lines |
|------|---------|-------|
| `authStore.js` | Add user persistence | +15 lines |

**Specific changes:**
1. ✅ Load user from localStorage on store init
2. ✅ Save user to localStorage in `loginUser()`
3. ✅ Save user to localStorage in `fetchCurrentUser()`
4. ✅ Remove user from localStorage in `logoutUser()`

---

## 🔄 Data Flow

### **Before Fix:**

```
Login → Save token ✅ + Save user in memory ❌
          ↓
Page Refresh → Load token ✅ + user = null ❌
          ↓
Navigate to /orders → Router guard: token exists ✅ → Allow
          ↓
OrderHistoryPage → Check authStore.user ❌ → Redirect to login
```

### **After Fix:**

```
Login → Save token ✅ + Save user to localStorage ✅
          ↓
Page Refresh → Load token ✅ + Load user from localStorage ✅
          ↓
Navigate to /orders → Router guard: token exists ✅ → Allow
          ↓
OrderHistoryPage → Check authStore.user ✅ → Show orders
```

---

## 🧪 Testing Steps

1. **Login:**
```javascript
// User logs in
loginUser('testuser', 'password')

// Check localStorage
localStorage.getItem('accessToken')  // ✅ "eyJhbGc..."
localStorage.getItem('user')         // ✅ '{"userId":1,"username":"testuser"}'
```

2. **Page Refresh:**
```javascript
// Refresh page (F5)
// authStore reinitializes

console.log(authStore.token)  // ✅ "eyJhbGc..."
console.log(authStore.user)   // ✅ { userId: 1, username: "testuser" }
```

3. **Navigate to Orders:**
```javascript
// Go to /orders
// Router guard checks token → ✅ Pass
// OrderHistoryPage checks authStore.user → ✅ Pass
// Shows order list
```

4. **Logout:**
```javascript
// User logs out
logoutUser()

// Check localStorage
localStorage.getItem('accessToken')  // ✅ null
localStorage.getItem('user')         // ✅ null
```

---

## 🚨 Security Considerations

### **Q: Is storing user data in localStorage secure?**

**A:** Reasonable for non-sensitive data with caveats:

**Safe to store:**
- ✅ User ID
- ✅ Username
- ✅ Display name
- ✅ Email (non-sensitive)
- ✅ Avatar URL
- ✅ Role/permissions

**NEVER store:**
- ❌ Passwords (even hashed)
- ❌ Credit card info
- ❌ Social security numbers
- ❌ Private personal data

**Current user object (safe):**
```javascript
{
  userId: 1,
  username: "testuser",
  fullName: "Nguyễn Văn A",
  email: "user@example.com",
  phone: "0123456789",
  role: "USER"
}
```

**Mitigation:**
- Token expires automatically (backend sets expiry)
- User can logout to clear data
- Use httpOnly cookies for sensitive tokens (future improvement)

---

## 🎯 Alternative Solutions Considered

### **Option 1: Fetch user on every page load** ❌
```javascript
// router/index.js
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.user && authStore.token) {
      await authStore.fetchCurrentUser()  // API call
    }
    // ...
  }
})
```
**Cons:**
- Extra API call on every protected route navigation
- Slower page loads
- Unnecessary server load

### **Option 2: Use sessionStorage** ❌
```javascript
sessionStorage.setItem('user', JSON.stringify(user))
```
**Cons:**
- Lost when user closes tab/browser
- Poor UX (must login again after closing tab)

### **Option 3: Store in Pinia with persist plugin** ✅ (Future)
```javascript
import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const useAuthStore = defineStore('auth', () => {
  // ...
}, {
  persist: true  // Auto-save to localStorage
})
```
**Pros:**
- Automatic persistence
- No manual localStorage management
- Clean code

**Why not now:** Avoid adding dependency for simple fix

---

## 📋 localStorage Structure

After login:
```javascript
// localStorage contents
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": "{\"userId\":1,\"username\":\"testuser\",\"fullName\":\"Nguyễn Văn A\",\"email\":\"user@example.com\"}"
}
```

After logout:
```javascript
// localStorage contents
{}
```

---

## ✅ Verification

**Test Checklist:**
- [x] Login saves user to localStorage
- [x] Page refresh loads user from localStorage
- [x] Navigate to /orders works without redirect
- [x] OrderHistoryPage shows orders
- [x] Logout clears user from localStorage
- [x] After logout, /orders redirects to login
- [x] No console errors

---

## 🎊 Summary

**Issue:** User data lost on page refresh causing redirect loop

**Root Cause:** Only token persisted, not user object

**Fix:** Save user to localStorage on login/fetch, load on init

**Impact:** Authentication now persists across page refreshes

**Files Modified:** 1 (authStore.js)

**Lines Changed:** ~15 lines

**Result:** ✅ Users can now access `/orders` after page refresh!
