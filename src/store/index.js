import Vue from 'vue'
import Vuex from 'vuex'
import { getCart } from '@/service/cart'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //购物车数量
    cartCount:0
  },
  mutations: {
    //设置购物车数量
    setCart(state,payload){
      state.cartCount = payload.count;
    }
  },
  actions: {
    //更新购物车数量
    async updateCart(context){
      const { data } = await getCart();
      context.commit('setCart',{
        count:data.length || 0
      })
    }
  }
})
