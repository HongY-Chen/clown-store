import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/User.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/Setting')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/Category.vue')
  },
  {
    path: '/product-list',
    name: 'product-list',
    component: () => import('@/views/ProductList')
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('@/views/ProductDetail')
  },
  {
    path: '/create-order',
    name: 'create-order',
    component: () => import('@/views/CreateOrder')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Order')
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/Address')
  },
  {
    path: '/address-edit',
    name: 'address-edit',
    component: () => import('@/views/AddressEdit')
  },
]

const router = new VueRouter({
  routes
})

export default router
