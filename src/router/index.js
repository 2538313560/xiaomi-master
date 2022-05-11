import Vue from 'vue'
import Router from 'vue-router'

// 前端
import GoodsList from '@/views/GoodsList'
import home from '@/views/home'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'

// 后台管理
import index from '@/admin/index'
import carouselManage from '@/admin/carouselManage'
import goodsManage from '@/admin/goodsManage'


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // 前端路由
    {
      path: '/',
      component: home
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    },

    // 后台管理路由
    {
      path: '/index',
      name: 'admin',
      component: index,
      redirect: '/index/carouselManage',
      children: [
        {
          path: '/index/carouselManage',
          name: 'carouselManage',
          component: carouselManage
        },
        {
          path: '/index/goodsManage',
          name: 'goodsManage',
          component: goodsManage
        },
      ]
    },
  ]
})
