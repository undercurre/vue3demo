
<!-- 生成单个气泡的vue组件 -->
<template>
  <div
    class="pop_container"
    :style="{
      position: 'absolute', // 必须设置绝对定位才能对应到地图场景上
      transformOrigin: 'bottom', // 固定transform的原点位置，避免偏移方向出错
      transform: popTips.transformStyle // 通过气泡的onUpdatePosition方法动态绑定偏移位置
    }"
  >
    <div v-show="popTips.visible">
      <div class="pop_extend">
        <div class="pop_title">
          <span>店铺名称：{{ popData.name }}</span>
          <li @click="hidePop">X</li>
        </div>
        <div class="pop_detail">
          <img
            v-if="popData.RoomLogo"
            :src="require(`@/assets/imagelogo/${popData.RoomLogo}`)"
            alt=""
          />
        </div>
      </div>

      <div
        class="pop_line"
        :style="{
          backgroundImage:
            'linear-gradient(to bottom, #1594FF, rgba(0, 0, 0, 0))',
          height: popData.height + 'px  '
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init.js'
import { reactive, onMounted, onUnmounted } from 'vue'
import { default as CommonTools } from '@/map/utils/common'

export default {
  // 组件名称
  name: 'popDialog',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: { popData: { type: Object, default: () => {} } },
  // 组件状态值
  setup(props) {
    // 定义该子组件的偏移和显隐的响应式对象
    let popTips = reactive({
      transformStyle: '',
      visible: false
    })

    // 定义气泡标注对象
    let PopMarker = reactive({})

    onMounted(() => {
      // 初始化生命周期执行气泡初始化
      initPop()
    })

    onUnmounted(() => {
      // 销毁组件生命周期执行气泡销毁
      PopMarker.close()
      PopMarker = null
    })

    // 初始化气泡标注并将位置信息绑定到该子组件的popTips响应式对象上
    function initPop() {
      // 根据父组件传的popData值，生成气泡标注
      PopMarker = CommonTools.addPopMarker({
        x: props.popData.mapCoord.x,
        y: props.popData.mapCoord.y,
        fnum: props.popData.FloorNum,
        offset: 0,
        ShowLevel: props.popData.ShowLevel,
        bid: mapApp.map.focusBuilding.id,
        callback: () => {
          // 将气泡标注的偏移位置绑定到该子组件的css属性transformStyle中
          PopMarker.onUpdatePosition((transformStyle, displayStyle) => {
            popTips.transformStyle = transformStyle
            popTips.visible = displayStyle.display === 'none' ? false : true
          })
        }
      })
    }
    // 隐藏气泡标注
    function hidePop() {
      PopMarker.hide()
    }

    return { popTips, hidePop }
  }
}
</script>

<style lang="scss" scoped>
.pop_container {
  user-select: none;
  pointer-events: none;
  z-index: 98;
  font-size: 40px;
  color: #fff;

  .pop_line {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100px;
    background-image: linear-gradient(to bottom, #f3ab0f, rgba(0, 0, 0, 0));
    animation: scale-in-bl 0.5s;

    &::after {
      content: '';
      width: 8px;
      height: 8px;
      transform: translateX(-50%);
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #fff;
      border-radius: 50%;
    }
  }

  .pop_extend {
    backdrop-filter: blur(4px);

    color: #fff;
    animation: shutter-in-top 0.3s 0.3s forwards;
    opacity: 0;
    font-family: SiYuan;
    width: 200px;

    .pop_title {
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      white-space: nowrap;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      background-color: #325f9c;
      padding: 0 10px;

      & > li {
        border: 1px solid #fff;
        padding: 2px;
        width: 10px;
        height: 10px;
        line-height: 10px;
        text-align: center;
        cursor: pointer;
        pointer-events: auto;
      }
    }

    .pop_detail {
      background-color: #40669ca2;
      white-space: nowrap;

      img {
        width: 100%;
      }
    }
  }
}

@keyframes scale-in-bl {
  0% {
    transform: scaleY(0) translateX(-50%);
    opacity: 1;
  }

  100% {
    transform: scaleY(1) translateX(-50%);
    opacity: 1;
  }
}

@keyframes shutter-in-top {
  0% {
    transform: rotateX(-100deg);
    opacity: 0;
  }

  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
</style>
