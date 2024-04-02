<!-- 生成多个气泡的vue组件 -->
<template>
  <div
    class="pop_container"
    :style="{
      position: 'absolute', // 必须设置绝对定位才能对应到地图场景上
      transformOrigin: 'bottom', // 固定transform的原点位置，避免偏移方向出错
      transform: popTips.transformStyle, // 通过气泡的onUpdatePosition方法动态绑定偏移位置
      zIndex: popTips.zIndex // 通过气泡的onUpdatePosition方法动态计算各气泡间的层级关系
    }"
    v-show="popTips.visible"
  >
    <div class="pop_base">
      <div class="box" @click="popExtend(true)">
        <img
          v-if="popData.RoomLogo"
          :src="require(`@/assets/imagelogo/${popData.RoomLogo}`)"
          alt=""
        />
      </div>
      <div class="line"></div>
    </div>
    <!-- 拓展内容 -->
    <div class="pop_main" v-show="isPopExtendShow">
      <div class="pop_line">
        <div class="obliqueLine"></div>
        <div class="straightLine"></div>
      </div>
      <div class="pop_box">
        <div class="pop_title">
          <div>
            <span>店铺名称：</span><span>{{ popData.name }}</span>
          </div>
          <div class="close" @click="popExtend(false)">
            <li>X</li>
          </div>
        </div>
        <div class="pop_detail">
          <img
            v-if="popData.RoomLogo"
            :src="require(`@/assets/imagelogo/${popData.RoomLogo}`)"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init.js'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { default as CommonTools } from '@/map/utils/common'
export default {
  // 组件名称
  name: 'popMarkers',
  // 组件参数 接收来自父组件的数据
  props: { popData: { type: Object, default: () => {} } },
  // 组件状态值
  setup(props) {
    // 定义该子组件的偏移、显隐和层级的响应式对象
    let popTips = reactive({
      transformStyle: '',
      visible: false,
      zIndex: 0
    })

    // 定义气泡标注对象
    let PopMarker = reactive({})
    let isPopExtendShow = ref(false)

    onMounted(() => {
      // 初始化生命周期执行气泡初始化
      initPop()
    })

    onUnmounted(() => {
      // 销毁组件生命周期执行气泡销毁
      PopMarker.close()
      PopMarker = null
    })

    // 初始化气泡标注并绑定到该子组件
    function initPop() {
      // 根据点击元素的配置生成气泡标注
      PopMarker = CommonTools.addPopMarker({
        x: props.popData.mapCoord.x,
        y: props.popData.mapCoord.y,
        fnum: props.popData.FloorNum,
        offset: 0,
        ShowLevel: props.popData.ShowLevel,
        bid: mapApp.map.focusBuilding.id,
        updateSize: true, //是否跟随三维场景缩放
        callback: () => {
          // 将气泡标注的偏移位置绑定到vue组件的css属性transformStyle中
          PopMarker.onUpdatePosition((transformStyle, displayStyle) => {
            popTips.transformStyle = transformStyle
            popTips.visible = displayStyle.display === 'none' ? false : true
            // popTips.zIndex = displayStyle.zIndex
          })
        }
      })
    }

    // 控制拓展内容的显隐
    function popExtend(flag) {
      isPopExtendShow.value = flag
      let zIndex = mapApp.zIndex ? ++mapApp.zIndex : 1 && (mapApp.zIndex = 1)
      popTips.zIndex = zIndex
    }

    return { popTips, isPopExtendShow, popExtend }
  }
}
</script>

<style lang="scss" scoped>
.pop_container {
  user-select: none;
  pointer-events: none;

  .pop_base {
    position: relative;

    .box {
      position: absolute;
      top: -40px;
      left: -42px;
      transform: translateX(50%);
      width: 42px;
      height: 42px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 1px solid #48b9cf;
      box-shadow: 0 0 2px 20px #208fa3a1 inset, 0 0 2px 1px #24616d;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: auto;

      img {
        width: 25px;
        height: 25px;
      }
    }

    .line {
      width: 1px;
      height: 60px;
      background-color: #56defa;

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
  }

  .pop_main {
    position: absolute;
    top: -190px;
    left: 30px;

    .pop_line {
      position: relative;
      display: flex;

      .obliqueLine {
        position: absolute;
        left: -29px;
        top: 75px;
        height: 75px;
        border-left: 2px solid #34c9ee;
        transform-origin: 0 100%;
        transform: rotate(20deg);
        background-color: #34c9ee;
        animation: scale-in-bl 0.3s ease;
        animation-fill-mode: forwards;
      }

      .straightLine {
        // margin-left: 15px;
        position: absolute;
        left: -2px;
        top: 79px;
        width: 40px;
        height: 2px;
        opacity: 0;
        background-color: #34c9ee;
        animation: scale-in-hor-left 0.2s ease 0.3s;
        animation-fill-mode: forwards;
      }
    }

    .pop_box {
      backdrop-filter: blur(4px);

      position: absolute;
      top: 45px;
      left: 38px;
      width: 220px;
      background-color: #03050eb0;
      box-sizing: border-box;
      border: 1px solid #1c899c;
      padding: 13px;
      animation: shutter-in-top 0.5s ease 0.5s forwards;
      opacity: 0;

      &::before {
        content: '';
        position: absolute;
        left: -2px;
        top: -2px;
        width: 5px;
        height: 10px;
        background-color: #42deff;
      }

      &::after {
        content: '';
        position: absolute;
        right: -2px;
        top: -2px;
        width: 5px;
        height: 10px;
        background-color: #42deff;
      }

      .pop_title {
        color: #fff;
        display: flex;
        justify-content: space-between;
        width: 100%;
        background-image: linear-gradient(to right, #173d66, rgba(0, 0, 0, 0));
        padding: 5px;
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 24px;
        vertical-align: middle;
        font-family: YouSheBiaoTiHei;

        span {
          letter-spacing: 0.5px;

          &:nth-child(3) {
            color: #42deff;
          }
        }

        .close {
          width: 22px;
          height: 22px;
          color: #27abc2;
          margin-right: 10px;
          box-sizing: border-box;
          border: 2px solid #1e92a7;
          text-align: center;
          line-height: 16px;
          cursor: pointer;
          pointer-events: auto;

          i {
            font-size: 12px;
            font-weight: bolder;
          }
        }
      }

      .pop_detail {
        white-space: nowrap;

        img {
          width: 100%;
        }
      }
    }
  }
}

@keyframes scale-in-bl {
  0% {
    transform: scale(0) rotate(20deg);
    transform-origin: 0% 100%;
    opacity: 1;
  }

  100% {
    transform: scale(1) rotate(20deg);
    transform-origin: 0% 100%;
    opacity: 1;
  }
}

@keyframes scale-in-hor-left {
  0% {
    transform: scaleX(0);
    transform-origin: 0% 0%;
    opacity: 0;
  }

  100% {
    transform: scaleX(1);
    transform-origin: 0% 0%;
    opacity: 1;
  }
}

@keyframes shutter-in-top {
  0% {
    transform: rotateX(-100deg);
    transform-origin: top;
    opacity: 0;
  }

  100% {
    transform: rotateX(0deg);
    transform-origin: top;
    opacity: 1;
  }
}
</style>
