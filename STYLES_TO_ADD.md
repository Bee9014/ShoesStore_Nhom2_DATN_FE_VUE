# 🎨 STYLES CẦN THÊM VÀO ProductDetail.vue

Thêm các CSS styles sau vào file `src/views/ProductDetail.vue` trong thẻ `<style scoped>`:

## 1. Inactive Badge trên Main Image

```css
.main-image {
  /* ... existing styles ... */
  position: relative; /* ✅ THÊM DÒNG NÀY */
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
```

## 2. Title Row với Status Badge

```css
.title-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
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
```

## 3. Disabled State cho Buttons

Sửa styles của buttons để support disabled state:

```css
.btn-add-to-cart:hover:not(:disabled) {
  background-color: #e04500;
}

.btn-buy-now:hover:not(:disabled) {
  background-color: #000;
}

.btn-add-to-cart:disabled,
.btn-buy-now:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}
```

---

## Hoặc Copy Full Style Block

```css
<style scoped>
/* ... existing styles ... */

/* ✅ THÊM/SỬA CÁC STYLES SAU */

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
  position: relative; /* ✅ THÊM */
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

.title-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
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

.btn-add-to-cart:hover:not(:disabled) {
  background-color: #e04500;
}

.btn-buy-now:hover:not(:disabled) {
  background-color: #000;
}

.btn-add-to-cart:disabled,
.btn-buy-now:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
```

---

**Lưu ý:** Nếu file ProductDetail.vue đã có styles cho `.main-image`, chỉ cần thêm `position: relative;` vào block đó.
