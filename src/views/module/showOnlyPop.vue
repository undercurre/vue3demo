<template>
  <div class="container">
    <!-- 提示 -->
    <div class="title">单点房间可显示气泡标注(不可缩放)</div>

    <!-- 单个气泡组件 -->
    <popDialog
      v-if="onlyPopConfig.value"
      :popData="onlyPopConfig.value"
      :key="onlyPopConfig.value"
    ></popDialog>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init'
// 单个气泡vue组件
import popDialog from '@/components/popDialog.vue'

import { onMounted, onUnmounted, reactive, ref } from 'vue'
export default {
  name: 'onlyPopControl',
  components: { popDialog },
  setup() {
    // 定义单独气泡的响应式配置对象
    let onlyPopConfig = reactive({ value: null })

    onMounted(() => {
      // 将响应式对象赋值到mapApp上，方便跨组件调用
      mapApp.onlyPopConfig = onlyPopConfig
    })

    onUnmounted(() => {})

    return { onlyPopConfig }
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
  .title {
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: #fefefe;
    color: #000;
    padding: 5px 35px;
    border-radius: 15px;
    z-index: 99;
    user-select: none;
  }
}
</style>
