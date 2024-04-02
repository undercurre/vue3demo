<template>
  <div class="home">
    <!-- 地图资源加载组件 -->
    <mapView ref="mapViewRef"></mapView>

    <!-- 路由跳转地图的各模块功能组件，并缓存气泡控件模块的状态 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component
          :is="Component"
          v-if="$route.meta.keepAlive"
          :key="$route.fullPath"
        />
      </keep-alive>
    </router-view>

    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <!-- 公共气泡模块 -->
    <!-- <commonPopControl></commonPopControl> -->
  </div>
</template>

<script>
// 地图资源组件
import mapView from '@/components/mapView.vue'
import { default as mapApp } from '@/map/init'
import { ref, onMounted } from 'vue'
export default {
  name: 'Home',
  components: { mapView },
  setup() {
    // 获取地图组件dom
    const mapViewRef = ref('')

    onMounted(() => {
      // 赋值到mapApp对象中方便调用子组件方法
      mapApp.mapContainer = mapViewRef.value
    })
    return { mapViewRef }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 80%;
  height: 600px;
  box-sizing: border-box;
  margin: auto;
  position: relative;
  overflow: hidden;
}
</style>