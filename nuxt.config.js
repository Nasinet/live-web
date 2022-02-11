
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '钠斯直播',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_1872754_312vywa9br5.css' },
      { rel: 'stylesheet', type: 'text/css', href: '//cdn.bootcdn.net/ajax/libs/Swiper/5.4.5/css/swiper.min.css' },
    ],
    script: [
      { src: '/flv.min.js' },
      { src: 'https://cdn.jsdelivr.net/npm/hls.js@latest' },
      { src: 'https://cdn.bootcdn.net/ajax/libs/Swiper/5.4.5/js/swiper.min.js' },
      { src: 'https://cdn-go.cn/cdn/vod-js-sdk-v6/latest/vod-js-sdk-v6.js' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#18D5D9', height: '2px' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/reset.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~plugins/element-ui', ssr: true},
    {src: '~plugins/player', ssr: false},
    {src: '~plugins/cos', ssr: false},
    {src: '~plugins/vod', ssr: false},
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all'
    //   }
    // },
    // extractCSS: true,
    // transpile: [ /element-ui.*?css/ ],
    babel: {
      plugins: [
        [ "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, { isClient, loaders: { sass } }) {
      // less.lessOptions = {
      //   modifyVars: {
      //     'text-color': 'red',
      //     'border-color': 'red',
      //     'background-color': 'red',
      //     'background-color-light': 'red',
      //     'active-color': 'red',
      //     'primary': 'red'
      //   }
      // }
    }
  }
}
