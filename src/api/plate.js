import request from '@/utils/request'

/**
 * 分页查询审批信息
 * @param {Object} params
 * @param {String} params.applyNickname 昵称
 * @param {Number} params.applyPhone 手机号码
 * @param {Number} params.plateNo 车牌
 * @param {Number} params.status 状态
 * @param {Number} params.startTimestamp 开始时间
 * @param {Number} params.endTimestamp 结束时间
 * @param {String} params.pageNo 页码
 * @param {String} params.pageSize 条数
 */

export function postQueryPlateAuthPage (data = {}) {
  return request({
    url: `plate/plateAuth/queryPlateAuthPage`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'profile'
  })
}

/**
 * 通过一个审批认证
 * @param {Object} params
 * @param {String} params.plateAuthId id
 */

export function postApprove (data = {}) {
  return request({
    url: `plate/plateAuth/approve`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'profile'
  })
}

/**
 * 驳回一个管理员认证
 * @param {Object} params
 * @param {String} params.plateAuthId id
 * @param {Number} params.rejectMessage 驳回信息
 */

export function postReject (data = {}) {
  return request({
    url: `plate/plateAuth/reject`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'profile'
  })
}

/**
 * 获取一个车牌认证的信息
 * @param {Object} params
 * @param {String} params.plateAuthId id
 */

export function getOne (plateAuthId = '') {
  return request({
    url: `plate/plateAuth/getOne/${plateAuthId}`,
    serviceCode: 'profile'
  })
}

/**
 * 撤销一个审批认证
 * @param {Object} params
 * @param {String} params.plateAuthId id
 */

export function postMntCancel (data = {}) {
  return request({
    url: `plate/plateAuth/mnt/cancel`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'profile'
  })
}