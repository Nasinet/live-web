/**
 * @description user相关路由
 * @author xmw
 */

const axios = require('axios')

const router = require('koa-router')()

const { host } = require('../php-server')

router.prefix('/api/user')

router.get('/logout', async (ctx, next) => {
  ctx.cookies.set('token')
  ctx.cookies.set('uid')
  ctx.redirect('/')
})

router.post('/login', async (ctx, next) => {
  const { body } = ctx.request
  const res = await axios.post(`${host}/webapi/user/login`, body)
  if (!res.data.msg) {
    const { token, id } = res.data.data
    const options = {
      httpOnly: false,  // 是否只用于http请求中获取
      overwrite: false  // 是否允许重写
    }
    ctx.cookies.set('token', token, options)
    ctx.cookies.set('uid', id, options)
  }
  ctx.body = res.data
})

router.post('/register', async (ctx, next) => {
  const { body } = ctx.request
  const res = await axios.post(`${host}/webapi/user/regist`, body)
  if (!res.data.msg) {
    const { token, id } = res.data.data
    const options = {
      httpOnly: false,  // 是否只用于http请求中获取
      overwrite: false  // 是否允许重写
    }
    ctx.cookies.set('token', token, options)
    ctx.cookies.set('uid', id, options)
  }
  ctx.body = res.data
})

module.exports = router
