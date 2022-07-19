import request from '@/utils/request'

/**
 * 获取用户乐币
 * @param {String} loginId
 */
export function getUserProfileByLoginId (loginId) {
  return request({
    url: `user/getUserProfileByLoginId/${loginId}`,
    serviceCode: 'profile'
  })
}

/**
 * 【用户/商户】获取一个商品的信息
 * @param {String} serialNo
 */
export function getOneBySerialNo (serialNo) {
  return request({
    url: `user/getOneBySerialNo/${serialNo}`,
    serviceCode: 'goods'
  })
}

/**
 * 获取核销人员
 * @param {String} phone  手机号
 */
export function getUserPhone (phone = '') {
  return request({
    url: `user/getUserProfile/phone?phone=${phone}`,
    serviceCode: 'profile'
  })
}