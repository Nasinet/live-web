const axios = require('axios')

const router = require('koa-router')()

const { host } = require('../php-server')

router.get('/danmuv3', async (ctx, next) => {
  console.log('quit group')
  ctx.body = []
})

router.all(/^\/webapi/, async (ctx, next) => {
  const { body } = ctx.request
  const token = ctx.cookies.get('token')
  const uid = ctx.cookies.get('uid')
  if (token && uid) {
    body.token = token
    body.uid = uid
  }
  try {
    const { data } = await axios.post(`${host}${ctx.url}`, body)
    if (data.status === 2) {
      ctx.cookies.set('token')
      ctx.cookies.set('uid')
    }
    ctx.body = data
  } catch (e) {
    console.error(e)
    ctx.body = e
  }
})

router.all(/^\/shop/, async (ctx, next) => {
  const { body } = ctx.request
  const token = ctx.cookies.get('token')
  const uid = ctx.cookies.get('uid')
  if (token && uid) {
    body.token = token
    body.uid = uid
  }
  try {
    const { data } = await axios.post(`${host}${ctx.url}`, body)
    if (data.status === 2) {
      ctx.cookies.set('token')
      ctx.cookies.set('uid')
    }
    ctx.body = data
  } catch (e) {
    console.error(e)
    ctx.body = e
  }
})

router.all(/^\/api/, async (ctx, next) => {
  const { body } = ctx.request
  const token = ctx.cookies.get('token')
  const uid = ctx.cookies.get('uid')
  if (token && uid) {
    body.token = token
    body.uid = uid
  }
  try {
    const { data } = await axios.post(`${host}${ctx.url}`, body)
    if (data.status === 2) {
      ctx.cookies.set('token')
      ctx.cookies.set('uid')
    }
    ctx.body = data
  } catch (e) {
    console.error(e)
    ctx.body = e
  }
})

module.exports = router
