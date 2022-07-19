import request from '@/utils/request'
const path = 'lebo/'
// 查询管理分页查询
export function queryVerificationList (data = {}) {
  return request({
    url: `${path}order/coupons`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'thirdmnt'
  })
}
// 查询单个核销单据信息
export function queryVerificationOne (writeOffCode = '') {
  return request({
    url: `${path}order/one?writeOffCode=${writeOffCode}`,
    method: 'get',
    type: 'json',
    serviceCode: 'thirdmnt'
  })
}
// // 更新核销信息
export function putOrderProduct (data = {}) {
  return request({
    url: `${path}order/product`,
    method: 'put',
    data: data,
    type: 'json',
    serviceCode: 'thirdmnt'
  })
}

// （5）重新推送
export function getRePush (data = {}) {
  return request({
    url: `${path}order/push`,
    method: 'put',
    data: data,
    type: 'json',
    serviceCode: 'thirdmnt'
  })
}

// （6）手动核销
export function getCancellation (data = {}) {
  return request({
    url: `${path}order/cancellation`,
    method: 'put',
    data: data,
    type: 'json',
    serviceCode: 'thirdmnt'
  })
}
