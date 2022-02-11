import { post } from '../util/http'
import { parseCookie } from '../util/http'

export const state = () => ({
  showLogin: false,
  userInfo: {
    id: '',
    gold: 0
  },
  showDynamicRel: false,
  categories: [],
  appConfig: {},
  defaultAvatar: require('../pages/rank/moren@2x.png'),
  isOpenAnimation: true
})

export const mutations = {
  toggleAnimation(state) {
    state.isOpenAnimation = !state.isOpenAnimation
  },
  toggleLogin(state) {
    state.showLogin = !state.showLogin
  },
  toggleDynamicRel (state) {
    state.showDynamicRel = !state.showDynamicRel
  },
  changeCate(state, data) {
    state.categories = data
  },
  changeConfig(state, config) {
    state.appConfig = config
  },
  changeUserInfo(state, info) {
    state.userInfo = info
  }
}

export const actions = {
  getUserInfo({ commit }) {
    post({url: '/webapi/user/getUserInfo'})
      .then(({ data: { data } }) => {
        commit('changeUserInfo', data)
      })
  },
  async nuxtServerInit({ commit }, { req, res, redirect }) {
    const { data: { data } } = await post({url: '/webapi/live/getCategory'})
    commit('changeCate', data)
    const { data: { data: config } } = await post({url: '/webapi/config/getCommonConfig'})
    commit('changeConfig', config.config)
    if (req && req.headers.cookie) {
      const { token, uid } = parseCookie(req.headers.cookie)
      if (token && uid) {
        try {
          const { data: { data: info } } = await post({url: '/webapi/user/getUserInfo', req, res})
          commit('changeUserInfo', info)
        } catch (e) {
          req.ctx.cookies.set('token')
          req.ctx.cookies.set('uid')
          // redirect('/')
        }
      }
    }
  }
}
