import Layout from '@/layout'
import { asyncRoutes, constantRoutes } from '@/router'
import { getUserMenu } from '@/api/user'

export const getComponent = (component) => {
  if (component === 'Layout') {
    return Layout
  }
  return (resolve) => require([`@/views/${component}.vue`], resolve)
}

export function getMenus(routes, data) {
  data.forEach(itm => {
    const menu = {
      path: itm.path,
      component: getComponent(itm.component),
      hidden: itm.hidden,
      redirect: itm.redirect,
      name: itm.name,
      meta: {
        title: itm.meta.title,
        icon: itm.meta.icon
      },
      children: []
    }
    if (itm.children && itm.children.length > 0) {
      getMenus(menu.children, itm.children)
    } else {
      menu.children = null
    }
    routes.push(menu)
  })
  return routes
}

const getDefaultState = () => {
  return {
    routes: [],
    addRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  getRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getUserMenu().then(res => {
        const menuData = Object.assign([], res)
        const tempAsyncRoutes = Object.assign([], asyncRoutes)
        const accessedRoutes = getMenus(tempAsyncRoutes, menuData)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
