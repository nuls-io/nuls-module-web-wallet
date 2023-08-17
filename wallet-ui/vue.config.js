const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const shell = require("shelljs");
const NULS_ENV = process.env.NULS_ENV
if (NULS_ENV) {
  shell.cp(process.cwd() + "/config/" + NULS_ENV + ".js", process.cwd() + "/src/config.js");
}
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {

  publicPath: process.env.NODE_ENV === 'production' ? 'dist/' : '/',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    },
    electronBuilder: {
      externals: [
        '@ledgerhq/hw-transport-node-hid',
        // '@ledgerhq/devices/hid-framing'
      ],
      nodeIntegration: true
    }
  },

  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }));

    }
    // config.plugins.push(new webpack.NormalModuleReplacementPlugin(
    //   /@ledgerhq\/devices\/hid-framing/,
    //   '@ledgerhq/devices/lib/hid-framing' 
    // ))
    config.externals = {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'moment': 'moment',
      'element-ui': 'ELEMENT',
    }
  },
  // chainWebpack: config => {
  //   config.resolve.alias
  //   .set('@ledgerhq/devices', '@ledgerhq/devices/lib-es')
  // },

  devServer: {
    port: 8085,
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    proxy: {// 配置跨域处理
      '/api': {
        target: '/',
        changeOrigin: true,  // 是否跨域
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
};
