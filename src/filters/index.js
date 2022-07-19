// import parseTime, formatTime and set to filter
import { toRMBNumber, toRMBstr, duration } from '@/utils/function'
import moment from 'moment'
import accounting from 'accounting'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter (num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * numberFixed
 *
 * @export
 * @param {*Number} num
 * @param {*Number} digits
 * @returns
 */
export function numberFixed (num = 0, digits = 2) {
  num = num / 100
  return Number(num).toFixed(digits).toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter (num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * date
 * @param {String} string
 */
export function date (value, pattern) {
  if (value === undefined || value === null || value === '') {
    return '--'
  }
  return Date.format(value, pattern)
}

/**
 * 默认头像
 * @param {String} string
 */
export function defaultImg (url) {
  return url || require('@/static/defaultAvatar.png')
}

/**
 * @param {Number} Number
 */
export function RMBNumber (value) {
  return toRMBNumber(value)
}

/**
 * @param {Number} Number
 */
export function RMBstr (value) {
  return toRMBstr(value)
}

export function durationFilter (value) {
  return duration(value)
}

/**
 *
 * @param {*} dataStr
 * @param {*} pattern
 * @return {String}
 * @example dateformat('2020-06-01T20:20:20', 'YYYY-MM-DD HH:mm'); // 2020-06-01 20:20
 * @example dateformat('2020-06-01 13:15:25'); // 2020-06-01
 */
export function dateformat (dataStr, pattern = 'YYYY-MM-DD') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return dataStr
  }
}

/**
 *
 * @param {Number} value 值
 * @param {Number} digits 保留几位
 * @param {String} symbol 间隔符号
 * @return {String}
 * @example formatNumber(5318008); // 5,318,008
 * @example formatNumber(9876543.21, 3, " "); // 9 876 543.210
 *
 */
export function formatNumber (value = 0, digits = 0, symbol = '') {
  if (!Number(value)) return value
  return accounting.formatNumber(value, digits, symbol)
}

/**
 *
 * @param {Number} value 值
 * @param {Number} digits 保留几位
 * @param {String} symbol 间隔符号
 * @return {String}
 * @example formatNumber(5318008); // 5,318,008
 * @example formatNumber(9876543.21, 3, " "); // 9 876 543.210
 *
 */
export function formatMoney (value = 0) {
  if (!Number(value)) return value
  return accounting.formatMoney(...arguments)
}
