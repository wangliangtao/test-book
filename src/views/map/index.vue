<template>
  <div class="dataScreen-wrap">
    <!-- 左侧边栏统计 start -->
    <transition
      enter-active-class="animate__bounceInLeft"
      leave-active-class="animate__bounceOutLeft"
      mode="out-in"
    >
      <div
        v-if="showLeft"
        class="LeftIndex animate__animated"
      >
        <LeftIndex
          @close="showLeft = false"
          @editMapData="editMapData"
        />
      </div>
    </transition>
    <!-- 左侧边栏统计 end -->
    <div class="map-wrap">
      <!-- <div class="switchMouse">
        <el-switch
          v-model="switchMouse"
          active-text="开启鼠标缩放"
          inactive-text="关闭鼠标缩放"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="switchMouseArea"
        />
        <br>
        <br>
        <br>
        <el-switch
          v-if="switchMouse"
          v-model="zoomIn"
          active-text="放大"
          inactive-text="缩小"
          @change="changeZoom"
        />
      </div> -->

      <div
        id="map"
        class="maps"
      />
      <!-- 筛选/操作 start -->
      <mapHeader
        ref="mapHeader"
        @showDetailDialog="showDetailDialog"
        @showPicture="showPicture"
        @hideSearchInArea="hideSearchInArea"
      />
      <operation class="operation" />
      <!-- 筛选/操作 end -->
      <!-- 右下角统计 start -->
      <transition
        enter-active-class="animate__bounceInRight"
        leave-active-class="animate__bounceOutRight"
      >
        <div
          v-if="isTotalQuantity"
          class="animate__animated"
        >
          <TotalQuantity class="totalQuantity" />
        </div>
      </transition>

      <!-- 右下角统计 end -->
      <!-- 左右侧边栏统计开关 start -->
      <div
        v-show="!showLeft"
        class="leftSide side"
        @click="showLeft = true"
      />
      <div
        v-show="!showRight"
        class="rightSide side"
        @click="showRight = true"
      />
      <!-- 左右侧边栏统计开关 end -->
      <!-- 停车场详情 start -->
      <transition
        enter-active-class="animate__fadeInLeft"
        leave-active-class="animate__fadeOutLeft"
      >
        <div
          v-if="isDetailDialog"
          class="detailDialog animate__animated"
        >
          <div class="detail-mask" />
          <div class="detail-wrap">
            <mapDetailsView @close="closeDetailDialog" />
          </div>
        </div>
      </transition>
      <!-- 停车场详情 end -->
      <transition
        enter-active-class="animate__fadeInUp"
        leave-active-class="animate__fadeOutUp"
      >
        <div
          v-show="showSearch"
          class="searchInArea animate__animated"
          @click="searchInArea"
        >
          检索 <span>{{ homeCenter.city || homeCenter.province }}</span> 停车场
        </div>
      </transition>
      <div
        v-if="locaLayerDetails.show"
        class="scale-wrap"
      >
        <div
          class="title"
          v-html="locaLayerDetails.title"
        />
        <div class="scale">
          <span
            v-for="(item,index,key) in locaLayerDetails.scale.length"
            :key="key"
            :style="`background-color:${locaLayerDetails.colors[index]}`"
          />
        </div>
        <div class="number-wrap">
          {{ locaLayerDetails.min }}
          <div :class="['number-content', locaLayerDetails.align]">
            <div
              v-for="(item,key) in locaLayerDetails.scale"
              :key="key"
            >
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧边栏统计 start -->
    <transition
      enter-active-class="animate__bounceInRight"
      leave-active-class="animate__bounceOutRight"
    >
      <div
        v-if="showRight"
        class="RightIndex animate__animated"
      >
        <RightIndex
          @close="showRight = false"
          @editMapData="editMapData"
        />
      </div>
    </transition>
    <!-- 右侧边栏统计 end -->
    <!-- 侧边栏统计编辑界面 start -->
    <transition
      enter-active-class="animate__fadeInLeft"
      leave-active-class="animate__fadeOutLeft"
    >
      <MapDataEditComponent
        v-if="showEditMapData"
        class="animate__animated"
        :type="editMapDataDirection"
        @close="showEditMapData = false"
      />
    </transition>
    <!-- 侧边栏统计编辑界面 end -->
    <!-- 侧边栏统计图导出 start -->
    <transition
      enter-active-class="animate__fadeInLeft"
      leave-active-class="animate__fadeOutLeft"
    >
      <div
        v-if="sidebarDownloadData.show"
        class="detailDialog animate__animated"
      >
        <div class="detail-mask" />
        <div class="detail-wrap">
          <MapSidebarDownload />
        </div>
      </div>
    </transition>
    <!-- 侧边栏统计图导出 end -->
  </div>
</template>

<script type="text/ecmascript-6">
import AMap from 'AMap'
import Loca from 'Loca'
import { mapState } from 'vuex'
import mapMixin from './mapMixin'
import mapHeader from './components/map-header'
import operation from './components/operation'
import TotalQuantity from './components/totalQuantity'
import LeftIndex from './DataComponents/Left-index'
import RightIndex from './DataComponents/Right-index'
import MapDataEditComponent from './DataComponents/MapDataEditComponent'
import { getLable } from '@/utils/function'
import { parkinglotTypesOptions } from '@/utils/lookup'
import { postResourceList, postParkingDeviceDetail } from '@/api/parking'
import { postHeatMap, postYesterdayPSIndexHeatMap, postSlotsHeatMap, postParkingFlowHeatMap, postParkingTimeHeatMap } from '@/api/report'
import MapDetailsView from '@/views/mapDetailsView'
import MapSidebarDownload from '@/views/mapSidebarDownload'
import { parkImg, areaStyle, deviceImg, areaColors } from './mapIconStyles'
import mapBus from './mapBus'
// https://lbs.amap.com/api/javascript-api/reference/core api 地址
export default {
  components: {
    mapHeader,
    operation,
    MapDetailsView,
    LeftIndex,
    RightIndex,
    TotalQuantity,
    MapDataEditComponent,
    MapSidebarDownload
  },
  mixins: [mapMixin],
  data () {
    return {
      parkinglotTypesOptions,
      showLeft: false, // 左侧侧边栏
      showRight: false, // 右侧侧边栏
      zoomIn: true,
      showSearch: false, // 显示 检索此区域停车场 按钮
      switchMouse: false,
      showEditMapData: false, // 显示地图侧边栏统计编辑模板
      editMapDataDirection: '', // 统计编辑模板方向
      parkingIcon: [], // 停车场中心点覆盖物数据
      deviceGates: [], // 闸机覆盖物数据
      deviceMonitors: [], // 监控覆盖物数据
      deviceGuides: [], // 诱导屏覆盖物数据
      searchIcons: [], // 当前下拉搜索资源结果覆盖物数据
      curIcon: null, // 选中的覆盖物数据
      layersData: [], // 区域图层
      checkedDeviceData: {}, // 当前选中设备数据
      isDetailDialog: false, // 详情弹窗
      inAreaDataMarkers: {
        indexs: [], // 记录查询的数据
        inParkingArea: [], // 当前区域的停车场范围覆盖物数据
        inDeviceGates: [], // 当前区域的停车场闸机覆盖物数据
        inDeviceMonitors: [], // 当前区域的停车场监控覆盖物数据
        inDeviceGuides: [] // 当前区域的停车场诱导屏覆盖物数据
      },
      homeCenter: {}, // 当前区域中心点所在地
      locaLayers: null, // 地图数据可视化图层对象
      locaLayerDetails: { // 热力图数据及比例尺相关数据
        show: false,
        min: 0,
        title: '',
        scale: [],
        data: [],
        align: '' // 居中 center 居右 right
      }
    }
  },
  computed: {
    ...mapState('mapDetails', {
      mapSearch: state => state.mapSearch,
      mapSearchData: state => state.mapSearchData,
      mapCurData: state => state.mapCurData,
      sidebarDownloadData: state => state.sidebarDownloadData,
      isTotalQuantity: state => state.isTotalQuantity
    })
  },
  mounted () {
    this.initBus_Event()
    this.initEvent_Data()
  },
  methods: {
    // 注册 bus 事件
    initBus_Event () {
      // 清空地图数据可视化图层
      mapBus.$on('clearMapLoca', () => this.clearMapLoca())
      // 绘制地图数据可视化图层
      mapBus.$on('renderMapLoca', data => this.switchMapLoca(data))
      // 区域设备查询查询
      mapBus.$on('mapSearch', () => this.initEvent_Data())
      // 资源查询结果
      mapBus.$on('mapSearchData', () => {
        // 清空之前的搜索结果
        this.clearMapSearchData()
        const list = this.mapSearchData.resultData || []
        list.forEach((item, index) => {
          this.initSearchDataMarker(item, index, 'highlight').then(res => this.searchIcons.push(res))
        })
      })
      // 清空资源查询结果
      mapBus.$on('clearMapSearchData', this.clearMapSearchData)
      // 资源查询列表点击，选中匹配停车场覆盖物
      mapBus.$on('clickMapSearchData', () => this.clickMarker(null))
      // 清除选中的匹配停车场覆盖物
      mapBus.$on('clearCurIcon', this.clearCurIcon)
      // 移入移出资源查询列表
      mapBus.$on('inOutMapSearchData', (inOut, index) => this.switchSearchIcons(null, inOut, index))
    },
    // 初始化地图数据
    initEvent_Data () {
      // 清除侧边栏选中样式
      mapBus.$emit('changeMapCheck')
      this.initMap()
        .then(() => {
          this.map.on('zoomend', this.mapZoomchange)
          this.map.on('dragend', this.mapdragend)
          this.clearData(true)
          if (this.mapSearch.city === '南通市' && this.mapSearch.l3Region === '经济开发区') {
            this.initRegionArea('崇川区').then(() => this.initMapsData())
          } else {
            this.initRegionArea(this.mapSearch.l3Region || this.mapSearch.city || this.mapSearch.province)
              .then(() => this.initMapsData())
          }
        })
    },
    // 获取周转率热力图数据
    postHeatMap (params = {}) {
      // this.clearMapLoca()
      postHeatMap(params).then(res => {
        const data = res.body || {}
        const diffAverage = ((data.up - data.down) / 5)
        const scale = []
        let layerOptions = {}
        const color = ['#4588E6', '#99EEFF', '#FFFFB3', '#FFEA80', '#E62517']
        for (let i = 1; i < 6; i++) {
          const val = (data.down + diffAverage * i).toFixed(1)
          scale.push(val)
          const tag = ((1 / color.length) * i).toFixed(1)
          layerOptions[tag] = color[i - 1]
        }
        this.locaLayerDetails = {
          show: false,
          min: data.down || 0,
          max: data.up || 0,
          scale: scale,
          colors: color,
          layerOptions: layerOptions,
          align: 'right',
          data: data.details.map(item => {
            return {
              lnglat: [item.lng, item.lat],
              value: item.turnoverRate
            }
          }),
          ...params
        }
        // this.locaLayerDetails.title = `<span>${params.l3Region ? params.l3Region + '各镇、街道' : params.city + '各区'}</span> 停车周转率<span>【${params.xname}】</span>`
        this.locaLayerDetails.title = `停车周转率<span>【${params.xname}】</span>`
        this.$nextTick(() => this.initHeatmapLayer())
      })
    },
    // 获取时段性分析热力图数据
    postYesterdayPSIndexHeatMap (params = {}) {
      // this.clearMapLoca()
      postYesterdayPSIndexHeatMap(params).then(res => {
        const data = res.body || []
        const scale = ['空闲', '一般', '拥挤', '爆满']
        let layerOptions = {}
        const color = ['#4588E6', '#99EEFF', '#FFFFB3', '#E62517']
        for (let i = 1; i < 5; i++) {
          const tag = ((1 / color.length) * i).toFixed(1)
          layerOptions[tag] = color[i - 1]
        }
        this.locaLayerDetails = {
          show: false,
          min: data.down,
          max: data.up,
          scale: scale,
          colors: color,
          layerOptions: layerOptions,
          align: 'center',
          data: data.map(item => {
            return {
              lnglat: [item.lng, item.lat],
              value: item.psRate * 1000
            }
          }),
          ...params
        }
        // this.locaLayerDetails.title = `<span>${params.l3Region ? params.l3Region + '各镇、街道' : params.city + '各区'}</span>停车场停车指数分布<span>【${params.time}】</span>`
        this.locaLayerDetails.title = `停车场停车指数分布<span>【${params.time}】</span>`
        this.$nextTick(() => this.initHeatmapLayer())
      })
    },
    // 泊位使用的热力图
    postSlotsHeatMap (params = {}) {
      // this.clearMapLoca()
      postSlotsHeatMap(params).then(res => {
        const data = res.body || {}
        const scale = ['20%', '40%', '60%', '80%', '100%']
        let layerOptions = {}
        const color = ['#4588E6', '#99EEFF', '#FFFFB3', '#FFEA80', '#E62517']
        for (let i = 1; i < 6; i++) {
          const tag = 0.2 * i
          layerOptions[tag] = color[i - 1]
        }
        this.locaLayerDetails = {
          show: false,
          min: data.down || 0,
          max: data.up || 0,
          scale: scale,
          colors: color,
          layerOptions: layerOptions,
          align: 'right',
          data: data.map(item => {
            return {
              lnglat: [item.lng, item.lat],
              value: item.slotsUse
            }
          }),
          ...params
        }
        this.locaLayerDetails.title = `
          ${params.l3Region ? `<span class="fw">` + params.l3Region + `</span>` + '各镇、街道' : `<span class="fw">` + params.city + `</span>` + '各区'}
          <span class="fw">【${params.resourceType.length === 0 ? '全部停车场' : getLable(params.resourceType[0], parkinglotTypesOptions)}】</span>泊位使用率`
        this.$nextTick(() => this.initHeatmapLayer())
      })
    },
    // 绘制热力图
    initHeatmapLayer () {
      this.locaLayers = new Loca.HeatmapLayer({
        map: this.map,
        fitView: true,
        eventSupport: true,
        // zIndex: 100
      });
      this.locaLayers.setData(this.locaLayerDetails.data, {
        lnglat: 'lnglat',
        value: 'value',
      });
      this.locaLayers.setOptions({
        style: {
          radius: 32,
          opacity: [0, 1],
          color: this.locaLayerDetails.layerOptions
        }
      });
      this.locaLayers.render();
      this.locaLayerDetails.show = true
    },
    // 获取并绘制停车场数量气泡图
    postResourceBubble () {
      this.clearMapLoca()
    },
    // 停车流量网格图（近24小时）
    postParkingFlowHeatMap (params = {}) {
      // this.clearMapLoca()
      postParkingFlowHeatMap(params).then(res => {
        const data = res.body || {}
        const diffAverage = ((data.up - data.down) / 5)
        const scale = []
        const color = params.flowType === 'inCount' ? ['#A6CBFF', '#80B5FF', '#599EFF', '#3388FF', '#0D72FF'] : ['#A1E6B8', '#6CD990', '#2BD964', '#00BF3F', '#009932']
        for (let i = 1; i < 6; i++) {
          const val = (data.down + diffAverage * i).toFixed(1)
          scale.push(val)
        }
        this.locaLayerDetails = {
          show: false,
          min: data.down || 0,
          max: data.up || 0,
          scale: scale,
          colors: color,
          align: 'right',
          data: data.details.map(item => {
            return {
              lnglat: [item.lng, item.lat],
              value: item.count
            }
          }),
          ...params
        }
        this.locaLayerDetails.title = `<span class="fw">${params.l3Region || params.city}</span><span class="fw">【${params.str}】</span>停车流量分布`
        this.$nextTick(() => this.initGridLayer())
      })
    },
    // 停车时长网格图
    postParkingTimeHeatMap (params = {}) {
      // this.clearMapLoca()
      postParkingTimeHeatMap(params).then(res => {
        const data = res.body || {}
        const diffAverage = ((data.up - data.down) / 5)
        const scale = []
        const color = ['#A1E6B8', '#6CD990', '#2BD964', '#00BF3F', '#009932']
        for (let i = 1; i < 6; i++) {
          const val = (data.down + diffAverage * i).toFixed(1)
          scale.push(val)
        }
        this.locaLayerDetails = {
          show: false,
          min: data.down || 0,
          max: data.up || 0,
          scale: scale,
          colors: color,
          align: 'right',
          data: data.details.map(item => {
            return {
              lnglat: [item.lng, item.lat],
              value: item.count
            }
          }),
          ...params
        }
        this.locaLayerDetails.title = `<span class="fw">${params.l3Region || params.city} </span> 停车流量分布<span class="fw">【${params.parkingTime || '全部区间'}】</span>`
        this.$nextTick(() => this.initGridLayer())
      })
    },
    // 绘制网格图
    initGridLayer () {
      this.locaLayers = new Loca.GridLayer({
        map: this.map,
        fitView: true,
        eventSupport: true,
        // zIndex: 100
      });
      this.locaLayers.setData(this.locaLayerDetails.data, {
        lnglat: 'lnglat',
        value: 'value',
      });
      this.locaLayers.setOptions({
        unit: 'px',
        mode: 'sum',
        style: {
          color: this.locaLayerDetails.colors,
          radius: 20,
          opacity: 0.9,
          gap: 2,
          height: [0, 0],
          text: {
            content: v => v.value.sum,
            direction: 'center',  // 文字方位
            offset: [0, -3],  // 偏移大小
            fontSize: 12,  // 文字大小
            fontWeight: 'bold',
            fillColor: '#fff',
            strokeColor: 'rgba(255,255,255,0)',  // 文字描边颜色
            strokeWidth: 0,  // 文字描边宽度
          }
        }
      })
      this.locaLayers.render();
      this.locaLayerDetails.show = true
    },
    // 侧边栏点击跳转停车场详情
    clickDataSidebar (params) {
      this.clearCurIcon().then(() => {
        let d = null
        d = params
        this.$store.dispatch('mapDetails/changeMapSearchData', { show: true, isOpen: true })
        this.$refs.mapHeader.resourceName = d.parkingName
        this.$refs.mapHeader.to({ activeName: 'parkDetail' })
        this.$store.dispatch('mapDetails/changeMapCurData', d)
        const style = d.status === 1 ? 'normal' : 'abnormal'
        const markerIcon = parkImg[d.parkingType][style].checked
        // 绘制坐标点
        const center = {
          anchor: 'center',
          position: Object.values(d.centerPosition),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          extData: { ...d },
          icon: new AMap.Icon({
            size: new AMap.Size(34, 47),
            image: markerIcon,
            imageSize: new AMap.Size(34, 47)
          }),
          zIndex: 9999,
          label: {
            content: `<div class="mapLabel ${style}"><div class="name">${d.parkingName}</div><div class="type">${getLable(d.parkingType, parkinglotTypesOptions)}</div></div>`,
            offset: new AMap.Pixel(0, -66),
            direction: 'center'
          }
        }
        this.addMarker(center).then(res => {
          this.curIcon = res
          this.showPicture()
        })
        this.lightArea(d.parkingSn)
        // 查询数据覆盖物图标改为默认样式

      })
    },
    // 地图数据初始化
    initMapsData () {
      // this.clearData(true)
      const params = {
        ...this.mapSearch,
        resourceName: '',
        resourceType: [...this.mapSearch.parking, ...this.mapSearch.device],
        pageSize: 99999,
        pageNo: 1
      }
      postResourceList(params).then(res => {
        const { parkingList, deviceMonitors, deviceGuides, deviceGates } = res.body || { parkingList: [], deviceMonitors: [], deviceGuides: [], deviceGates: [] }
        parkingList.forEach((item, index) => {
          this.initMarker(item, this.parkingIcon.length + index + 101).then(res => this.parkingIcon.push(res))
        })
        deviceGates.forEach((item, index) => {
          this.initDeviceMarker(item, index).then(res => this.deviceGates.push(res))
        })
        deviceMonitors.forEach((item, index) => {
          this.initDeviceMarker(item, index).then(res => this.deviceMonitors.push(res))
        })
        deviceGuides.forEach((item, index) => {
          this.initDeviceMarker(item, index).then(res => this.deviceGuides.push(res))
        })
        this.setZoom(12)
      })
    },
    // 获取 17 级时视图中的停车场详情
    getParksData () {
      this.clearInAreaMarkers()
      const zoom = this.map.getZoom()
      if (zoom < 17) return
      const parkingSNLists = []
      const inArea = this.inAreaDataMarkers
      this.parkingIcon.forEach((item, markerIndex) => {
        const location = item.getPosition()
        if (this.isInLocation(location)) {
          const parkingSn = item.getExtData().parkingSn
          parkingSNLists.push(parkingSn)
          inArea.indexs.push(markerIndex)
        }
      })
      if (parkingSNLists.length === 0) return
      postParkingDeviceDetail({ parkingSNList: parkingSNLists }).then(res => {
        const { parking, deviceGates, deviceGuides, deviceMonitors } = res.body || {}
        parking.forEach((item, index) => {
          this.initArea(item, index).then(res => inArea.inParkingArea.push(res))
        })
        deviceGates.forEach((item, index) => {
          this.initDeviceMarker(item, index).then(res => inArea.inDeviceGates.push(res))
        })
        deviceMonitors.forEach((item, index) => {
          this.initDeviceMarker(item, index).then(res => inArea.inDeviceMonitors.push(res))
        })
        deviceGuides.forEach((item, index) => {
          this.initDeviceMarker(item, index).then(res => inArea.inDeviceGuides.push(res))
        })
      })
    },
    // 停车场数据相关事件 start
    // 创建停车场坐标点
    initMarker (data, index, defaultIcon = '') {
      const style = data.status === 1 ? 'normal' : 'abnormal'
      const markerIcon = parkImg[data.parkingType][style][defaultIcon || 'default']
      // 绘制坐标点
      const center = {
        anchor: 'center',
        position: Object.values(data.centerPosition),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        extData: { ...data, index: index, search: !!defaultIcon },
        icon: new AMap.Icon({
          size: new AMap.Size(24, 33),
          image: markerIcon,
          imageSize: new AMap.Size(24, 33)
        }),
        zIndex: index
      }
      return this.addMarker(center).then(res => {
        res.on('click', this.clickMarker)
        res.on('mouseover', this.mouseoverMarker)
        res.on('mouseout', this.mouseoutMarker)
        return res
      })
    },
    // 创建停车场区域坐标点
    initArea (data, index, isFitView = false) {
      // 绘制图形覆盖物
      const style = data.status === 1 ? 'normal' : 'abnormal'
      const path = {
        ...areaStyle[style].default,
        path: data.parkAreaLocation.map(r => [r.lon, r.lat]),
        extData: { ...data, index }
      }
      return this.addArea(path, isFitView).then(res => {
        res.on('mouseover', this.mouseoverArea)
        res.on('mouseout', this.mouseoutArea)
        res.on('click', e => {
          this.position = [e.lnglat.lng, e.lnglat.lat]
          this.clickMarker(e)
        })
        return res
      })
    },
    mouseoverMarker (e) {
      // 进入标记点
      this.switchMarkerLight(e.target, true)
    },
    mouseoutMarker (e) {
      // 移出标记点
      this.switchMarkerLight(e.target, false)
    },
    mouseoverArea (e) {
      // 进入图形覆盖物
      this.switchAreaLight(e.target, true)
    },
    mouseoutArea (e) {
      // 移出图形覆盖物
      this.switchAreaLight(e.target, false)
    },
    switchHighlight (data = {}) {
      // 点击坐标点取消其他覆盖物高亮
      this.parkingIcon.forEach(item => {
        const d = item.getExtData()
        const style = d.status === 1 ? 'normal' : 'abnormal'
        const markerIcon = parkImg[d.parkingType][style][d.parkingSn !== data.parkingSn ? 'default' : 'checked']
        const size = d.parkingSn !== data.parkingSn ? [24, 33] : [34, 46]
        item.setIcon(
          new AMap.Icon({
            size: new AMap.Size(...size),
            image: markerIcon,
            imageSize: new AMap.Size(...size)
          })
        )
        item.setzIndex(11)
        // this.lightArea(data.parkingSn)
      })
    },
    // 切换区域高亮
    switchAreaLight (e, isHighlight = false) {
      const data = e.getExtData()
      // this.$store.dispatch('mapDetails/changeMapSearchData', {cacheData: isHighlight ? data : {}})
      // const status = data.status === 1 ? 'normal' : 'abnormal'
      // const style = areaStyle[status][isHighlight ? 'checked' : 'default']
      // e.setOptions({...style})
      // 切换坐标点高亮
      const marker = this.parkingIcon[this.inAreaDataMarkers.indexs[data.index]]
      this.switchMarkerLight(marker, isHighlight)
    },
    // 切换坐标点高亮
    switchMarkerLight (e, isHighlight = false) {
      if (!e) return
      const data = e.getExtData()
      this.$store.dispatch('mapDetails/changeMapSearchData', { cacheData: isHighlight ? data : {} })
      const style = data.status === 1 ? 'normal' : 'abnormal'
      const markerIcon = parkImg[data.parkingType][style][isHighlight ? 'hover' : data.search ? 'highlight' : 'default']
      const label = isHighlight ? {
        content: `<div class="mapLabel ${style}"><div class="name">${data.parkingName}</div><div class="type">${getLable(data.parkingType, parkinglotTypesOptions)}</div></div>`,
        offset: new AMap.Pixel(0, -66),
        direction: 'center'
      } : { content: '<div></div>' }
      const index = data.index
      const zIndex = isHighlight ? 9999 : index
      e.setIcon(
        new AMap.Icon({
          size: new AMap.Size(24, 33),
          image: markerIcon,
          imageSize: new AMap.Size(24, 33)
        })
      )
      e.setLabel(label)
      e.setzIndex(zIndex)
      // 切换区域高亮
      if (this.mapCurData.parkingSn === data.parkingSn) return
      this.lightArea(data.parkingSn)
    },
    // 停车场数据相关事件 end




    // 设备数据相关事件 start
    // 创建设备坐标点
    initDeviceMarker (data = {}, index) {
      const style = data.deviceStatus === 1 ? 'normal' : 'abnormal'
      const markerIcon = deviceImg[data.deviceType][style].default
      // 绘制设备坐标点
      const center = {
        anchor: 'center',
        position: [data.lon, data.lat],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        extData: { ...data, index },
        icon: new AMap.Icon({
          size: new AMap.Size(24, 33),
          image: markerIcon,
          imageSize: new AMap.Size(24, 33)
        }),
        // visible: false
      }
      return this.addMarker(center).then(res => {
        res.on('click', this.clickDeviceMarker)
        res.on('mouseover', this.mouseoverDeviceMarker)
        res.on('mouseout', this.mouseoutDeviceMarker)
        return res
      })
    },
    clickDeviceMarker () {
      // 点击设备标记点
    },
    mouseoverDeviceMarker (e) {
      // 进入设备标记点
      const d = e.target.getExtData()
      this.switchDeviceMarkerLight(e.target, d, true)
    },
    mouseoutDeviceMarker (e) {
      // 移除设备标记点
      const d = e.target.getExtData()
      this.switchDeviceMarkerLight(e.target, d, false)
    },
    switchDeviceMarkerLight (e, data, isHighlight = false) {
      // 切换设备高亮
      const style = data.deviceStatus === 1 ? 'normal' : 'abnormal'
      const label = isHighlight ? {
        content: `<div class="mapLabel ${style}"><div class="name">${data.deviceName}</div></div>`,
        offset: new AMap.Pixel(0, -55),
        direction: 'center'
      } : { content: '<div></div>' }
      const index = isHighlight ? 9999 : 10
      // const markerIconHover = require(`@/static/maps/${data.deviceType}${data.deviceStatus === 1 ? 'Normal' : 'Abnormal'}${isHighlight ? 'Hover' : 'Default'}.png`)
      const markerIconHover = deviceImg[data.deviceType][style][isHighlight ? 'hover' : 'default']
      e.setIcon(
        new AMap.Icon({
          size: new AMap.Size(24, 33),
          image: markerIconHover,
          imageSize: new AMap.Size(24, 33)
        })
      )
      e.setLabel(label)
      e.setzIndex(index)
    },
    // 设备数据相关事件 end
    // 资源查询数据相关事件 start
    // 创建资源查询数据坐标点
    initSearchDataMarker (data, index, defaultIcon = '') {
      const style = data.status === 1 ? 'normal' : 'abnormal'
      const markerIcon = parkImg[data.parkingType][style][defaultIcon || 'default']
      // 绘制坐标点
      const center = {
        anchor: 'center',
        position: Object.values(data.centerPosition),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        extData: { ...data, index: this.parkingIcon.length + index + 101, search: !!defaultIcon },
        icon: new AMap.Icon({
          size: new AMap.Size(24, 33),
          image: markerIcon,
          imageSize: new AMap.Size(24, 33)
        }),
        zIndex: this.parkingIcon.length + index + 101
      }
      return this.addMarker(center).then(res => {
        res.on('click', this.clickMarker)
        res.on('mouseover', this.mouseoverSearchMarker)
        res.on('mouseout', this.mouseoutSearchMarker)
        return res
      })
    },
    mouseoverSearchMarker (e) {
      // 进入搜索数据标记点
      this.switchSearchIcons(e.target, true)
    },
    mouseoutSearchMarker (e) {
      // 移出搜索数据标记点
      this.switchSearchIcons(e.target, false)
    },
    // 切换资源查询数据高亮
    switchSearchIcons (e, isHighlight = false, index) {
      const cacheData = e ? e.getExtData() : this.mapSearchData.cacheData
      const style = cacheData.status === 1 ? 'normal' : 'abnormal'
      const markerIcon = parkImg[cacheData.parkingType][style][isHighlight ? 'hover' : 'highlight']
      const label = isHighlight ? {
        content: `<div class="mapLabel ${style}"><div class="name">${cacheData.parkingName}</div><div class="type">${getLable(cacheData.parkingType, parkinglotTypesOptions)}</div></div>`,
        offset: new AMap.Pixel(0, -66),
        direction: 'center'
      } : { content: '<div></div>' }
      const zIndex = isHighlight ? 9999 : cacheData.index
      const target = e || this.searchIcons[index]
      const light = isHighlight ? 'checked' : 'default'
      target.setIcon(
        new AMap.Icon({
          size: new AMap.Size(24, 33),
          image: markerIcon,
          imageSize: new AMap.Size(24, 33)
        })
      )
      target.setLabel(label)
      target.setzIndex(zIndex)
      this.$store.dispatch('mapDetails/changeMapSearchData', { cacheData: isHighlight ? cacheData : {} })
      this.lightArea(cacheData.parkingSn, light)
    },
    // 高亮停车场区域
    lightArea (parkingSn, light = 'checked') {
      this.inAreaDataMarkers.inParkingArea.forEach(item => {
        const d = item.getExtData()
        const style = d.status === 1 ? 'normal' : 'abnormal'
        if (d.parkingSn === parkingSn) {
          item.setOptions({ ...areaStyle[style][light] })
        } else {
          item.setOptions({ ...areaStyle[style].default })
        }
      })
    },
    // 高亮资源查询数据
    lightSearchIcon (parkingSn, light = 'hover') {
      this.searchIcons.forEach(item => {
        const d = item.getExtData()
        const match = d.parkingSn === parkingSn
        const style = d.status === 1 ? 'normal' : 'abnormal'
        const markerIcon = parkImg[d.parkingType][style][match ? light : 'highlight']
        const label = match ? {
          content: `<div class="mapLabel ${style}"><div class="name">${d.parkingName}</div><div class="type">${getLable(d.parkingType, parkinglotTypesOptions)}</div></div>`,
          offset: new AMap.Pixel(0, -66),
          direction: 'center'
        } : { content: '<div></div>' }
        const index = d.index
        const zIndex = match ? 9999 : index
        item.setIcon(
          new AMap.Icon({
            size: new AMap.Size(24, 33),
            image: markerIcon,
            imageSize: new AMap.Size(24, 33)
          })
        )
        item.setLabel(label)
        item.setzIndex(zIndex)
      })
    },
    // 清除资源查询数据覆盖物
    clearMapSearchData () {
      this.clearCurIcon().then(() => {
        if (this.searchIcons.length > 0) {
          this.clearPolygons(this.searchIcons)
          this.searchIcons = []
        }
      })
    },

    // 资源查询数据相关事件 end

    // 公共事件 start
    // 点击停车场坐标点生成一个新的坐标覆盖在上面
    clickMarker (e) {
      this.clearCurIcon().then(() => {
        let d = null
        if (e) {
          d = e.target.getExtData()
          this.$store.dispatch('mapDetails/changeMapSearchData', { show: true, isOpen: true })
          this.$refs.mapHeader.resourceName = d.parkingName
          this.$refs.mapHeader.to({ activeName: 'parkDetail' })
          this.$store.dispatch('mapDetails/changeMapCurData', d)
        } else {
          d = this.mapCurData
        }
        const style = d.status === 1 ? 'normal' : 'abnormal'
        const markerIcon = parkImg[d.parkingType][style].checked
        // 绘制坐标点
        const center = {
          anchor: 'center',
          position: Object.values(d.centerPosition),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          extData: { ...d },
          icon: new AMap.Icon({
            size: new AMap.Size(34, 47),
            image: markerIcon,
            imageSize: new AMap.Size(34, 47)
          }),
          zIndex: 9999,
          label: {
            content: `<div class="mapLabel ${style}"><div class="name">${d.parkingName}</div><div class="type">${getLable(d.parkingType, parkinglotTypesOptions)}</div></div>`,
            offset: new AMap.Pixel(0, -66),
            direction: 'center'
          }
        }
        this.addMarker(center).then(res => {
          this.curIcon = res
        })
        // setTimeout(() => this.lightArea(d.parkingSn), 0)
        this.lightArea(d.parkingSn)
        // 查询数据覆盖物图标改为默认样式
      })
    },
    // 清空覆盖物（可选清空地区覆盖物）
    clearData (isAll = false) {
      return new Promise(resolve => {
        // 是否全部清除
        if (isAll) {
          this.clearPolygons()
        } else {
          const polygons = [...this.parkingIcon, ...this.deviceGates, ...this.deviceMonitors, ...this.deviceGuides]
          polygons.length > 0 && this.clearPolygons(polygons)
          this.clearInAreaMarkers()
          this.clearMapSearchData()
        }
        this.parkingIcon = []
        this.deviceGates = []
        this.deviceMonitors = []
        this.deviceGuides = []
        this.checkedDeviceData = {}
        this.layersData = []
        this.hideSearchInArea()
        resolve()
      })
    },
    // 清除选中的地图坐标点
    clearCurIcon () {
      return new Promise(resolve => {
        if (this.curIcon) {
          this.clearPolygons([this.curIcon])
          this.curIcon = null
          this.$store.dispatch('mapDetails/changeMapSearchData', { cacheData: {} })
          this.$store.dispatch('mapDetails/removeMapCurData')
        }
        // 修改查询数据为默认样式
        this.lightSearchIcon()
        this.lightArea('', 'default')
        // 隐藏此区域查找按钮
        this.hideSearchInArea()
        resolve()
      })
    },
    // 清除当前区域的停车场查询的坐标点
    clearInAreaMarkers () {
      let inArea = this.inAreaDataMarkers
      const polygons = [...inArea.inParkingArea, ...inArea.inDeviceGates, ...inArea.inDeviceMonitors, ...inArea.inDeviceGuides]
      polygons.length > 0 && this.clearPolygons(polygons)
      this.inAreaDataMarkers.indexs = []
      this.inAreaDataMarkers.inParkingArea = []
      this.inAreaDataMarkers.inDeviceGates = []
      this.inAreaDataMarkers.inDeviceMonitors = []
      this.inAreaDataMarkers.inDeviceGuides = []
    },
    // 显示详情
    showDetailDialog () {
      this.isDetailDialog = true
    },
    // 关闭详情
    closeDetailDialog () {
      this.isDetailDialog = false
    },
    // 展示全貌
    showPicture () {
      this.setFitView({ polygon: this.curIcon, maxZoom: 18 }).then(this.getParksData)
    },
    showSearchInArea () {
      this.showSearch = true
    },
    hideSearchInArea () {
      this.showSearch = false
    },
    // 搜索此区域
    searchInArea () {
      const { province, city } = this.homeCenter
      const params = {
        province,
        city,
        l3Region: '',
        l4Region: '',
        resourceName: '',
        resourceType: [],
        parking: parkinglotTypesOptions.map(item => item.value),
        device: []
      }
      this.$store.dispatch('mapDetails/changeMapSearch', params)
      this.initEvent_Data()
    },
    // 创建地图覆盖物
    initRegionArea (areaStr) {
      return this.getCoordinates(areaStr).then(res => {
        res.districtList.forEach(item => {
          this.getAddress(item.center).then(res => {
            const { province, city } = res.regeocode.addressComponent
            const { Mprovince = province, Mcity = city } = this.mapSearch
            item.districtList = item.districtList || []
            if (province === Mprovince && city === Mcity) {
              item.districtList.forEach((cItem, index) => {
                const style = {
                  strokeWeight: 6,
                  strokeColor: '#99C4FF',
                  fillColor: areaColors[index] || areaColors[0],
                  fillOpacity: 0,
                  strokeStyle: 'dashed',
                  zIndex: -1
                }
                this.getCoordinates(cItem.adcode).then(data => {
                  this.setLayers(data.districtList[0], style).then(cRes => {
                    this.layersData.push(cRes)
                    cRes[0].on('dblclick', () => this.map.zoomIn())
                  })
                })
              })
              this.setCenter(item.center)
            }
          })
        })
      })
      // 生成地区图层

    },
    //  坐标点是否在当前区域内
    isInLocation ({ lng, lat }) {
      const { southwest, northeast } = this.map.getBounds().toBounds()
      return (lng >= southwest.lng && lng <= northeast.lng)
        &&
        (lat >= southwest.lat && lat <= northeast.lat)
    },
    mapZoomchange () {
      // const zoom = this.map.getZoom()
      // 16 级以下不显示地图色
      // if (this.layersData.length > 0) {
      //   this.layersData.forEach((item, index) => {
      //     const style = {
      //       strokeWeight: 4,
      //       strokeColor: '#99C4FF',
      //       fillColor: areaColors[index] || areaColors[0],
      //       fillOpacity: zoom < 16 ? 1 : 0,
      //       strokeStyle: 'dashed',
      //       zIndex: 1
      //     }
      //     item[0].setOptions(style)
      //   })
      // }
      // 地图缩放结束
      this.getParksData()
    },
    mapdragend () {
      // 地图拖拽结束
      this.getParksData()
      if (!this.mapSearchData.show) {
        const center = this.map.getCenter()
        this.getAddress(center).then(res => {
          this.homeCenter = res.regeocode.addressComponent
          this.showSearchInArea()
        })
      }
    },
    // 打开编辑侧边栏
    editMapData (type) {
      if (type) {
        this.showEditMapData = true
        this.editMapDataDirection = type
      }
    },
    // 图表点击后触发事件中间件方法
    switchMapLoca ({ methods, ...data }) {
      if (!methods) return
      this[methods](data)
    },
    // 清空地图数据可视化图层
    clearMapLoca () {
      this.locaLayerDetails.show = false
      this.locaLayers && this.locaLayers.setMap(null)
      this.locaLayers = null
    },
    // 公共事件 end









    switchMouseArea (status) {
      if (status) {
        this.changeZoom(this.zoomIn)
      } else {
        this.mouseTool.close(true)
      }
    },
    changeZoom (status) {
      const options = {
        strokeColor: '#80d8ff',
        fillColor: '#80d8ff',
        fillOpacity: 0.3
        //同 Polygon 的 Option 设置
      }
      status ? this.mouseTool.rectZoomIn(options) : this.mouseTool.rectZoomOut(options)
    },
    demoLimitBounds (switchs = false) {
      this.setLimitBounds(switchs)
    },
    demoSetCenter () {
      this.setCenter([120.5928, 31.13744], 15)
      this.addMarker([{ position: [120.590988, 31.136952] }, { position: [120.593906, 31.137149] }])
    },
    demoSetPolygons () {
      this.setPolygons(this.polygons, true)
    }
  }
}
</script>

<style scoped lang="scss">
.fullScreen {
  .dataScreen-wrap {
    height: 100vh;
  }
}
.dataScreen-wrap {
  height: calc(100vh - 50px);
  position: relative;
  display: flex;
  background-color: $mapColor12-1;
  .searchInArea {
    position: absolute;
    padding: 0 44px;
    left: calc(50% - 100px);
    bottom: 60px;
    height: 40px;
    font-size: 14px;
    color: $mapFontColorDefault1-1;
    line-height: 40px;
    background-color: $mapMainColor1-1;
    border-radius: 4px;
    cursor: pointer;
    span {
      font-weight: bold;
    }
  }
  .LeftIndex,
  .RightIndex {
    padding: 20px;
    width: 495px;
    background-color: $mapColor12-1;
    // z-index: 100;
  }
  .totalQuantity {
    position: absolute;
    right: 70px;
    bottom: 20px;
    z-index: 11;
  }
  .switchMouse {
    padding: 5px;
    position: absolute;
    left: 50px;
    top: 300px;
    z-index: 11;
  }
  .scale-wrap {
    position: absolute;
    left: 50%;
    bottom: 40px;
    transform: translate(-50%, 0);
    padding: 15px 30px;
    width: 480px;
    font-size: 14px;
    color: $mapFontColorDefault1-1;
    border-radius: 4px;
    border: 2px solid $mapMainColor1-1;
    background-color: $mapColor1-2;
    .title {
      ::v-deep {
        .fw {
          font-weight: bold;
        }
      }
    }
    .scale {
      margin: 10px 0 6px;
      display: flex;
      span {
        flex: 1;
        height: 20px;
      }
    }
    .number-wrap {
      position: relative;
      color: $mapFontColorDefault1-2;
      height: 16px;
      .number-content {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        width: 100%;
        height: 100%;
        div {
          flex: 1;
        }
        &.right {
          div {
            position: relative;
            text-align: right;
            span {
              position: absolute;
              right: 0;
              transform: translate(50%, 0);
            }
          }
        }
        &.center {
          div {
            text-align: center;
          }
        }
      }
    }
  }
  .map-wrap {
    flex: 1;
    position: relative;

    // min-height: calc(100vh - 50px);

    overflow: auto;
    .side {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      width: 34px;
      height: 126px;
      background-size: 100% 100%;
      background-position: 0 0;
      background-repeat: no-repeat;
      transition: all 0.3s;
      cursor: pointer;
      z-index: 1;
      &.leftSide {
        left: -1px;
        background-image: url('~@/static/mapData/left.png');
        &:hover {
          background-image: url('~@/static/mapData/left-hover.png');
        }
      }
      &.rightSide {
        right: -1px;
        background-image: url('~@/static/mapData/right.png');
        &:hover {
          background-image: url('~@/static/mapData/right-hover.png');
        }
      }
    }
    .operation {
      position: absolute;
      right: 20px;
      top: 21px;
    }
    .maps {
      width: 100%;
      height: 100%;
    }
    .brief-wrap {
      position: absolute;
      left: 60%;
      top: 20%;
    }
  }
}
.detailDialog {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .detail-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .detail-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1200px;
    // height: 787px;
    background-color: $mapColor1-2;
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>
