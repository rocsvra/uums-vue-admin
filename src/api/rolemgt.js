import request from '@/utils/request'

export function getPageRoles(condition) {
  var { clientId, pageIndex, pageSize, name } = condition
  pageIndex--
  return request({
    url: '/role/page',
    method: 'get',
    params: { clientId, pageIndex, pageSize, name }
  })
}

export function createRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: '/role/' + id,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/' + id,
    method: 'delete'
  })
}

export function getRoleMenus(id) {
  return request({
    url: '/role/' + id + '/menus',
    method: 'get'
  })
}

export function updateRoleMenus(id, data) {
  return request({
    url: '/role/' + id + '/menus',
    method: 'put',
    data
  })
}

export function getRoleUsers(id) {
  return request({
    url: '/role/' + id + '/users',
    method: 'get'
  })
}

export function getUnlinkedRoleUsers(id, name) {
  return request({
    url: '/role/' + id + '/unlinkedusers',
    method: 'get',
    params: { name }
  })
}

export function addLinkUsers(id, data) {
  return request({
    url: '/role/' + id + '/users',
    method: 'post',
    data
  })
}

export function deleteLinkUsers(id, data) {
  return request({
    url: '/role/' + id + '/users',
    method: 'delete',
    data
  })
}
