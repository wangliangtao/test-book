<template>
  <div class="siteManage-wrap">
    <div class="search-tab">
      <span class="park">{{ getLable(defaultData.parkingSn, parkingList, 'parkingName', 'parkingSn') }}</span>
      <el-popover
        v-model="showChangePark"
        popper-class="map-changePark-popover"
        :visible-arrow="false"
        placement="right"
        trigger="manual"
        width="345"
      >
        <div class="change-header">
          切换停车场
          <svg-icon
            class="closed"
            icon-class="icon_close_14"
            @click="closeChangePark"
          />
        </div>
        <div class="change-content">
          <el-select
            v-model="selectParkId"
            class="map-select change-select"
            placeholder="请选择"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in parkingList"
              :key="item.parkingSn"
              :label="item.parkingName"
              :value="item.parkingSn"
            />
          </el-select>
          <el-button
            class="map-btn-noBorder"
            type="primary"
            round
            @click="confirm"
          >
            确定
          </el-button>
        </div>
        <span
          slot="reference"
          class="replace"
          @click="showChangePark = true"
        >
          <svg-icon icon-class="icon_replace" />
          切换停车场
        </span>
      </el-popover>
    </div>
    <el-tabs
      v-model="activeName"
      class="map-tabs"
    >
      <template v-for="(item,index,key) in tabsData">
        <el-tab-pane
          v-if="!item.hidden"
          :key="key"
          :label="item.label"
          :name="item.name"
        />
      </template>
    </el-tabs>
    <div class="siteManage-content">
      <transition
        enter-active-class="animate__bounceInLeft"
        leave-active-class="animate__bounceOutRight"
        mode="out-in"
      >
        <component
          :is="activeName"
          class="animate__animated"
          :params="defaultData"
          :choose-router-data="chooseRouterData"
        />
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import basicInfo from './basicInfo'
import monitoring from './monitoring'
import gateTemplate from './gateTemplate'
import guideTemplate from './guideTemplate'
import dataStatistical from './dataStatistical'
import { getLable } from '@/utils/function'
import { postParkingNameList, getDeviceGroup } from '@/api/parking'
export default {
  components: {
    basicInfo: basicInfo,
    monitoring: monitoring,
    gateTemplate: gateTemplate,
    guideTemplate: guideTemplate,
    dataStatistical: dataStatistical,
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      selectParkId: '',
      parkingList: [],
      defaultData: {}, // 默认查询数据
      showChangePark: false,
      activeName: '',
      tabsData: [
        {
          name: 'basicInfo',
          label: '基本信息',
          component: 'basicInfo',
          hidden: false
        },
        {
          name: 'monitoring',
          label: '监控',
          component: 'monitoring',
          hidden: true
        },
        {
          name: 'gateTemplate',
          label: '闸机',
          component: 'gateTemplate',
          hidden: true
        },
        {
          name: 'guideTemplate',
          label: '诱导屏',
          component: 'guideTemplate',
          hidden: true
        },
        {
          name: 'dataStatistical',
          label: '数据统计',
          component: 'dataStatistical',
          hidden: false
        }
      ],
      chooseRouterData: {}
    }
  },
  computed: {
    ...mapState({
      siteManageDetail: state => state.mapDetails.siteManageDetail
    })
  },
  watch: {
    siteManageDetail: {
      handler (val) {
        const { routerName, basicItems } = val
        this.activeName = routerName || 'basicInfo'
        this.chooseRouterData = basicItems
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.defaultData = { ...this.data }
    this.getParkingName()
    this.getData(this.defaultData.parkingSn)
  },
  methods: {
    getLable,
    closeChangePark () {
      this.showChangePark = false
    },
    getParkingName () {
      postParkingNameList().then(res => {
        this.parkingList = res.body || []
        this.data.parkingSn && (this.selectParkId = this.data.parkingSn)
      })
    },
    getData (id) {
      if (!id) return
      getDeviceGroup(id).then(res => {
        const data = res.body || {}
        this.tabsData[1].hidden = data.deviceMonitorNum === 0
        this.tabsData[2].hidden = data.deviceGateNum === 0
        this.tabsData[3].hidden = data.deviceGuideNum === 0
        this.activeName = 'basicInfo'
      })
    },
    confirm () {
      this.defaultData = {
        parkingSn: this.selectParkId
      }
      this.chooseRouterData = {}
      this.closeChangePark()
      this.getData(this.defaultData.parkingSn)
    }
  }
}
</script>

<style scoped lang="scss">
.siteManage-wrap {
  position: relative;
  padding: 20px;
  height: calc(754px - 50px + 20px);
  overflow: auto;
  .search-tab {
    margin-bottom: 10px;
    display: flex;
    align-items: baseline;
    .park {
      margin-right: 20px;
      font-size: 18px;
      font-weight: bold;
      color: $mapFontColorDefault1-1;
    }
    .replace {
      font-size: 12px;
      color: $mapMainColor1-1;
      cursor: pointer;
    }
  }
  .siteManage-content {
    .animate__animated {
      animation-duration: 0.5s;
    }
  }
}
.map-select.change-select {
  flex: 1;
  margin-right: 10px;
  ::v-deep {
    .el-input {
      width: 100%;
      .el-input__inner {
        width: 100%;
        background-color: $mapColor4-2;
        border: 1px solid $mapMainColor1-1;
      }
    }
    .el-select-dropdown {
      background-color: $mapColor4-2;
    }
    .el-select-dropdown__list {
      padding: 0;
      .el-select-dropdown__item + .el-select-dropdown__item {
        border-top: 1px solid $mapMainColor1-1;
      }
      .el-select-dropdown__item {
        background-color: $mapColor4-2;
        &.selected.hover,
        &:hover {
          background-color: $mapMainColor1-1;
        }
      }
    }
  }
}
</style>
