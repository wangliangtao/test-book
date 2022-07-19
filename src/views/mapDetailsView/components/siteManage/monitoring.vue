<template>
  <div class="monitoring-wrap">
    <ul class="device-taps">
      <li
        v-for="(item,index,key) in device"
        :key="key"
        :class="{active: chooseData.deviceSn === item.deviceSn}"
        @click="changeDevice(item, index)"
      >
        {{ item.deviceName }}
      </li>
    </ul>
    <div
      v-if="chooseData.index > -1"
      class="monitoring-container"
    >
      <div class="items">
        <div class="label">
          设备型号：
        </div>
        <div class="content">
          {{ chooseData.deviceModelName }}
        </div>
      </div>
      <div class="items">
        <div class="label">
          唯一编号：
        </div>
        <div class="content">
          {{ chooseData.deviceSn }}
        </div>
      </div>
      <div class="items">
        <div class="label">
          当前状态：
        </div>
        <div class="online-wrap">
          <div :class="['status', statusClass.class]">
            <img
              src="~@/static/park/icon_online@2x.png"
            >
            <span>{{ statusClass.text }}</span>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="label">
          监控视频：
        </div>
        <div class="video-wrap">
          <div class="video" />
          <el-button
            class="map-btn-noBorder"
            type="primary"
            round
          >
            确定
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getMonitorList} from '@/api/parking'
export default {
  props: {
    chooseRouterData: {
      type: Object,
      default: () => {}
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chooseData: {
        index: null
      },
      device: []
    }
  },
  computed:{
    statusClass() {
      if (this.chooseData.deviceStatus === 1) {
        return {
          class: 'online',
          text: '在线'
        }
      }
      if (this.chooseData.deviceStatus === 2) {
        return {
          class: 'offline',
          text: ' 离线'
        }
      }
      return {}
    }
  },
  mounted() {
    this.getData(this.params.parkingSn)
  },
  methods: {
    changeDevice(data, index) {
      this.chooseData = {...data, index}
    },
    getData(id) {
      if (!id) return
      getMonitorList(id)
        .then(res => {
          this.device = res.body || []
          if (this.chooseRouterData.deviceId) {
            this.device.forEach((item, index) => {
              if (item.deviceSn === this.chooseRouterData.deviceId) {
                this.chooseData = {...item, index}
              }
            })
          } else {
            this.chooseData = this.device.length > 0 ? {...this.device[0], index: 0} : {index: null}
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.monitoring-wrap {
  .device-taps {
    margin-top: 10px;
    display: flex;
    align-items: center;
    li {
      margin-right: 10px;
      padding: 0 15px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: $mapFontColorDefault1-2;
      border: 1px solid $mapFontColorDefault1-2;
      border-radius: 16px;
      cursor: pointer;
      transition: all .3s;
      &.active,&:hover {
        color: $mapFontColorDefault1-1;
        background-color: $mapMainColor1-1;
        border-color: $mapMainColor1-1;
      }
    }
  }
  .monitoring-container {
    margin-top: 20px;
    .items + .items {
      margin-top: 15px;
    }
    .items {
      display: flex;
      font-size: 14px;
      color: $mapFontColorDefault1-1;
      .label {
        margin-right: 10px;
        white-space:nowrap;
        color: $mapFontColorDefault1-2;
      }
      .online-wrap {
        display: flex;
        .status {
          display: flex;
          align-items: flex-end;
          padding: 2px 5px;
          font-size: 12px;
          color: $mapFontColorDefault1-1;
          border-radius: 2px;
          &.online {
            background-color: $mapMainColor1-2;
          }
          &.offline {
            background-color: $mapColor9-1;
          }
          img {
            margin-right: 3px;
            width: 17px;
            height: 17px;
          }
        }
      }
      .video-wrap {
        .el-button + .el-button {
          margin-left: 0;
        }
        .el-button {
          margin: 0 10px 10px 0;
        }
        .video {
          margin-bottom: 20px;
          width: 640px;
          height: 360px;
          background: #000000;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>