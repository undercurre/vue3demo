/**
 * ESMap地图通用工具方法示例
 * City模式则各个方法中需要提供bid（地图ID）
 */
const CommonTools = {
    /**
   * 创建图片标注
   * @param {object} params - 参数配置
   * @param {string} params.id - 标注ID
   * @param {string} params.name - 标注name
   * @param {string} params.bid - 地图bid
   * @param {number} params.x - 墨卡托坐标x
   * @param {number} params.y - 墨卡托坐标y
   * @param {string} params.url - 图片地址
   * @param {(number|object)} params.size - 图片大小 或者 size:{w:32,h:64}
   * @param {boolean} params.spritify - 跟随地图缩放变化大小，默认为true，可选参数
   * @param {number} params.offsetHeight - 离地板高度
   * @param {number} params.showLevel - 显示等级
   * @param {boolean} params.isGlow - 是否开启闪烁
   * @param {string} params.glowColor - 发光颜色
   * @param {boolean} params.seeThrough - 是否开启穿透
   * @param {function} params.callback 回调返回标注对象
   */
    addImageMarker: function (params) {
        return new esmap.ESImageMarker({
            bid: params.bid,
            x: params.x,
            y: params.y,
            url: params.url,
            size: params.size,
            spritify: true,
            height: params.offsetHeight,
            showLevel: params.showLevel,
            id: params.id,
            name: params.name,
            glow: params.isGlow,
            center: params.center,
            glowColor: params.glowColor,
            seeThrough: params.seeThrough,
            callback: function (e) {
                params.callback ? params.callback(e) : null
            },
        })
    },
    /**
   * 创建文字标注
   * @param {object} params - 参数配置
   * @param {string} params.id - 标注ID
   * @param {string} params.name - 标注name
   * @param {string} params.bid - 地图bid
   * @param {number} params.x - 墨卡托坐标x
   * @param {number} params.y - 墨卡托坐标y
   * @param {string} params.text - 文本内容
   * @param {(number|object)} params.size - 图片大小 或者 size:{w:32,h:64}
   * @param {number} params.offsetHeight - 离地板高度
   * @param {number} params.showLevel - 显示等级
   * @param {string} params.image - 是否绑定图标
   * @param {string} params.imageAlign - 图标布局
   * @param {string} params.imageSize - 图标大小
   * @param {boolean} params.seeThrough - 是否开启穿透
   * @param {function} params.callback 回调返回标注对象
   */
    addTextMarker: function (params) {
        return new esmap.ESTextMarker({
            bid: params.bid,
            id: params.id,
            x: params.x,
            y: params.y,
            name: params.text,
            size: params.size,
            height: params.offsetHeight,
            showLevel: params.showLevel,
            image: params.image,
            imageAlign: params.imageAlign,
            imageSize: params.imageSize,
            seeThrough: params.seeThrough,
            callback: function (e) {
                params.callback ? params.callback() : null
            },
        })
    },
    /**
   * 创建气泡标注
   * @param {object} params - 参数配置
   * @param {string} params.bid - 地图bid
   * @param {number} params.fnum - 地图楼层
   * @param {number} params.x - 墨卡托坐标x
   * @param {number} params.y - 墨卡托坐标y
   * @param {number} params.offset - 离楼层地板高度
   * @param {string} params.html - 气泡内容自定义HTML模板
   * @param {string} params.className - 气泡内部容器class样式
   * @param {function} params.callback 气泡创建完成后回调返回内部dom对象
   */
    addPopMarker: function (params) {
        return new esmap.ESPopMarker({
            mapCoord: {
                x: params.x,
                y: params.y,
                height: params.offset,
                fnum: params.fnum || 1,
            },
            bid: params.bid,
            content: params.html,
            className: params.className,
            showLevel: params.showLevel,
            updateSize: params.updateSize,
            created: function (dom) {
                params.callback ? params.callback(dom) : null
            },
        })
    }
}

export default CommonTools
