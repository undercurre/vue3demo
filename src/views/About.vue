<template>
  <div class="about">
    <h1>Let's build awesome maps!(ESMap-vue3)</h1>
    <h2>该路由下无keep-alive缓存，已停留{{ num }}秒</h2>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    // 验证keep-alive缓存是否正确，当前页将不会被缓存
    let num = ref(0)
    setInterval(() => {
      num.value += 1
    }, 1000)
    return { num }
  }
}
</script>
<style scoped>
.about {
  line-height: 55px;
}
</style>
