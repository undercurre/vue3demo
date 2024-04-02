<template>
  <div class="home">
    <!-- 地图资源加载组件 -->
    <div id="inner-container"></div>
  </div>
</template>

<script>
// 地图资源组件
import { default as mapApp } from './inner.js'
import { ref, onMounted } from 'vue'
export default {
  name: 'Home',
  components: {},
  setup() {
    onMounted(() => {
      // 赋值到mapApp对象中方便调用子组件方法
      window.mapApp = mapApp
    })
    return {}
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

  #inner-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

.view_btns {
  z-index: 999;
  position: absolute;
  bottom: 5%;
  left: 10%;
}

.view_btns button {
  margin-right: 10px;
  cursor: pointer;
  pointer-events: auto;
}

#fpvTips {
  position: absolute;
  bottom: 38px;
  display: none;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;

  .btn {
    z-index: 2000;
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translate(-50%, 0);
    button {
      cursor: pointer;
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