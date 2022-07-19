import AMap from 'AMap'
import AMapUI from 'AMapUI'
export default {
  props: {},
  data () {
    return {
      map: null, // 地图实例
      PathSimplifier: null, // 轨迹
      mouseTool: null, // 鼠标工具
      geocoder: null // 地理位置编码
    }
  },
  methods: {
    initUI () {
      return new Promise(resolve => {
        AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
          if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
          }
          this.PathSimplifier = PathSimplifier
          resolve()
        });
      })
    },
    loadPath () {
      var pathSimplifierIns = new this.PathSimplifier({
        zIndex: 100,
        //autoSetFitView:false,
        map: this.map, //所属的地图实例

        getPath: function (pathData) {

          return pathData.path;
        },
        getHoverTitle: function (pathData, pointIndex) {

          if (pointIndex >= 0) {
            //point
            return pathData.name + '，点：' + (pointIndex + 1) + '/' + pathData.path.length;
          }

          return pathData.name + '，点数量' + pathData.path.length;
        },
        renderOptions: {

          renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
        }
      });

      //设置数据
      pathSimplifierIns.setData([
        {
          name: '路线',
          path: [
            [111.826403, 42.224702],
            [114.19945, 38.337615],
            [113.759996, 37.015984],
            [113.759996, 35.384849],
            [109.804918, 32.91216],
            [119.297106, 29.912386]
          ]
        }]);

      //对第一条线路（即索引 0）创建一个巡航器
      var navg1 = pathSimplifierIns.createPathNavigator(0, {
        loop: true, //循环播放
        speed: 1000000 //巡航速度，单位千米/小时
      });

      navg1.start();
    },
    // 地图初始化
    initMap (id, center) {
      return new Promise((resolve) => {
        if (!this.map) {
          this.map = new AMap.Map(id || 'map', {
            mapStyle: 'amap://styles/f8b6b55602b602661304feb23ed42ec0',
            // zoom: 16,
            expandZoomRange: true,
            resizeEnable: true,
            center,
            rotateEnable: true,
            viewMode: '3D',
            pitchEnable: true,
            // layers: [new AMap.TileLayer.Satellite()],
            zooms: [3, 20]
          })
          // this.initUI().then(() => this.loadPath())
          this.$once('hook:beforeDestroy', () => {
            this.map && this.map.destroy()
            this.map = null
          })
          this.setPlugins()
          this.map.on('complete', resolve)
        } else {
          resolve()
        }
      })
    },
    // 设置中心点
    setCenter (center = [], zoom) {
      // var z = zoom || this.map.getZoom()
      zoom ? this.map.setZoomAndCenter(zoom, center) : this.map.setCenter(center)
    },
    setZoom (zoom) {
      this.map.setZoom(zoom)
    },
    // 设置城市
    setCity (val = '') {
      val && this.map.setCity(val)
    },
    // 地图自适应
    setFitView ({ polygon = [], immediately = true, avoid = [0, 0, 0, 0], maxZoom = 12 }) {
      return new Promise(resolve => {
        this.map.setFitView(polygon, immediately, avoid, maxZoom)
        resolve()
      })
    },
    //  获取行政区边界坐标点
    getCoordinates (val = '', opt = { level: '', extensions: 'all' }) {
      return new Promise((resolve, reject) => {
        if (val) {
          var opts = {
            subdistrict: 1,   //返回下一级行政区
            showbiz: true,  //最后一级返回街道信息
            ...opt
          }
          let district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
          //行政区划查询
          district.search(val, (status, result) => {
            if (status == 'complete') {
              resolve(result)
            } else {
              reject(result)
            }
          })
        } else {
          reject()
        }
      })
    },
    // 绘制图层覆盖物
    setLayers (data, style) {
      return new Promise((resolve) => {
        var bounds = data.boundaries
        if (bounds) {
          bounds = bounds.map(item => {
            return new AMap.Polygon({
              path: item,
              ...style
            })
          })
          this.map.add(bounds)
          // this.setFitView({ polygon: bounds })
          resolve(bounds)
        }
      })
    },
    // 清除地图指定覆盖物/不传则清除地图全部覆盖物
    clearPolygons (polygons = []) {
      return new Promise(resolve => {
        if (polygons.length > 0) {
          this.map.remove(polygons)
        } else {
          this.map.clearMap()
        }
        resolve()
      })
    },
    // 绘制多边形覆盖物
    addArea (polygons) {
      return new Promise(resolve => {
        const area = new AMap.Polygon({ ...polygons })
        this.map.add(area)
        resolve(area)
        // isFitView && this.setFitView({ polygon: polygons, maxZoom: 18 })
      })
    },
    // 创建点标记
    addMarker (polygon) {
      return new Promise((resolve, reject) => {
        try {
          const marker = new AMap.Marker({ ...polygon })
          this.map.add(marker)
          resolve(marker)
        } catch (error) {
          reject(error)
        }
      })
    },
    // 初始化的时候异步加载插件
    setPlugins () {
      AMap.plugin(['AMap.ControlBar', 'AMap.DistrictSearch', 'AMap.MouseTool', "AMap.Geocoder"], () => {//异步加载插件
        var controlBar = new AMap.ControlBar({ position: { bottom: '-20px', right: '20px' }, showControlButton: false })
        this.map.addControl(controlBar)
        this.geocoder = new AMap.Geocoder()
        this.initMouseTool()
      })
    },
    // 是否限制地图显示范围
    setLimitBounds (switchs = true) {
      if (switchs) {
        const paths = this.map.getBounds()
        // const number = 0.5
        // paths.southwest.Q += number
        // paths.southwest.R += number
        // paths.southwest.lat += number
        // paths.southwest.lng += number

        // paths.northeast.Q += number
        // paths.northeast.R += number
        // paths.northeast.lat += number
        // paths.northeast.lng += number
        // console.log(paths);
        this.map.setLimitBounds(paths)
      } else {
        this.map.clearLimitBounds()
      }
    },
    initMouseTool () {
      this.mouseTool = new AMap.MouseTool(this.map)
      // this.mouseTool.rectangle({
      //   strokeColor: 'red',
      //   strokeOpacity: 0.5,
      //   strokeWeight: 6,
      //   fillColor: 'blue',
      //   fillOpacity: 0.5,
      //   // strokeStyle还支持 solid
      //   strokeStyle: 'solid',
      //   // strokeDasharray: [30,10],
      // })
      // this.mouseTool.on('draw', function (e) {
      //   // event.obj 为绘制出来的覆盖物对象
      //   console.log(e);
      // })
    },
    getAddress (center) {
      return new Promise(resolve => {
        this.geocoder.getAddress(center, (status, result) => {
          if (status === 'complete' && result.regeocode) {
            resolve(result)
          }
        })
      })
    }
  }
}
