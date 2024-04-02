<template>
  <div class="container">
    <!-- 按钮面板 -->
    <div class="view">
      <button @click="showManyPop(manyPopFlag)">
        <span>{{ manyPopFlag ? '关闭' : '开启' }}</span
        >多个气泡(可缩放)
      </button>
      <!-- <button @click="setSceneOption()">
        修改场景选项
      </button> -->
    </div>

    <!-- 多个气泡组件 -->
    <div v-for="(item, index) in manyPopConfigs.value" :key="index">
      <popMarkers :popData="item"></popMarkers>
    </div>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init'
// 气泡vue组件
import popMarkers from '@/components/popMarkers.vue'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
export default {
  name: 'manyPopControl',
  components: { popMarkers },
  setup() {
    // 定义单独气泡和多个气泡的响应式配置对象
    let manyPopConfigs = reactive({ value: [] })
    // 定义多个气泡的显隐控制
    let manyPopFlag = ref(false)

    onMounted(() => {
      // 将响应式对象赋值到mapApp上，方便跨组件调用
      mapApp.manyPopConfigs = manyPopConfigs
    })

    onUnmounted(() => {})

    // 显示隐藏多个气泡的方法
    function showManyPop(flag) {
      manyPopFlag.value = !flag

      if (manyPopFlag.value) {
        mapApp.showManyPop()
      } else {
        mapApp.clearManyPop()
      }
    }

    // 修改场景选项
    function setSceneOption() {
      mapApp.setSceneOption()
    }

    // 清除热力图
    function clearHeatMap() {
      mapApp.clearHeatMap()
    }

    return { manyPopConfigs, manyPopFlag, showManyPop, setSceneOption, clearHeatMap }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;

  .view {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translate(-50%, 0);

    button {
      pointer-events: auto;
      padding: 0 35px;
      height: 50px;
      margin: 0 10px;
      font-size: 16px;
      background-color: #63a0a9;
      color: #fff;
      border: none;
      border-radius: 15px;

      &:hover {
        background-color: #fefefe;
        color: #63a0a9;
      }
    }
  }
}
</style>
