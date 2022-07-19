import request from '@/utils/request'
const path = `role/`

// 查询权限列表
export function queryRoleList() {
  return request({
    url: `${path}queryRoleList`,
    method: 'get'
  })
}
