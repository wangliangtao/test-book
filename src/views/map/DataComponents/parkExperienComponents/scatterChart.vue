<template>
  <div
    :id="id"
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
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
  methods: {
    formatData ({legendData, series}) {
      const obj = {
        series: series,
        legend: {
          right: '0',
          data: legendData,
          textStyle: {
            color: '#fff'
          },
          selectedMode: false
        }
      }
      return obj
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById(this.id))
      this.$once('hook:beforeDestroy', () => {
        this.chart && this.chart.dispose()
        this.chart = null
      })
    },
    initChart (data = {}) {
      const defaultYAxis = [
        {
          type: 'value',
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          nameTextStyle: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)', // x坐标轴的轴线颜色
              // width: 0 //这里是坐标轴的宽度,为0就是不显示
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          name: '付款时长',
          nameGap: 5,
          // nameLocation: 'center',
          
        }
      ]
      const defaultXAxis = {
        type: 'category',
        interval: 1,
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)',
          // interval: 2
        },
        nameTextStyle: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.7)', // x坐标轴的轴线颜色
          }
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      }
      const defaultGrid = {
        left: '5%',
        right: '5%',
        bottom: '15%',
        top: '25%',
        containLabel: true
      }
      const yAxis = data.yAxis || defaultYAxis
      const xAxis = data.xAxis || defaultXAxis
      const grid = data.grid || defaultGrid
      const { series, legend } = this.formatData(data)
      this.chart.clear()
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: legend,
        grid: grid,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series
      })
    }
  }
}
</script>
