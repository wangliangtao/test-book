// 车牌
export const carTypeList = [
  {
    code: '001',
    text: 'blue',
    dec: '蓝牌'
  },
  {
    code: '002',
    text: 'yellow',
    dec: '黄牌'
  },
  {
    code: '003',
    text: 'green',
    dec: '绿牌'
  },
  {
    code: '004',
    text: 'white',
    dec: '白牌'
  },
  {
    code: '005',
    text: 'other',
    dec: '其他'
  }
]
// 推送状态
export const pushStatusOptions = [
  {
    value: '-1',
    label: '失败'
  },
  {
    value: '0',
    label: '等待推送'
  },
  {
    value: '1',
    label: '已完成'
  }
]
// 核销状态
export const cancellationOptions = [
  {
    value: '0',
    label: '未核销'
  },
  {
    value: '1',
    label: '已核销'
  },
  {
    value: '2',
    label: '已核销（手动）'
  }
]
// 异常状态
export const isErrorMessageOption = [
  {
    value: '0',
    label: '失败'
  },
  {
    value: '1',
    label: '成功'
  }
]

// 红包状态
export const rpStatusOption = [
  {
    value: '0',
    label: '已下架'
  },
  {
    value: '1',
    label: '上架中'
  },
  {
    value: '2',
    label: '已过期'
  }
]

// 红包状态
export const auditStatusOption = [
  {
    value: '-1',
    label: '审核失败'
  },
  {
    value: '0',
    label: '等待审核'
  },
  {
    value: '1',
    label: '审核通过'
  }
]

// 乐币数量限制类型
export const coinAloneTypeOptions = [
  {
    label: '每日消耗',
    value: 1,
    data: [
      { label: '每人最多', value: 100 },
      { label: '每人最多', value: 150 },
      { label: '每人最多', value: 200 }
    ]
  },
  {
    label: '每周消耗',
    value: 2,
    data: [
      { label: '每人最多', value: 100 },
      { label: '每人最多', value: 150 },
      { label: '每人最多', value: 200 }
    ]
  },
  {
    label: '每月消耗',
    value: 3,
    data: [
      { label: '每人最多', value: 100 },
      { label: '每人最多', value: 150 },
      { label: '每人最多', value: 200 }
    ]
  }
]

// 单个用户最多领取的乐币数
export const coinUserMaxOptions = {
  1: [
    { label: '每人最多', value: 100 },
    { label: '每人最多', value: 150 },
    { label: '每人最多', value: 200 },
  ],
  2: [
    { label: '每人最多', value: 100 },
    { label: '每人最多', value: 150 },
    { label: '每人最多', value: 200 },
  ],
  3: [
    { label: '每人最多', value: 100 },
    { label: '每人最多', value: 150 },
    { label: '每人最多', value: 200 },
  ]
}

// 礼包发布审核状态
export const giftBagAuditStatusOptions = [
  {
    label: '审核失败',
    value: -1
  },
  {
    label: '审核中',
    value: 0
  },
  {
    label: '审核成功',
    value: 1
  }
]
// 礼包启用状态
export const giftBagFrameStatusOptions = [
  {
    label: '禁用中',
    value: false
  },
  {
    label: '启用中',
    value: true
  }
]

// 红包状态
export const rpStatusOptions = [
  {
    label: ' 审核失败',
    value: 1
  },
  {
    label: '草稿',
    value: 2
  },
  {
    label: '等待审核',
    value: 3
  },
  // {
  //   label: '审核成功',
  //   value: 4
  // },
  {
    label: '下架中',
    value: 5
  },
  {
    label: '上架中',
    value: 6
  }
]

// 推文相关状态
export const interactionStatusOptions = [
  {
    label: ' 审核失败',
    value: 1
  },
  {
    label: '草稿',
    value: 2
  },
  {
    label: '等待审核',
    value: 3
  },
  // {
  //   label: '审核成功',
  //   value: 4
  // },
  {
    label: '禁用中',
    value: 5
  },
  {
    label: '启用中',
    value: 6
  }
]

// 奖券相关状态
export const giftBagStatusOptions = [
  {
    label: '审核失败',
    value: 1
  },
  {
    label: '草稿',
    value: 2
  },
  {
    label: '等待审核',
    value: 3
  },
  // {
  //   label: '审核成功',
  //   value: 4
  // },
  {
    label: '禁用中',
    value: 5
  },
  {
    label: '启用中',
    value: 6
  }
]

// 商品相关状态
export const goodsStatusOptions = [
  {
    label: '审核成功',
    value: 4
  },
  {
    label: '等待审核',
    value: 3
  },
  {
    label: '草稿',
    value: 2
  },
  {
    label: '审核失败',
    value: 1
  }
]

// 热销活动相关状态
export const saleStatusOptions = [
  {
    label: '禁用中',
    value: false
  },
  {
    label: '启用中',
    value: true
  }
]

// 热销购买数量限制
export const saleTypeOptions = [
  {
    label: '购买数量不限',
    value: 4
  },
  {
    label: '每人限购',
    value: 1
  },
  {
    label: '每人每天限购',
    value: 2
  },
  {
    label: '每次限购',
    value: 3
  }
]

// 订单相关状态
export const orderStatusOptions = [
  {
    label: '未完成',
    value: 1
  },
  {
    label: '已完成',
    value: 2
  },
  {
    label: '已退款',
    value: 3
  }
]

// 兑换券相关状态
export const voucherStatusOptions = [
  {
    label: '未核销',
    value: 1
  },
  {
    label: '已核销',
    value: 2
  },
  {
    label: '已过期',
    value: 3
  },
  {
    label: '已退款',
    value: 4
  }
]

// 魔窗相关状态
export const moduleStatusOptions = [
  {
    label: '禁用中',
    value: false
  },
  {
    label: '启用中',
    value: true
  }
]

// 魔窗相关状态
export const moduleLinkModelsOptions = [
  {
    label: '热销',
    value: 'HOT_SALE'
  },
  {
    label: '链接',
    value: 'MERCHANT_LINK'
  }
]

// 停车场类型
export const parkinglotTypesOptions = [
  {
    label: '路内泊位',
    value: 'road_park'
  },
  {
    label: 'P+R停车场',
    value: 'PR_park'
  },
  {
    label: '普通停车场',
    value: 'common_park'
  }
]

// 设备类型
export const deviceTypesOptions = [
  {
    label: '闸机',
    value: 'gate'
  },
  {
    label: '巡检车',
    value: 'patrol'
  },
  {
    label: '监控',
    value: 'monitor'
  },
  {
    label: '诱导屏',
    value: 'guide'
  }
]

//  停车场订单支付状态
export const parkingOrderPayStatusOptions = [
  {
    label: '撤销单据',
    value: 'CANCEL'
  },
  {
    label: '订单初始化',
    value: 'INIT'
  },
  {
    label: '支付成功',
    value: 'PAY_SUCCESS'
  },
  {
    label: '已经退款',
    value: 'REFUND'
  },
  {
    label: '请求支付',
    value: 'REQUEST_PAY'
  },
  {
    label: '超时',
    value: 'TIME_OUT'
  }
]

// 停车记录流水状态
export const orderWaterStatusOptions = [
  {
    label: '待结算',
    value: 1
  },
  {
    label: '已结算',
    value: 2
  },
  {
    label: '已预付',
    value: 3
  }
]

// 地图点位字典
export const mapIconTypesOptions = [
  {
    label: '闸机',
    value: 'gate'
  },
  {
    label: '监控',
    value: 'monitor'
  },
  {
    label: '诱导屏',
    value: 'guide'
  }
]
// 闸机设备状态
export const gateDeviceStatusOptions = [
  {
    label: '异常',
    value: -1
  },
  {
    label: '在线',
    value: 1
  },
  {
    label: '离线',
    value: 2
  }
]
// 监控设备状态
export const monitorDeviceStatusOptions = [
  {
    label: '异常',
    value: -1
  },
  {
    label: '在线',
    value: 1
  },
  {
    label: '离线',
    value: 2
  }
]
// 诱导屏设备状态
export const guideDeviceStatusOptions = [
  {
    label: '异常',
    value: -1
  },
  {
    label: '在线',
    value: 1
  },
  {
    label: '离线',
    value: 2
  }
]

// 地图侧边栏统计组件
export const mapSidebarComponents = [
  {
    label: '停车场数量',
    value: 'ParkAccounted',
    imgSrc: require('@/static/mapDataComponents/data1.png')
  },
  {
    label: '缴费情况（近14日）',
    value: 'PayCost',
    imgSrc: require('@/static/mapDataComponents/data3.png')
  },
  {
    label: '周转率排行榜TOP 5（近24小时）',
    value: 'Circulation',
    imgSrc: require('@/static/mapDataComponents/data5.png')
  },
  {
    label: '停车流量（近24小时）',
    value: 'ParkTraffic',
    imgSrc: require('@/static/mapDataComponents/data7.png')
  },
  {
    label: '停车体验',
    value: 'ParkExperien',
    imgSrc: require('@/static/mapDataComponents/data9.png')
  },
  {
    label: '泊位数量',
    value: 'BerthCount',
    imgSrc: require('@/static/mapDataComponents/data2.png')
  },
  {
    label: '支付方式分布图（近14日）',
    value: 'PaymentMethod',
    imgSrc: require('@/static/mapDataComponents/data4.png')
  },
  {
    label: '空闲率排行榜TOP 5（近24小时）',
    value: 'FreeTime',
    imgSrc: require('@/static/mapDataComponents/data6.png')
  },
  {
    label: '停车时长',
    value: 'ParkTime',
    imgSrc: require('@/static/mapDataComponents/data8.png')
  },
  {
    label: '周转率热力图',
    value: 'CirculationHotPower',
    imgSrc: require('@/static/mapDataComponents/data10.png')
  },
  {
    label: '时段性分析热力图',
    value: 'FrameTimeAnalyse',
    imgSrc: require('@/static/mapDataComponents/data11.png'),
    // hidden: true
  }
]

// 饼图主题色
export const pieColors = ['#8AB0E6', '#FFCC66', '#66CC88', '#FF8A80', '#66CCCC', '#AA80FF', '#66A6FF', '#FFC44D', '#52CC7A', '#FF7266', '#52CCCC', '#9966FF', '#99C4FF', '#FFD580', '#7ACC96', '#FFA199', '#7ACCCC', '#BB99FF', '#4D97FF', '#FFBB33', '#3DCC6D', '#FF5B4D', '#FF5B4D', '#FF5B4D']

// 地图侧边栏统计数据导出页面
export const mapSidebarDownloadRouter = [
  {
    label: '停车场统计',
    value: 'ParkAccounted',
  },
  {
    label: '缴费情况',
    value: 'PayCost',
  },
  {
    label: '支付方式',
    value: 'PaymentMethod',
  },
  {
    label: '停车流量',
    value: 'ParkTraffic',
  },
  {
    label: '停车时长',
    value: 'ParkTime',
  },
  {
    label: '周转率',
    value: 'Circulation',
  },
  {
    label: '停车指数',
    value: 'ParkIndex',
  },
  {
    label: '停车记录统计',
    value: 'ParkRecord',
  },
  {
    label: '停车收费统计',
    value: 'ParkCharge',
    // hidden: true
  }
]

export const queryPlateAuthOptions = [
  {
    label: '等待认证',
    value: 'USER_APPLY',
  },
  {
    label: '认证失败',
    value: 'REJECT',
  },
  {
    label: '认证成功',
    value: 'PASS',
  },
  {
    label: '已撤销',
    value: 'CANCEL',
  }
]