// 验证图片大小类型，限制为jpg和png，大小小于1m
export function checkImage (file, width, height) {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  // const isLt1M = file.size / 1024 / 1024 < 1
  const isLt1M = file.size / 1024 / 1024 < 1
  if (!isJPG && !isPNG) {
    this.$message.error('图片只能是jpg和png格式!')
  }
  if (!isLt1M) {
    this.$message.error('图片大小不能超过1M!')
  }
  const isSize = new Promise(function (resolve, reject) {
    // const width = 1000
    // const height = 1000
    const _URL = window.URL || window.webkitURL
    const img = new Image()
    img.onload = function () {
      const valid = img.width <= width && img.height <= height
      valid ? resolve() : reject()
    }
    img.src = _URL.createObjectURL(file)
  }).then(() => {
    return file
  }, () => {
    this.$message.error('图片必须小于等于' + width + 'px * ' + height + 'px')
    return Promise.reject()
  })
  return (isJPG || isPNG) && isLt1M && isSize
}

// 获取字典 label
export function getLable (value, options, labelStr = 'label', valueStr = 'value') {
  let label = ''
  options.forEach(element => {
    if (value === element[valueStr]) {
      label = element[labelStr]
    }
  })
  return label || value
}

export function GetPercent (num, total) {
  // <summary>
  // 求百分比
  // </summary>
  // <param name="num">当前数</param>
  // <param name="total">总数</param>
  num = parseFloat(num)
  total = parseFloat(total)
  if (isNaN(num) || isNaN(total)) {
    return '-'
  }
  return total <= 0 ? '0%' : (Math.round(num / total * 10000) / 100.00) + '%'
}

export function toRMBNumber (num) {
  let value = ''
  if (num !== null && num !== undefined) {
    num = Number(num)
    if (!isNaN(num)) {
      value = parseFloat(num / 100).toFixed(2)
    }
  }
  return value
}

export function toRMBstr (num) {
  let value = ''
  if (num !== null && num !== undefined) {
    num = Number(num)
    if (!isNaN(num)) {
      value = '￥' + parseFloat(num / 100).toFixed(2)
    }
  }
  return value
}

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// 首页时间格式
export function formatHalfHour (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  let minute = date.getMinutes()
  minute < 30 ? minute = '00' : minute = '30'
  const second = '00'

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function formatDate (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  // const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1}`
}

export function duration (num) {
  let value = ''
  if (num !== null && num !== undefined) {
    num = Number(num)
    if (!isNaN(num)) {
      const seconds = (num % 60)
      const minutes = parseInt(num % (60 * 60) / 60)
      const hours = parseInt((num % (60 * 60 * 24)) / (60 * 60))
      const days = parseInt(num / (60 * 60 * 24))
      if (days > 0) {
        value += days + '天'
      }
      if (hours > 0) {
        value += hours + '小时'
      }
      if (minutes > 0) {
        value += minutes + '分'
      }
      if (seconds > 0) {
        value += seconds + '秒'
      }
    }
  }
  return value || '--'
}

/**
 * 
 *注意事项：
  1.document下没有requestFullscreen
  2.requestFullscreen方法只能由用户触发，比如：在onload事件中不能触发
  3.页面跳转需先退出全屏
  4.进入全屏的元素，将脱离其父元素，所以可能导致之前某些css的失效
  解决方案：使用 :full-screen伪类 为元素添加全屏时的样式（使用时为了兼容注意添加-webkit、-moz或-ms前缀）
  5.一个元素A全屏后，其子元素要再全屏，需先让元素A退出全屏
 */
//进入全屏
export function requestFullScreen (element) {
  var de = document.querySelector(element) || document.documentElement;
  if (de.requestFullscreen) {
    de.requestFullscreen()
  } else if (de.mozRequestFullScreen) {
    de.mozRequestFullScreen()
  } else if (de.webkitRequestFullScreen) {
    de.webkitRequestFullScreen()
  }
}
//退出全屏
export function exitFullscreen () {
  if (document.exitFullScreen) {
    document.exitFullScreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

// 判断当前是否全屏
export function isFullScreen () {
  return !!(
    document.fullscreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen ||
    document.webkitFullScreen ||
    document.msFullScreen
  )
}