import request from '@/utils/request'

export function getPageClients(condition) {
  var { pageIndex, pageSize, name } = condition
  pageIndex--
  return request({
    url: '/client/page',
    method: 'get',
    params: { pageIndex, pageSize, name }
  })
}

export function getAllClients() {
  return request({
    url: '/client/all',
    method: 'get'
  })
}

export function createClient(data) {
  return request({
    url: '/client',
    method: 'post',
    data
  })
}

export function updateClient(id, data) {
  return request({
    url: '/client/' + id,
    method: 'put',
    data
  })
}

export function deleteClient(id) {
  return request({
    url: '/client/' + id,
    method: 'delete'
  })
}

