<template>
  <div class="container">
    <!-- 提示面板 -->
    <div class="description">{{ message }}</div>
    <!-- 按钮面板 -->
    <div class="view">
      <button @click="clearNavi()">
        清除
      </button>
      <button @click="startNavi1()">
        开始第一人称导航
      </button>
      <button @click="startNavi2()">
        开始第三人称导航
      </button>
      <button @click="showRoutes()">
        显示多点路径规划
      </button>
      <button @click="startNavi3()">
        真实导航
      </button>
    </div>
  </div>
</template>

<script>
import { default as mapApp } from '@/map/init'
import { onDeactivated, onMounted, onUnmounted, reactive, ref, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'RouteResult',
  setup() {
    const route = useRoute()
    // 三维场景对象
    let map = null
    // 导航对象
    let navi = null
    // 起点标注
    let startPoint = null
    // 终点标注
    let endPoint = null
    // 导航提示信息
    let message = ref('暂无导航提示信息')
    // 图层对象
    let layer = null
    // 真实导航定时器
    let timer = null
    // 真实导航当前位置索引
    let coordIndex = 0

    onMounted(() => {
      map = mapApp.map
      // 需要在模三维场景加载完成事件后创建导航实例对象
      map.on("loadComplete", function () {
        createNavi();
      });
      //点击三维场景事件。开始选点开始后，点击三维场景一次为起点，第二次点击为终点
      map.on("mapClickNode", function (event) {
        if (route.path != '/getRouteResult') {
          return
        }
        let h = 1, mapCoord = null, floor = 0;
        let point = {}
        if (![4, 5].includes(event.nodeType)) {
          return;
        }
        if (event.nodeType == 4) {
          h = 1;
          floor = event.floor;
          mapCoord = event.hitCoord;
        }
        if (event.nodeType == 5) {
          floor = event.FloorNum;
          h = event.RoomHigh;
          mapCoord = event.hitCoord;
        }
        point = {
          x: mapCoord.x,
          y: mapCoord.y,
          fnum: floor,
          height: h,
          size: 64
        }
        addRoute(point);
      });
    });
    onActivated(() => {
      // 调用时机为首次挂载
      // 以及每次从缓存中被重新插入时
    })
    onDeactivated(() => {
      clearNavi();
    });


    // 添加路径
    function addRoute(point) {
      console.log('add----', point);
      !navi && createNavi();
      // 第三次点击清除路径，重新设置起点
      if (endPoint != null) {
        startPoint = null;
        endPoint = null;
        navi.clearAll();
      }
      if (startPoint == null) {
        // 添加起点并画路线
        startPoint = { ...point, url: "image/start.png" };
        navi.setStartPoint(startPoint);
      } else if (endPoint == null) {
        // 添加终点并画路线
        // 判断起点和终点是否相同
        endPoint = point;
        if (startPoint.x == endPoint.x && startPoint.y == endPoint.y) {
          alert("起点和终点不能相同!,请重新选点");
          return;
        }
        navi.setEndPoint(endPoint);
      }
      if (startPoint && endPoint) {
        //画导航线
        navi.getRouteResult({
          drawRoute: true,
        })
      }

    }

    // 开启第一人称导航
    function startNavi1() {
      !navi && createNavi();
      // 如果正在导航则重置导航
      if (navi.isSimulating) {
        navi.stop();
        navi.reset();
      }

      if (startPoint && endPoint) {
        //画导航线
        // navi.getRouteResult({
        //   drawRoute: true,
        // })
        // navi.on('success', function() {
        navi.followAngle = true;
        navi.followPosition = true;
        navi.scaleAnimate = true;
        //下句解决IOS苹果手机不能播放问题，不能删除
        map.ESAudioTool.playSoundByName('startNaving');
        navi.simulate();
        // })
      }
    }

    // 开启第三人称导航
    function startNavi2() {
      !navi && createNavi();
      // 如果正在导航则重置导航
      if (navi.isSimulating) {
        navi.stop();
        navi.reset();
      }

      navi.getRouteResult({
        drawRoute: true,
      })
      // navi.on('success', function() {
      navi.followAngle = false;
      navi.followPosition = false;
      navi.scaleAnimate = false;
      //下句解决IOS苹果手机不能播放问题，不能删除
      map.ESAudioTool.playSoundByName('startNaving');
      navi.simulate();
      // })
    }

    // 显示多点路径规划
    function showRoutes() {
      !navi && createNavi()
      if (navi.isSimulating) {
        navi.stop();
      }
      const building = map.getBuilding();
      const fnum = building.focusFloorNum;
      const center_x = map.center.x
      const center_y = map.center.y
      var floorLayer = building.getFloor(fnum)
      if (!layer) {
        layer = new esmap.ESLayer(esmap.ESLayerType.IMAGE_MARKER)
      }
      layer.removeAll()

      var points = [
        {
          x: center_x + Math.random() * 100 - 50,
          y: center_y + Math.random() * 80 - 40,
          fnum: fnum
        },
        {
          x: center_x + Math.random() * 100 - 50,
          y: center_y + Math.random() * 80 - 40,
          fnum: fnum
        },
        {
          x: center_x + Math.random() * 100 - 50,
          y: center_y + Math.random() * 80 - 40,
          fnum: fnum
        },
        {
          x: center_x + Math.random() * 100 - 50,
          y: center_y + Math.random() * 80 - 40,
          fnum: fnum
        }
      ]
      points.forEach(function (p) {
        var im = new esmap.ESImageMarker({
          x: p.x,
          y: p.y,   //如果不添加x和y，则默认坐标在三维场景中心。
          url: 'image/user.png',  //图片标注的图片地址
          size: 64,   			//图片大小 或者 size:{w:32,h:64},
          spritify: true,			//跟随三维场景缩放变化大小，默认为true，可选参数
          height: 1,    			//距离地面高度
          showLevel: 20,  		//三维场景缩放等级达到多少时隐藏,可选参数
          seeThrough: true,		//是否可以穿透楼层一直显示,可选参数
          //angle:30,  	//如果设置了就是固定marker角度，与三维场景一起旋转。(size需要重新设置)
          id: 2017,   			//id，可自定义
          name: 'myMarker'   		//name可自定义
        });
        layer.addMarker(im)
      })

      floorLayer.addLayer(layer)
      navi.queryByPoints(points)
      navi.drawNaviLine();

      //下句解决IOS苹果手机不能播放问题，不能删除
      map.ESAudioTool.playSoundByName('startNaving');
      navi.simulate();
    }

    // 真实导航
    function startNavi3() {
      if (timer) {
        return;
      }
      !navi && createNavi();
      navi.setStartPoint({
        x: 12683425.395161062,
        y: 2557886.083905697,
        fnum: 1,
        height: 1,
        url: "image/start.png",
        size: 64,
      });
      navi.setEndPoint({
        x: 12683467.367029807,
        y: 2557862.8654304906,
        fnum: 1,
        height: 1,
        url: "image/end.png",
        size: 64,
      });
      navi.getRouteResult({
        drawRoute: true,
      });
      // 需要map对象加载完成后调用
      setTimeout(() => {
        navi.start();
        navi.on("reRouting", function () {
          message.value = "路径偏移，重新规划路径";
        });
        updateCoord();
      }, 1000)

    }

    // 定位真实导航坐标
    function updateCoord() {
      const coordsData = [
        {
          "x": 12683424.719966372,
          "y": 2557885.185365967,
          "fnum": 1
        },
        {
          "x": 12683426.058789892,
          "y": 2557882.8302299143,
          "fnum": 1
        },
        {
          "x": 12683424.811091267,
          "y": 2557880.8504934884,
          "fnum": 1
        },
        {
          "x": 12683424.387914414,
          "y": 2557877.9347775434,
          "fnum": 1
        },
        {
          "x": 12683425.641759392,
          "y": 2557876.6483775824,
          "fnum": 1
        },
        {
          "x": 12683427.155793173,
          "y": 2557874.507903562,
          "fnum": 1
        },
        {
          "x": 12683426.398919001,
          "y": 2557869.6238507954,
          "fnum": 1
        },
        {
          "x": 12683429.619599992,
          "y": 2557867.3317160057,
          "fnum": 1
        },
        {
          "x": 12683433.870244397,
          "y": 2557868.827596099,
          "fnum": 1
        },
        {
          "x": 12683437.532256726,
          "y": 2557871.5613475605,
          "fnum": 1
        },
        {
          "x": 12683439.769108804,
          "y": 2557871.092643042,
          "fnum": 1
        },
        {
          "x": 12683441.113114143,
          "y": 2557874.0667860936,
          "fnum": 1
        },
        {
          "x": 12683440.865133954,
          "y": 2557873.2177782673,
          "fnum": 1
        },
        {
          "x": 12683441.627268367,
          "y": 2557870.0770305027,
          "fnum": 1
        },
        {
          "x": 12683446.503550138,
          "y": 2557868.9744503805,
          "fnum": 1
        },
        {
          "x": 12683450.132003903,
          "y": 2557870.1598302154,
          "fnum": 1
        },
        {
          "x": 12683454.636647716,
          "y": 2557867.698125643,
          "fnum": 1
        },
        {
          "x": 12683456.808539584,
          "y": 2557869.8818324585,
          "fnum": 1
        },
        {
          "x": 12683462.56253651,
          "y": 2557868.474087202,
          "fnum": 1
        },
        {
          "x": 12683466.88967045,
          "y": 2557865.392996569,
          "fnum": 1
        },
        {
          "x": 12683467.144720772,
          "y": 2557864.131309511,
          "fnum": 1
        }
      ];
      let points = [];
      timer = setInterval(function () {
        if (coordIndex >= coordsData.length) {
          clearInterval(timer);
          timer = null;
          return;
        }
        var coord = coordsData[coordIndex];
        console.log('🐕', navi)
        navi && navi.walkTo(coord);
        points.push(coord);
        drawLine(points);
        coordIndex++;
      }, 1000);
    }

    // 划线
    function drawLine(points) {
      if (points.length && points.length <= 1) return;
      map.clearLineMarkById("routes");
      //配置线标注样式
      const lineStyle = {
        fixedWidth: true,
        lineWidth: 4,
        alpha: 0.8,
        offsetHeight: 0,
        smooth: true,
        lineType: esmap.ESLineType.FULL,
      };

      //创建线标注对象
      const line = new esmap.ESLineMarker({
        id: "routes",
        points,
        style: lineStyle,
      });
      //调用三维场景的画线方法
      map.drawLineMark(line);
    }

    // 创建导航对象
    function createNavi() {
      const building = map.getBuilding();
      if (building.naviData.length == 0) {
        alert("三维场景导航数据信息不存在！");
        return;
      }
      if (!navi) {
        //初始化导航对象
        navi = new esmap.ESNavigation({
          map: map,
          locationMarkerUrl: "image/pointer.png",
          locationMarkerSize: 150, //导航图标大小
          offsetHeight: 0.6, //导航图标高度
          speed: 4, //导航速度
          followAngle: true, //是否开启视角角度跟随
          followPosition: true, //是否开启视角位置跟随
          followGap: 0, //三维场景事件跟随间隔，设置为0则为实时跟随。默认为3，表示3秒
          tiltAngle: 80, //倾斜角，默认80
          scaleLevel: 0,//导航时缩放等级，默认1
          // 设置导航线的样式
          lineStyle: {
            color: "#33cc61",
            //设置线为导航线样式
            lineType: esmap.ESLineType.ESARROW,
            //设置边线宽度
            lineWidth: 6,
            fixedWidth: true,
            //是否可以穿透楼层一直显示,可选参数
            seeThrough: true,
            //设置边线高度
            offsetHeight: 0.3,
            //设置边线的颜色
            godEdgeColor: "#66cc99",
            //设置箭头颜色
            godArrowColor: "#333366",
            // 关闭箭头涌动动画
            noAnimate: true,
          },
        });
        window.navi = navi;
        // 监听导航提示事件
        navi.on('naviTip', function (msg) {
          message.value = msg
        })
        // 监听导航完成事件
        navi.on('complete', function () {
          message.value = '到达终点'
        })
        navi.on("walking", function (data) {
          //定位旋转
          navi.locationMarker.rotateTo(-data.angle);
        });
      }
    }

    // 清除导航对象
    function clearNavi() {
      message.value = '暂无导航提示信息'
      navi && navi.clearAll();
      layer && layer.removeAll();
      timer && (clearInterval(timer) || (timer = null) || (coordIndex = 0));
      map.clearLineMarkById("routes");
    }

    return { message, addRoute, startNavi1, startNavi2, startNavi3, showRoutes, clearNavi }
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

  .description {
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 10px 25px;
    background: rgba(255, 255, 255, 255);
    border-radius: 4px;
    opacity: 0.7;
  }
}
</style>
