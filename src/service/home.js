import axios  from "@/utils/axios";

// 获取轮播图
export function getHome(params){
  return axios.get('/index-infos');
}