<template>
  <div
    :class="['hot-wrap', {edit: operationStatus === 'edit', checked: checked}]"
    @click="renderMapLoca()"
  >
    <div class="tips">
      <svg-icon icon-class="icon_thermal" />
      热力图
    </div>
    <div class="item1">
      <div class="header">
        <span class="cur" />
        周转率（近24小时）
      </div>
      <div
        v-show="form.up"
        class="reset"
        @click="getData"
      >
        <svg-icon icon-class="icon_reset_12" />
        重置为全部区间
      </div>
      <div
        style="height: 100%;"
        @click.stop
      >
        <BarChart
          :id="id"
          width="100%"
          height="100%"
          :data="data"
          @click="clickBar"
        />
      </div>
    </div>
    <div class="item2">
      <div class="title">
        <div>
          下级停车场数量占比：<span>{{ form.xname }}</span>
        </div>
      </div>
      <div class="item2-content">
        <div class="left">
          <el-scrollbar
            class="scrollbar"
            wrap-class="x-hidden"
          >
            <div
              v-for="(item,index,key) in pieData"
              :key="key"
              class="item"
              @click.stop="renderMapLoca(item)"
            >
              <div>
                <svg-icon icon-class="icon_color_round" />
                <span :title="item.name">{{ item.name }}</span>
              </div>
              <div><span class="count moneyFont">{{ item.per }}%</span></div>
              <div><span class="count moneyFont">{{ item.value }}</span><span class="str">个</span></div>
            </div>
          </el-scrollbar>
        </div>
        <div class="right">
          <PieChart
            :id="pieId"
            width="100%"
            height="100%"
            :data="pieData"
            @click="renderMapLoca"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import timingRefresh from './timingRefresh'
import BarChart from './circulationHotPowerComponent/barChart'
import PieChart from './circulationHotPowerComponent/pieChart'
import { postTurnoverRateInterval, postTurnoverRateIntervalDetail } from '@/api/report'
import mapBus from '../mapBus'
export default {
  components: {
    BarChart,
    PieChart
  },
  mixins: [timingRefresh],
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
      default: 'parkTime' + Date.now()
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pieId: 'pie' + Date.now(),
      data: {
        xData: [],
        yData: []
      },
      form: {
        up: '',
        down: '',
        xname: '全部区间'
      },
      pieData: []
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
  methods: {
    getData () {
      mapBus.$emit('clearMapLoca')
      this.form = {
        up: '',
        down: '',
        xname: '全部区间'
      }
      this.pieData = []
      postTurnoverRateInterval({ ...this.params })
        .then(res => {
          this.initChartData(res.body || [])
          this.getPieData()
        })
        .then(() => this.setRegular('00:20', this.getData))
    },
    getPieData () {
      const params = { ...this.params, ...this.form }
      postTurnoverRateIntervalDetail(params).then(res => {
        const data = res.body || []
        this.pieData = data.map(item => {
          return { name: item.l4Region || item.l3Region, value: item.parkingNum || 0, per: item.percentage || 0 }
        })
      })
    },
    initChartData (payLoad) {
      this.data.xData = []
      const bar = payLoad.map(item => {
        this.data.xData.push(item.xname)
        return {
          value: item.parkingNum,
          data: { ...item },
          color: ['#80B5FF', '#3388FF'],
          name: '停车场数量'
        }
      })
      this.data.yData = [bar]
    },
    clickWrap (data) {
      this.$emit('changeCheck', 'renderMapLoca', data)
    },
    clickBar () {
      if (this.operationStatus === 'edit') return
      // const params= data.params.data|| {}
      // this.form = {...params}
      this.getPieData()
      this.renderMapLoca()
    },
    renderMapLoca (data = {}) {
      if (this.operationStatus === 'edit') return
      const { l3Region } = this.params
      const params = {
        ...this.params,
        ...this.form,
        l3Region: l3Region ? l3Region : data.name,
        l4Region: l3Region ? data.name : '',
        methods: 'postHeatMap'
      }
      this.clickWrap(params)
    }
  }
}
</script>

<style scoped lang="scss">
.tips {
  position: absolute;
  right: -3px;
  top: -3px;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  color: $mapFontColorDefault1-1;
  background: linear-gradient(225deg, #80b5ff 0%, #3388ff 100%);
  border-radius: 0px 4px 0px 4px;
  z-index: 1;
}
.title {
  margin-bottom: 20px;
  font-size: 12px;
  color: $mapFontColorDefault1-1;
  text-align: center;
  div {
    position: relative;
    display: inline-block;
    &::after,
    &::before {
      content: '';
      position: absolute;
      top: 45%;
      width: 15px;
      height: 1px;
      transform: translate(0, -50%);
      background-color: #d8d8d8;
      opacity: 0.4;
    }
    &::after {
      right: -25px;
    }
    &::before {
      left: -25px;
    }
    span {
      color: $mapFontColor1-1;
      font-weight: bold;
    }
  }
}
.hot-wrap {
  position: relative;
  border: 3px solid transparent;
  &.edit {
    .tips {
      top: 35px;
      border-radius: 4px 0 0 4px;
    }
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
      background-color: $mapColor4-3;
    }
    .item2 {
      background-color: $mapColor3-4;
    }
  }
  &.checked {
    border-color: $mapFontColor1-1;
    .item1 {
      background-color: $mapColor4-3;
    }
    .item2 {
      background-color: $mapColor3-4;
    }
  }
  .item1 {
    position: relative;
    padding: 15px;
    height: 234px;
    background-color: $mapColor3-3;
    .header {
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
    .reset {
      position: absolute;
      right: 18px;
      top: 35px;
      font-size: 12px;
      color: $mapFontColor1-1;
      cursor: pointer;
      z-index: 1;
    }
  }
  .item2 {
    padding: 15px;
    height: 234px;
    display: flex;
    flex-direction: column;
    .item2-content {
      flex: 1;
      display: flex;
      overflow: hidden;
      .left {
        flex: 1;
        overflow: hidden;
        .scrollbar {
          height: 100%;
        }
        .item + .item {
          margin-top: 5px;
        }
        .item {
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
          height: 28px;
          line-height: 28px;
          font-size: 14px;
          color: $pieColor1;
          border-radius: 2px;
          background-color: $mapColor10-1;
          cursor: pointer;
          &:hover {
            background-color: $mapColor5-1;
          }
          div {
            display: flex;
            align-items: center;
            span {
              display: inline-block;
            }
            .str {
              margin-top: 3px;
            }
          }
          & > div:first-of-type {
            font-size: 12px;
            flex: 0 0 70px;
            overflow: hidden;
            span {
              margin-left: 5px;
              flex: 1;
              color: $mapFontColorDefault1-1;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .item:nth-of-type(1) {
          color: $pieColor1;
        }
        .item:nth-of-type(2) {
          color: $pieColor2;
        }
        .item:nth-of-type(3) {
          color: $pieColor3;
        }
        .item:nth-of-type(4) {
          color: $pieColor4;
        }
        .item:nth-of-type(5) {
          color: $pieColor5;
        }
        .item:nth-of-type(6) {
          color: $pieColor6;
        }
        .item:nth-of-type(7) {
          color: $pieColor7;
        }
        .item:nth-of-type(8) {
          color: $pieColor8;
        }
        .item:nth-of-type(9) {
          color: $pieColor9;
        }
        .item:nth-of-type(10) {
          color: $pieColor10;
        }
        .item:nth-of-type(11) {
          color: $pieColor11;
        }
        .item:nth-of-type(12) {
          color: $pieColor12;
        }
        .item:nth-of-type(13) {
          color: $pieColor13;
        }
        .item:nth-of-type(14) {
          color: $pieColor14;
        }
        .item:nth-of-type(15) {
          color: $pieColor15;
        }
        .item:nth-of-type(16) {
          color: $pieColor16;
        }
        .item:nth-of-type(17) {
          color: $pieColor17;
        }
        .item:nth-of-type(18) {
          color: $pieColor18;
        }
        .item:nth-of-type(19) {
          color: $pieColor19;
        }
        .item:nth-of-type(20) {
          color: $pieColor20;
        }
        .item:nth-of-type(21) {
          color: $pieColor21;
        }
        .item:nth-of-type(22) {
          color: $pieColor22;
        }
        .item:nth-of-type(23) {
          color: $pieColor23;
        }
        .item:nth-of-type(24) {
          color: $pieColor24;
        }
      }
      .right {
        flex: 1;
        height: 100%;
      }
    }
  }
}
</style>
