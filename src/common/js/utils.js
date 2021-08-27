export function getLocal(name){
  return localStorage.getItem(name);
}

export function setLocal(name,value){
  localStorage.setItem(name,value);
}

// 图片前缀方法,用于主页的商品
export const prefix = (url) => {
  if (url && url.startsWith('http')) {
    return url
  } else {
    url = `http://backend-api-01.newbee.ltd${url}`
    return url
  }
}
