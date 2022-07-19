<template>
  <div
    :class="['parkTime-wrap', {edit: operationStatus === 'edit', checked: checked}]"
    @click.stop="renderMapLoca()"
  >
    <div class="tips">
      <svg-icon
        icon-class="icon_grid"
      />
      网格图
    </div>
    <div class="item1">
      <div class="header">
        <span class="cur" />
        停车时长（近24小时）
        <span class="download">
          <svg-icon
            icon-class="icon_export"
          />
          导出报表
        </span>
      </div>
      <BarChart
        :id="id"
        width="100%"
        height="100%"
        :data="data"
        @click="renderMapLoca"
      />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BarChart from './parkTimeComponent/barChart'
import {postParkingTime} from '@/api/report'
const DEFAULTTIME = 60 * 60 * 1000
export default {
  components: {
    BarChart
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
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
  data() {
    return {
      timer: null,
      data: {
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
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    getData() {
      postParkingTime({...this.params})
        .then(res => {
          this.initChartData(res.body || [])
        })
        .then(() => {
          if (this.timer) clearInterval(this.timer)
          this.timer = setTimeout(this.getData, DEFAULTTIME)
        })
    },
    initChartData(payLoad) {
      this.data.xData = []
      const bar = payLoad.map(item => {
        this.data.xData.push(item.time)
        return {
          value: item.parkingNum,
          color: ['#66CC88', '#14CC52'],
          name: '停车数量'
        }
      })
      this.data.yData = [bar]
    },
    clickWrap(data) {
      if (data) {
        this.$emit('changeCheck', 'renderMapLoca', data)
      } else {
        this.$emit('changeCheck')
      }
    },
    renderMapLoca(data = {}) {
      if (this.operationStatus === 'edit') return
      const params = {
        ...this.params,
        parkingTime: data.name || '',
        methods: 'postParkingTimeHeatMap'
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
  background: linear-gradient(225deg, #80B5FF 0%, #3388FF 100%);
  border-radius: 0px 4px 0px 4px;
  z-index: 1;
}
.parkTime-wrap {
  position: relative;
  border: 3px solid transparent;
  border-radius: 4px;
  &.edit {
    .tips {
      top: 35px;
      border-radius: 4px 0 0 4px;
    }
    .item1 {
      padding: 40px 20px 20px;
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
    padding: 15px;
    height: 224px;
    cursor: pointer;
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
      .download {
        margin-left: 20px;
        color: $mapFontColor1-1;
        cursor: pointer;
      }
    }
  }
}
</style>