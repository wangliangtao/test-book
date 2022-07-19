<template>
  <div class="mapDetails-wrap">
    <div class="header">
      <svg-icon
        class="closed"
        icon-class="icon_close_14"
        @click="callClosed"
      />
      <ul class="header-tabs">
        <li
          v-for="(item, index, key) in tabs"
          :key="key"
          :class="{active: item.name === active}"
          @click="changeTabs(item)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div class="mapDetails-content">
      <transition
        enter-active-class="animate__bounceInLeft"
        leave-active-class="animate__bounceOutRight"
        mode="out-in"
      >
        <component
          :is="active"
          class="animate__animated"
          :data="siteManageDetail.data"
          :child-data="childData"
          @goOrder="goOrder"
        />
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import siteManage from './components/siteManage/index'
import parkRecord from './components/parkRecord/index'
import paymentOrder from './components/paymentOrder/index'
export default {
  components: {
    siteManage,
    parkRecord,
    paymentOrder
  },
  data () {
    return {
      active: 'siteManage',
      tabs: [
        { title: '场地管理', name: 'siteManage' },
        { title: '停车记录', name: 'parkRecord' },
        { title: '支付订单', name: 'paymentOrder' }
      ],
      childData: {}
    }
  },
  computed: {
    ...mapState('mapDetails', {
      siteManageDetail: state => state.siteManageDetail
    })
  },
  methods: {
    changeTabs ({ name }) {
      this.active = name
    },
    callClosed () {
      // 清空场地管理中的缓存数据
      this.$store.dispatch('mapDetails/changeSiteDetail', { basicItems: {} })
      this.$emit('close')
    },
    goOrder (orderId) {
      this.childData = { orderId: orderId }
      this.active = 'paymentOrder'
    }
  }
}
</script>

<style scoped lang="scss">
.mapDetails-wrap {
  .header {
    position: relative;
    padding: 10px 10px 0;
    height: 50px;
    background-color: $mapColor3-2;
    border-bottom: 1px solid $mapColor4-1;
    background-image: url('~@/static/maps/decoration3.png');
    background-size: cover;
    background-repeat: no-repeat;
    .closed {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 14px;
      color: $mapFontColorDefault1-2;
      cursor: pointer;
      &:hover {
        color: $mapFontColorDefault1-1;
      }
    }
    .header-tabs {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 14px;
      color: $mapFontColorDefault1-2;
      line-height: 40px;
      li {
        margin-right: 5px;
        padding: 0 20px;
        background-color: transparent;
        border: 1px solid transparent;
        border-bottom: none;
        cursor: pointer;
        transition: all 0.3s;
        &:hover,
        &.active {
          border-radius: 4px 4px 0 0;
          background-color: $mapColor1-2;
          border: 1px solid $mapColor4-1;
          border-bottom: none;
        }
        &.active {
          font-size: 16px;
          color: $mapFontColorDefault1-1;
          font-weight: bold;
        }
      }
    }
  }
  .mapDetails-content {
    position: relative;
    background-image: url('~@/static/maps/decoration3.png');
    background-position: left bottom;
    background-size: cover;
    background-repeat: no-repeat;
    .animate__animated {
      animation-duration: 0.5s;
    }
  }
}
</style>
