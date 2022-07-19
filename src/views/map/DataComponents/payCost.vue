<template>
  <div
    :class="['payCost', {edit: operationStatus === 'edit', checked: checked}]"
    @click="clickWrap"
  >
    <div class="item1">
      <div class="header">
        <span class="cur" />
        缴费情况（近14日）
      </div>
      <BarLineChart
        :id="id"
        class="chart"
        width="100%"
        height="100%"
        :data="chartData"
      />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BarLineChart from './payCostComponents/barLineChart'
import {postPayChartInfo} from '@/api/report'
import timingRefresh from './timingRefresh'
export default {
  components: {BarLineChart},
  mixins: [timingRefresh],
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: 'payCost' + Date.now()
    },
    params: {
      type: Object,
      default: () => {}
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: [],
      chartData: {
        xData: [],
        yData: []
      }
    }
  },
  watch: {
    params: {
      handler() {
        this.getData()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getData() {
      postPayChartInfo({...this.params})
        .then(res => {
          this.data = res.body || []
          this.initChartData(this.data)
        })
        .then(() => this.setRegular('00:20', this.getData))
    },
    initChartData(payLoad) {
      this.chartData.xData = []
      const bar1 = [],bar2 = [],line1 = [],line2 = []
       payLoad.forEach(item => {
         this.chartData.xData.push(item.feeDate)
         bar1.push({
            value: item.payAllAmount / 100,
            color: ['#FFD480', '#FFBB33'],
            name: '应收金额',
            yAxisIndex: 0,
            // stack: '总量'
          })
        bar2.push({
            value: item.paid / 100,
            color: ['#80B5FF', '#3388FF'],
            name: '实收金额',
            yAxisIndex: 0,
            // stack: '总量'
          })
        line1.push({
            value: item.paidAllNum,
            color: ['#FF8A80', '#FF8A80'],
            name: '应付次数',
            yAxisIndex: 1,
            type: 'line'
          })
        line2.push({
            value: item.paidNum,
            color: ['#66CC88', '#66CC88'],
            name: '实付次数',
            yAxisIndex: 1,
            type: 'line'
          })
      })
      this.chartData.yData = [bar1,bar2,line1,line2]
    },
    clickWrap() {
      this.$emit('changeCheck', 'park')
    }
  }
}
</script>

<style scoped lang="scss">
.payCost {
  border: 3px solid transparent;
  border-radius: 4px;
  &.edit {
    .item1 {
      padding: 35px 20px 20px;
      height: 244px;
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
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: 224px;
    .header {
      margin-bottom: 10px;
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
    .chart {
      flex: 1;
    }
  }
}
</style>