<template>
  <div class="parkBasicInfo-wrap">
    <div class="basicInfo">
      <div class="info-item">
        <span class="label">场地名称：</span>
        <span class="info-content">{{ parkingInfo.parkingName }}</span>
      </div>
      <div class="info-item">
        <span class="label">所在地址：</span>
        <span class="info-content">{{ parkingInfo.addressLine }}</span>
      </div>
      <div class="info-item">
        <span class="label">场地类型：</span>
        <span class="info-content">{{ getLable(parkingInfo.parkingType, parkinglotTypesOptions) }}</span>
      </div>
      <div class="info-item">
        <span class="label">计费规则：</span>
        <span class="info-content">暂无</span>
      </div>
      <div class="info-item">
        <span class="label">泊位数量：</span>
        <span class="info-content">{{ parkingInfo.slots }}</span>
      </div>
    </div>
    <ul class="device-wrap">
      <li
        v-for="(item,index,key) in deviceModels"
        :key="key"
        class="device-container"
      >
        <div class="device-title">
          {{ item.label }}
        </div>
        <ul class="device-content row4">
          <li
            v-for="(device,dIndex,dKey) in item.deviceCommonList"
            :key="dKey"
            class="device-item"
          >
            <transition
              enter-active-class="animate__bounceInLeft"
              leave-active-class="animate__bounceOutLeft"
              mode="out-in"
            >
              <component
                :is="device.deviceType"
                class="animate__animated"
                :params="device"
              />
            </transition>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import monitorItem from './basicItems/monitorItem'
import gateItem from './basicItems/gateItem'
import guideItem from './basicItems/guideItem'
import { getParkingBaseInfo } from '@/api/parking'
import { parkinglotTypesOptions } from '@/utils/lookup'
import { getLable } from '@/utils/function'
export default {
  components: {
    monitor: monitorItem,
    gate: gateItem,
    guide: guideItem
  },
  props: {
    params: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      parkinglotTypesOptions,
      parkingInfo: {},
      deviceModels: []
    }
  },
  watch: {
    'params.parkingSn': {
      handler (val) {
        this.getData(val)
      }
    }
  },
  mounted () {
    this.getData(this.params.parkingSn)
  },
  methods: {
    getLable,
    getData (id) {
      if (!id) return
      getParkingBaseInfo(id)
        .then(res => {
          const { parkingInfo, deviceModels } = res.body || { parkingInfo: {}, deviceModels: [] }
          this.parkingInfo = parkingInfo
          this.deviceModels = deviceModels
        })
    }
  }
}
</script>

<style scoped lang="scss">
.parkBasicInfo-wrap {
  margin-top: 20px;
  .basicInfo {
    .info-item + .info-item {
      margin-top: 15px;
    }
    .info-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      .label {
        color: $mapFontColorDefault1-2;
      }
      .info-content {
        color: $mapFontColorDefault1-1;
      }
    }
  }
  .device-wrap {
    .device-container {
      margin-top: 30px;
      .device-title {
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: bold;
        color: $mapFontColorDefault1-1;
      }
      .device-content {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        &.row4 {
          li {
            flex: 0 0 24.5%;
            margin-right: 0.6666666%;
          }
          li:nth-of-type(4n) {
            margin-right: 0;
          }
          li:nth-of-type(5n) {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
