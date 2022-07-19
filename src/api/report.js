import request from '@/utils/request'
const path = 'parking/'

/**
 * 1.停车场概览
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postParkingInfo (data = {}) {
  return request({
    url: `${path}getParkingInfo`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 2.获取泊位信息概览
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postSlots (data = {}) {
  return request({
    url: `${path}getSlots`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 3.获取14天统计缴费情况
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postPayChartInfo (data = {}) {
  return request({
    url: `${path}getPayChartInfo`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 4.支付方式分布图
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postPaymentMode (data = {}) {
  return request({
    url: `${path}getPaymentMode`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 5.周转率排行榜Top5
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postTurnoverRateRanking (data = {}) {
  return request({
    url: `${path}getTurnoverRateRanking`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 6.空闲率排行榜Top5
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postSpareRateRanking (data = {}) {
  return request({
    url: `${path}getSpareRateRanking`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 7.停车流量（近24小时）
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postParkingFlow (data = {}) {
  return request({
    url: `${path}getParkingFlow`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 8.停车时长（近24小时）
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postParkingTime (data = {}) {
  return request({
    url: `${path}getParkingTime`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 9.周转率根据周转率区间分组
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postTurnoverRateInterval (data = {}) {
  return request({
    url: `${path}getTurnoverRateInterval`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 10.根据给的区信息以及周转率区间
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 * @param {String} params.up 周转率上限
 * @param {String} params.down 周转率下限
 */
export function postTurnoverRateIntervalDetail (data = {}) {
  return request({
    url: `${path}getTurnoverRateIntervalDetail`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 11.根据给的区信息以及周转率区间
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 * @param {String} params.l4Region 镇
 * @param {String} params.up 周转率上限
 * @param {String} params.down 周转率下限
 */
export function postHeatMap (data = {}) {
  return request({
    url: `${path}getHeatMap`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 12.流量分析
 * @param {Object} params
 * @param {String} params.parkingSN	 停车场 id
 * @param {Number} params.time 时间戳
 */
export function postFlowAnalysis (data = {}) {
  return request({
    url: `${path}getFlowAnalysis`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 13.停车难易度，前30天 【一张图使用】
 * @param {Object} params
 * @param {String} params.parkingSN	 停车场 id
 * @param {Number} params.date 时间戳
 */
export function postMonthParkingSpaceIndex (data = {}) {
  return request({
    url: `${path}getMonthParkingSpaceIndex`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 14.停车难易度，数量统计 ，区域维度
 * @param {Object} params
 * @param {String} params.city	 市区
 * @param {String} params.l3Region 区镇，不传或者为空表示上一级
 */
export function postYesterdayParkingSpaceIndex (data = {}) {
  return request({
    url: `${path}getYesterdayParkingSpaceIndex`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 15.停车难易度，数量统计，小时维度
 * @param {Object} params
 * @param {String} params.city	 市区
 * @param {String} params.l3Region 区镇，不传或者为空表示上一级
 */
export function postYesterdayParkingSpaceIndexDependHour (data = {}) {
  return request({
    url: `${path}getYesterdayParkingSpaceIndexDependHour`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 16.时段性分析出入流量
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city	 市区
 * @param {String} params.l3Region 区
 * @param {String} params.dayType 日期类型 workday holiday
 */
export function postFlowAnalysisArea (data = {}) {
  return request({
    url: `${path}getFlowAnalysisArea`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 17.停车难易度，小时维度 热力图
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city	 市区
 * @param {String} params.l3Region 区
 * @param {String} params.l4Region 镇
 * @param {String} params.hour 0-23 小时对应
 */
export function postYesterdayPSIndexHeatMap (data = {}) {
  return request({
    url: `${path}getYesterdayPSIndexHeatMap`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 停车体验
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 */
export function postParkingExperience (data = {}) {
  return request({
    url: `report/getParkingExperience`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 泊位使用的热力图
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 * @param {Array} params.resourceType
 */
export function postSlotsHeatMap (data = {}) {
  return request({
    url: `parking/getSlotsHeatMap`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 7.1、停车流量网格图（近24小时）
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 * @param {String} params.flowType inCount/outCount
 * @param {Number} params.currentTime 时间戳
 */
export function postParkingFlowHeatMap (data = {}) {
  return request({
    url: `parking/getParkingFlowHeatMap`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}

/**
 * 停车时长网格图
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 * @param {Number} params.parkingTime  <0.5h,0.5h-2h,2h-6h,6h-12h,>12h
 */
export function postParkingTimeHeatMap (data = {}) {
  return request({
    url: `parking/getParkingTimeHeatMap`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'report'
  })
}