<template>
  <div
    :class="['circulation-wrap', {edit: operationStatus === 'edit', checked: checked}]"
    @click="clickWrap"
  >
    <div class="item1">
      <div class="header">
        <span class="cur" />
        周转率排行榜TOP 5（近24小时）
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
import BarChart from './circulationComponent/barChart'
import {postTurnoverRateRanking} from '@/api/report'
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
      default: 'circulation' + Date.now()
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
      postTurnoverRateRanking({...this.params})
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
        this.data.xData.push(item.parkingName)
        return {
          value: item.turnoverRate,
          color: ['#FFD480', '#FFBB33'],
          name: '周转率',
          ...item
        }
      })
      this.data.yData = bar.length > 0 && [bar] || []
    },
    clickWrap(data) {
      if (data) {
        this.$emit('changeCheck', 'renderMapLoca', data)
      } else {
        this.$emit('changeCheck')
      }
    },
    renderMapLoca({data}) {
      if (this.operationStatus === 'edit') return
      const params = {
        ...data.params,
        methods: 'clickDataSidebar'
      }
      this.clickWrap(params)
    }
  }
}
</script>

<style scoped lang="scss">
.circulation-wrap {
  border: 3px solid transparent;
  border-radius: 4px;
  transition: all .3s;
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
    transition: all .3s;
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