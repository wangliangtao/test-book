<template>
  <div
    :id="id"
    :class="className"
    :style="{height:height,width:width}"
    @click.stop
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
    formatData (yData = [], data = {}) {
      const obj = {
        series: yData.map(item => {
          return {
            name: item[0].name,
            type: item[0].type || 'bar',
            stack: item[0].stack,
            areaStyle: item[0].areaStyle,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: item[0].color[0] },
                    { offset: 1, color: item[0].color[1] }
                  ]
                )
              }
            },
            barMinHeight: 2,
            yAxisIndex: item[0].yAxisIndex || 0,
            data: item.map(val => {
              return {
                value: val.value,
                params: val
              }
            }),
            label: {
              show: true,
              position: 'top',
              align: 'center',
              color: '#fff'
            }
          }
        }),
        legend: {
          top: 15,
          data: yData.map(item => item[0].name),
          textStyle: {
            color: '#fff'
          },
          selectedMode: false,
          // icon: 'roundRect'
          ...data.legend
        }
      }
      return obj
    },
    drawLine () {
      if (!this.chart) {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id))
        this.$once('hook:beforeDestroy', () => {
          this.chart && this.chart.dispose()
          this.chart = null
        })
        this.chart.on('click', params => this.$emit('click', params))
      }
    },
    initChart (data = {}) {
      const { series, legend } = this.formatData(data.yData, data)
      const defaultYAxis = [
        {
          type: 'value',
          axisLabel: {
            show: true,
            color: 'rgba(255, 255, 255, 0.7)'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.7)', // x坐标轴的轴线颜色
              width: 0 //这里是坐标轴的宽度,为0就是不显示
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      ]
      const defaultXAxis = {
        type: 'category',
        axisLabel: {
          color: 'rgba(255,255,255,0.7)'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)', // x坐标轴的轴线颜色
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data: data.xData || []
      }
      const defaultGrid = {
        left: '0',
        right: '0',
        bottom: '15',
        top: '30%',
        containLabel: true
      }
      const defaultTooltip = {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(51, 136, 255, 0.2)'
          }
        },
        formatter: params => {
          let header = `<div style="color:#fff">${params[0].axisValueLabel}</div>`
          let content = `
              <div>
                ${params[0].marker}
                <span style="color:#fff">${params[0].seriesName} </span>
                <span style="color:${params[0].color.colorStops[0].color};">${params[0].value}</span>
              </div>
            `
          return header + content
        },
        backgroundColor: 'rgba(15, 41, 77, 0.9)',
        borderWidth: 0
      }
      const yAxis = data.yAxis || defaultYAxis
      const xAxis = data.xAxis || defaultXAxis
      const tooltip = data.tooltip || defaultTooltip
      const grid = data.grid || defaultGrid
      this.chart.clear()
      this.chart.setOption({
        tooltip: tooltip,
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
