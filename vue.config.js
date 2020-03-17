module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('assets', '@/assets')
      .set('common', '@/common')
      .set('network', '@/network')
      .set('views', '@/views')
    //生产模式
    if (process.env.NODE_ENV === 'production') {
      config.entry('app').clear().add('./src/main-pro.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor',
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    } else {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    }
  }
  // configureWebpack: {
  // resolve: {
  //   alias: {
  //     'assets': '@/assets',
  //     'common': '@/common',
  //     'components': '@/components',
  //     'network': '@/network',
  //     'views': '@/views',
  //   }
  // },
  // }
}
