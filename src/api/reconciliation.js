import request from '@/utils/request'
const path = 'reconciliation/'

// 停车支付统计接口
export function parkingPayMonthly (date = '') {
  return request({
    url: `${path}parkingPayMonthly?date=${date}`,
    serviceCode: 'payment'
  })
}

// 【new统计】TOP 所有的支付金额统计
export function parkingPayTotal () {
  return request({
    url: `${path}parkingPayTotal`,
    serviceCode: 'payment'
  })
}

/**
 * 【new统计】P1-用户时间区间内的 ，支付金额总计
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */
export function parkingPayDayliy ({ beginTime, endTime }) {
  return request({
    url: `${path}parkingPayDayliy?sdate=${beginTime}&edate=${endTime}`,
    serviceCode: 'payment'
  })
}

/**
 * 【new统计】P1-用户日支付数据 表格统计
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */
export function parkingPayDayliyChart ({ beginTime, endTime }) {
  return request({
    url: `${path}parkingPayDayliyChart?sdate=${beginTime}&edate=${endTime}`,
    serviceCode: 'payment'
  })
}

/**
 * 【new统计】p2-支付总数统计
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */
export function parkingPayDaliyUser ({ beginTime, endTime }) {
  return request({
    url: `${path}parkingPayDaliyUser?sdate=${beginTime}&edate=${endTime}`,
    serviceCode: 'payment'
  })
}

/**
 * 【new统计】p2-用户日支付数统计
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */
export function parkingPayDayliyUserChart ({ beginTime, endTime }) {
  return request({
    url: `${path}parkingPayDayliyUserChart?sdate=${beginTime}&edate=${endTime}`,
    serviceCode: 'payment'
  })
}

/**
 * 【new统计】p2-支付日统计
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */
export function parkingPayDayliyPayChart ({ beginTime, endTime }) {
  return request({
    url: `${path}parkingPayDayliyPayChart?sdate=${beginTime}&edate=${endTime}`,
    serviceCode: 'payment'
  })
}