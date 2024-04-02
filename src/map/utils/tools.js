/**
 *  地图常用工具方法示例
 */

// 文件加载工具
function loadFile(filePath) {
    return new Promise((resolve, reject) => {
        var loader = new esmap.ESFileLoader();
        loader.load(
            // 资源的URL
            filePath,
            // onLoad回调
            function (data) {
                resolve(data);
            },
            null,
            // onError回调
            function (err) {
                reject(err);
            }
        );
    })
}
// 地图墨卡托坐标转经纬度坐标
function mercator2lonLat(mercatorX, mercatorY) {
    var xy = [];
    var x = mercatorX / 20037508.342789 * 180;
    var y = mercatorY / 20037508.342789 * 180;
    y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
    xy.push(x);
    xy.push(y);
    return xy;
}


// 经纬度坐标转地图墨卡托坐标
function lonLat2Mercator(lon, lat) {
    var xy = []
    var x = (lon * 20037508.342789) / 180
    var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180)
    y = (y * 20037508.34789) / 180
    xy.push(x)
    xy.push(y)
    return xy
}

// 经纬度浮点数转换度数表达
function formatDegree(value) {
    if (value != null && value != '') {
        value = Math.abs(value);
        var v1 = Math.floor(value);//度
        var v2 = Math.floor((value - v1) * 60);//分
        var v3 = Math.round((value - v1) * 3600 % 60);//秒
        return [v1, v2, v3];
    }
}

// 计算两点距离
function getDistance(p1, p2) {
    if (p1 == undefined || p2 == undefined) return;
    return Math.abs(Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)))
}

export {
    loadFile,
    mercator2lonLat,
    lonLat2Mercator,
    formatDegree,
    getDistance
}