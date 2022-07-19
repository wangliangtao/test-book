<template>
  <div
    :class="['parkAccounted-wrap', {edit: operationStatus === 'edit', checked: checked}]"
    @click="renderMapLoca()"
  >
    <div class="tips">
      <svg-icon
        icon-class="icon_thermal"
      />
      气泡图
    </div>
    <div class="item1">
      <div class="header">
        <span class="cur" />
        停车场数量
        <span
          class="download"
        >
          <svg-icon
            icon-class="icon_export"
          />
          导出报表
        </span>
      </div>
      <div class="data-container">
        <Piechart
          :id="id"
          width="167px"
          height="167px"
          :data="chartData"
          :total="data.parkingNum"
          title="停车场总数"
          @click="renderMapLoca"
        />
        <div class="datas-wrap">
          <div
            v-for="(item, key) in list"
            :key="key"
            :class="['data-item', item.class]"
            @click.stop="renderMapLoca(item)"
          >
            <div class="left">
              <div class="title">
                <span class="cur" />
                {{ item.name }}
              </div>
              <div class="count moneyFont">
                {{ item.value }}
              </div>
            </div>
            <div class="right">
              <div class="title">
                占比
              </div>
              <div class="count moneyFont">
                {{ item.perValue }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const echarts = require('echarts')
import Piechart from './parkAccountedComponent/pieChart'
import timingRefresh from './timingRefresh'
import {postParkingInfo} from '@/api/report'
export default {
  components: {
    Piechart
  },
  mixins: [timingRefresh],
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
      default: 'parkAccounted' + Date.now()
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data () {
    return {
      data: {},
      chartData: [],
      list: [
        { name: '普通停车场', key: 'commonNum', value: 0, perKey: 'commonNumPer', perValue: 0, class: 'common_park' },
        { name: 'P+R停车场', key: 'prnum', value: 0, perKey: 'prper', perValue: 0, class: 'PR_park' },
        { name: '路内泊位', key: 'roadNum', value: 0, perKey: 'roadNumPer', perValue: 0, class: 'road_park' },
      ],
      color: [
        this.chartLinearGradient('#80B5FF','#3388FF'),
        this.chartLinearGradient('#FFBB33','#FFD480'),
        this.chartLinearGradient('#66CC88','#14CC52')
      ]
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
      this.chartData = []
      postParkingInfo({...this.params})
        .then(res => {
          this.data = res.body || {}
          this.list.forEach(item => {
            item.value = this.data[item.key] || 0
            item.perValue = this.data[item.perKey]
            this.chartData.push({...item})
          })
        })
        .then(() => this.setRegular('00:20', this.getData))
    },
    chartLinearGradient(color1, color2) {
      return new echarts.graphic.LinearGradient(0, 0, 0, 1,[{ offset: 0, color: color1 },{ offset: 1, color: color2 }])
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
        resourceType: data.class ? [data.class] : [],
        methods: 'postResourceBubble'
      }
      this.clickWrap(params)
    }
  }
}
</script>
<style lang="scss" scoped>
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
.header {
  margin-bottom: 15px;
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
.parkAccounted-wrap {
  position: relative;
  border: 3px solid transparent;
  border-radius: 4px;
  &.edit {
    .tips {
      top: 35px;
      border-radius: 4px 0px 0px 4px;
    }
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
    padding: 15px 20px;
    height: 224px;
    cursor: pointer;
    .data-container {
      display: flex;
    }
    .datas-wrap {
      flex: 1;
      margin-left: 19px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      .data-item {
        display: flex;
        cursor: pointer;
        & > div {
          flex: 1;
          padding: 5px 0;
        }
        &:hover {
          .left {
            background-color: $mapColor5-1;
          }
          .right {
            background-color: $mapColor4-1;
          }
        }
        .left {
          border-radius: 2px 0px 0px 2px;
          background-color: $mapColor4-1;
          transition: all .3s;
        }
        .right {
          border-radius: 0px 2px 2px 0px;
          background-color: $mapColor10-1;
          transition: all .3s;
        }
        .title {
          font-size: 12px;
          line-height: 18px;
          color: $mapFontColorDefault1-1;
          .cur {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
        }
        .count {
          margin-top: 2px;
          font-size: 16px;
          line-height: 22px;
        }
        &.common_park {
          .title {
            .cur {
              background-color: $mapFontColor1-1;
            }
          }
          .count {
            color: $mapFontColor1-1;
          }
        }
        &.PR_park {
          .title {
            .cur {
              background-color: $mapFontColor3-1
            }
          }
          .count {
            color: $mapFontColor3-1;
          }
        }
        &.road_park {
          .title {
            .cur {
              background-color: $mapFontColor2-1;
            }
          }
          .count {
            color: $mapFontColor2-1;
          }
        }
      }
    }
  }
}
</style>
