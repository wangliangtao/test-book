<template>
  <div
    :class="['parkTraffic-wrap', {edit: operationStatus === 'edit', checked: checked}]"
    @click.stop="clickWrap()"
  >
    <div class="tips">
      <svg-icon
        icon-class="icon_grid"
      />
      网格图
    </div>
    <div class="item1">
      <div class="mark">
        周转率（24小时）:
        <span>{{ orginData.turnoverRateAverage || 0 }}</span>
      </div>
      <div class="header">
        <span class="cur" />
        停车流量（近24小时）
        <span class="download">
          <svg-icon
            icon-class="icon_export"
          />
          导出报表
        </span>
      </div>
      <lineChart
        :id="id"
        class="chart"
        :data="data"
        width="100%"
        @click="renderMapLoca"
      />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import lineChart from './parkTrafficComponent/lineChart'
import {postParkingFlow} from '@/api/report'
const DEFAULTTIME = 60 * 60 * 1000
export default {
  components: {
    lineChart
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: 'parkTraffic' + Date.now()
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data() {
    return {
      timer: null,
      orginData: '',
      data: {
        xData: [],
        yData: []
      }
    }
  },
  watch: {
    params: {
      handler() {
        this.getData()
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    getData() {
      postParkingFlow({...this.params})
      .then(res => {
        this.orginData = res.body || {}
        this.initChartData(this.orginData.parkingFlowList)
      })
      .then(() => {
        if (this.timer) clearInterval(this.timer)
        this.timer = setTimeout(this.getData, DEFAULTTIME)
      })
    },
    initChartData(payLoad) {
      this.data.xData = []
      const line1 = [],line2 = []
      payLoad.forEach(item => {
        this.data.xData.push(this.$moment(+item.prkHour).format('HH:mm'))
        line1.push({
          value: item.inCount,
          name: '入场车流量',
          color: ['rgba(128, 181, 255, 1)', 'rgba(128, 181, 255, 1)'],
          areaStyle: ['rgba(128, 181, 255, 0.7)', 'rgba(128, 181, 255, 0.1)'],
          // time: time,
          currentTime: item.prkHour,
          flowType: 'inCount',
          str: '入场'
        })
        line2.push({
          value: item.outCount,
          color: ['rgba(102, 204, 136, 1)', 'rgba(102, 204, 136, 1)'],
          name: '出场车流量',
          type: 'line',
          areaStyle: ['rgba(102, 204, 136, 0.7)', 'rgba(102, 204, 136, 0.1)'],
          // time: time,
          currentTime: item.prkHour,
          flowType: 'outCount',
          str: '出场'
        })
      })
      this.data.yData = [line1,line2]
    },
    clickWrap(data) {
      if (data) {
        this.$emit('changeCheck', 'renderMapLoca', data)
      } else {
        this.$emit('changeCheck')
      }
    },
    renderMapLoca({data}) {
      if (this.operationStatus === 'edit') return
      const {flowType, currentTime, str} = data.params
      const params = {
        ...this.params,
        flowType,
        currentTime,
        str,
        methods: 'postParkingFlowHeatMap'
      }
      this.clickWrap(params)
    }
  }
}
</script>

<style scoped lang="scss">
.tips {
  position: absolute;
  right: -3px;
  top: -3px;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  color: $mapFontColorDefault1-1;
  background: linear-gradient(225deg, #80B5FF 0%, #3388FF 100%);
  border-radius: 0px 4px 0px 4px;
  z-index: 1;
}
.parkTraffic-wrap {
  position: relative;
  border: 3px solid transparent;
  border-radius: 4px;
  &.edit {
    .tips {
      top: 35px;
      border-radius: 4px 0 0 4px;
    }
    .item1 {
      padding: 40px 20px 20px;
      height: 244px;
      .mark {
        top: 65px;
      }
    }
  }
  &:not(.edit, .checked):hover {
    border-color: $mapColor3-4;
    .item1 {
      background-color: $mapColor3-4;
    }
  }
  &.checked {
    border-color: $mapFontColor1-1;
    .item1 {
      background-color: $mapColor3-4;
    }
  }
  .item1 {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 15px;
    height: 224px;
    .mark {
      position: absolute;
      right: 0;
      top: 40px;
      padding: 0 10px 0 15px;
      height: 24px;
      font-size: 12px;
      line-height: 24px;
      color: $mapFontColorDefault1-2;
      border-radius: 14px 4px 0px 14px;
      background-color: $mapColor4-1;
      span {
        color: $mapFontColorDefault1-1;
        font-weight: bold;
      }
    }
    .header {
      margin-bottom: 10px;
      display: flex;
      font-size: 12px;
      color: $mapFontColorDefault1-1;
      font-weight: bold;
      .cur {
        margin-right: 5px;
        width: 3px;
        background-color: $mapFontColor1-1;
        border-radius: 1px;
      }
      .download {
        margin-left: 20px;
        color: $mapFontColor1-1;
        cursor: pointer;
      }
    }
    .chart {
      margin-top: 7px;
      flex: 1;
    }
  }
}
</style>