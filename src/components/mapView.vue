<template>
  <div class="container">
    <!-- 禁止点击遮罩层 -->
    <div class="clickShade" v-show="clickShadeSign"></div>
    <!-- loading -->
    <loading-triangle></loading-triangle>

    <!-- 地图容器 -->
    <div id="map-container"></div>

    <!-- 用于装载多个室内图(可能多个，尽量单个iframe) -->
    <div id="map-frames-container" v-show="isShowModelMap">
      <!-- 单模型地图的底层背景遮罩 -->
      <div class="model_map_shade"></div>
    </div>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init'
// loading 页面
import LoadingTriangle from '@/components/LoadingTriangle.vue'
import { ref, onMounted } from 'vue'
export default {
  name: 'mapView',
  components: { LoadingTriangle },
  setup() {
    let clickShadeSign = ref(true) // 初始化的防点击蒙版
    let isShowModelMap = ref(false) // 是否展示内嵌地图场景的iframe
    let isLoadedInnerMap = false // 是否已经加载过室内地图

    onMounted(() => {
      // 初始化地图
      mapApp.initMap()
      window.mapApp = mapApp // 测试环境中开发此对象方便调试，生产环境可以注释

      mapApp.clickShadeSign = clickShadeSign
      mapApp.isShowModelMap = isShowModelMap
    })

    // 创建iframe框架
    function createFrame(mapId, pagePath, onLoadCallback) {
      let frameContainer = document.getElementById('map-frames-container')
      let iframeDom = document.createElement('iframe')
      iframeDom.setAttribute('class', 'map_frame animate__animated') // 这里为了方便找到的iframe列表
      iframeDom.setAttribute('id', 'map-frame-' + mapId)
      iframeDom.setAttribute('src', pagePath) //跳转第二个页面
      // iframeDom.style.width = '100%'
      // iframeDom.style.height = '100%'
      // iframeDom.style.zIndex = 7 // 设置一个合适的层高
      // iframeDom.style.position = 'absolute'
      // iframeDom.style.left = '0'
      // iframeDom.style.top = '0'
      iframeDom.style.display = 'none'
      iframeDom.style.border = 'none'
      // iframeDom.style.transform = 'translate(-50%,-50%)'
      frameContainer.appendChild(iframeDom)
      iframeDom.onload = function () {
        console.log('on iframe loaded')
        onLoadCallback && onLoadCallback(iframeDom.contentWindow)
      }
    }
    // 展示单模型地图
    function showInnerMap(configs = {}) {
      let mapId = configs.id
      isShowModelMap.value = configs.isShow

      // 判断是否曾打开过内嵌地图场景
      if (configs.isShow && isLoadedInnerMap) {
        // 停止原本地图场景的渲染
        mapApp.map.stopRender()
        // 隐藏原本地图场景的控件
        mapApp.floorControl.visible = false
        // 开启内嵌新地图场景的渲染
        mapApp.frameWindows.innerMap.map.reRender()
      } else if (!configs.isShow && isLoadedInnerMap) {
        mapApp.floorControl.visible = true
        mapApp.map.reRender()
        mapApp.frameWindows.innerMap.map.stopRender()
      }

      if (!isLoadedInnerMap) {
        // 未加载过模型地图，构建iframe
        createFrame(mapId, './inner.html', (frameWindow) => {
          mapApp.frameWindows.innerMap = frameWindow.mapApp

          isLoadedInnerMap = true
          document.getElementById(
            'map-frame-' + mapId
          ).style.display = configs.isShow ? 'block' : 'none'

          let mapOptions = configs.options
          for (let o in mapOptions) {
            frameWindow.map.options[o] = mapOptions[o]
          }
          frameWindow.mapApp.mapId = mapId
          frameWindow.mapApp.initMap()
          // frameWindow.addEventListener("close", () => {
          //   this.showInnerBuildingMap({
          //     id: mapId
          //   });
          // });
          frameWindow.mapApp.map.on('loadComplete', () => {
            mapApp.dispatchEvent({
              type: 'mapLoaded',
              id: mapId
            })
            // esmap.ESMapUtil.setControlsInfo({target: '1.166,0.000,146.451', position: '-1.114,129.900,-220.841'});
          })
          mapApp.dispatchEvent({
            type: 'iframeLoaded',
            window: frameWindow
          })
        })
      } else {
        // 加载过模型地图，则只需要显隐iframe窗口即可
        document.getElementById(
          'map-frame-' + mapId
        ).style.display = configs.isShow ? 'block' : 'none'
      }
    }

    return {
      clickShadeSign,
      isShowModelMap,
      showInnerMap
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .clickShade {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    cursor: wait;
  }

  #map-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .model_map_shade {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    backdrop-filter: blur(50px);
  }

  #map-frames-container {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);

    :deep(.map_frame) {
      z-index: 1005;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
