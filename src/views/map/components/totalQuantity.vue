<template>
  <div class="totalQuantity-wrap">
    <div class="item">
      <div class="label">
        总待缴费金额
      </div>
      <div class="count moneyFont amount">
        {{ (data.pendingPayAmount | 0) / 100 | formatNumber(2, ',') }}
      </div>
    </div>
    <div class="item">
      <div class="label">
        总剩余泊位数量
      </div>
      <div class="count moneyFont quantity">
        {{ data.slots | formatNumber(0, ',') }}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import {postPayAndSlots} from '@/api/parking'
export default {
  data() {
    return {
      data: {}
    }
  },
  computed: {
    ...mapState('mapDetails',{
      mapSearch: state => state.mapSearch
    })
  },
  watch: {
    mapSearch: {
      handler() {
        this.getData()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    getData() {
      postPayAndSlots({...this.mapSearch}).then(res => {
        this.data = res.body || {}
      })
    }
  }
}
</script>

<style scoped lang="scss">
.totalQuantity-wrap {
  padding: 12px 15px 15px;
  min-width: 276px;
  background: url('~@/static/mapData/img_overview_bg@2x.png') 0 0 no-repeat;
  background-size: 100% 100%;
  .item + .item {
    margin-top: 5px;
  }
  .item {
    padding: 15px 20px;
    background: url('~@/static/mapData/img_overview_bg_single@2x.png') 0 0 no-repeat;
    background-size: 100% 100%;
    .label {
      font-size: 16px;
      color: $mapFontColorDefault1-1;
      line-height: 22px;
    }
    .count {
      font-size: 36px;
      line-height: 47px;
      &.amount {
        color: $mapFontColor3-1;
      }
      &.quantity {
        color: $mapFontColor1-1;
      }
    }
  }
}
</style>