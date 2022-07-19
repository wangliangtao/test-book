export const parkImg = {
  common_park: {
    // 普通停车场
    normal: {
      default: require('@/static/maps/common_parkNormalDefault.png'),
      hover: require('@/static/maps/common_parkNormalHover.png'),
      checked: require('@/static/maps/common_parkNormalChecked.png'),
      highlight: require('@/static/maps/common_parkNormalHighlight.png')
    },
    abnormal: {
      default: require('@/static/maps/common_parkAbnormalDefault.png'),
      hover: require('@/static/maps/common_parkAbnormalHover.png'),
      checked: require('@/static/maps/common_parkAbnormalChecked.png'),
      highlight: require('@/static/maps/common_parkNormalHighlight.png')
    }
  },
  road_park: {
    normal: {
      default: require('@/static/maps/road_parkNormalDefault.png'),
      hover: require('@/static/maps/road_parkNormalHover.png'),
      checked: require('@/static/maps/road_parkNormalChecked.png'),
      highlight: require('@/static/maps/road_parkNormalHighlight.png')
    },
    abnormal: {
      default: require('@/static/maps/road_parkAbnormalDefault.png'),
      hover: require('@/static/maps/road_parkAbnormalHover.png'),
      checked: require('@/static/maps/road_parkAbnormalChecked.png'),
      highlight: require('@/static/maps/road_parkNormalHighlight.png')
    }
  },
  PR_park: {
    normal: {
      default: require('@/static/maps/PR_parkNormalDefault.png'),
      hover: require('@/static/maps/PR_parkNormalHover.png'),
      checked: require('@/static/maps/PR_parkNormalChecked.png'),
      highlight: require('@/static/maps/PR_parkNormalHighlight.png')
    },
    abnormal: {
      default: require('@/static/maps/PR_parkAbnormalDefault.png'),
      hover: require('@/static/maps/PR_parkAbnormalHover.png'),
      checked: require('@/static/maps/PR_parkAbnormalChecked.png'),
      highlight: require('@/static/maps/PR_parkNormalHighlight.png')
    }
  }
}

export const areaStyle = {
  normal: {
    default: {
      strokeWeight: 2,
      strokeColor: '#296DCC',
      fillColor: '#143666',
      fillOpacity: 0.4
    },
    checked: {
      strokeWeight: 2,
      strokeColor: '#66A6FF',
      fillColor: '#3388FF',
      fillOpacity: 0.6
    }
  },
  abnormal: {
    default: {
      strokeWeight: 2,
      strokeColor: '#CC3629',
      fillColor: '#661B14',
      fillOpacity: 0.4
    },
    checked: {
      strokeWeight: 2,
      strokeColor: '#FF7366',
      fillColor: '#FF4433',
      fillOpacity: 0.6
    }
  }
}

export const deviceImg = {
  gate: {
    // 闸机
    normal: {
      default: require('@/static/maps/gateNormalDefault.png'),
      hover: require('@/static/maps/gateNormalHover.png'),
      checked: require('@/static/maps/gateNormalChecked.png'),
    },
    abnormal: {
      default: require('@/static/maps/gateAbnormalDefault.png'),
      hover: require('@/static/maps/gateAbnormalHover.png'),
      checked: require('@/static/maps/gateAbnormalChecked.png'),
    }
  },
  monitor: {
    // 监控
    normal: {
      default: require('@/static/maps/monitorNormalDefault.png'),
      hover: require('@/static/maps/monitorNormalHover.png'),
      checked: require('@/static/maps/monitorNormalChecked.png'),
    },
    abnormal: {
      default: require('@/static/maps/monitorAbnormalDefault.png'),
      hover: require('@/static/maps/monitorAbnormalHover.png'),
      checked: require('@/static/maps/monitorAbnormalChecked.png'),
    }
  },
  guide: {
    // 诱导屏
    normal: {
      default: require('@/static/maps/guideNormalDefault.png'),
      hover: require('@/static/maps/guideNormalHover.png'),
      checked: require('@/static/maps/guideNormalChecked.png'),
    },
    abnormal: {
      default: require('@/static/maps/guideAbnormalDefault.png'),
      hover: require('@/static/maps/guideAbnormalHover.png'),
      checked: require('@/static/maps/guideAbnormalChecked.png'),
    }
  }
}

/**
 * 区域主题色
 * TODO: #3388FF 20%
 * TODO: #3388FF 30%
 * TODO: #3366FF 20%
 * TODO: #3366FF 30%
 * TODO: #33AAFF 20%
 * TODO: #33AAFF 30%
 */
export const areaColors = [
  'rgba(51, 136, 255, 0.2)',
  'rgba(51, 136, 255, 0.3)',
  'rgba(51, 102, 255, 0.2)',
  'rgba(51, 102, 255, 0.3)',
  'rgba(51, 170, 255, 0.2)',
  'rgba(51, 170, 255, 0.3)',

  'rgba(51, 136, 255, 0.2)',
  'rgba(51, 136, 255, 0.3)',
  'rgba(51, 102, 255, 0.2)',
  'rgba(51, 102, 255, 0.3)',
  'rgba(51, 170, 255, 0.2)',
  'rgba(51, 170, 255, 0.3)'
]