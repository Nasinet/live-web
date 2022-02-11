import Vue from 'vue'
import { post } from '../util/http'

function getSignature() {
  return post({url: '/webapi/config/getSignForVod'})
    .then(({ data: { data } }) => {
      return data.signature
    })
}

const createVod = () => {
  return new window.TcVod.default({
    getSignature: getSignature // 前文中所述的获取上传签名的函数
  })
}

Vue.prototype.$vod = createVod
