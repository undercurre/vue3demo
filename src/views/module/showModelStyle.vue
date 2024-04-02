<template>
  <div class="container">
    <!-- 按钮面板 -->
    <div class="view">
      <button @click="changeModelColor()">
        修改模型样式
      </button>
      <button @click="change3dColor()">
        修改3D样式
      </button>
      <button @click="change3dVisible()">
        隐藏3d模型
      </button>
      <button @click="clearStyle()">
        还原
      </button>
    </div>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init'
import { onDeactivated, onMounted, onUnmounted, reactive, ref } from 'vue'
export default {
  name: 'ModelStyle',
  setup() {
    onMounted(() => {
    })
    onDeactivated(() => {
      clearStyle();
    });

    // 修改模型样式
    function changeModelColor() {
      const { map } = mapApp
      // 改变方块房子颜色,id,name二选择一，都可以是数组, fnum可选择
      map.changeModelColor({
        id: [76767],
        // name:'千禧之星',
        // fnum:[1],
        color: '#00ff00'
      })
    }

    // 修改3d样式
    function change3dColor() {
      const { map } = mapApp
      // 改3d模型颜色,id,name二选择一，都可以是数组, fnum可选择
      map.change3dColor({
        id: [87471, 76767, 87420],
        // name:,
        // fnum:[1,2]
        color: '#00ff00'
      })
    }

    // 隐藏3d模型
    function change3dVisible() {
      const { map } = mapApp
      // 改3d模型颜色,id,name二选择一，都可以是数组, fnum可选择
      map.change3dVisible({
        id: [76768],
        value: false
      })
    }

    // 清除样式
    function clearStyle() {
      const { map } = mapApp
      map.changeModelColor({
        id: [76767],
        color: 0
      })
      map.change3dColor({
        id: [87471, 76767, 87420],
        color: 0
      })
      map.change3dVisible({
        id: [76768],
        value: true
      })
    }

    return { changeModelColor, change3dColor, change3dVisible, clearStyle }
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
    width: 100%;

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
