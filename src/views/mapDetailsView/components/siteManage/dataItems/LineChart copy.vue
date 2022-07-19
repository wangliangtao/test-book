<template>
  <div
    :id="id"
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
// import echarts from 'echarts'
const echarts = require('echarts')
import resize from '@/components/Charts/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart' + Date.now()
    },
    id: {
      type: String,
      default: 'chart' + Date.now()
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    data: {
      handler: function (newVal) {
        this.$nextTick(() => {
          this.drawLine()
          this.initChart(newVal)
        })
      },
      deep: true
    }
  },
  mounted () {
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById(this.id))
    },
    initChart ({xData,yData,name}) {
      this.chart.setOption(
        {
          // backgroundColor: '#194480',
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (params) => {
              let date = `<span style="color:#FFFFFF">${params[0].axisValue}</span><br/>`
              let content = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#FFCC66;"></span> 
                <span style="color:#FFFFFF">${name}</span>
                <span style="color:#FFCC66">${params[0].value}</span>`
              return date + content
            },
            borderWidth: 0,
            backgroundColor: 'rgba(15, 41, 77, 0.9)'
          },
          legend: {
              // right: 10,
              top: 10,
              textStyle: {
                color: '#fff'
              },
              selectedMode: false
          },
          grid: {
              top: 42,
              bottom: 10,
              left: 15,
              right: 20,
              containLabel: true
          },
          xAxis: {
              type: "category",
              boundaryGap: false,
              axisLabel: {
                  // formatter: '{value}月',
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.7)'
                  }
              },
              axisLine: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                  }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              data: xData
          },
          yAxis: {
              type: "value",
              // name: '今日停车流量',
              axisLabel: {
                  textStyle: {
                      color: 'rgba(255, 255, 255, 0.7)'
                  }
              },
              nameTextStyle: {
                  color: "#fff",
                  fontSize: 12,
                  // lineHeight: 40
              },
              splitLine: {
                  lineStyle: {
                      color: 'rgba(255, 255, 255, 0.2)'
                  }
              },
              min: 0,
              axisLine: {
                  show: false
              },
              axisTick: {
                  show: false
              }
          },
          series: [{
              name: name,
              type: "line",
              smooth: true,
              // showSymbol: false,
              symbolSize: 4,
              zlevel: 3,
              lineStyle: {
                  normal: {
                      color: '#FFCC66'
                  }
              },
              itemStyle: {
                color: '#FFCC66'
              },
              areaStyle: {
                  normal: {
                      color: new echarts.graphic.LinearGradient(
                          0,
                          0,
                          0,
                          1,
                          [{
                                  offset: 0,
                                  color: 'rgba(255, 204, 102, 0.6)'
                              },
                              {
                                  offset: 1,
                                  color: 'rgba(255, 204, 102, 0.1)'
                              }
                          ],
                          false
                      )
                  }
              },
              data: yData
          }]
      }
      )
    }
  }
}
</script>
