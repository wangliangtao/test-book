import request from '@/utils/request-merchant'
const BASEURL = process.env.VUE_APP_BASE_API

// 商品分也查询
export function queryProductList(data = {}, token) {
  return request({
    url: `${BASEURL}/thirdmnt/api/v1/lebo/product/relations`,
    method: 'post',
    data: data,
    type: 'json',
    token: token
  })
}

// 添加商品信息
export function addProduct(data = {}, token) {
  return request({
    url: `${BASEURL}/thirdmnt/api/v1/lebo/product`,
    method: 'post',
    data: data,
    type: 'json',
    token: token
  })
}

// 修改商品信息
export function putProduct(data = {}, token) {
  return request({
    url: `${BASEURL}/thirdmnt/api/v1/lebo/product`,
    method: 'put',
    data: data,
    type: 'json',
    token: token
  })
}
