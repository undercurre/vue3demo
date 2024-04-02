<template>
  <div class="container">
    <div class="btn" @click="openIframe(!isShow)">
      <button>{{ isShow ? '关闭' : '打开' }}内嵌页面</button>
    </div>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init'
import { onMounted, onUnmounted, reactive, ref, onActivated } from 'vue'
export default {
  name: 'manyPopControl',
  components: {},
  setup() {
    let isShow = ref(false)
    onMounted(() => {
      isShow.value = false
    })

    onActivated(() => {
      isShow.value = false
    })

    onUnmounted(() => {
      openIframe(false)
    })

    function openIframe(flag) {
      isShow.value = flag
      mapApp.toggleModelMap(flag)
    }
    return { openIframe, isShow }
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

  .btn {
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
