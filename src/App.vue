<template>
  <div>
    <div id="nav">
      <router-link to="/showManyPop">多个气泡展示</router-link> |
      <router-link to="/showOnlyPop">单个气泡展示</router-link> |
      <router-link to="/showModelStyle">模型样式切换展示</router-link> |
      <router-link to="/showHeatMap">热力图展示</router-link> |
      <router-link to="/getRouteResult">路径规划</router-link> |
      <router-link to="/showMarker">标注展示</router-link> |
      <router-link to="/embedded">跳转内嵌地图</router-link> |
      <router-link to="/about">无地图页面</router-link>
    </div>

    <!-- vue3版本的keep-live缓存组件写法,通过router.js设置keepAlive值判断是否需要缓存 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" />
      </keep-alive>
    </router-view>

    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <!-- <router-view ></router-view> -->
  </div>
</template>
<script>
export default {}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
