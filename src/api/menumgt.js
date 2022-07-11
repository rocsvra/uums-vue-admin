import request from '@/utils/request'

export function getMenus(condition) {
  var { clientId, name } = condition
  return request({
    url: '/menu/' + clientId,
    method: 'get',
    params: { name }
  })
}

export function createMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function updateMenu(id, data) {
  return request({
    url: '/menu/' + id,
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}

export function getPids(id) {
  return request({
    url: '/menu/parentids/' + id,
    method: 'get'
  })
}

