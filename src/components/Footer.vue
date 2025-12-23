<template>
  <footer class="footer-main">
    <div class="footer-content">
      <div class="footer-col about">
        <div class="logo">
          <span class="logo-text">BITI'S HUNTER</span>
        </div>
        <p class="company-name">Công ty TNHH Sản Xuất Hàng Tiêu Dùng Bình Tiên</p>
        <p>Địa chỉ: 22 Lý Thái Tổ, P.2, Q.10, TP. HCM</p>
        <p>Hotline: 0966158666 (8h - 21h30)</p>
        <p>Email: <a href="mailto:cskh@bitis.com.vn">cskh@bitis.com.vn</a></p>
        <div class="social-icons">
          <a href="#"><Facebook :size="24" /></a>
          <a href="#"><Instagram :size="24" /></a>
          <a href="#"><Youtube :size="24" /></a>
        </div>
      </div>

      <div class="footer-col support">
        <h4>HỖ TRỢ KHÁCH HÀNG</h4>
        <ul>
          <li><a href="#">Các câu hỏi thường gặp</a></li>
          <li><a href="#">Tìm kiếm cửa hàng</a></li>
          <li><a href="#">Chính sách bảo hành</a></li>
          <li><a href="#">Chính sách đổi trả</a></li>
          <li><a href="#">Hướng dẫn mua hàng</a></li>
        </ul>
      </div>

      <div class="footer-col company">
        <h4>VỀ BITI'S</h4>
        <ul>
          <li><a href="#">Giới thiệu về Biti's</a></li>
          <li><a href="#">Tin tức</a></li>
          <li><a href="#">Tuyển dụng</a></li>
          <li><a href="#">Liên hệ</a></li>
        </ul>
      </div>

      <div class="footer-col payment">
        <h4>PHƯƠNG THỨC THANH TOÁN</h4>
        <div class="payment-methods">
          <span class="payment-badge">VISA</span>
          <span class="payment-badge">MoMo</span>
          <span class="payment-badge">VNPay</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 Biti's Hunter. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { Facebook, Instagram, Youtube } from 'lucide-vue-next'
</script>

<style scoped>
.footer-main {
  background-color: #2c2c2c;
  color: #fff;
  padding: 40px 5% 20px;
  margin-top: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-col h4 {
  font-size: 16px;
  margin-bottom: 20px;
  color: #ff5000;
}

.footer-col p,
.footer-col li {
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 1.6;
}

.footer-col a {
  color: #ccc;
  transition: color 0.3s;
}

.footer-col a:hover {
  color: #ff5000;
}

.footer-col ul {
  list-style: none;
  padding: 0;
}

.company-name {
  font-weight: bold;
  color: #ff5000;
  margin-bottom: 15px;
}

.logo-text {
  font-size: 24px;
  font-weight: 900;
  color: #ff5000;
  letter-spacing: 1px;
}

.logo img {
  height: 50px;
  margin-bottom: 20px;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-icons a {
  color: #fff;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #ff5000;
}

.payment-methods {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.payment-badge {
  display: inline-block;
  background: white;
  color: #333;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
}

.payment-methods img {
  height: 30px;
  background: white;
  padding: 5px;
  border-radius: 4px;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #444;
  font-size: 13px;
  color: #999;
}
</style>
