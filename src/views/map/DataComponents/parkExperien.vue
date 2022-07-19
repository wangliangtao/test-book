<template>
  <div
    :class="['parkExperien-wrap', {edit: operationStatus === 'edit', checked: checked}]"
    @click="clickWrap"
  >
    <div class="item1">
      <div class="header">
        <span class="cur" />
        停车体验
      </div>
      <ScatterChart
        :id="id"
        width="100%"
        height="100%"
        :data="data"
      />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import ScatterChart from './parkExperienComponents/scatterChart'
import { postParkingExperience } from '@/api/report'
const DEFAULTTIME = 60 * 1000
export default {
  components: {
    ScatterChart
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => { }
    },
    id: {
      type: String,
      default: 'parkExperien' + Date.now()
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data () {
    return {
      timer: null,
      data: {
        legendData: [{ name: '付款金额' }],
        xAxis: {
          type: 'category',
          interval: 1,
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            formatter: value => this.$moment(+value).format('HH:mm')
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
          },
          name: '支付时间',
          nameGap: 25,
          nameLocation: 'center'
        },
        yAxis: [
          {
            type: 'value',
            interval: 20,
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.7)',
              formatter: value => value + 's',
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
          }
        ],
        series: [
          {
            name: '付款金额',
            symbolSize: (value) => {
              if (value[1] > 6) {
                return 10
              } else if (value[1] > 3) {
                return 8
              } else {
                return 6
              }
            },
            itemStyle: {
              color: 'rgba(255, 204, 102, 0.8)'
            },
            emphasis: {
              itemStyle: {
                color: 'rgba(255, 204, 102, 1)'
              }
            },
            type: 'scatter',
            data: [],
            tooltip: {
              formatter: params => {
                const data = params.value
                const content = `
                  <div>
                    <div style="display:flex;align-items: center;">
                      <div style="color:rgba(255,255,255,0.7)">停车场地：</div>
                      <div style="color:rgba(255,255,255,1)">${data[2]}</div>
                    </div>
                    <div style="display:flex;align-items: center;">
                      <div style="color:rgba(255,255,255,0.7)">车牌号码：</div>
                      <div  style="color:rgba(255,255,255,1)">${data[3]}</div>
                    </div>
                    <div style="display:flex;align-items: center;">
                      <div style="color:rgba(255,255,255,0.7)">支付时间：</div>
                      <div  style="color:rgba(255,255,255,1)">${this.$moment(+data[0]).format('HH:mm:ss')}</div>
                    </div>
                    <div style="display:flex;align-items: center;">
                      <div style="color:rgba(255,255,255,0.7)">实付车费：</div>
                      <div  style="color:rgba(255,255,255,1)">${data[4] / 10}元</div>
                    </div>
                    <div style="display:flex;align-items: center;">
                      <div style="color:rgba(255,255,255,0.7)">付款时长：</div>
                      <div  style="color:rgba(255,255,255,1)">${data[1]}秒</div>
                    </div>
                  </div>`
                return content
              },
              backgroundColor: 'rgba(15, 41, 77, 0.9)',
              borderWidth: 0
            }
          }
        ]
      }
    }
  },
  watch: {
    params: {
      handler () {
        this.getData()
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy () {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    getData () {
      postParkingExperience({ ...this.params })
        .then(res => {
          this.initChartData(res.body || {})
        })
        .then(() => {
          if (this.timer) clearInterval(this.timer)
          this.timer = setTimeout(this.getData, DEFAULTTIME)
        })
    },
    initChartData (payLoad) {
      this.data.series[0].data = payLoad.map(item => {
        return {
          name: '付款金额',
          value: [item.payTime, item.duration, item.parkingName, item.plateNo, item.paid]
        }
      })
    },
    clickWrap () {
      this.$emit('changeCheck', 'park')
    }
  }
}
</script>

<style scoped lang="scss">
.parkExperien-wrap {
  border: 3px solid transparent;
  border-radius: 4px;
  &.edit {
    .item1 {
      padding: 40px 20px 20px;
      height: 244px;
      .header {
        top: 45px;
      }
    }
  }
  &:not(.edit, .checked):hover {
    border-color: $mapColor3-4;
    .item1 {
      background-color: $mapColor3-4;
    }
  }
  &.checked {
    border-color: $mapFontColor1-1;
    .item1 {
      background-color: $mapColor3-4;
    }
  }
  .item1 {
    position: relative;
    padding: 15px;
    height: 224px;
    .header {
      position: absolute;
      top: 15px;
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
    }
  }
}
</style>
