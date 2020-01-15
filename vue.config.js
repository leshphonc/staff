const pxtoviewport = require('postcss-px-to-viewport')

module.exports = {
  publicPath: './',
  configureWebpack: {
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'vue-baidu-map': 'BaiduMap',
      moment: 'moment',
      quill: 'Quill',
    },
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'nav-bar-background-color': '@primary-c',
          'nav-bar-icon-color': 'white',
          'nav-bar-text-color': 'white',
          'nav-bar-title-text-color': 'white',
          'button-primary-background-color': '@primary-c',
          'button-primary-border-color': '@primary-c',
          'tag-primary-color': '@primary-c',
          'switch-on-background-color': '@primary-c',
          'dropdown-menu-title-active-text-color': '@primary-c',
          'dropdown-menu-option-active-color': '@primary-c',
          'tabs-default-color': '@primary-c',
          'picker-action-text-color': '@primary-c',
          'checkbox-checked-icon-color': '@primary-c',
          'radio-checked-icon-color': '@primary-c',
          'primary-c': '#00a29a',
          'primary-deep-c': '#007b81',
          'gray-light-c': '#f7f7f7',
          'gray-c': '#dfdfdf',
          'gray-deep-c': '#888',
          'gray-background-c': '#fafafa',
          'font-gray-c': '#666666',
          'red-c': '#ff4646',
          'green-c': '#77ca35',
          'black-c': '#444',
          'black-light-c': '#333',
        },
      },
      postcss: {
        plugins: [
          pxtoviewport({
            viewportWidth: 375,
          }),
        ],
      },
    },
  },
  devServer: {
    proxy: 'http://localhost:4000'
  }
}
