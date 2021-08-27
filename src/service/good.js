import axios from "@/utils/axios";

// 获取分类
export function getCategory(){
  return axios.get('/categories');
}

// 搜索商品
export function search(params){
  return axios.get('/search',{ params });
}

// 获取商品详情
export function getDetail(id){
  return axios.get(`/goods/detail/${id}`);
}