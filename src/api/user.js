import request from '@/utils/request'

export function login(userInfo) {
  const { username, password } = userInfo
  return request({
    url: '/self/token',
    method: 'get',
    params: { username, password }
  })
}

export function getUserMenu() {
  var clientId = 'C33C8457-54C3-4800-8D1C-53E8F96D9EA1'
  return request({
    url: '/self/elementuimenu',
    method: 'get',
    params: { clientId }
  })
}

export function getUserinfo() {
  return request({
    url: '/self/info',
    method: 'get'
  })
}

export function updateAvatar(fileId) {
  return request({
    url: '/self/avatar',
    method: 'put',
    params: { fileId }
  })
}

export function updateBase(data) {
  return request({
    url: '/self/base',
    method: 'put',
    data
  })
}

export function updatePsw(data) {
  return request({
    url: '/self/password',
    method: 'put',
    data
  })
}
