import request from '@/utils/request'

// 登陆
// export function userLogin (data = {}) {
//   return request({
//     url: `${path}loginSimple`,
//     method: 'post',
//     data: data,
//     type: 'json',
//     serviceCode: 'merchant'
//   })
// }

/**
 * 手机验证码登录
 * @param {Object} params
 * @param {String} params.phone
 * @param {String} params.authCode
 * @param {String} params.appId
 */

export function userLogin (data = {}) {
  return request({
    url: `login/phone`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'profile'
  })
}

// 获取验证码
export function authCode (phone = '') {
  return request({
    url: `authcode?phone=${phone}`,
    method: 'get',
    type: 'json',
    serviceCode: 'message'
  })
}
