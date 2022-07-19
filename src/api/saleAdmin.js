import request from '@/utils/request'

/**
 * 获取热销列表
 * @param {Object} params
 * @param {String} params.saleSerialNo 热销编号
 * @param {Number} params.goodSerialNo 商品编号
 * @param {Number} params.merchantName 商家昵称
 * @param {Number} params.merchantPhone 商家手机号
 * @param {Number} params.updateBeginTime 开始时间
 * @param {Number} params.updateEndTime 结束时间
 * @param {Number} params.enableStatus 热销状态
 * @param {String} params.pageNo 页码
 * @param {String} params.pageSize 条数
 */

export function postSalePageList (data = {}) {
  return request({
    url: `saleAdmin/getSalePage`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'activity'
  })
}

/**
 * 根据热销ID获取热销详情
 * @param {Object} params
 * @param {String} params.saleSerialNo 热销编号
 */

export function getSaleDetail (saleSerialNo = '') {
  return request({
    url: `saleUser/getSaleDetail?saleSerialNo=${saleSerialNo}`,
    serviceCode: 'activity'
  })
}

/**
 * 编辑一个热销
 * @param {Object} params
 * @param {String} params.saleSerialNo 热销编号
 * @param {Number} params.goodSerialNo 商品编号
 * @param {Number} params.theme 封面
 * @param {Number} params.currentPrice 现价
 * @param {Number} params.inventory 库存
 * @param {Number} params.limitType 购买限制  1：每人限购，2：每人每天限购，3：每次限购
 * @param {Number} params.limitQuantity 限制数量
 * @param {String} params.deductionLebiEnable 是否开启抵扣乐币
 * @param {String} params.deductionLebi 可抵扣乐币
 * @param {String} params.luckEnable 是否开启抽奖
 * @param {String} params.luckLebiSpend 抽奖乐币花费
 * @param {String} params.luckWinPercentage 中奖概率
 */

export function postSaveSale (data = {}) {
  return request({
    url: `saleAdmin/saveSale`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'activity'
  })
}