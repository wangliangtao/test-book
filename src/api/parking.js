import request from '@/utils/request'

/**
 * 获取地址列表
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3District 区
 */
export function postAreaList (data = {}) {
  return request({
    url: `area/getAreaList`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 获取指定地址的停车场列表
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3District 区
 * @param {String} params.l4Detail 镇
 * @param {String} params.parkingType 停车场类型
 * @param {String} params.parkingName 停车场名
 */
export function postParkingList (data = {}) {
  return request({
    url: `parking/getParkingList`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 获取指定地址的停车场列表 v2
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3District 区
 * @param {String} params.l4Detail 镇
 * @param {String} params.parkingType 停车场类型
 * @param {String} params.parkingName 停车场名
 * @param {Array} params.northeast 东北方经纬度数组
 * @param {Array} params.southwest 西南风经纬度数组
 * @param {Array} params.displayList 展示图标数组 parking，gate,guide,monitor
 * @param {Boolean} params.displayParkingArea 是否显示停车场区域
 */
export function postParkingListV2 (data = {}) {
  return request({
    url: `parking/getParkingListV2`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 模糊查询停车场名字列表
 * @param {Object} params
 * @param {String} params.areaId 区域 id
 * @param {String} params.parkingType 停车场类型
 * @param {String} params.parkingName 停车场名
 */
export function postParkingNameList (data = {}) {
  return request({
    url: `parking/getParkingNameList`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 管理员查询停车记录
 * @param {Object} params
 * @param {Number} params.orderStartTimestamp 订单开始时间-毫秒
 * @param {Number} params.orderEndTimestamp 订单结束时间 -毫秒
 * @param {String} params.userNickname 用户昵称
 * @param {Number} params.userPhone 用户手机
 * @param {Array} params.prkCodeList 停车场编号数组
 * @param {String} params.prkName 停车场名称
 * @param {String} params.plateColor 车牌颜色
 * @param {String} params.plateNo 车牌号
 * @param {String} params.orderId 订单编号
 * @param {String} params.orderPayStatus 订单状态
 * @param {Number} params.pageNo 页码
 * @param {Number} params.pageSize 条数
 */
export function postParkingFeeMntPage (data = {}) {
  return request({
    url: `parking/parkingFeeMntPage`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'order'
  })
}

/**
 * 查询指定停车场的记录
 * @param {Object} params
 * @param {Array} params.parkingSn 停车场id数组
 * @param {String} params.plateColor 车牌颜色
 * @param {String} params.plateNo 车牌号码
 * @param {String} params.recordSn 流水编号
 * @param {Number} params.inBeginTime 进场开始时间
 * @param {Number} params.inEndTime 进场结束时间
 * @param {Number} params.outBeginTime 出场开始时间
 * @param {Number} params.outEndTime 出场结束时间
 * @param {String} params.status 流水状态
 * @param {String} params.orderId 订单编号
 * @param {Number} params.pageNo 页码
 * @param {Number} params.pageSize 条数
 */
export function postRecordsList (data = {}) {
  return request({
    url: `record/getRecords`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 查询停车订单明细
 * @param {String} orderId 订单 ID
 */
export function getParkingFeeOrderMnt (orderId = '') {
  return request({
    url: `parking/parkingFeeOrderMnt/${orderId}`,
    serviceCode: 'order'
  })
}

/**
 * 单个商品退款
 * @param {Object} params
 * @param {Array} params.refundImgList 退款图片
 * @param {String} params.remark 备注
 * @param {String} params.skuNo 编号
 * @param {Number} params.refundAmount 退款金额
 */
export function postRefundParkingGoods (data = {}) {
  return request({
    url: `core/refundParkingGoods`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'order'
  })
}

/**
 * 获取停车场各个设备的分组数量
 * @param {String} parkingSn 停车场 id
 */
export function getDeviceGroup (parkingSn = '') {
  return request({
    url: `parking/getDeviceGroup?parkingSn=${parkingSn}`,
    serviceCode: 'parking'
  })
}

/**
 * 获取停车场基本信息，设备列表
 * @param {String} parkingSn 停车场 id
 */
export function getParkingBaseInfo (parkingSn = '') {
  return request({
    url: `parking/getParkingBaseInfo?parkingSn=${parkingSn}`,
    serviceCode: 'parking'
  })
}

/**
 * 获取指定停车场监控列表
 * @param {String} parkingSn 停车场 id
 */
export function getMonitorList (parkingSn = '') {
  return request({
    url: `device/getMonitorList?parkingSn=${parkingSn}`,
    serviceCode: 'parking'
  })
}

/**
 * 获取指定停车场闸机列表
 * @param {String} parkingSn 停车场 id
 */
export function getGateList (parkingSn = '') {
  return request({
    url: `device/getGateList?parkingSn=${parkingSn}`,
    serviceCode: 'parking'
  })
}

/**
 * 获取指定停车场诱导屏列表
 * @param {String} parkingSn 停车场 id
 */
export function getGuideList (parkingSn = '') {
  return request({
    url: `device/getGuideList?parkingSn=${parkingSn}`,
    serviceCode: 'parking'
  })
}

/**
 * 场地管理数据统计Top停车场当前实时信息
 * @param {String} parkingSn 停车场 id
 */
export function getParkingRealTimeData (parkingSn = '') {
  return request({
    url: `parking/getParkingRealTimeData?parkingSn=${parkingSn}`,
    serviceCode: 'parking'
  })
}

/**
 * 场地管理数据统计 TOP 下
 * @param {Object} params
 * @param {Number} params.currentDay  时间戳
 * @param {String} params.parkingSn 停车场 id
 */
export function postParkingData (data = {}) {
  return request({
    url: `parking/getParkingData`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 获取总待缴费金额和总剩余泊位数量
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3District 区
 */
export function postPayAndSlots (data = {}) {
  return request({
    url: `report/getPayAndSlots`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 【客户】获取地址详细层级信息
 */
export function getAreaDetails () {
  return request({
    url: `area/getAreaDetails`,
    serviceCode: 'parking'
  })
}

/**
 * 【用户】根据地区条件筛选资源
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 * @param {String} params.l4Region 镇
 * @param {Array} params.resourceType common_park/PR_park/road_park/gate/guide/monitor/all
 * @param {String} params.resourceName 搜索关键字
 * @param {String} params.pageNo
 * @param {String} params.pageSize
 */
export function postResourceList (data = {}) {
  return request({
    url: `parking/getResourceList`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 【客户】模糊查询资源名字列表
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {Array} params.l3Region 区
 * @param {String} params.l4Region 镇
 * @param {Array} params.resourceType common_park/PR_park/road_park/gate/guide/monitor/all
 * @param {String} params.resourceName 搜索关键字
 */
export function postResourceNameList (data = {}) {
  return request({
    url: `parking/getResourceNameList`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 【客户】根据停车场获取停车场和关联的设备的详细信息
 * @param {Object} params
 * @param {Array} params.parkingSNList 停车场 id 数组
 */
export function postParkingDeviceDetail (data = {}) {
  return request({
    url: `parking/getParkingDeviceDetail`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}

/**
 * 停车场数量气泡图
 * @param {Object} params
 * @param {String} params.province 省
 * @param {String} params.city 市
 * @param {String} params.l3Region 区
 * @param {Array} params.resourceType
 */
export function postResourceBubble (data = {}) {
  return request({
    url: `parking/getResourceBubble`,
    method: 'post',
    data: data,
    type: 'json',
    serviceCode: 'parking'
  })
}