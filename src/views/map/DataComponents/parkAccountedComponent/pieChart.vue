<template>
  <div
    :id="id"
    :class="className"
    :style="{height:height,width:width}"
    @click.stop
  />
</template>

<script>
import { pieColors } from '@/utils/lookup'
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
      type: Array,
      default: function () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    total: {
      type: Number,
      default: 0
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
    drawLine () {
      if (!this.chart) {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id))
        this.$once('hook:beforeDestroy', () => {
          this.chart && this.chart.dispose()
          this.chart = null
        })
        this.chart.on('click', params => this.$emit('click', params))
      } else {
        let option = this.chart.getOption()
        option.series[0].data = this.data
        this.chart.setOption(option)
      }
    },
    initChart (data = []) {
      const defaultTooltip = {
        show: true,
        trigger: 'item',
        confine: true,
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(51, 136, 255, 0.2)'
          }
        },
        formatter: params => {
          let header = `<span style="color:#fff;font-size: 12px;">停车场数量占比</span>
                <br/>`
          let content = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span> 
            <span style="color:#fff;font-size: 12px;">${params.name} </span>
            <span style="color:${params.color};font-size: 12px;">${params.data.perValue}%</span>`
          return header + content
        },
        backgroundColor: 'rgba(15, 41, 77, 0.9)',
        borderWidth: 0
      }
      const tooltip = data.tooltip || defaultTooltip
      this.chart.clear()
      this.chart.setOption({
        color: pieColors,
        tooltip: tooltip,
        title: {
          show: true,
          text: this.total || 0,
          subtext: this.title,
          left: 'center',
          top: 'center',
          itemGap: -5,
          textStyle: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '36px',
            fontFamily: 'BEBAS',
          },
          subtextStyle: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
          }
        },
        series: {
          type: 'pie',
          itemStyle: {
              // borderColor: 'transparent',
              borderColor: 'rgba(25, 68, 128, 0.6)',
              borderWidth: 2,
              
          },
          emphasis: {
            scaleSize: 3
          },
          radius: ['65%', '95%'],
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          data: data
        }
      })
    }
  }
}
</script>
