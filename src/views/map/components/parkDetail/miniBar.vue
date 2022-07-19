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
  methods: {
    formatData (data) {
      const obj = {
        series: data.map(item => {
          return {
            name: item[0].name,
            type: item[0].type || 'bar',
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
            yAxisIndex: item[0].yAxisIndex || 0,
            barMinHeight: 2,
            data: item.map(val => {
              return {
                value: val.value,
                params: val
              }
            })
          }
        }),
        legend: {
          right: '0',
          data: data.map(item => item[0].name),
          textStyle: {
            color: '#fff'
          },
          selectedMode: false,
          // icon: 'roundRect'
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
          min: 0,
          max: 100,
          interval: 25,
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            showMinLabel: false,
            showMaxLabel: null,
            formatter: value => {
              if (value <= 25) {
                return '爆满'
              } else if (value <= 50) {
                return '拥挤'
              } else if (value <= 75) {
                return '一般'
              } else {
                return '空闲'
              }
            }
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
      ]
      const yAxis = data.yAxis || defaultYAxis
      const { series, legend } = this.formatData(data.yData)
      this.chart.clear()
      this.chart.setOption({
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
            let content = params.map(item => {
              return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color.colorStops[0].color};"></span> 
              <span style="color:#fff">${item.seriesName} </span>
              <span style="color:${item.color.colorStops[0].color};">${item.data.params.str}</span>`
            }).join('<br/>')
            return date + content
          },
          backgroundColor: 'rgba(15, 41, 77, 0.9)',
          borderWidth: 0
        },
        legend: legend,
        grid: {
          left: '1%',
          right: '1%',
          bottom: '1%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          interval: 1,
          axisLabel: {
            color: 'rgba(255,255,255,0.7)',
            // formatter: value => this.$moment(+value).format('MM-DD')
            // formatter: value => value
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)', // x坐标轴的轴线颜色
              width: 0 //这里是坐标轴的宽度,为0就是不显示
            }
          },
          // splitLine: {
          //   show: false
          // },
          axisTick: {
            show: false
          },
          data: data.xData || []
        },
        yAxis: yAxis,
        series: series
      })
    }
  }
}
</script>
