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
        this.drawLine()
        this.$nextTick(() => {
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
    initChart ({data,title,color, bgColor}) {
      this.chart.setOption(
        {
          title: {
            text: '{a|' + data + '}{c|%}',
            textStyle: {
              rich: {
                a: {
                  fontSize: 24,
                  color: color,
                  fontWeight: 'bold',
                  fontFamily: 'BEBAS'
                },
                c: {
                  fontSize: 12,
                  color: color
                }
              }
            },
            subtext: title,
            subtextStyle: {
                color: '#fff',
                fontSize: 12
            },
            itemGap: 4,
            left: 'center',
            top: '32%'
          },
          angleAxis: {
            max: 100,
            clockwise: true, // 逆时针
            // 隐藏刻度线
            show: false
          },
          radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false,

            },
            axisTick: {
                show: false
            },
          },
          polar: {
            center: ['50%', '50%'],
            radius: '100' //图形大小
          },
          series: [{
            type: 'bar',
            data: [data || 0],
            showBackground: true,
            backgroundStyle: {
              color: '#1F5299',
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 12,
            itemStyle: {
              normal: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: bgColor[0]
                }, {
                    offset: 1,
                    color: bgColor[1]
                }]),
                // shadowBlur: 5,
                // shadowColor: '#2A95F9',
              }
            }
          }]
        }
      )
    }
  }
}
</script>
