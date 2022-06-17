import request from '@/utils/request'

export function getPageUsers(condition) {
  const { pageIndex, pageSize, name } = condition
  return request({
    url: '/user/page',
    method: 'get',
    params: { pageIndex, pageSize, name }
  })
}

export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: '/user/' + id,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}
