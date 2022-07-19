import request from '@/utils/request'

/**
 * 根据热销ID模糊查询热销列表
 * @param {Object} params
 * @param {String} params.saleSerialNo 热销编号
 * @param {Number} params.pageNo 页码
 * @param {Number} params.pageSize 条数
 */

export function postSaleSimpleList (data = {}) {
  return request({
    url: `adminModule/getSaleSimpleList`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'activity'
  })
}

/**
 * 获取魔窗列表
 * @param {Object} params
 * @param {String} params.moduleSerialNo 魔窗编号
 * @param {String} params.moduleTitle 魔窗名称
 * @param {Number} params.updateBeginTime 更新时间
 * @param {Number} params.updateEndTime 更新时间
 * @param {Boolean} params.enableStatus 状态
 * @param {Number} params.pageNo 页码
 * @param {Number} params.pageSize 条数
 */

export function postModulePageList (data = {}) {
  return request({
    url: `adminModule/getModulePage`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'activity'
  })
}

/**
 * 启用/禁用魔窗
 * @param {Object} params
 * @param {String} params.moduleSerialNo 魔窗编号
 * @param {Boolean} params.enableStatus 操作状态
 */

export function postEnableModule (data = {}) {
  return request({
    url: `adminModule/enableModule`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'activity'
  })
}

/**
 * 保存一个魔窗
 * @param {Object} params
 * @param {String} params.moduleTitle 魔窗标题
 * @param {String} params.moduleLogo 魔窗logo
 * @param {Array<Object>} params.moduleLinkModels 展位
 * @param {String} moduleLinkModels.boothIndex 展位序号
 * @param {String} moduleLinkModels.boothType 展位类别，HOT_SALE/MERCHANT_LINK
 * @param {String} moduleLinkModels.saleSerialNo 热销id
 * @param {String} moduleLinkModels.linkImage 链接图片
 * @param {String} moduleLinkModels.linkMerchantLoginId 链接商户loginId
 * @param {Number} moduleLinkModels.linkMerchantPhone 链接手机号
 */

export function postSaveModule (data = {}) {
  return request({
    url: `adminModule/saveModule`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'activity'
  })
}

/**
 * 删除魔窗
 * @param {Object} params
 * @param {String} params.moduleSerialNo 魔窗编号
 */

export function getDeleteModule (moduleSerialNo = '') {
  return request({
    url: `adminModule/deleteModule?moduleSerialNo=${moduleSerialNo}`,
    serviceCode: 'activity'
  })
}

/**
 * 查看魔窗
 * @param {Object} params
 * @param {String} params.moduleSerialNo 魔窗编号
 */

export function getModuleDetail (moduleSerialNo = '') {
  return request({
    url: `adminModule/getModuleDetail?moduleSerialNo=${moduleSerialNo}`,
    serviceCode: 'activity'
  })
}