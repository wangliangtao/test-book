import axios from 'axios'
import { Message, Loading } from 'element-ui'
import qs from 'qs'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '../router'
import serviceCode from '@/utils/serviceCode'

// 创建axios实例
let loadingInstance = null

function filterObject (obj) {
  if (obj && obj instanceof Object) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === '' || obj[key] === undefined || obj[key] === null) {
          delete obj[key]
        }
      }
    }
  }
}

function checkJSON (obj) {
  let ret = false
  if (obj && obj instanceof Object) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] instanceof Object || obj[key] instanceof Array) {
          ret = true
        }
      }
    }
  }
  return ret
}
// console.log(process.env)
// create an axios instance
const service = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})
const applicationJSON = 'application/json;charset=utf-8'
service.interceptors.request.use(
  config => {
    if (store.getters.token || getToken()) {
      config.headers['Authorization'] = 'Bearer ' + (store.getters.token || getToken())
    }
    config.url = serviceCode[config.serviceCode] + config.url
    if (!config.isFilterObject) {
      filterObject(config.data)
      filterObject(config.params)
    }
    if (checkJSON(config.data) || config.type === 'json') {
      config.headers['Content-Type'] = applicationJSON
    }
    if (config.type === 'upload') {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      config.data = qs.stringify(config.data)
    }
    loadingInstance = Loading.service({
      fullscreen: true,
      lock: false,
      text: '',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0)'
    })
    return config
  },
  error => {
    loadingInstance && loadingInstance.close()
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    loadingInstance && loadingInstance.close()
    const res = response.data
    // 200 成功 50 后台异常 100 校验异常
    if (res.code === 200) {
      return res
    } else if (res.code === 50 || res.code === 100) {
      Message({
        message: res.tips || '系统处理异常',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else {
      return Promise.reject(res)
    }
  },
  error => {
    loadingInstance && loadingInstance.close()
    console.log('err' + error) // for debug
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        Message({
          message: '验证过期，请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
        store.dispatch('user/logout')
        router.push('/login')
      } else {
        Message({
          message: error.response.data.message || error || '请求出现错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
