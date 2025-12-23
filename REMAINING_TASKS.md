# 📋 Remaining Tasks - ShoeStore Project

**Last Updated:** 2025-12-21  
**Current Progress:** Order System 80% Complete

---

## ✅ Completed Features

### **Phase 1: Cart System** ✅
- [x] Fixed cart to use `variantId` instead of composite key
- [x] Updated CartItem.vue and CartPage.vue
- [x] Added mock variants to ProductDetail.vue
- [x] Cart operations work with real database variants

### **Phase 2: Order History** ✅
- [x] Created OrderHistoryPage with status filters & pagination
- [x] Created OrderDetailPage with timeline visualization
- [x] Added router guards for authentication
- [x] Cancel order functionality (PENDING only)

### **Phase 3: Authentication** ✅
- [x] Fixed auth persistence (user data in localStorage)
- [x] Page refresh maintains login state
- [x] Protected routes work correctly

### **Phase 4: Navigation** ✅
- [x] Added Package icon to Header
- [x] Added "Xem đơn hàng của tôi" button to OrderSuccessPage
- [x] Navigation only shows when authenticated

### **Backend Integration** ✅
- [x] Removed all hardcoded values from order creation
- [x] Integrated ProductVariantMapper and ProductMapper
- [x] Real prices and product names from database
- [x] Stock validation added
- [x] Fixed all database schema mismatches

---

## 🚧 In Progress / High Priority

### **1. End-to-End Testing** 🔴 HIGH
**Status:** Not started  
**Estimated Time:** 30-60 minutes

**Tasks:**
- [ ] Test complete user journey:
  - Browse products → Add to cart → Checkout → Order created → View history
- [ ] Test with different product variants (sizes, colors)
- [ ] Test with multiple items in cart
- [ ] Test order cancellation
- [ ] Test pagination in order history
- [ ] Test status filters
- [ ] Verify all data displays correctly
- [ ] Check mobile responsive layout
- [ ] Test error handling (network failures, validation)

**Why Important:** Ensure everything works together before moving forward

---

### **2. Reorder Functionality** 🟡 MEDIUM
**Status:** TODO placeholder exists  
**Estimated Time:** 1-2 hours

**Current State:**
```javascript
// OrderDetailPage.vue
const handleReorder = () => {
  alert('Tính năng đặt lại đơn hàng sẽ được cập nhật sớm!')
  router.push('/')
}
```

**Tasks:**
- [ ] Create API endpoint: `GET /api/v1/orders/{orderId}/items`
- [ ] Fetch order items with full variant info
- [ ] Map order items to current product variants
- [ ] Add items to cart with correct variantIds
- [ ] Handle out-of-stock items
- [ ] Show confirmation message
- [ ] Redirect to cart page
- [ ] Test with multiple orders

**Implementation Plan:**
```javascript
const handleReorder = async () => {
  try {
    // 1. Get order items
    const response = await getOrderDetail(order.value.orderId)
    const items = response.data.items
    
    // 2. Add each item to cart
    for (const item of items) {
      // Need variantId from item (backend must provide this)
      cartStore.addToCart(
        item.productId,
        item.productName,
        item.unitPrice,
        item.defaultImage,
        item.variantId,
        item.quantity
      )
    }
    
    // 3. Redirect to cart
    alert('Đã thêm sản phẩm vào giỏ hàng!')
    router.push('/cart')
  } catch (error) {
    alert('Không thể đặt lại đơn hàng: ' + error.message)
  }
}
```

**Backend Changes Needed:**
- OrderItem must include `variantId` in response
- Or add endpoint that returns full product variant info

---

### **3. Admin Order Management** 🟡 MEDIUM
**Status:** Not started  
**Estimated Time:** 3-4 hours

**Features Needed:**

#### **3.1. Admin Order List Page**
- [ ] View all orders from all users
- [ ] Filter by status (Pending, Shipping, Delivered, Cancelled)
- [ ] Filter by date range
- [ ] Search by order ID or customer name
- [ ] Pagination
- [ ] Sort by date/amount
- [ ] Export to Excel/CSV

#### **3.2. Admin Order Detail & Update**
- [ ] View full order details
- [ ] Update order status:
  - Pending → Shipping
  - Shipping → Delivered
- [ ] Add tracking number
- [ ] Add admin notes
- [ ] View customer info
- [ ] Call customer directly (click-to-call)
- [ ] Print order invoice

#### **3.3. Backend Endpoints Needed:**
```
GET /api/v1/admin/orders              // List all orders
GET /api/v1/admin/orders/{id}         // Get order detail
PUT /api/v1/admin/orders/{id}/status  // Update status
POST /api/v1/admin/orders/{id}/notes  // Add admin note
```

---

## 🔮 Future Enhancements / Low Priority

### **4. Payment Integration** 🟢 LOW
**Status:** Not started  
**Estimated Time:** 4-6 hours per gateway

**Options:**
- **VNPay** (Popular in Vietnam, bank transfer)
- **Momo** (E-wallet)
- **ZaloPay** (E-wallet)
- **COD** (Already supported - default)

**Tasks:**
- [ ] Research payment gateway APIs
- [ ] Register merchant accounts
- [ ] Implement payment initiation
- [ ] Handle payment callback/webhook
- [ ] Update order status on payment success
- [ ] Handle payment failures
- [ ] Add payment method selection to checkout
- [ ] Store payment transaction info
- [ ] Test sandbox environment

---

### **5. Email Notifications** 🟢 LOW
**Status:** Not started  
**Estimated Time:** 2-3 hours

**Email Types:**
- [ ] Order confirmation (after checkout)
- [ ] Order shipped (tracking number)
- [ ] Order delivered
- [ ] Order cancelled
- [ ] Password reset
- [ ] Account verification

**Implementation:**
- Use Spring Boot Mail Sender
- Create email templates (Thymeleaf)
- Queue emails for async sending
- Add email preferences to user settings

---

### **6. Product Reviews & Ratings** 🟢 LOW
**Status:** Not started  
**Estimated Time:** 4-5 hours

**Features:**
- [ ] Rate product (1-5 stars)
- [ ] Write review text
- [ ] Upload review images
- [ ] Only allow reviews after delivery
- [ ] Display reviews on product page
- [ ] Calculate average rating
- [ ] Sort reviews by date/rating
- [ ] Admin moderation

---

### **7. Order Search & Advanced Filters** 🟢 LOW
**Status:** Not started  
**Estimated Time:** 1-2 hours

**Features:**
- [ ] Search by order ID
- [ ] Filter by date range (from - to)
- [ ] Filter by price range
- [ ] Filter by product name
- [ ] Filter by shipping status
- [ ] Sort by date/amount
- [ ] Save filter preferences

---

### **8. Print Invoice/Receipt** 🟢 LOW
**Status:** Not started  
**Estimated Time:** 2-3 hours

**Features:**
- [ ] Generate PDF invoice
- [ ] Include company info
- [ ] Order details table
- [ ] QR code for tracking
- [ ] Print-friendly layout
- [ ] Download invoice button
- [ ] Email invoice option

---

### **9. Order Tracking** 🟢 LOW
**Status:** Not started  
**Estimated Time:** 3-4 hours

**Features:**
- [ ] Real-time order status updates
- [ ] Shipping partner integration
- [ ] Estimated delivery date
- [ ] Push notifications (web/mobile)
- [ ] SMS notifications
- [ ] Track by order ID (public page)
- [ ] Map view of delivery route

---

### **10. Dashboard & Analytics** 🟢 LOW
**Status:** Not started  
**Estimated Time:** 4-6 hours

**Admin Dashboard:**
- [ ] Total orders today/week/month
- [ ] Revenue charts
- [ ] Top selling products
- [ ] Order status distribution
- [ ] Customer statistics
- [ ] Inventory alerts

---

## 🐛 Known Issues / Improvements

### **Minor Issues:**

1. **Tab Counts in OrderHistoryPage**
   - Currently only "All" tab shows count
   - Need API to return count per status

2. **Item Count in Order List**
   - Backend doesn't return `itemCount`
   - Frontend shows "N/A"
   - Need to add to OrderResponse

3. **Mock Product Variants**
   - ProductDetail uses 32 hardcoded variants
   - Should fetch from API
   - Need ProductVariant API endpoint

4. **No Product Images in Order Detail**
   - OrderDetailPage shows Package icon
   - Should show actual product images
   - Need to include image URLs in order items

5. **Shipping Fee Hardcoded**
   - OrderDetailPage: `shippingFee = 30000`
   - Should come from order data or calculation

---

## 📊 Priority Recommendation

### **Immediate (This Week):**
1. ✅ **End-to-End Testing** - Verify everything works
2. 🟡 **Fix Known Issues** - Item counts, product images
3. 🟡 **Reorder Functionality** - Complete the TODO

### **Short Term (Next 2 Weeks):**
4. 🟡 **Admin Order Management** - Essential for business
5. 🟡 **Email Notifications** - Improve customer experience
6. 🟢 **Payment Integration** - Start with one gateway (VNPay)

### **Long Term (1+ Month):**
7. 🟢 **Product Reviews**
8. 🟢 **Order Tracking**
9. 🟢 **Dashboard & Analytics**
10. 🟢 **Advanced Filters**

---

## 🎯 Next Steps - What to Do Now?

**Option 1: Testing & Bug Fixes** ✅ RECOMMENDED
- Test complete flow
- Fix any bugs found
- Polish existing features
- Ensure production-ready

**Option 2: Complete Core Features**
- Implement Reorder
- Admin Order Management
- Essential for MVP

**Option 3: Add Payment**
- VNPay integration
- Make it a real e-commerce site
- Requires merchant account

**Option 4: Improve UX**
- Email notifications
- Better product images in orders
- Fix tab counts
- Polish UI/UX

---

## 🎊 Summary

**Completed:** 80%
- ✅ Order creation
- ✅ Order history
- ✅ Order detail
- ✅ Cancel orders
- ✅ Authentication
- ✅ Navigation

**Remaining:** 20%
- 🔴 Testing
- 🟡 Reorder
- 🟡 Admin management
- 🟢 Payments
- 🟢 Emails
- 🟢 Reviews
- 🟢 Tracking

**Recommendation:** Start with testing, then reorder, then admin features.

---

**Bạn muốn làm cái nào tiếp theo?** 🚀
