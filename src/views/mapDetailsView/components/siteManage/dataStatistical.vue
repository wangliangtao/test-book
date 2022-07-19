<template>
  <div class="dataStatistical-wrap">
    <ul class="defaultData row4">
      <li>
        <IconData
          :data="realData.parkingSlots"
          text="车位总数"
          color="#80B5FF"
          :icon="require('@/static/park/icon_park_54@2x.png')"
        />
      </li>
      <li>
        <IconData
          :data="realData.parkingSlotsUse"
          text="已使用车位"
          color="#FFCC66"
          :icon="require('@/static/park/icon_park_used_54@2x.png')"
        />
      </li>
      <li>
        <IconData
          :data="realData.parkingSlotsSurplus"
          text="空余车位"
          color="#66CC88"
          :icon="require('@/static/park/icon_park_empty_54@2x.png')"
        />
      </li>
      <li>
        <BatteryData
          text="使用率"
          :battery="battery1"
        />
      </li>
    </ul>
    <div class="nowData-wrap">
      <div class="search-wrap">
        <el-date-picker
          v-model="currentDay"
          type="date"
          value-format="timestamp"
          class="map-datePicker-date"
          popper-class="map-datePicker-date-popper"
          :clearable="false"
          @change="getStatisticalData"
        />
      </div>
      <ul class="nowData-content row4">
        <li>
          <TextData
            :text="['待付款数', '支付笔数']"
            :data="[parkingData.payWaitNum,parkingData.payOverNum]"
          />
        </li>
        <li>
          <BatteryData
            text="付款率"
            :battery="battery2"
          />
        </li>
        <li>
          <IconData
            :data="parkingData.turnoverRate || 0"
            data-tail="%"
            :format-number="[1,',']"
            text="车位周转率 (日)"
            color="#66CC88"
            :icon="require('@/static/park/icon_recycle_54备份@2x.png')"
          />
        </li>
        <li>
          <IconData
            :data="parkingData.income"
            text="今日收入 (¥)"
            color="#80B5FF"
            :icon="require('@/static/park/icon_income_54@2x.png')"
          />
        </li>
      </ul>
      <div class="statistical">
        <div class="header fixed">
          <span class="cur" />
          流量分析
        </div>
        <barLineChart
          id="analyse"
          :data="analyseData"
          width="100%"
          height="543px"
        />
      </div>
      <div class="statistical">
        <div class="header fixed">
          <span class="cur" />
          余位指数
          <el-popover
            placement="top-start"
            width="300"
            trigger="hover"
            popper-class="header-info-wrap"
            :visible-arrow="false"
            offset="50"
          >
            <svg-icon
              slot="reference"
              class="instructions"
              icon-class="icon_instructions"
            />
            <div class="header-info">
              <div class="titles">
                <div>工作日指数</div>
                <div>由过去30天的工作日数据通过智能算法计算得出。</div>
              </div>
              <div class="titles">
                <div>节假日指数</div>
                <div>由过去30天的节假日数据通过智能算法计算得出。</div>
              </div>
            </div>
          </el-popover>
        </div>
        <BarChart
          id="BarChart"
          :data="BarChart"
          width="100%"
          height="303px"
        />
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getParkingRealTimeData, postParkingData} from '@/api/parking'
import { postFlowAnalysis, postMonthParkingSpaceIndex } from '@/api/report'
import BatteryData from './dataItems/batteryData'
import IconData from './dataItems/iconData'
import TextData from './dataItems/textData'
import BarChart from './dataItems/barChart'
import barLineChart from './dataItems/barLineChart'
export default {
  components: {
    TextData,
    IconData,
    BatteryData,
    BarChart,
    barLineChart
  },
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentDay: Date.now(),
      realData: {},
      parkingData: {},
      battery1: {
        bg: require('@/static/battery/yellow_bg_1@2x.png'),
        w: 0,
        color1: '#FFCC66',
        color2: '#FFBB33'
      },
      battery2: {
        bg: require('@/static/battery/blue_bg_1@2x.png'),
        w: 0,
        color1: '#80B5FF',
        color2: '#3388FF'
      },
      BarChart: {
        xData: [],
        yData: []
      },
      analyseData: {
        xData: [],
        yData: []
      }
    }
  },
  mounted() {
    this.getParkingRealTimeData(this.params.parkingSn)
    this.getStatisticalData()
  },
  methods: {
    require(path) {
      return require(path)
    },
    getParkingRealTimeData(id) {
      if (!id) return
      getParkingRealTimeData(id).then(res => {
        this.realData= res.body || {}
        this.battery1.w = this.realData.utilizationRate || 0
      })
    },
    getStatisticalData() {
      this.postParkingData()
      this.postFlowAnalysis()
      this.postMonthParkingSpaceIndex()
    },
    postFlowAnalysis() {
      const params = {
        parkingSN: this.params.parkingSn,
        time: this.currentDay
      }
      postFlowAnalysis(params)
        .then(res => {
          const data = res.body || []
          this.analyseData.xData = []
          const bar1 = [],line1 = [],line2 = []
          data.forEach((item, index) => {
            const str1 = index < 10 ? '0' + index + ':00' : index + ':00'
            const str2 = index < 9 ? '0' + (index + 1) + ':00' : (index + 1) + ':00'
            this.analyseData.xData.push(str1)
            bar1.push({
                value: item.occupyCount,
                color: ['#80B5FF', '#3388FF'],
                name: '流量差',
                time: str1 + ' ~ ' + str2,
              })
            line1.push({
                value: item.inCount,
                color: ['#FFCC66', '#FFCC66'],
                name: '入场流量',
                type: 'line',
                time: str1 + ' ~ ' + str2,
              })
            line2.push({
                value: -item.outCount,
                color: ['#66CC88', '#66CC88'],
                name: '出场流量',
                type: 'line',
                time: str1 + ' ~ ' + str2,
              })
          })
          this.analyseData.yData = [bar1, line1, line2]
        })
    },
    postParkingData() {
      const data = {
        parkingSn: this.params.parkingSn,
        currentDay: this.currentDay
      }
      postParkingData(data).then(res => {
        this.parkingData = res.body || {}
        this.battery2.w = this.parkingData.payRate || 0
      })
    },
    postMonthParkingSpaceIndex() {
      postMonthParkingSpaceIndex({parkingSn: this.params.parkingSn}).then(res => {
        const params = res.body || {}
        this.BarChart.xData = []
        this.BarChart.yData = []
        const bar1 = [], bar2 = []
        params.parkingSpace.forEach((item, index) => {
          const str1 = index < 10 ? '0' + index + ':00' : index + ':00'
          const str2 = index < 9 ? '0' + (index + 1) + ':00' : (index + 1) + ':00'
          this.BarChart.xData.push(str1)
          bar1.push({
            value: 100 - item.workingDayIndex * 100,
            color: ['#80B5FF', '#3388FF'],
            name: '工作日',
            time: str1 + ' ~ ' + str2,
            str: this.judgeSpaceIndex(100 - item.workingDayIndex * 100)
          })
          bar2.push({
            value: 100 - item.holidayIndex * 100,
            color: ['#FFD480', '#FFBB33'],
            name: '节假日',
            time: str1 + ' ~ ' + str2,
            str: this.judgeSpaceIndex(100 - item.holidayIndex * 100)
          })
        })
        this.BarChart.yData = [bar1, bar2]
      })
    },
    judgeSpaceIndex(data) {
      const conditions = [
        { label: '爆满', min: 0, max: 25 },
        { label: '拥挤', min: 25, max: 50 },
        { label: '一般', min: 50, max: 75 },
        { label: '空闲', min: 75, max: 101 },
      ]
      for (let i = 0; i < conditions.length; i++) {
        const item = conditions[i]
        if (data >= item.min && data < item.max){
          return item.label
        }
      }
    }
  }
}
</script>
<style lang="scss">
.header-info-wrap {
  padding: 15px;
  border-color: $mapFontColorDefault1-2;
  background-color: $mapColor6-1;
  .header-info {
    .titles + .titles {
      margin-top: 10px;
    }
    .titles {
      font-size: 14px;
      color: $mapFontColorDefault1-1;
      div:first-of-type {
        font-weight: bold;
      }
      div:last-of-type {
        font-size: 12px;
      }
    }
  }
}
</style>
<style scoped lang="scss">
.dataStatistical-wrap {
  margin-top: 20px;
  .row4 {
    li {
      flex: 0 0 282px;
      margin-right: 10px;
    }
    li:nth-of-type(4n) {
      margin-right: 0;
    }
    li:nth-of-type(5n) {
      margin-top: 10px;
    }
  }
  .defaultData {
    padding-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px dashed $mapColor4-1;
    li {
      border-radius: 4px;
      background-color: $mapColor3-1;
    }
  }
  .nowData-wrap {
    margin-top: 20px;
    .search-wrap {
      text-align: right;
    }
    .nowData-content {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      li {
        border-radius: 4px;
        background-color: $mapColor3-1;
      }
    }
    .statistical {
      position: relative;
      margin-top: 20px;
      padding: 20px;
      background-color: $mapColor3-1;
      border-radius: 4px;
      .header {
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
        .instructions {
          margin-left: 5px;
          color: $mapMainColor1-1;
          cursor: pointer;
          &:hover {
            color: $mapColor7-1;
          }
        }
        &.fixed {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 1;
        }
      }
    }
  }
}
</style>