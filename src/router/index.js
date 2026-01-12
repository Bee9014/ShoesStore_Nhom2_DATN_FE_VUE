import { createRouter, createWebHistory } from 'vue-router'
import { Home, ShoppingBag, LogIn, UserPlus, ShoppingCart, CreditCard, User, Package } from 'lucide-vue-next'

// Layouts
import DefaultLayout from '../layouts/DefaultLayout.vue'

// Views
import HomePage from '../views/HomePage.vue'
import ProductPage from '../views/ProductPage.vue'
import ProductDetail from '../views/ProductDetail.vue'
import CartPage from '../views/CartPage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'
import OrderSuccessPage from '../views/OrderSuccessPage.vue'
import OrderHistoryPage from '../views/OrderHistoryPage.vue'
import OrderDetailPage from '../views/OrderDetailPage.vue'
import ProfilePage from '../views/user/ProfilePage.vue'
import LoginPage from '../views/auth/LoginPage.vue'
import RegisterPage from '../views/auth/RegisterPage.vue'
import PaymentResultPage from '../views/PaymentResultPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomePage,
          meta: {
            title: "ShoesStore - Trang chủ",
            icon: Home,
          },
        },
        {
          path: '/products',
          name: 'Products',
          component: ProductPage,
          meta: {
            title: 'Sản phẩm',
            icon: ShoppingBag,
          },
        },
        {
          path: '/products/:id',
          name: 'ProductDetail',
          component: ProductDetail,
          meta: {
            title: 'Chi tiết sản phẩm',
          },
        },
        {
          path: '/cart',
          name: 'Cart',
          component: CartPage,
          meta: {
            title: 'Giỏ hàng',
            icon: ShoppingCart,
          },
        },
        {
          path: '/checkout',
          name: 'Checkout',
          component: CheckoutPage,
          meta: {
            title: 'Thanh toán',
            icon: CreditCard,
            requiresAuth: true,
          },
        },
        {
          path: '/payment-result', 
          name: 'PaymentResult',
          component: PaymentResultPage,
          meta: {
            title: 'Kết quả thanh toán',
            // requiresAuth: true, // Có thể bật nếu muốn bắt buộc đăng nhập
          },
        },
        {
          path: '/orders/:orderId/success',
          name: 'OrderSuccess',
          component: OrderSuccessPage,
          meta: {
            title: 'Đặt hàng thành công',
          },
        },
        {
          path: '/orders',
          name: 'OrderHistory',
          component: OrderHistoryPage,
          meta: {
            title: 'Đơn hàng của tôi',
            icon: Package,
            requiresAuth: true,
          },
        },
        {
          path: '/orders/:orderId',
          name: 'OrderDetail',
          component: OrderDetailPage,
          meta: {
            title: 'Chi tiết đơn hàng',
            requiresAuth: true,
          },
        },
        {
          path: '/profile',
          name: 'Profile',
          component: ProfilePage,
          meta: {
            title: 'Thông tin cá nhân',
            icon: User,
            requiresAuth: true,
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
      meta: {
        title: 'Đăng nhập',
        icon: LogIn,
        layout: 'auth',
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage,
      meta: {
        title: 'Đăng ký',
        icon: UserPlus,
        layout: 'auth',
      },
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "ShoesStore"
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      // Redirect to login if not authenticated
      next('/login')
      return
    }
  }
  
  next()
})

export default router
