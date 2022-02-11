const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyparser = require('koa-bodyparser')
var cors = require('koa2-cors')

const app = new Koa()

app.use(cors())

// router
const userRouter = require('./router/user')
const proxyRouter = require('./router/proxy-server')
const h5Router = require('./router/h5')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  await nuxt.ready()
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
  }))

  app.use(userRouter.routes(), userRouter.allowedMethods())
  app.use(h5Router.routes(), h5Router.allowedMethods())
  app.use(proxyRouter.routes(), proxyRouter.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
