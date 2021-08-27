import axios from "@/utils/axios";

//添加到购物车
export function addCart(params){
  return axios.post('/shop-cart',params);
}

//获取购物车数量
export function getCart(params){
  return axios.get('/shop-cart',{ params })
}

//删除购物车商品
export function deleteCartItem(id){
  return axios.delete(`/shop-cart/${id}`);
}

//修改购物车
export function modifyCart(params){
  return axios.put('/shop-cart',params);
}

//在创建订单页面,通过商品ID查询对应的商品信息并返回
export function getByCartItemIds(params){
  return axios.get('/shop-cart/settle',{ params });
}