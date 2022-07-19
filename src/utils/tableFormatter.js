import { getLable, duration } from '@/utils/function'
import Date from 'element-ui/src/utils/date'

// 格式化时间
export function formatterDate (row, col, cell, formatter = 'yyyy-MM-dd HH:mm', tacitly = '--') {
  if (typeof row[col.property] === 'number') {
    return row[col.property] == null ? tacitly : Date.format(
      row[col.property], formatter)
  } else {
    return tacitly
  }
}

// 通用
export function formatterAll (row, col, cell, formatter = '', tacitly = '--') {
  return row[col.property] == null || row[col.property] === '' ? tacitly : row[col.property] + formatter
}

// 格式化字典
export function formatterGetLable (row, col, cell, options = [], tacitly = '--') {
  return row[col.property] == null ? tacitly : getLable(row[col.property], options)
}

// 格式化时长
export function formatterDuration (row, col, cell, tacitly = '--') {
  return row[col.property] == null ? tacitly : duration(row[col.property])
}

// 格式化判断
export function formatterJudge (row, col, cell, success = '正确', error = '错误', tacitly = '--') {
  if (row[col.property] == null) {
    return tacitly
  }
  return !row[col.property] ? error : success
}

// 格式化方法
export function formatterFunctions (row, col, cell, func, tacitly = '--') {
  return row[col.property] == null ? tacitly : func(row[col.property])
}

// 格式金额
export function formatterAmount (row, col, cell, func, tacitly = '0.00') {
  return !row[col.property] ? tacitly : (row[col.property] / 100).toFixed(2)
}
