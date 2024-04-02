<template>
  <div class="container">
    <!-- 按钮面板 -->
    <div class="view">
      <button @click="addHeatMap()">
        添加热力图
      </button>
      <button @click="addRandomHeatMap()">
        添加随机热力图
      </button>
      <button @click="clearHeatMap()">
        清除热力图
      </button>
    </div>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init'
import { onMounted, onUnmounted, reactive, ref, onDeactivated } from 'vue'
export default {
  name: 'HeatMap',
  setup() {
    onMounted(() => {
    })

    onDeactivated(() => {
      clearHeatMap();
    });

    // 添加热力图
    function addHeatMap() {
      const {map, heatmapInstance} = mapApp
      const building = map.getBuilding();
      var fnum = building.focusFloorNum; // 获取聚焦的楼层层数
      heatmapInstance.setFloorNum(fnum); // 将热力图设置到某个楼层上

      // 添加热力图数据
      heatmapInstance.addPoint(map.center.x, map.center.y - 20, 100);
      // 把热力图应用到需要添加的楼层对象中
      var floorLayer = building.getFloor(fnum); // fnum为楼层层数
      floorLayer.applyHeatMap(heatmapInstance);
    }

    // 添加随机热力图
    function addRandomHeatMap() {
      const {map, heatmapInstance} = mapApp
      const building = map.getBuilding();
      var fnum = building.focusFloorNum; // 获取聚焦的楼层层数
      heatmapInstance.setFloorNum(fnum); // 将热力图设置到某个楼层上

      // 随机添加热力图数据
      heatmapInstance.randomPoints(200);
      // 把热力图应用到需要添加的楼层对象中
      var floorLayer = building.getFloor(fnum); // fnum为楼层层数
      floorLayer.applyHeatMap(heatmapInstance);
    }

    // 清除热力图
    function clearHeatMap() {
      const {map, heatmapInstance} = mapApp
      const building = map.getBuilding();
      // 清除画布
      heatmapInstance.clear()

      // 清除热力点
      heatmapInstance.clearPoints()

      // 清除某一层热力图，fnum为楼层数
      heatmapInstance.disposeHeatMap(building.focusFloorNum);  
                      
      // 销毁热力图实例
      var floorLayer = building.getFloor(building.focusFloorNum)
      floorLayer.removeHeatMap(heatmapInstance)
    }

    return { addHeatMap, addRandomHeatMap, clearHeatMap }
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
