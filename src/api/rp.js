import request from '@/utils/request'
const path = 'rp/'

/**
 * 红包管理界面获取红包列表
 * @param {Object} params
 * @param {String} params.rpId 红包ID
 * @param {Number} params.rpTitle 红包标题
 * @param {Number} params.merchantName 广告主昵称
 * @param {Number} params.merchantPhone 手机号码
 * @param {Number} params.beginDateTime 开始时间
 * @param {Number} params.endDateTime 结束时间
 * @param {Number} params.rpStatus 红包状态
 * @param {Number} params.frameStatus 关联互动
 * @param {Number} params.frameStatus 关联奖券
 * @param {String} params.pageNo 页码
 * @param {String} params.pageSize 条数
 */

export function queryGetRpList (data = {}) {
  return request({
    url: `${path}getRpList`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'activity'
  })
}

// 更新红包审核状态
export function ajaxUpdateAuditStatus (data = {}) {
  return request({
    url: `${path}updateAuditStatus`,
    method: 'put',
    data: data,
    type: 'json',
    serviceCode: 'activity'
  })
}

// PC管理界面统计相关
export function getStatistics (date = '') {
  return request({
    url: `${path}compute/statistics?date=${date}`,
    serviceCode: 'activity'
  })
}

/**
 * PC刷红包总计
 */

export function getComputePCRPSum () {
  return request({
    url: `${path}compute/getComputePCRPSum`,
    serviceCode: 'activity'
  })
}

/**
 * PC刷红包统计三个总数
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */

export function getComputePCRP (data = {}) {
  return request({
    url: `${path}compute/getComputePCRP`,
    serviceCode: 'activity',
    method: 'post',
    data: data,
    type: 'json'
  })
}

/**
 * PC刷红包三个总数图表信息
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */

export function getComputePCRPChart (data = {}) {
  return request({
    url: `${path}compute/getComputePCRPChart`,
    serviceCode: 'activity',
    method: 'post',
    data: data,
    type: 'json'
  })
}

/**
 * PC用户行为统计两个总数
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */

export function getComputeUserBeha (data = {}) {
  return request({
    url: `${path}compute/getComputeUserBeha`,
    serviceCode: 'activity',
    method: 'post',
    data: data,
    type: 'json'
  })
}

/**
 * PC用户浏览次数图表信息
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */

export function getComputeBrowseTimesChart (data = {}) {
  return request({
    url: `${path}compute/getComputeBrowseTimesChart`,
    serviceCode: 'activity',
    method: 'post',
    data: data,
    type: 'json'
  })
}

/**
 * PC用户浏览人数图表信息
 * @param {Object} params
 * @param {Number} params.beginTime 开始时间戳
 * @param {Number} params.endTime 结束时间戳
 */

export function getComputeBrowsePersonNumChart (data = {}) {
  return request({
    url: `${path}compute/getComputeBrowsePersonNumChart`,
    serviceCode: 'activity',
    method: 'post',
    data: data,
    type: 'json'
  })
}