import { setStorage, getStorage, removeStorage } from '@/utils/auth'
import { parkinglotTypesOptions } from '@/utils/lookup'
const state = {
  mapSearch: {
    province: '江苏省',
    city: '苏州市',
    l3Region: '吴江区',
    l4Region: '',
    resourceName: '',
    resourceType: [],
    parking: parkinglotTypesOptions.map(item => item.value),
    device: []
  },
  mapSearchData: {
    // 查询数据
    show: false, // 显示查询数据
    isOpen: true, // 展开
    total: 0,
    resultData: [], // 搜索结果
    cacheData: {} // hover 时数据
  },
  mapCurData: {}, // 当前选中数据
  mapSearchHistory: JSON.parse(getStorage('mapHistory')) || [], // 地图搜索历史
  siteManageDetail: {
    // 停车场详情 tab 页与数据
    routerName: 'basicInfo',
    data: {},
    basicItems: {} // 基本信息页选中的数据
  },
  // 左侧侧边栏 json
  leftDataSidebar: JSON.parse(getStorage('leftDataSidebar')),
  // 右侧侧边栏 json
  rightDataSidebar: JSON.parse(getStorage('rightDataSidebar')),
  // 左右侧边栏导出信息
  sidebarDownloadData: {
    show: false,
    routerName: '' // 导出打开页
  },
  isTotalQuantity: true
}
const getters = {
  leftSidebarList: state => {
    if (state.leftDataSidebar === null) {
      return {
        title: '概览统计',
        componentList: [
          { label: '停车场数量', value: 'ParkAccounted' },
          { label: '泊位数量', value: 'BerthCount' },
          { label: '缴费情况（近14日）', value: 'PayCost' },
          { label: '支付方式分布图（近14日）', value: 'PaymentMethod' }
        ]
      }
    } else {
      return state.leftDataSidebar
    }
  },
  rightSidebarList: state => {
    if (state.rightDataSidebar === null) {
      return {
        title: '实时统计',
        componentList: [
          // { label: '时段性分析热力图', value: 'FrameTimeAnalyse' },
          { label: '周转率热力图', value: 'circulationHotPower' },
          { label: '周转率排行榜TOP 5（近24小时）', value: 'Circulation' },
          { label: '空闲率排行榜TOP 5（近24小时）', value: 'FreeTime' },
          { label: '停车流量（近24小时）', value: 'ParkTraffic' },
          { label: '停车时长', value: 'ParkTime' },
          { label: '停车体验', value: 'ParkExperien' }
        ]
      }
    } else {
      return state.rightDataSidebar
    }
  }
}
const mutations = {
  SET_MAP_SEARCH (state, payload = {}) {
    state.mapSearch = { ...state.mapSearch, ...payload }
  },
  SET_SITE_DETAIL (state, payload = {}) {
    state.siteManageDetail = { ...state.siteManageDetail, ...payload }
  },
  SET_MAP_HISTORY (state, payload = []) {
    state.mapSearchHistory = payload
  },
  REMOVE_MAP_HISTORY (state) {
    state.mapSearchHistory = []
  },
  SET_MAP_SEARCH_DATA (state, payload = {}) {
    state.mapSearchData = { ...state.mapSearchData, ...payload }
  },
  SET_MAP_CUR_DATA (state, payload = {}) {
    state.mapCurData = { ...payload }
  },
  REMOVE_MAP_CURDATA (state) {
    state.mapCurData = {}
  },
  SET_DATA_SIDEBAR (state, data = {}) {
    state[data.type + 'DataSidebar'] = data
  },
  SET_SIDER_DOWNLOAD_DATA (state, payload = {}) {
    state.sidebarDownloadData = { ...payload }
  },
  TOGGLE_TOTALQUANTITY (state) {
    state.isTotalQuantity = !state.isTotalQuantity
  }
}

const actions = {
  // 修改地图筛选条件
  changeMapSearch ({ commit }, data = {}) {
    return new Promise(resolve => {
      commit('SET_MAP_SEARCH', data)
      resolve()
    })
  },
  // 修改场地管理数据
  changeSiteDetail ({ commit }, data = {}) {
    return new Promise(resolve => {
      commit('SET_SITE_DETAIL', data)
      resolve()
    })
  },
  // 添加地图搜索历史记录
  setMapHistory ({ commit }, payload = '') {
    return new Promise(resolve => {
      const data = JSON.parse(getStorage('mapHistory')) || []
      const index = data.indexOf(payload)
      if (index > -1) {
        data.splice(index, 1)
      }
      data.unshift(payload)
      // 超过 10 条删除之前的记录
      data.length > 10 && data.pop()
      commit('SET_MAP_HISTORY', [...data])
      setStorage('mapHistory', JSON.stringify(data))
      resolve()
    })
  },
  // 清空地图搜索历史记录
  removeMapHistory ({ commit }) {
    return new Promise(resolve => {
      commit('REMOVE_MAP_HISTORY')
      removeStorage('mapHistory')
      resolve()
    })
  },
  // 修改搜索条件数据
  changeMapSearchData ({ commit }, data = {}) {
    return new Promise(resolve => {
      commit('SET_MAP_SEARCH_DATA', data)
      resolve()
    })
  },
  // 修改选中数据
  changeMapCurData ({ commit }, data = {}) {
    return new Promise(resolve => {
      commit('SET_MAP_CUR_DATA', data)
      resolve()
    })
  },
  removeMapCurData ({ commit }) {
    return new Promise(resolve => {
      commit('REMOVE_MAP_CURDATA')
      resolve()
    })
  },
  // 修改侧边栏json
  // TODO: type: left / right
  changeDataSidebar ({ commit }, payload = {}) {
    return new Promise((resolve, reject) => {
      if (payload && payload.type) {
        commit('SET_DATA_SIDEBAR', payload, payload.type)
        setStorage(payload.type + 'DataSidebar', JSON.stringify(payload))
        resolve()
      } else {
        reject('未填写位置')
      }
    })
  },
  // 清空侧边栏 json
  removeDataSidebar ({ commit }) {
    return new Promise(resolve => {
      commit('SET_DATA_SIDEBAR', {}, 'left')
      commit('SET_DATA_SIDEBAR', {}, 'right')
      resolve()
    })
  },
  // 修改左右侧边栏导出信息
  changeSidebarDownloadData ({ commit }, data = {}) {
    return new Promise(resolve => {
      commit('SET_SIDER_DOWNLOAD_DATA', data)
      resolve()
    })
  },
  toggleTotalQuantity ({ commit }) {
    commit('TOGGLE_TOTALQUANTITY')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
