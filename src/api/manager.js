import request from '@/utils/request'

/**
 * 【管理员】查询所有审批信息
 * @param {Object} params
 * @param {String} params.title 标题
 * @param {Number} params.startTime 结束时间
 * @param {Number} params.endTime 开始时间
 * @param {Number} params.pageNo 页码
 * @param {Number} params.pageSize 条数
 * @param {Number} params.status 互动状态
 * @param {Number} params.phone 手机号
 * @param {String} params.nickname 昵称
 * @param {String} params.rpUserLoginId
 */
export function queryInteractionPage (params) {
  return request({
    url: `manager/queryInteractionPage`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'interaction'
  })
}

/**
 * 【管理员】查询一个信息（创建者信息）
 * @param {String} interactionSerialNo 序列号
 */
export function getBySerialNo (interactionSerialNo) {
  return request({
    url: `manager/getBySerialNo/${interactionSerialNo}`,
    serviceCode: 'interaction'
  })
}

/**
 * 【管理员】通过审批
 * @param {Object} params
 * @param {String} params.interactionSerialNo 序列号
 */
export function approval (params) {
  return request({
    url: `manager/audit/approval`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'interaction'
  })
}

/**
 * 【管理员】驳回
 * @param {Object} params
 * @param {String} params.interactionSerialNo 序列号
 * @param {String} params.rejectReason 驳回原因
 */
export function reject (params) {
  return request({
    url: `manager/audit/reject`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'interaction'
  })
}

/**
 * 【管理员】下架
 * @param {Object} params
 * @param {String} params.interactionSerialNo 序列号
 */
export function disable (params) {
  return request({
    url: `manager/disable`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'interaction'
  })
}

/**
 * 【管理员】修改用户草稿信息
 * @param {Object} params
 * @param {String} params.serialNo 序列号传入null 或者空串 是不穿， 传入为更新
 * @param {String} params.puzzleTitle 猜字标题
 * @param {Array<String>} params.puzzleContentList 猜字内容
 */
export function draftInteraction (params) {
  return request({
    url: `manager/draftInteraction`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'interaction'
  })
}

/**
 * 【管理员】查询商品审批信息 -分页
 * @param {Object} params
 * @param {String} params.title 标题
 * @param {Number} params.phone 手机号
 * @param {String} params.nickname 昵称
 * @param {Number} params.startTime 结束时间
 * @param {Number} params.endTime 开始时间
 * @param {Number} params.pageNo 页码
 * @param {Number} params.pageSize 条数
 * @param {Array<Number>} params.status 商品状态
 * @param {String} params.serialNo 商品编号
 */
export function postQueryManagerPage (params) {
  return request({
    url: `manager/queryManagerPage`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'goods'
  })
}

/**
 * 【管理员】商品审批通过
 * @param {Object} params
 * @param {String} params.serialNo 商品编号
 * @param {String} params.rate 扣除乐币数
 */
export function postAuditApproval (params) {
  return request({
    url: `manager/audit/approval`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'goods'
  })
}

/**
 * 【管理员】驳回商品审批信息
 * @param {Object} params
 * @param {String} params.serialNo 商品编号
 * @param {String} params.rejectReason 审批信息
 */
export function postAuditReject (params) {
  return request({
    url: `manager/audit/reject`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'goods'
  })
}

/**
 * 【管理员】编辑商品信息
 * @param {Object} params
 * @param {String} params.serialNo 商品 id
 * @param {String} params.goodsTitle 商品标题
 * @param {String} params.goodsImg 商品封面
 * @param {String} params.logo 商家 logo
 * @param {String} params.rate 扣除乐币数
 * @param {Number} params.commercialValue 原价
 * @param {Array<Object>} params.addressList 地址数组 [{address: '地址', tel: '12345678901'}]
 * @param {Array<Object>} params.detailList 详情数组 [{type: 'text / image', detail: 'sad2132asd / http://sadsad'}]
 */
export function postGoodsEdit (params) {
  return request({
    url: `manager/edit`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'goods'
  })
}