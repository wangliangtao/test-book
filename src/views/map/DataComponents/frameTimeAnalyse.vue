<template>
  <div
    :class="['frameTime-wrap', {edit: operationStatus === 'edit', checked: checked}]"
    @click="renderMapLoca()"
  >
    <div class="tips">
      <svg-icon
        icon-class="icon_thermal"
      />
      热力图
    </div>
    <div class="item1">
      <div class="header">
        <span class="cur" />
        时段性分析
        <!-- <span
          class="download"
          @click="download"
        >
          <svg-icon
            icon-class="icon_export"
          />
          导出报表
        </span> -->
      </div>
      <div
        class="chart1"
        @click.stop
      >
        <FrameTimeBarLineChart
          :id="id"
          width="100%"
          height="355px"
          :data="data1"
        />
      </div>
      <div
        class="chart2"
        @click.stop
      >
        <div class="title">
          <div>昨日停车指数</div>
        </div>
        <FrameTimeBarLineChart
          :id="`yesterday+${Date.now()}`"
          width="100%"
          height="165px"
          :data="data2"
          @click="clickBar"
        />
      </div>
    </div>
    <div class="item2">
      <div class="title">
        <div>
          下级
          <span>{{ form.parkSpaceType === 'easy' ? '空闲' : '拥挤' }}</span>
          停车场数量占比：<span>{{ form.time }}</span>
        </div>
      </div>
      <div class="item2-content">
        <div class="left">
          <el-scrollbar
            class="scrollbar"
            wrap-class="x-hidden"
          >
            <div
              v-for="(item,index,key) in pieData"
              :key="key"
              class="item"
              @click.stop="renderMapLoca(item)"
            >
              <div>
                <svg-icon
                  icon-class="icon_color_round"
                />
                <span :title="item.name">{{ item.name }}</span>
              </div>
              <div><span class="count moneyFont">{{ item.per }}%</span></div>
              <div><span class="count moneyFont">{{ item.value }}</span><span class="str">个</span></div>
            </div>
          </el-scrollbar>
        </div>
        <div class="right">
          <div
            :id="pieId"
            :style="{width: '100%',height: '100%'}"
            @click.stop
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const echarts = require('echarts')
import resize from '@/components/Charts/mixins/resize'
import FrameTimeBarLineChart from './frameTimeBarLineChart'
import { pieColors } from '@/utils/lookup'
import { postFlowAnalysisArea, postYesterdayParkingSpaceIndex, postYesterdayParkingSpaceIndexDependHour } from '@/api/report'
import mapBus from '../mapBus'
const DEFAULTTIME = 60 * 60 * 1000
export default {
  components: {
    FrameTimeBarLineChart
  },
  mixins: [resize],
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
      default: 'parkTime' + Date.now()
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pieChart: null,
      pieId: 'pie'+ Date.now(),
      data1: {
        yData: [],
        xData: [],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'rgba(51, 136, 255, 0.2)'
            }
          },
          formatter: params => {
            let date = `<span style="color:#fff">${params[0].data.params.time}</span><br/>`
            let header = ''
            let content = params.map(item => {
              return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color.colorStops[0].color};"></span> 
              <span style="color:#fff">${item.seriesName} </span>
              <span style="color:${item.color.colorStops[0].color};">${Math.abs(item.value)}</span>`
            }).join('<br/>')
            return date + header + content
          },
          backgroundColor: 'rgba(15, 41, 77, 0.9)',
          borderWidth: 0
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '20%',
          containLabel: true
        },
        legend: {
          padding: [5, 0]
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            formatter: val =>  Math.abs(val)
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff', // x坐标轴的轴线颜色
              width: 0 //这里是坐标轴的宽度,为0就是不显示
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      },
      data2: {
        yData: [],
        xData: [],
        tooltip: {
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'rgba(51, 136, 255, 0.2)'
            }
          },
          formatter: params => {
            let date = `<span style="color:#fff">${params.data.params.time}</span><br/>`
            let header = ''
            let content = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color.colorStops[0].color};"></span> 
              <span style="color:#fff">${params.seriesName} </span>
              <span style="color:${params.color.colorStops[0].color};">${params.value}</span>`
            return date + header + content
          },
          backgroundColor: 'rgba(15, 41, 77, 0.9)',
          borderWidth: 0
        }
      },
      tabsData: [
        {label: '工作日', value: 'workday'},
        {label: '节假日', value: 'holiday'}
      ],
      tabsChecked: ['workday'],
      form: {
        parkSpaceType: 'easy',
        hour: new Date().getHours(),
        time: new Date().getHours() + ':00' + ' ~ ' +  (1 + new Date().getHours()) + ':00'
      },
      pieData: [],
      timer: null
    }
  },
  watch: {
    params: {
      handler() {
        this.initData()
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    initData() {
      this.getData1()
      this.getData2()
      if (this.timer) clearInterval(this.timer)
      this.timer = setTimeout(this.initData, DEFAULTTIME)
    },
    getData1() {
      const params = { ...this.params }
      postFlowAnalysisArea(params)
        .then(res => {
          let data = res?.body || []
          this.data1.xData = []
          const labels = [
            {label: '今日入场流量', key: 'inCount', color: ['#FFCC66','#FFCC66']},
            {label: '今日出场流量', key: 'outCount', color: ['#66CC88','#66CC88'], isNeg: true},
            {label: '工作日入场基线', key: 'baseInCountWorkday', color: ['#80B5FF','#80B5FF'] },
            {label: '工作日出场基线', key: 'baseOutCountWorkday', color: ['#FF8A80','#FF8A80'], isNeg: true},
            {label: '节假日入场基线', key: 'baseInCountHoliday', color: ['#66CCCC','#66CCCC']},
            {label: '节假日出场基线', key: 'baseOutCountHoliday', color: ['#AA80FF','#AA80FF'], isNeg: true},
          ]
          if (data.length === 0) {
            data = new Array(24).fill({})
          }
          const yData = labels.reduce((acc, cur, idx) => {
            const a = data.map((item, index) => {
              const str1 = index < 10 ? '0' + index + ':00' : index + ':00'
              const str2 = index < 9 ? '0' + (index + 1) + ':00' : (index + 1) + ':00'
              idx === 0 && this.data1.xData.push(str1)
              return {
                value: Number((cur.isNeg ? '-' : '+') + (item[cur.key] || 0)),
                data: {...item},
                color: cur.color,
                name: cur.label,
                type: 'line',
                time: str1 + ' ~ ' + str2
              }
            })
            acc.push(a)
            return acc
          }, [])
          this.data1.yData = yData
        })
    },
    getData2() {
      postYesterdayParkingSpaceIndex({...this.params})
        .then(res => {
          const data = res.body || {}
          this.data2.xData = []
          const labels = [
            {label: '拥挤停车场数量', key: 'hard', color: ['#FFD480', '#FFBB33'], parkSpaceType: 'hard'},
            {label: '空闲停车场数量', key: 'easy', color: ['#80B5FF', '#3388FF'], parkSpaceType: 'easy'}
          ]
          const yData = labels.reduce((acc, cur, idx) => {
            const a = data.heArray.map((item, index) => {
              const str1 = index < 10 ? '0' + index + ':00' : index + ':00'
              const str2 = index < 9 ? '0' + (index + 1) + ':00' : (index + 1) + ':00'
              idx === 0 && this.data2.xData.push(str1)
              return {
                value: item[cur.key],
                color: cur.color,
                name: cur.label,
                parkSpaceType: cur.parkSpaceType,
                hour: index,
                time: str1 + ' ~ ' + str2
              }
            })
            acc.push(a)
            return acc
          }, [])
          this.data2.yData = yData
          this.getData3()
        })
    },
    getData3() {
      mapBus.$emit('clearMapLoca')
      const params = {
        ...this.params,
        ...this.form
      }
      postYesterdayParkingSpaceIndexDependHour(params).then(res => {
        const data = res.body || []
        this.pieData = data.map(item => {
          return { name: item.name, value: item.number, per: item.percent, parkSpaceType: params.parkSpaceType  }
        })
        this.initPieChart()
      })
    },
    initPieChart() {
      if (!this.pieChart) {
        this.pieChart = echarts.init(document.getElementById(this.pieId))
        this.$once('hook:beforeDestroy', () => {
          this.pieChart && this.pieChart.dispose()
          this.pieChart = null
        })
        this.pieChart.setOption({
          color: pieColors,
          tooltip: {
            show: true,
            trigger: 'item',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: 'rgba(51, 136, 255, 0.2)'
              }
            },
            formatter: params => {
              let header = `<span style="color:#fff;font-size: 12px;">${params.data.parkSpaceType === 'easy' ? '空闲' : '拥挤'}停车场数量占比</span>
                    <br/>`
              let content = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span> 
                <span style="color:#fff;font-size: 12px;">${params.name} </span>
                <span style="color:${params.color};font-size: 12px;">${params.data.per}%</span>`
              return header + content
            },
            backgroundColor: 'rgba(15, 41, 77, 0.9)',
            borderWidth: 0
          },
          series: [
            {
              type: 'pie',
              itemStyle: {
                  // borderColor: 'transparent',
                  borderColor: '#143666',
                  borderWidth: 2,
                  
              },
              radius: ['50%', '80%'],
              // top: 'middle',
              // roseType: 'radius',
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              },
              data: this.pieData
            }
          ]
        })
        this.pieChart.off('click')
        if (this.operationStatus === 'edit') return
        this.pieChart.on('click', ({data}) => this.renderMapLoca(data))
      } else {
        let option = this.pieChart.getOption()
        option.series[0].data = this.pieData
        this.pieChart.setOption(option)
      }
    },
    clickWrap(data) {
      if (data) {
        this.$emit('changeCheck', 'renderMapLoca', data)
      } else {
        this.$emit('changeCheck')
      }
    },
    clickBar({data}) {
      if (this.operationStatus === 'edit') return
      this.form = data.params|| {}
      this.getData3()
      this.renderMapLoca()
    },
    renderMapLoca(data = {}) {
      if (this.operationStatus === 'edit') return
      const {l3Region} = this.params
      const params = {
        ...this.params,
        ...this.form,
        l3Region: l3Region ? l3Region : data.name,
        l4Region: l3Region ? data.name : '',
        methods: 'postYesterdayPSIndexHeatMap'
      }
      this.clickWrap(params)
    },
    download() {
      this.$store.dispatch('mapDetails/changeSidebarDownloadData', {show: true})
    }
  }
}
</script>

<style scoped lang="scss">
.title {
  margin-bottom: 20px;
  font-size: 12px;
  color: $mapFontColorDefault1-1;
  text-align: center;
  div {
    position: relative;
    display: inline-block;
    &::after,&::before {
      content: '';
      position: absolute;
      top: 45%;
      width: 15px;
      height: 1px;
      transform: translate(0,-50%);
      background-color: #D8D8D8;
      opacity: .4;
    }
    &::after {
      right: -25px;
    }
    &::before {
      left: -25px;
    }
    span {
      color: $mapFontColor1-1;
      font-weight: bold;
    }
  }
}
.frameTime-wrap {
  position: relative;
  border: 3px solid transparent;
  &.edit {
    .tips {
      top: 35px;
      border-radius: 4px 0 0 4px;
    }
    .item1 {
      padding: 40px 20px 20px;
    }
  }
  &:not(.edit, .checked):hover {
    border-color: $mapColor3-4;
    .item1{
      background-color: $mapColor4-3;
    }
    .item2 {
      background-color: $mapColor3-4;
    }
  }
  &.checked {
    border-color: $mapFontColor1-1;
    .item1 {
      background-color: $mapColor4-3;
    }
    .item2 {
      background-color: $mapColor3-4;
    }
  }
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
  .item1 {
    position: relative;
    padding: 20px;
    background-color: $mapColor3-3;
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
      .download {
        margin-left: 20px;
        color: $mapFontColor1-1;
        cursor: pointer;
      }
    }
    .chart1 {
      padding: 20px 0;
      border-bottom: 1px dashed $mapFontColorDefault1-3;
    }
    .chart2 {
      margin-top: 20px;
    }
  }
  .item2 {
    padding: 15px;
    height: 234px;
    display: flex;
    flex-direction: column;
    .item2-content {
      flex: 1;
      display: flex;
      overflow: hidden;
      .left {
        flex: 1;
        overflow: hidden;
        .scrollbar {
          height: 100%;
        }
        .item + .item {
          margin-top: 5px;
        }
        .item {
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
          height: 28px;
          line-height: 28px;
          font-size: 14px;
          color: $pieColor1;
          border-radius: 2px;
          background-color: $mapColor10-1;
          cursor: pointer;
          &:hover {
            background-color: $mapColor5-1;
          }
          div {
            display: flex;
            align-items: center;
            span {
              display: inline-block;
            }
            .str {
              margin-top: 3px;
            }
          }
          & > div:first-of-type {
            font-size: 12px;
            flex: 0 0 70px;
            overflow: hidden;
            span {
              margin-left: 5px;
              flex: 1;
              color: $mapFontColorDefault1-1;
              overflow:hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .item:nth-of-type(1) {
          color: $pieColor1;
        }
        .item:nth-of-type(2) {
          color: $pieColor2;
        }
        .item:nth-of-type(3) {
          color: $pieColor3;
        }
        .item:nth-of-type(4) {
          color: $pieColor4;
        }
        .item:nth-of-type(5) {
          color: $pieColor5;
        }
        .item:nth-of-type(6) {
          color: $pieColor6;
        }
        .item:nth-of-type(7) {
          color: $pieColor7;
        }
        .item:nth-of-type(8) {
          color: $pieColor8;
        }
        .item:nth-of-type(9) {
          color: $pieColor9;
        }
        .item:nth-of-type(10) {
          color: $pieColor10;
        }
        .item:nth-of-type(11) {
          color: $pieColor11;
        }
        .item:nth-of-type(12) {
          color: $pieColor12;
        }
        .item:nth-of-type(13) {
          color: $pieColor13;
        }
        .item:nth-of-type(14) {
          color: $pieColor14;
        }
        .item:nth-of-type(15) {
          color: $pieColor15;
        }
        .item:nth-of-type(16) {
          color: $pieColor16;
        }
        .item:nth-of-type(17) {
          color: $pieColor17;
        }
        .item:nth-of-type(18) {
          color: $pieColor18;
        }
        .item:nth-of-type(19) {
          color: $pieColor19;
        }
        .item:nth-of-type(20) {
          color: $pieColor20;
        }
        .item:nth-of-type(21) {
          color: $pieColor21;
        }
        .item:nth-of-type(22) {
          color: $pieColor22;
        }
        .item:nth-of-type(23) {
          color: $pieColor23;
        }
        .item:nth-of-type(24) {
          color: $pieColor24;
        }
      }
      .right {
        flex: 1;
        height: 100%;
      }
    }
  }
}
</style>