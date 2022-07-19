<template>
  <div class="inductionScreen-wrap">
    <img
      v-if="data.deviceStatus !== 1"
      class="abnormal"
      src="~@/static/park/angle.png"
    >
    <div class="title">
      <img
        v-if="data.deviceStatus === 1"
        src="~@/static/park/icon_guide_normal@2x.png"
      >
      <img
        v-else
        src="~@/static/park/icon_guide_abnormal@2x.png"
      >
      {{ data.deviceName }}
    </div>
    <div class="online-wrap">
      <div :class="['status', statusClass.class]">
        <img
          src="~@/static/park/icon_online@2x.png"
        >
        <span>{{ statusClass.text }}</span>
      </div>
    </div>
    <div class="deviceInfo">
      <span class="label">设备型号：</span>
      <span class="info">{{ data.deviceModelName }}</span>
    </div>
    <div class="deviceInfo">
      <span class="label">唯一编号：</span>
      <span class="info">{{ data.deviceModelSn }}</span>
    </div>
    <div class="btns-wrap">
      <el-button
        class="map-btn-noBorder"
        type="primary"
        round
        @click="goRouter"
      >
        查看
      </el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      data: {}
    }
  },
  computed:{
    statusClass() {
      if (this.data.deviceStatus === 1) {
        return {
          class: 'online',
          text: '在线'
        }
      }
      if (this.data.deviceStatus === 2) {
        return {
          class: 'offline',
          text: ' 离线'
        }
      }
      return {}
    }
  },
  mounted() {
    this.data = {...this.params}
  },
  methods: {
    goRouter() {
      const params = {
        routerName: 'guideTemplate',
        basicItems: {
          deviceSn: this.data.deviceSn
        }
      }
      this.$store.dispatch('mapDetails/changeSiteDetail', params)
    }
  }
}
</script>

<style scoped lang="scss">
.inductionScreen-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: $mapColor3-1;
  border-radius: 4px;
  .abnormal {
    position: absolute;
    right: 0;
    top: 0;
    width: 48px;
    height: 48px;
  }
  .title {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: $mapFontColorDefault1-1;
    font-weight: bold;
    img {
      margin-right: 5px;
      width: 16px;
      height: 16px;
    }
  }
  .online-wrap {
    display: flex;
    margin-top: 10px;
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
  .deviceInfo {
    margin-top: 10px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: $mapFontColorDefault1-2;
    .label {
      // color: $mapFontColorDefault1-2;
    }
    .info {
      // color: $mapFontColorDefault1-1;
    }
  }
  .btns-wrap {
    margin-top: 20px;
  }
}
</style>