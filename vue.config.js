const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 配置多入口，为了实现打开iframe内嵌地图
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    index2: {
      entry: 'src/innerPage/main2.js',
      template: 'public/inner.html',
      filename: 'inner.html'
    }
  }

})
