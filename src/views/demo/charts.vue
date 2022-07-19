<template>
  <div class="aaa">
    <div
      :id="id"
      :style="{width: '100%',height: '100%'}"
    />
  </div>
</template>

<script type="text/ecmascript-6">
const echarts = require('echarts')
import resize from '@/components/Charts/mixins/resize'
export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'charts'
    },
    data: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pieChart: null
    }
  },
  mounted() {
    setTimeout(() => {
      console.log(this.data, 'data');
      this.initPieChart()
    },100)
  },
  methods: {
    random(min,max) {
      return Math.floor(Math.random()*(max-min+1))+min
    },
    initPieChart() {
      if (!this.pieChart) {
        this.pieChart = echarts.init(document.getElementById(this.id))
        this.$once('hook:beforeDestroy', () => {
          this.pieChart && this.pieChart.dispose()
          this.pieChart = null
        })
        this.pieChart.setOption({
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
              data: [
                {value: this.random(100,10000), name: '搜索引擎'},
                {value: this.random(100,10000), name: '直接访问'},
                {value: this.random(100,10000), name: '邮件营销'},
                {value: this.random(100,10000), name: '联盟广告'},
                {value: this.random(100,10000), name: '视频广告'}
              ]
            }
          ]
        })
      } else {
        let option = this.pieChart.getOption()
        option.series[0].data = this.pieData
        this.pieChart.setOption(option)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.aaa {
  width: 150px;
  height: 150px;
  // background-color: #fff;
  // border-radius: 50%;
}
</style>