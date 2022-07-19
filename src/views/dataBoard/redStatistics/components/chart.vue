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
    formatData (data) {
      const obj = {
        series: data.map(item => {
          return {
            name: item[0].name,
            type: item[0].type || 'bar',
            stack: item[0].stack,
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
            data: item.map(val => {
              return {
                value: val.value,
                params: val
              }
            })
          }
        }),
        legend: {
          // right: '0',
          data: data.map(item => item[0].name),
          textStyle: {
            color: '#979BA0'
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
    },
    initChart (data = {}) {
      const defaultYAxis = [
        {
          type: 'value',
          axisLabel: {
            color: '#979BA0'
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
              color: '#F1F2F3'
            }
          }
        }
      ]
      const yAxis = data.yAxis || defaultYAxis
      const { series, legend } = this.formatData(data.yData)
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            let date = `<span style="color:#31353A">${params[0].axisValue}</span><br/>`
            let header = ''
            if (params[0].data && params[0].data.params && params[0].data.params.all) {
              if (this.title) {
                header = `<span style="color:#979BA0">${this.title}</span>
                  <span style="color:#31353A;font-weight: bold;">${params[0].data.params.all || 0}</span>
                  <br/>`
              }
            }
            let content = params.map(item => {
              return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color.colorStops[0].color};"></span>
              <span style="color:#979BA0">${item.seriesName} </span>
              <span style="color:${item.color.colorStops[0].color};">${item.value}</span>`
            }).join('<br/>')
            return date + header + content
          },
          backgroundColor: '#fff'
        },
        legend: legend,
        grid: {
          left: '3%',
          right: '4s%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          interval: 1,
          axisLabel: {
            color: '#979BA0',
            formatter: (value) => this.$moment(value).format('MM-DD')
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff', // x坐标轴的轴线颜色
              width: 0 //这里是坐标轴的宽度,为0就是不显示
            }
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
