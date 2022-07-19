<template>
  <div
    :class="['paymentMethod-wrap', {edit: operationStatus === 'edit', checked: checked}]"
    @click="renderMapLoca()"
  >
    <div class="item1">
      <div class="left">
        <div class="header">
          <span class="cur" />
          支付方式分布图（近14日）
        </div>
        <PieChart
          :id="id"
          width="100%"
          height="100%"
          :data="data"
        />
      </div>
      <div class="right">
        <div
          v-for="(item,index,key) in data"
          :key="key"
          :class="['item', item.class]"
          @click.stop="renderMapLoca(item)"
        >
          <div>
            <svg-icon
              icon-class="icon_color_round"
            />
            <span>{{ item.name }}</span>
          </div>
          <div><span class="count moneyFont">{{ item.perValue }}%</span></div>
          <div><span class="count moneyFont">{{ item.value }}</span><span class="str">次</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import PieChart from './paymentMethodComponent/pieChart'
import timingRefresh from './timingRefresh'
import {postPaymentMode} from '@/api/report'
export default {
  components: {
    PieChart
  },
  mixins: [timingRefresh],
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: 'paymentMethod' + Date.now()
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
      data: [
        { class: 'weChat', name: '微信', key: 'weChartNum', value: 0, perKey: 'weChartPer', perValue: 0 },
        { class: 'groupBuy', name: '团购', key: 'groupBuyNum', value: 0, perKey: 'groupBuyPer', perValue: 0 },
        { class: 'paymax', name: '聚合码', key: 'paymaxNum', value: 0, perKey: 'paymaxPer', perValue: 0 },
        { class: 'etc', name: 'ETC', key: 'etcNum', value: 0, perKey: 'etcPer', perValue: 0 },
        { class: 'citizenCard', name: '市民卡', key: 'citizenCardNum', value: 0, perKey: 'citizenCardPer', perValue: 0 },
        { class: 'monthlyCard', name: '月卡', key: 'monthlyCardNum', value: 0, perKey: 'monthlyCardPer', perValue: 0 },
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
      postPaymentMode({...this.params})
        .then(res => {
          const data = res.body || []
          this.data.forEach(item => {
            item.value = data[item.key] || 0
            item.perValue = data[item.perKey]
          })
        })
        .then(() => this.setRegular('00:20', this.getData))
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
        data: data && data,
        methods: ''
      }
      this.clickWrap(params)
    }
  }
}
</script>

<style scoped lang="scss">
.paymentMethod-wrap {
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
    padding: 15px 20px;
    height: 224px;
    & > div {
      flex: 1;
    }
    .left {
      margin-right: 27px;
      display: flex;
      flex-direction: column;
      .header {
        margin-bottom: 20px;
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
    .right {
      display: flex;
      flex-direction: column;
      .item + .item {
        margin-top: 5px;
      }
      .item {
        flex: 1;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        border-radius: 2px;
        background-color: $mapColor10-1;
        cursor: pointer;
        div {
          display: flex;
          align-items: center;
          .count {
            font-size: 14px;
          }
          .str {
            margin-top: 3px;
          }
        }
        & > div:first-of-type {
          margin-left: 5px;
          width: 49px;
          span {
            color: $mapFontColorDefault1-1;
          }
        }
        &.weChat {
          color: $mapFontColor1-1;
        }
        &.groupBuy {
          color: $mapFontColor3-1;
        }
        &.paymax {
          color: $mapFontColor2-1;
        }
        &.etc {
          color: $mapFontColor4-1;
        }
        &.citizenCard {
          color: $mapFontColor5-1;
        }
        &.monthlyCard {
          color: $mapFontColor6-1;
        }
      }
    }
  }
}
</style>