/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return str.length > 0
}

/**
 * 验证账号 6-30位数字或字符
 * @param {string} str
 * @returns {Boolean}
 */
export function validAccount(str) {
  const reg = /^[A-Za-z0-9]{6,29}$/
  return reg.test(str)
}

/**
   * @param {string} email
   * @returns {Boolean}
   */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
   * @param {string} mobile
   * @returns {Boolean}
   */
export function validMobile(mobile) {
  const reg = /^1[0-9]{10}$/
  return reg.test(mobile)
}

