<template>
  <div class="container">
    <!-- 按钮面板 -->
    <div class="view">
      <button @click="addTextMarker()">
        添加文本带图片标注
      </button>
      <button @click="addImageMarker()">
        添加普通图片标注
      </button>
      <button @click="addLocMarker()">
        添加定位标注
      </button>
      <button @click="addMarkers()">
        多边形标注
      </button>
      <button @click="addlineMarker()">
        线标注
      </button>
      <button @click="drawTubeLine()">
        管线标注
      </button>
      <button @click="removeAll()">
        清除标注
      </button>
    </div>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init'
import { onMounted, onUnmounted, onDeactivated, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'HeatMap',
  setup() {
    const route = useRoute()
    let lm = null // 定位图标对象
    let layer_poly = null // 多边形标注图层
    onMounted(() => {
      const { map } = mapApp
      //点击三维场景事件
      map.on("mapClickNode", function (e) {
        if (route.path != '/showMarker') {
          return
        }
        const mapCoord = e.hitCoord
        const fnum = e.FloorNum ?? 1
        addDynamicImage(mapCoord.x, mapCoord.y, fnum)
      });
    });
    onDeactivated(() => {
      // 在从 DOM 上移除、进入缓存
      // 以及组件卸载时调用
      removeAll();
    })

    // 添加文本标注
    function addTextMarker() {
      const { map } = mapApp
      const building = map.getBuilding();
      const floorLayer = building.getFloor(building.focusFloorNum);
      const layer = new esmap.ESLayer('textMarker');
      layer.name = 'mylayer'
      const gpos = floorLayer.mapCoord; // 楼层中心坐标
      //添加文本标注，默认样式
      const tm = new esmap.ESTextMarker({
        x: gpos.x - 25,
        y: gpos.y - 35,
        height: 3,
        text: "",
        image: "image/user.png",
        imageAlign: "bottom",
        imageSize: 60,
        showLevel: 20,
        // spritify: false, //是否跟随三维场景缩放默认为true
        fillcolor: "255,0,0", //填充色
        fontsize: "12.0", //字体大小
        strokecolor: "255,255,0" //边框色
      });
      layer.addMarker(tm);
      floorLayer.addLayer(layer);
      tm.text = '文本标签' + Math.random().toFixed(2)
    }

    // 添加图片标注
    function addImageMarker() {
      const { map } = mapApp
      const building = map.getBuilding();
      const floorLayer = building.getFloor(building.focusFloorNum);
      const layer = new esmap.ESLayer('imageMarker');
      layer.name = 'myIamgeLayer'
      const gpos = floorLayer.mapCoord;
      const im = new esmap.ESImageMarker({
        x: gpos.x - 35,
        y: gpos.y - 35,
        url: 'image/user.png',
        size: 64,
        showLevel: 20,
        height: 3,
        // spritify:false,
        // 或者指定宽高：size:{
        // 	w:32,
        // 	h:64
        // },
        // angle: 30,  //如果设置了就是固定marker角度，与三维场景一起旋转。(size需要重新设置)
        id: 1,
        name: 'myMarker'
      });
      layer.addMarker(im);
      floorLayer.addLayer(layer);
      var angle = 30
      var rotateID = setInterval(function () {
        angle += 2
        im.angle = angle //直接设置角度旋转
      }, 50)
    }

    // 点击动态标注图片
    function addDynamicImage(x, y, fnum = 1) {
      const { map } = mapApp
      const building = map.getBuilding();
      const floorLayer = building.getFloor(fnum);
      const layer = floorLayer.getOrCreateLayerByName('dynamic', 'imageMarker');
      const im = new esmap.ESImageMarker({
        x: x,
        y: y,
        url: 'image/user.png',
        spritify: true, //跟随三维场景缩放变化大小，默认为true，可选参数
        height: 2,
        size: 64
      });
      layer.addMarker(im);
      floorLayer.addLayer(layer);
    }

    // 添加定位标注方法,x、y为墨卡托坐标
    function addLocMarker(x, y) {
      const { map } = mapApp
      const building = map.getBuilding();
      const fnum = building.focusFloorNum;
      lm && map.removeLocationMarker(lm);
      lm = new esmap.ESLocationMarker({
        url: 'image/pointer.png',
        size: 150,
        height: 30
      });
      map.addLocationMarker(lm);
      lm.setPosition({
        x: x,
        y: y,
        fnum: fnum,
        height: 1
      })
      // lm.direction = 30;  //改变定位标注的方向 ，或者使用rotateTo()方法
      updateLocMarker()
    }

    // 更新定位导航位置
    function updateLocMarker() {
      const { map } = mapApp
      lm.direction = -40; //改变定位标注的方向
      lm.moveTo({
        x: map.center.x + 10,
        y: map.center.y + 10,
        time: 3
      });
    }

    // 多边形标注
    function addMarkers() {
      const { map } = mapApp
      const building = map.getBuilding();
      const floor = building.getFloor(building.focusFloorNum);
      layer_poly && layer_poly.removeAll();
      layer_poly = floor.getOrCreateLayerByName('poly', esmap.ESLayerType.POLYGON_MARKER);
      addCircleMaker(map.center, 20);
      addRectangleMaker(map.center);
      addMyPolygonMaker();
    }

    // 创建矩形标注
    function addRectangleMaker(coord) {
      var marker = new esmap.ESPolygonMarker({
        name: "矩形标注",
        id: 21,
        //设置颜色
        color: getRandomColor(),
        //设置透明度
        alpha: .6,
        //设置边框线的宽度
        lineWidth: 1,
        //设置高度
        height: 6,
        points: {
          //设置为矩形
          type: 'rectangle',
          //设置此形状的中心坐标
          center: {
            x: coord.x,
            y: coord.y
          },
          //设置矩形的宽度
          width: 50,
          //设置矩形的高度
          height: 30
        }
      });
      layer_poly && layer_poly.addMarker(marker);
    }

    //创建圆形标注
    function addCircleMaker(coord, radius) {
      var marker = new esmap.ESPolygonMarker({
        name: "圆形标注",
        id: 20,
        //设置颜色
        color: getRandomColor(),
        //设置透明度
        alpha: 0.3,
        //设置边框线的宽度
        lineWidth: 2,
        //设置高度
        height: 6.2,
        points: {
          //设置为圆形
          type: 'circle',
          //设置此形状的中心坐标
          center: {
            x: coord.x + 20,
            y: coord.y - 20
          },
          //设置半径
          radius: radius,
          //设置段数，默认为40段
          segments: 40,
        }
      });
      layer_poly && layer_poly.addMarker(marker);
    }

    //创建自定义形状标注
    function addMyPolygonMaker() {
      const { map } = mapApp
      //创建PolygonMarker自定义形状的顶点数组
      var coords = [
        { x: map.center.x + 20, y: map.center.y + 20, z: 26 },
        { x: map.center.x + 40, y: map.center.y + 40, z: 26 },
        { x: map.center.x + 60, y: map.center.y + 20, z: 26 },
        { x: map.center.x + 40, y: map.center.y + 10, z: 26 },
        { x: map.center.x + 10, y: map.center.y, z: 26 },
      ];
      var marker = new esmap.ESPolygonMarker({
        name: "自定义多边形标注",
        id: 23,
        color: getRandomColor(),
        //设置透明度
        alpha: .9,
        //设置边框线的宽度
        lineWidth: 1,
        //设置高度
        height: 6.5,
        //设置多边形坐标点
        points: coords
      });
      layer_poly && layer_poly.addMarker(marker);
    }

    // 生成随机颜色
    function getRandomColor() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    // 创建线标注
    function addlineMarker() {
      const { map } = mapApp
      const building = map.getBuilding();
      const center = map.center;
      const fnum = building.focusFloorNum;
      const v1 = {
        x: center.x + 20,
        y: center.y - 20,
        fnum: fnum,
        bid: building.id,
        offset: 10
      }
      const v2 = {
        x: center.x - 10,
        y: center.y - 40,
        fnum: fnum,
        bid: building.id,
        offset: 10
      }
      //箭头导航线
      const points = [v1, v2];
      const lineType = [
        esmap.ESLineType.FULL, //实线
        esmap.ESLineType.ARROW, //箭头线
        esmap.ESLineType.DOT_DASH, //虚线
        esmap.ESLineType.DOUBLE_DOT_DASH, //双虚线
        esmap.ESLineType.TRI_DOT_DASH, //三虚线
        esmap.ESLineType.ESARROW, //导航线
      ]
      const lineStyle = {
        color: getRandomColor(),
        lineWidth: 10,
        alpha: 0.8,
        offsetHeight: 0,
        lineType: lineType[Math.floor(Math.random() * lineType.length)]
      }
      const linemark = new esmap.ESLineMarker({ points, style: lineStyle })
      map.clearAllLineMark()
      map.drawLineMark(linemark)
    }

    // 创建管线标注
    function drawTubeLine() {
      const { map } = mapApp
      var lineStyle = {
        lineWidth: 3,
        lineWidthMeter: true,   //lineWidth是否代表真实单位/m
        offsetHeight: 1,
        lineMode: "circle",
        lineType: esmap.ESLineType.TEXTURE,
        url: "./image/tube.png" //指定管线贴图url
      };
      var points = getRandomTubePoints();
      map.clearAllLineMark();
      const lineMarker = new esmap.ESLineMarker({ points, style: lineStyle });
      map.drawLineMark(lineMarker);
    }

    // 生成随机管道位置
    function getRandomTubePoints() {
      const { map } = mapApp
      const building = map.getBuilding();
      const fnum = building.focusFloorNum;
      var floorHeight = building.getFloorHeight(fnum);
      var points = [
        {
          x: map.center.x,
          y: map.center.y,
          offset: floorHeight + 20,
          fnum: 1,
        },
      ];
      var lastDir = 2;
      for (var i = 0; i < 30; i++) {
        var lastPoint = points[points.length - 1];
        var dir = Math.floor(Math.random() * 100) % 3;
        while (lastDir == dir) {
          dir = Math.floor(Math.random() * 100) % 3;
        }
        lastDir = dir;
        var offset = (Math.random() * 10 + 4) * (Math.random() > 0.5 ? 1 : -1);
        points.push({
          x: dir === 0 ? lastPoint.x + offset : lastPoint.x, fnum: 1,
          offset: dir === 1 ? lastPoint.offset + offset : lastPoint.offset,
          y: dir === 2 ? lastPoint.y + offset : lastPoint.y,
        });
      }
      return points;
    }

    // 清除标注
    function removeAll() {
      const { map } = mapApp
      const building = map.getBuilding();
      [1, 2, 3].forEach(i => {
        const floorLayer = building.getFloor(i);
        // floorLayer.removeLayersByTypes([esmap.ESLayerType.TEXT_MARKER, esmap.ESLayerType.IMAGE_MARKER]);
        floorLayer.removeLayersByNames(['mylayer', 'myIamgeLayer', 'dynamic']);
      })
      lm && map.removeLocationMarker(lm);
      layer_poly && layer_poly.removeAll();
      map.clearAllLineMark()
    }


    return { addTextMarker, addImageMarker, addLocMarker, addMarkers, addlineMarker, drawTubeLine, removeAll }
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
      margin: 0 10px 10px 10px;
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
