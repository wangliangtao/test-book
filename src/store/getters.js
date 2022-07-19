const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  isFullScreen: state => state.app.isFullScreen,
  XAuthToken: state => state.user.XAuthToken,
  userInfo: state => state.user.userInfo,
  userID: state => state.user.userID,
  accountRoles: state => state.user.accountRoles,
  permissions: state => state.permission.permissions
}
export default getters
