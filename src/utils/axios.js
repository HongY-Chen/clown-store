import axios from "axios";
import { Toast } from "vant";
import router from "../router";

// 项目的请求地址
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? 'http://backend-api-01.newbee.ltd/api/v1' : 'http://backend-api-01.newbee.ltd/api/v1'
// 跨域是否携带cookie
axios.defaults.withCredentials = true;
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// 每次请求都携带token
axios.defaults.headers['token'] = localStorage.getItem('token') || '';
// post请求的数据格式为json
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 设置相应拦截器
axios.interceptors.response.use((res) => {
  // 返回数据需要是对象
  if(typeof res.data !== 'object'){
    Toast.fail('服务端异常！');
    return Promise.reject(res);
  }
  if(res.data.resultCode !== 200){
    if(res.data.message){
      Toast.fail(res.data.message);
    }
    // 416是代表没有登录,路由跳转到登陆界面
    if(res.data.resultCode == 416){
      router.push({ path: '/login' });
    }
    return Promise.reject(res.data);
  }

  return res.data;
})

export default axios;
