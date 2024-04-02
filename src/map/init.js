
import { MAP_ID, MAP_DATA_PATH, EFFECT_PATH } from "./const";

class MapApplication extends esmap.ESEventDispatcher {

  constructor() {
    super();
    this.map = null;
    this.heatmapInstance = null
    this.onlyPopConfig = null
    this.manyPopConfigs = null

    this.showStoreList = ['金悦罗兰', 'deer', '王牌', '海尔', '金凯莎', '金伯利钻石', '步步高']

    this.manyStoreList = []

    this.watchSuccessList = []

    //地图加载好的标识
    this.successSign = false
    //是否展示内嵌模型地图
    this.isShowModelMap = false

    this.frameWindows = {
      innerMap: null
    }
  }

  /**
   * 初始化地图
   */
  initMap () {
    var container = document.getElementById('map-container');
    console.log(window.esmap)
    this.map = new window.esmap.ESMap({
      mode: window.esmap.MapMode.Building, // 加载室内地图
      container: container, //渲染dom
      mapDataSrc: MAP_DATA_PATH, //地图数据位置 
      visibleFloors: 'all',//更多初始化参数配置请参考https://www.esmap.cn/docs/sdk3.0-tutorial/map-init.html
      token: "escope",
      focusAlphaMode: false,
      // focusFloor: 3,
      // focusAlpha: 0.1
    });
    //打开地图数据
    this.map.openMapById(MAP_ID);
    this.map.showCompass = true;     //显示指南针
    this.map.showScaler = true;     // 显示三维场景比例尺

    // 定义楼层控件的配置属性
    var ctlOpt = new esmap.ESControlOptions({
      position: esmap.ESControlPositon.RIGHT_TOP,
      //注意：imgURL参数是static目录下图片的路径
      imgURL: "./image/wedgets/",
      showBtnCount: 1,
    });

    // 1.声明放大、缩小控件配置参数
    // esmap.ESControlPositon类型定义
    // LEFT_TOP: 左上方, LEFT_BOTTOM: 左下方, RIGHT_TOP: 右上方, RIGHT_BOTTOM: 右下方
    var ctlOpt1 = new esmap.ESControlOptions({
      position: esmap.ESControlPositon.LEFT_TOP, // 控件放置位置
      // 位置x,y的偏移量
      offset: {
        x: 20,
        y: 80
      }
    });

    // 三维场景加载完成事件
    this.map.on("loadComplete", () => {
      // const building = this.map.getBuildingById(MAP_ID);
      const building = this.map.getBuilding();
      // 创建楼层控件
      this.floorControl = new esmap.ESScrollFloorsControl(this.map, ctlOpt);
      // 创建放大、缩小控件
      // var zoomControl = new esmap.ESZoomControl(this.map, ctlOpt1);
      // 多层控制控件
      // var toolControl = new esmap.ESToolControl(this.map);
      this.successSign = true
      this.isShowLoading(false);   // 关闭加载动画
      // 初始化气泡组件数据
      this.initPopData()
      mapApp.clickShadeSign.value = false
      this.map.moveTo({
        x: this.map.center.x + 10,         // 目标点x在中心点坐标基础上再加10米
        y: this.map.center.y + 10,          // 目标点y在中心点坐标基础上再加10米
        FloorNum: 3,             // 可选，设置聚焦到某一层
        // callback: func,          // 可选，完成移动后的回调函数
        time: 1,             // 可选，单位（秒/s），若time为0或不传值会瞬间移动，没有移动过程
        // time若有值则控制三维场景视角移动过程时间，可以实现平滑地移动三维场景
      })

      this.watchSuccessList.forEach((fn) => {
        fn()
      })

      // 2.设置为纯色背景色
      // this.map.setBackgroundColor('#00ff00');   // 修改背景颜色   

      //   this.map.screenshot({
      //     download:true,  // 是否自动下载图片
      //     filename: 'screenshot.png',   // 下载图片名
      //     newTab:false,   // 是否自动打开新标签页
      //     width:1024,     // 截图宽度
      //     height:768,     // 截图高度
      // })

      // 第一步:新建一个文字标注图
      // var layer = new esmap.ESLayer(esmap.ESLayerType.TEXT_MARKER);

      // // 第二步:创建一个文字标注实例
      // var tm = new esmap.ESTextMarker({
      //     name:'标注文字',
      //     x: this.map.center.x,
      //     y: this.map.center.y,
      // });

      // var layer = new esmap.ESLayer(esmap.ESLayerType.IMAGE_MARKER);
      // var im = new esmap.ESImageMarker({
      //   x: this.map.center.x,
      //   y: this.map.center.y,
      //   url: './info.png',
      //   size: 64
      // });

      // 新建热力图实例
      var gradient = { 0.45: 'rgb(201,135,255)', 0.65: 'rgb(155,49,255)', 0.95: 'yellow', 1.0: 'rgb(157,53,255)' }
      this.heatmapInstance = esmap.ESHeatMap.create(this.map, {
        bid: building.id,    // *绑定到需要显示的建筑id*
        radius: 20,          // 热力点半径
        opacity: 0.5,        // 透明度
        max: 100,            // 热力点value的最大值
        maxSize: 2048,       // 热力图画布分辨率
        gradient: gradient,  // 自定义渐变色
        mapOpacity: 0.2,       // 设置三维场景楼层整体透明度
        backgroundColor: '#FFFFFF', // 热力图背景颜色，默认白色
      });

    });

    // 模型加载完成事件
    this.map.on('modelLoadedAll', () => {
      // 改变方块房子颜色,id,name二选择一，都可以是数组, fnum可选择
      // this.map.changeModelColor({
      //   id:[76767],
      //   // name:'千禧之星',
      //   // fnum:[1],
      //   color:'#00ff00'
      // }) 

      // 改3d模型颜色,id,name二选择一，都可以是数组, fnum可选择
      // this.map.change3dColor({
      //   id: [87471, 76767, 87420],
      //   // name:,
      //   // fnum:[1,2]
      //   color:'#00ff00'
      // })

      // 根据id寻找房间，并返回房间信息
      // 参数方法1: params可以是房间id
      // 参数方法2: 或者是一个对象，格式如下:
      // var params = {
      //     id: 76768,            // 必选
      //     // fnum: 1,         // 可选
      //     isSelect: true    // 是否高亮房间
      // }
      // var roomdata = this.map.findRoomById(params)
      // console.log('roomdata', roomdata)

      // 三维场景对象显示隐藏接口
      // this.map.change3dVisible({
      //   id: [76768],   // 三维场景对象id
      //   value: false,     // true显示,false隐藏
      // })
    });

    // 室内建筑加载完成事件
    this.map.on('buildingLoadComplete', () => {

    });

    // 地图点击事件
    this.map.on('mapClickNode', (e) => {
      console.log(e);

      // 记录并打印点集
      // self.tempCoords.push({ x: e.hitCoord.x, y: e.hitCoord.y, offset: 0 })
      // console.log(JSON.stringify(self.tempCoords));

      // 获取当前相机视角
      // console.log(self.map.cameraFlyToHelper())

      // 触发关于气泡生成的事件
      this.managerMapClick(e);
    })

  }

  /**
   * 销毁地图
   */
  destroyMap () {
    this.map.dumpScene();
    this.map = null;
  }

  /**
   * 是否显示loading
   */
  isShowLoading (isShow) {
    document.querySelector('.loading_shade').style.display = isShow ? 'block' : 'none'
  }

  /**
 * 搜索地图中的资源信息
 */
  searchRes (keyword) {
    return new Promise((resolve, reject) => {
      var conditions = {
        nodeType: esmap.ESNodeType.MODEL, //nodeType指定为房间模型
        keyword: keyword || ''
      }
      esmap.ESMapUtil.search(this.map, "all", conditions, function (e) {
        console.log("search:", e);
        resolve(e)
      })
    })
  }

  /**
  *  初始化多个气泡的内容数据
  */
  async initPopData () {
    // 根据已知房间名称搜索获取在地图上的位置信息等，以便生成气泡
    const list = await this.searchRes(this.showStoreList.join(' '))
    // 存储地图上房间模型信息的数组
    this.manyStoreList = Array.from(new Set(list))
  }

  /**
  *   管理地图点击
  */
  managerMapClick (e) {
    // 判断元素类型是否是房间模型，并且是否附带RoomLogo属性(RoomLogo属性存放着图片地址)
    if (e.nodeType === esmap.ESNodeType.MODEL && e.RoomLogo && window.location.hash == '#/showOnlyPop') {
      // 将元素传值给生成单个气泡标注方法
      this.showOnlyPop(e)
    }
  }

  /**
  *  生成单独气泡组件
  */
  showOnlyPop (popConfig) {
    // 存储点击元素的配置到onlyPopConfig响应式对象，生成单个气泡子组件
    this.onlyPopConfig.value = popConfig

    // 获取点击元素所处的楼层计算出高度
    const height = this.map.focusBuilding.getFloorHeight(popConfig.FloorNum)
    // 聚焦点击元素所在的位置
    this.map.cameraFlyTo({
      directionAngle: 20.16,    // 视角朝向的方向角
      pitchAngle: 90.85,        // 视角朝向的俯仰角
      radius: 100.4,            // 视角中心目标点至相机位置本身的距离
      time: 1.5,                // 视角移动飞行时间，单位（秒/s）
      x: popConfig.mapCoord.x,  // 聚焦点x轴
      y: popConfig.mapCoord.y,  // 聚焦点y轴
      z: height,                // 聚焦点高度
      callback: () => {         // 飞行动画结束后的回调函数
      }
    })

  }

  /**
  *  生成多个气泡组件
  */
  showManyPop () {
    // 执行固定飞行视角
    this.map.cameraFlyTo({
      "directionAngle": 358.7,// 视角朝向的方向角
      "pitchAngle": 52.6,     // 视角朝向的俯仰角
      "radius": 223.1,        // 视角中心目标点至相机位置本身的距离
      "x": 12683467.6,        // 聚焦点x轴
      "y": 2557900.5,         // 聚焦点y轴
      "z": 20,                // 聚焦点高度
      time: 1,                // 视角移动飞行时间，单位（秒/s）
      callback: () => {          // 飞行动画结束后的回调函数
        // 传入搜索出来的房间元素信息，生成多个气泡vue组件
        this.manyPopConfigs.value = this.manyStoreList
      }
    })
  }

  /**
  *  清空多个气泡组件
  */
  clearManyPop () {
    this.manyPopConfigs.value = []
  }

  /**
   * 修改场景配置选项
   */
  setSceneOption () {
    this.map.options['focusAlphaMode'] = false;
    this.map.options['modelSelectedEffect'] = true;
    this.map.openMapById(MAP_ID);
  }

  /**
  * 展示内嵌地图
  */
  toggleModelMap (isShow) {
    this.isShowModelMap = isShow
    this.mapContainer.showInnerMap({ id: '10005', isShow: isShow })
  }

  //监听地图加载后执行函数
  watchSuccess (fn) {
    if (this.successSign == true) {
      fn()
    } else {
      this.watchSuccessList.push(fn)
    }
  }


}

export default new MapApplication;