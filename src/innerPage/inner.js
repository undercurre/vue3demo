class MapApplication extends esmap.ESEventDispatcher {


    constructor() {
        super();
        //定义全局map变量
        this.map;
        this.mapId;
        this.floorControl;
        this.effectLayer = null;

        this.testMapId = '10005';

        this.dataPath = './data/'

        this.building = null;
        this.floors = {}
        this.modelLayers = {}
        this.textLayers = {}
        this.bimMarkers = {};

    }


    // 初始化地图
    initMap () {
        if (this.testMapId) this.mapId = this.testMapId;

        // 楼层控制控件配置参数
        this.map = new esmap.ESMap({
            mode: esmap.MapMode.Building, // 新版sdk需要配置地图模式
            visibleFloors: 'all',
            container: document.getElementById('inner-container'), // 渲染dom
            mapDataSrc: this.dataPath, //地图数据位置
            // mapThemeSrc: themePath, // 地图主题位置
            token: 'escope',
            focusAlphaMode: false,
            enableCollide: false,
            defaultScaleLevel: 20,
            perspective: true,
            // hideFloorBase: true,
            model3DSelectedEffect: false,
        });

        this.map.openMapById(this.mapId);

        //地图加载完成回调
        this.map.on('loadComplete', function () {
            // this.map.controls.minDistance = 1; // 修改最小缩放距离
            // 初始化楼层控制控件
            // floorControl = new esmap.ESScrollFloorsControl(map, ctlOpt)
        });

        // 特效初始化完成事件
        this.map.on('effectsInitComplete', function () {
            this.building = map.getBuildingById(map.id);
            for (let fn of this.building.floorNums) {
                this.floors[fn] = this.building.getFloor(fn);
                this.modelLayers[fn] = this.floors[fn].getOrCreateLayerByName('modelLayer_' + fn, esmap.ESLayerType.MODEL3D);
                this.textLayers[fn] = this.floors[fn].getOrCreateLayerByName('textLayer_' + fn, esmap.ESLayerType.TEXT_MARKER);
            }
        })

        // 地图点击事件
        this.map.on('mapClickNode', function (obj, event) {
            console.log(obj);
        });

        // 模型加载完成事件
        this.map.on('modelLoadComplete', function (e) {

        })

        // 模型全部加载完成事件
        this.map.on('modelLoadedAll', function (obj) {

        })

        // 初始化场景特效
        esmap.ESEffectTool.init({
            // effectThemeSrc: './data/effects', // 特效包位置
            // effectThemeId: 'E106', // 应用特效主题名称
            // loadRoads: false, // 是否加载路网
            // isSetRoomEffect: true, // 是否开启房间特效
            // isSetModelEffect: true, // 是否应用模型特效
            isShowSkybox: false, // 是否展示天空盒
            // isShowShadow: false, // 是否使用场景阴影
            // isOpenScreenEffect: true, // 是否开启全屏特效
            // effectQuality: 'high', // 特效画质
        });
    }
}

export default new MapApplication;
