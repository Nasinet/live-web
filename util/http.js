import axios from 'axios'
import { Message } from 'element-ui'
import host from './host'

export function parseCookie(cookie) {
  cookie = cookie.replace(/\s/g, '')
  const cookieArr = cookie.split(';')
  const res = {}
  cookieArr.forEach(item => {
    const keyVal = item.split('=')
    res[keyVal[0]] = keyVal[1]
  })
  return res
}

const instance = axios.create({
  baseURL: host,
  timeout: 5000,
  withCredentials: true
})

instance.interceptors.response.use((res) => {
  const reqData = JSON.parse(res.config.data)
  if (res.data.msg === '登录超时，请重新登录') {
    if (process.env.VUE_ENV !== 'server') {
      $nuxt.$store.commit('changeUserInfo', {
        id: '',
        gold: 0
      })
      $nuxt.$store.commit('toggleLogin')
      if ($nuxt.$store.state.userInfo.id) {
        $nuxt.$store.commit('changeUserInfo', {
          id: '',
          gold: 0
        })
        Message.warning(res.data.msg)
      }
    }
    return Promise.reject(new Error('登陆超时'))
  }
  if (res.data.msg) {
    if (process.env.VUE_ENV !== 'server' && !reqData.hideMSg) {
      Message.warning(res.data.msg)
    }
    return Promise.reject(new Error(res.data.msg))
  }
  return res
}, (err) => {
  if (process.env.VUE_ENV !== 'server') {
    Message.warning('请求超时，请稍后再试')
  }
  return Promise.reject(err)
})

export const post = ({ req, data, url }) => {
  if (!data) data = {}
  if (req && req.headers.cookie) {
    const { token, uid } = parseCookie(req.headers.cookie)
    if (token && uid) {
      data.token = token
      data.uid = uid
    }
  }
  return instance.post(url, data)
}
