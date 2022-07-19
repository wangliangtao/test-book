<template>
  <div class="parkDetail-wrap">
    <div
      :class="['close', mapSearchData.resultData.length > 0 && 'borders']"
      @click="close"
    >
      <svg-icon icon-class="icon_close_14" />
    </div>
    <div
      v-show="mapSearchData.resultData.length > 0"
      class="operation-header"
    >
      <div class="left">
        <span @click="to">
          <svg-icon
            class="icon"
            icon-class="icon_back_12"
          />
          返回“{{ mapSearch.resourceName }}”的搜索结果
        </span>
      </div>
      <!-- <div
        class="close"
        @click="close"
      >
        <svg-icon icon-class="icon_close_14" />
      </div> -->
    </div>
    <el-scrollbar wrap-class="x-hidden">
      <div class="brief-container">
        <header>
          <div class="left">
            <div class="title">
              {{ form.parkingName }}
            </div>
            <div class="type">
              {{ getLable(form.parkingType, parkinglotTypesOptions) }}
            </div>
          </div>
        </header>
        <div class="prompt">
          2小时免费，超出2元/小时，每日15元封顶
        </div>
        <div class="contents">
          <parkDetailItem :data="data1" />
        </div>
        <div class="contents">
          <parkDetailItem :data="data2" />
        </div>
        <div class="contents">
          <div class="charts-content">
            <div class="header">
              <span class="cur" />
              流量分析
            </div>
            <div class="tabs">
              <mapTabs
                :data="tabsData"
                :checked="tabsChecked"
                @change="changeTabs"
              />
            </div>
            <miniBarLineChart
              id="analyse"
              :data="data3"
              width="100%"
              height="240px"
            />
          </div>
        </div>
        <div class="contents">
          <div class="charts-content">
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
            <miniBar
              id="chart4"
              :data="data4"
              width="100%"
              height="160px"
            />
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div class="operation-footer">
      <el-button
        class="map-btn-border"
        round
        @click="showPicture"
      >
        查看全貌
      </el-button>
      <el-button
        class="map-btn-noBorder"
        type="primary"
        round
        @click="showDetailDialog"
      >
        查看详情
      </el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { getParkingRealTimeData, postParkingData } from '@/api/parking'
import { postFlowAnalysis, postMonthParkingSpaceIndex } from '@/api/report'
import { getLable } from '@/utils/function'
import { parkinglotTypesOptions } from '@/utils/lookup'
import parkDetailItem from './parkDetailItem'
import miniBar from './miniBar'
import miniBarLineChart from './miniBarLineChart'
import mapTabs from '@/components/mapTabs'
export default {
  components: {
    parkDetailItem,
    miniBar,
    miniBarLineChart,
    mapTabs
  },
  data () {
    return {
      parkinglotTypesOptions,
      data1: {
        data: [
          {
            value: 0, label: '车位总数', format: true, valueColor: '#80B5FF'
          },
          {
            value: 0, label: '已使用车位', format: true, valueColor: '#FFCC66'
          },
          {
            value: 0, label: '空余车位', format: true, valueColor: '#66CC88'
          },
          {
            value: 0, label: '车位周转率 (日)', tail: '%', valueColor: '#66CC88'
          }
        ],
        chartsData: {
          id: 'chart1',
          data: 0,
          title: '使用率',
          color: '#FFCC66',
          bgColor: ['#FFD480', '#FFBB33']
        }
      },
      data2: {
        data: [
          {
            value: 0, label: '待付笔数', format: true, valueColor: '#FFCC66'
          },
          {
            value: 0, label: '支付笔数', format: true, valueColor: '#66CC88'
          },
          {
            value: 0, label: '今日收入 (¥)', format: true, valueColor: '#80B5FF'
          }
        ],
        chartsData: {
          id: 'chart2',
          data: 80,
          title: '付款率',
          color: '#80B5FF',
          bgColor: ['#80B5FF', '#3388FF']
        }
      },
      data3: {
        xData: [],
        yData: []
      },
      data4: {
        xData: [],
        yData: []
      },
      tabsData: [
        { label: '今日', value: 'today' },
        { label: '昨日', value: 'yesterday' }
      ],
      form: {},
      tabsChecked: ['today']
    }
  },
  computed: {
    ...mapState('mapDetails', {
      mapSearchData: state => state.mapSearchData,
      mapSearch: state => state.mapSearch,
      mapCurData: state => state.mapCurData
    })
  },
  watch: {
    'mapCurData': {
      handler () {
        this.form = { ...this.mapCurData }
        this.getData()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getLable,
    to () {
      this.$emit('to', { resourceName: this.mapSearch.resourceName, activeName: 'resourceList' })
    },
    close () {
      this.$emit('close')
    },
    callDetails (id) {
      this.$emit('callDetails', id)
    },
    getData () {
      if (!this.form.parkingSn) return
      this.getParkingRealTimeData()
      this.postParkingData()
      this.postFlowAnalysis()
      this.postMonthParkingSpaceIndex()
    },
    getParkingRealTimeData () {
      getParkingRealTimeData(this.form.parkingSn).then(res => {
        const { parkingSlots, parkingSlotsUse, parkingSlotsSurplus, turnoverRate, utilizationRate } = res.body || {}
        this.data1.data[0].value = parkingSlots || 0
        this.data1.data[1].value = parkingSlotsUse || 0
        this.data1.data[2].value = parkingSlotsSurplus || 0
        this.data1.data[3].value = turnoverRate || 0
        this.data1.chartsData.data = utilizationRate || 0
      })
    },
    postParkingData () {
      postParkingData({ parkingSn: this.form.parkingSn }).then(res => {
        const params = res.body || {}
        this.data2.data[0].value = params.payWaitNum || 0
        this.data2.data[1].value = params.payOverNum || 0
        this.data2.data[2].value = params.income / 100 || 0
        this.data2.chartsData.data = params.payRate || 0
      })
    },
    postFlowAnalysis () {
      const params = {
        parkingSN: this.form.parkingSn,
        time: this.tabsChecked[0] === 'today' ? Date.now() : Date.now() - 24 * 60 * 60 * 1000
      }
      postFlowAnalysis(params)
        .then(res => {
          const data = res.body || []
          this.data3.xData = []
          const bar1 = [], line1 = [], line2 = []
          data.forEach((item, index) => {
            const str1 = index < 10 ? '0' + index + ':00' : index + ':00'
            const str2 = index < 9 ? '0' + (index + 1) + ':00' : (index + 1) + ':00'
            this.data3.xData.push(str1)
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
          this.data3.yData = [bar1, line1, line2]
        })
    },
    postMonthParkingSpaceIndex () {
      postMonthParkingSpaceIndex({ parkingSn: this.form.parkingSn }).then(res => {
        const params = res.body || {}
        this.data4.xData = []
        this.data4.yData = []
        const bar1 = [], bar2 = []
        params.parkingSpace.forEach((item, index) => {
          // console.log(item.holidayIndex);
          const str1 = index < 10 ? '0' + index + ':00' : index + ':00'
          const str2 = index < 9 ? '0' + (index + 1) + ':00' : (index + 1) + ':00'
          this.data4.xData.push(str1)
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
        this.data4.yData = [bar1, bar2]
      })
    },
    changeTabs (data) {
      this.tabsChecked = [...data]
      this.postFlowAnalysis()
    },
    showDetailDialog () {
      this.$store.dispatch('mapDetails/changeSiteDetail', { data: this.form })
      this.$emit('showDetailDialog')
    },
    showPicture () {
      this.$emit('showPicture')
    },
    judgeSpaceIndex (data) {
      const conditions = [
        { label: '爆满', min: 0, max: 25 },
        { label: '拥挤', min: 25, max: 50 },
        { label: '一般', min: 50, max: 75 },
        { label: '空闲', min: 75, max: 101 },
      ]
      for (let i = 0; i < conditions.length; i++) {
        const item = conditions[i]
        if (data >= item.min && data < item.max) {
          return item.label
        }
      }
    }
  }
}
</script>
<style lang="scss">
.x-hidden {
  overflow-x: hidden;
}
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
.close {
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  color: $mapFontColorDefault1-1;
  text-align: center;
  border: 1px solid $mapColor4-1;
  border-width: 0 0 1px 1px;
  border-radius: 0px 4px 0px 4px;
  background-color: $mapColor3-1;
  transition: all 0.3s;
  cursor: pointer;
  z-index: 1;
  &:hover {
    background-color: $mapMainColor1-1;
    border-color: $mapMainColor1-1;
  }
  &:active {
    background-color: $mapColor5-1;
    border-color: $mapColor5-1;
  }
  &.borders {
    border-radius: 0px 4px 0px 0px;
  }
}
.parkDetail-wrap {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background-color: $mapColor1-2;
  border: 1px solid $mapColor4-1;
  overflow: hidden;
  &::after,
  &::before {
    content: '';
    position: absolute;
    left: 0;
    height: 14px;
    width: 100%;
    z-index: 1;
    background-image: url('~@/static/maps/decoration2.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
  &::after {
    top: 0;
    background-position: left top;
  }
  ::v-deep {
    .el-scrollbar {
      height: 100%;
    }
  }
  &::before {
    bottom: 0;
    background-position: left bottom;
  }
  .operation-header {
    padding-bottom: 1px;
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid $mapColor4-1;
    .left {
      padding-left: 15px;
      flex: 1;
      font-size: 12px;
      color: $mapMainColor1-1;
      background-color: $mapColor3-1;
      span {
        cursor: pointer;
      }
      .icon {
        margin-right: 3px;
      }
    }
  }
  .brief-container {
    position: relative;
    padding: 15px;
    flex: 1;
    overflow: auto;
    header {
      display: flex;
      align-items: center;
      color: $mapFontColorDefault1-1;
      .title {
        font-size: 18px;
        font-weight: bold;
      }
      .type {
        padding: 2px 4px;
        margin-top: 6px;
        font-size: 12px;
        line-height: 16px;
        background-color: $mapMainColor1-1;
        border-radius: 2px;
        display: inline-block;
      }
      .el-button {
        margin-left: auto;
      }
    }
    .prompt {
      margin-top: 7px;
      font-size: 12px;
      color: $mapFontColorDefault1-2;
    }
    .contents {
      position: relative;
      margin-top: 15px;
      border-radius: 4px;
      background-color: $mapColor3-1;
      .charts-content {
        padding: 10px;
        height: 100%;
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
            top: 10px;
            left: 15px;
            z-index: 1;
          }
        }
        .tabs {
          margin: 10px 0;
        }
      }
    }
  }
  .operation-footer {
    padding: 10px 15px;
    background-color: $mapColor3-1;
    text-align: right;
    border-top: 1px solid $mapColor4-1;
  }
}
</style>
