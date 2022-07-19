import request from '@/utils/request'
const path = `menu/`

// 获取角色权限表
export function queryMenuListByRoleId(data = '', token = '') {
  return request({
    url: `${path}queryMenuListByRoleId/${data}`,
    method: 'get'
    // ,
    // headers: {
    // 	token
    // }
  })
}

// 保存角色授权
export function saveMenu(data = {}) {
  return request({
    url: `${path}saveMenu`,
    method: 'post',
    data: data
  })
}
