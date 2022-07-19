<template>
  <div class="mapSidebarDownload-wrap">
    <div class="header">
      <div>报表导出</div>
      <svg-icon
        class="closed"
        icon-class="icon_close_14"
        @click="callClosed"
      />
    </div>
    <div class="mapSidebarDownload-content">
      <ul class="dataMenu">
        <el-scrollbar
          wrap-class="x-hidden"
          style="height: 100%;"
        >
          <li
            v-for="(item,index, key) in menuRouter"
            :key="key"
            :class="[active === item.value && 'active']"
            @click="changeTabs(item)"
          >
            {{ item.label }}
          </li>
        </el-scrollbar>
      </ul>
      <transition
        name="fade-transform"
        mode="out-in"
      >
        <component :is="active" />
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { mapSidebarDownloadRouter } from '@/utils/lookup'
import ParkAccounted from './menuViews/ParkAccounted'
import PayCost from './menuViews/PayCost'
import PaymentMethod from './menuViews/PaymentMethod'
import ParkTraffic from './menuViews/ParkTraffic'
import ParkTime from './menuViews/ParkTime'
import Circulation from './menuViews/Circulation'
import ParkIndex from './menuViews/ParkIndex'
import ParkRecord from './menuViews/ParkRecord'
import ParkCharge from './menuViews/ParkCharge'
export default {
  components: {
    ParkAccounted,
    PayCost,
    PaymentMethod,
    ParkTraffic,
    ParkTime,
    Circulation,
    ParkIndex,
    ParkRecord,
    ParkCharge
  },
  data () {
    return {
      menuRouter: mapSidebarDownloadRouter,
      active: ''
    }
  },
  computed: {
    ...mapState('mapDetails', {
      sidebarDownloadData: state => state.sidebarDownloadData
    })
  },
  mounted () {
    this.active = this.sidebarDownloadData.routerName || this.menuRouter[0].value
  },
  methods: {
    changeTabs ({ value }) {
      this.active = value
    },
    callClosed () {
      this.$store.dispatch('mapDetails/changeSidebarDownloadData', { show: false })
    }
  }
}
</script>

<style scoped lang="scss">
.animate__animated {
  animation-duration: 0.5s;
}
.mapSidebarDownload-wrap {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px - 40px); // 50px 是navbar高度 40px 是距离上下距离
  &::after,
  &::before {
    content: '';
    position: absolute;
    left: 0;
    height: 14px;
    width: 100%;
    z-index: 1;
    background-image: url('~@/static/maps/decoration3.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
  &::after {
    top: 0;
    background-position: left top;
  }
  &::before {
    bottom: 0;
    background-position: left bottom;
  }
  .header {
    position: relative;
    padding: 0 20px;
    height: 50px;
    font-size: 16px;
    font-weight: bold;
    color: $mapFontColorDefault1-1;
    line-height: 50px;
    background-color: $mapColor4-1;
    border-bottom: 1px solid $mapColor4-1;
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
  }
  .mapSidebarDownload-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    .dataMenu {
      position: relative;
      z-index: 1;

      padding: 10px 0;
      flex: 0 0 180px;
      background-color: $mapColor3-1;
      border: 1px solid $mapColor4-1;
      li {
        padding-left: 30px;
        height: 50px;
        font-size: 14px;
        color: $mapFontColorDefault1-2;
        line-height: 50px;
        cursor: pointer;
        transition: all 0.3s;
        &.active {
          color: $mapFontColorDefault1-1;
          background-color: $mapMainColor1-1;
          border-right: 3px solid $mapFontColorDefault1-3;
        }
        &:not(.active):hover {
          background-color: $mapColor4-1;
        }
      }
    }
  }
}
</style>
