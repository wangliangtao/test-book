<template>
  <div class="inductionScreen-wrap">
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
      class="inductionScreen-container"
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
          位置描述：
        </div>
        <div class="content">
          开平路与映山路交汇处，B入口附近
        </div>
      </div>
      <div class="items">
        <div class="label">
          显示模板：
        </div>
        <div class="content">
          模板A
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getGuideList} from '@/api/parking'
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
      getGuideList(id)
        .then(res => {
          this.device = res.body || []
          if (this.chooseRouterData.deviceSn) {
            this.device.forEach((item, index) => {
              if (item.deviceSn === this.chooseRouterData.deviceSn) {
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
.inductionScreen-wrap {
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
  .inductionScreen-container {
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
    }
  }
}
</style>