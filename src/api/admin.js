import request from '@/utils/request'

/**
 * 抽奖规则的审核
 * @param {Object} params
 * @param {String} params.ruleId 规则编号
 * @param {String} params.awardTitle 礼包标题
 * @param {String} params.merchantNickName 商家昵称
 * @param {Number} params.merchantPhone 手机号码
 * @param {Boolean} params.ruleStatus 礼包状态
 * @param {Number} params.beginTime 发布时间
 * @param {Number} params.endTime 结束时间
 * @param {Number} params.pageNo
 * @param {Number} params.pageSize
 */
export function getPCRuleList (params) {
  return request({
    url: `admin/getPCRuleList`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'choujiang'
  })
}

/**
 * 抽奖规则的审核
 * @param {Object} params
 * @param {String} params.ruleId 规则Id
 * @param {Number} params.auditStatus 审核状态
 * @param {String} params.auditErrorMessage 审核失败理由
 */
export function auditRule (params) {
  return request({
    url: `admin/auditRule`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'choujiang'
  })
}

/**
 * 根据规则ID获取规则信息
 * @param {String} ruleId 规则Id
 */
export function getRuleDetail (ruleId) {
  return request({
    url: `user/getRuleDetail?ruleId=${ruleId}`,
    serviceCode: 'choujiang'
  })
}

/**
 * 根据红包Id获取详情
 * @param {String} rpParentId 红包Id
 */
export function getRpDetail (rpParentId) {
  return request({
    url: `admin/getRpDetail?rpParentId=${rpParentId}`,
    serviceCode: 'activity'
  })
}

/**
 * 更新红包信息 （礼包绑定）
 * @param {Object} params
 * @param {String} params.rpId 红包
 * @param {Number} params.rpTitle 规则Id
 * @param {Number} params.slogan 规则Id
 * @param {Number} params.logoLocation 规则Id
 * @param {Number} params.advLocation 规则Id
 * @param {Number} params.ruleId 规则Id
 */
export function updateRpInfo (params) {
  return request({
    url: `admin/updateRpInfo`,
    method: 'put',
    data: params,
    type: 'json',
    serviceCode: 'activity'
  })
}

/**
 * 根据商户ID获取所属规则列表
 * @param {String} merchantLoginId 商户 ID
 */
export function getSimpleRuleList (merchantLoginId) {
  return request({
    url: `admin/getSimpleRuleList?merchantLoginId=${merchantLoginId}`,
    serviceCode: 'choujiang'
  })
}

/**
 * 抽奖总计————1
 */

export function getRuleStatisticsHeader () {
  return request({
    url: `admin/getRuleStatisticsHeader`,
    serviceCode: 'choujiang'
  })
}

/**
 * 乐币回收数量1--1
 * @param {Number} beginTime 开始时间戳
 * @param {Number} endTime 结束时间戳
 */

export function getRecoverLebiNum (beginTime, endTime) {
  return request({
    url: `admin/getRecoverLebiNum?beginTime=${beginTime}&endTime=${endTime}`,
    serviceCode: 'choujiang',
  })
}

/**
 * 乐币回收数量图表信息1--2
 * @param {Number} beginTime 开始时间戳
 * @param {Number} endTime 结束时间戳
 */

export function getRecoverLebiChart (beginTime, endTime) {
  return request({
    url: `admin/getRecoverLebiChart?beginTime=${beginTime}&endTime=${endTime}`,
    serviceCode: 'choujiang',
  })
}

/**
 * 抽奖人数和次数--2
 * @param {Number} beginTime 开始时间戳
 * @param {Number} endTime 结束时间戳
 */

export function getRuleLotteryNum (beginTime, endTime) {
  return request({
    url: `admin/getRuleLotteryNum?beginTime=${beginTime}&endTime=${endTime}`,
    serviceCode: 'choujiang',
  })
}

/**
 * 抽奖人数和次数图表--3
 * @param {Number} beginTime 开始时间戳
 * @param {Number} endTime 结束时间戳
 */

export function getRuleLotteryChart (beginTime, endTime) {
  return request({
    url: `admin/getRuleLotteryChart?beginTime=${beginTime}&endTime=${endTime}`,
    serviceCode: 'choujiang'
  })
}

/**
 * 中奖人数次数统计--4
 * @param {Number} beginTime 开始时间戳
 * @param {Number} endTime 结束时间戳
 */

export function getRuleAwardNum (beginTime, endTime) {
  return request({
    url: `admin/getRuleAwardNum?beginTime=${beginTime}&endTime=${endTime}`,
    serviceCode: 'choujiang'
  })
}

/**
 * 中奖人数次数图表--5
 * @param {Number} beginTime 开始时间戳
 * @param {Number} endTime 结束时间戳
 */

export function getRuleAwardChart (beginTime, endTime) {
  return request({
    url: `admin/getRuleAwardChart?beginTime=${beginTime}&endTime=${endTime}`,
    serviceCode: 'choujiang'
  })
}

/**
 * 核销人数次数统计--6
 * @param {Number} beginTime 开始时间戳
 * @param {Number} endTime 结束时间戳
 */

export function getRuleWriteOffNum (beginTime, endTime) {
  return request({
    url: `admin/getRuleWriteOffNum?beginTime=${beginTime}&endTime=${endTime}`,
    serviceCode: 'choujiang'
  })
}

/**
 * 核销人数次数图表--7
 * @param {Number} beginTime 开始时间戳
 * @param {Number} endTime 结束时间戳
 */

export function getRuleWriteOffChart (beginTime, endTime) {
  return request({
    url: `admin/getRuleWriteOffChart?beginTime=${beginTime}&endTime=${endTime}`,
    serviceCode: 'choujiang'
  })
}

/**
 * new_管理端关联红包的推文和抽奖
 * @param {Object} params
 * @param {String} params.rpParentId 红包ID
 * @param {String} params.interactionSerialNo 推文ID
 * @param {String} params.ruleId 规则ID
 */
export function interactionBinding (params) {
  return request({
    url: `admin/interactionBinding`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'activity'
  })
}

/**
 * new_PC端强制下架红包
 * @param {Object} params
 * @param {String} params.rpParentId 红包ID
 */
export function publishDown (rpParentId) {
  return request({
    url: `admin/publishDown?rpParentId=${rpParentId}`,
    serviceCode: 'activity'
  })
}

/**
 * new_管理端关联红包的推文和抽奖
 * @param {Object} params
 * @param {String} params.ruleId 规则码
 * @param {String} params.awardTitle 标题
 * @param {String} params.awardDescription 规则描述
 * @param {string<Array>} params.awardImages 规则图片
 * @param {Number} params.originalPrice 原价
 */
export function updateRuleInfo (params) {
  return request({
    url: `admin/updateRuleInfo`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'choujiang'
  })
}

/**
 * new_PC 端强制红包上架
 * @param {Object} params
 * @param {String} params.rpId 红包ID
 * @param {Number} params.coinUp 上架的乐币数量
 * @param {Number} params.coinAloneType 消耗类别1：一天最多领取，2：一周最多领取 3：一月最多领取
 * @param {Number} params.coinUserMax 单个用户最多领取的乐币数
 * @param {String} params.endDate 结束时间
 * @param {Number} params.displayTime 广告时长
 */
export function publishUp (params) {
  return request({
    url: `admin/publishUp`,
    method: 'post',
    data: params,
    type: 'json',
    serviceCode: 'activity'
  })
}