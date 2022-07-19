import Cookies from 'js-cookie'

const TokenKey = 'admin-token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function setStorage (key, val) {
  if (key) return localStorage.setItem(key, val)
}
export function getStorage (key) {
  return localStorage.getItem(key)
}
export function removeStorage (key) {
  return localStorage.removeItem(key)
}
