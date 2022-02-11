import Vue from 'vue'
import COS from 'cos-js-sdk-v5'
import { post } from '../util/http'

let filename = ''

function getCosData () {
  return post({url: '/webapi/Config/getTempKeysForCos'})
    .then(({ data }) => {
      filename = data.data.filename
      return data.data
    })
}

Vue.prototype.$cos = () => {
  const cosObj = new COS({
    getAuthorization: function (options, callback) {
      getCosData()
        .then(data => {
          const cosData = {
            TmpSecretId: data.credentials.tmpSecretId,
            TmpSecretKey: data.credentials.tmpSecretKey,
            XCosSecurityToken: data.credentials.sessionToken,
            // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
            ScopeLimit: true
          }
          // eslint-disable-next-line standard/no-callback-literal
          callback(cosData)
        })
    }
  })
  cosObj.filename = filename
  return cosObj
}
