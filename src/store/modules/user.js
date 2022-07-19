import { userLogin } from '@/api/power'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

function getData () {
  // Cookies.remove('userInfo')
  return JSON.parse(Cookies.get('userInfo') || '{}')
}
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  userID: '',
  roles: [],
  userInfo: getData()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, payload = {}) => {
    state.userInfo = payload
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userID) => {
    state.userID = userID
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_XAUTHTOKEN: (state, XAuthToken) => {
    state.XAuthToken = XAuthToken
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { phone, authCode } = userInfo
    return new Promise((resolve, reject) => {
      userLogin({
        phone: phone.trim(),
        authCode: authCode,
        appId: 'EMAIL'
      }).then(response => {
        const { accessToken, ...userData } = response.body || {}
        commit('SET_NAME', userData.nickName || 'Hi')
        commit('SET_TOKEN', accessToken)
        commit('SET_USERINFO', userData)
        setToken(accessToken)
        Cookies.set('userInfo', JSON.stringify(userData))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit }) {
    return new Promise(resolve => {
      const changeData = {
        roles: ['admin'],
        name: 'admin',
        userID: 1
      }
      commit('SET_ROLES', ['admin'])
      commit('SET_USERID', 1)
      resolve(changeData)
    })
  },

  // user logout
  logout ({ commit, dispatch }) {
    return new Promise(resolve => {
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      Cookies.remove('userInfo')
      resetRouter()

      // 清空地图搜索历史记录
      dispatch('mapDetails/removeMapHistory', null, { root: true })

      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
