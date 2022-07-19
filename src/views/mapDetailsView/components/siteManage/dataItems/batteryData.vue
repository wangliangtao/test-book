<template>
  <div class="batteryData">
    <div class="top">
      <div class="title">
        {{ text }}
      </div>
      <div class="moneyFont number">
        {{ battery.w }}%
      </div>
    </div>
    <div
      class="battery"
      :style="`background-image:url(${battery.bg})`"
    >
      <div
        class="progress"
        :style="`width:calc(${battery.w}% - 2px);background: linear-gradient(270deg, ${battery.color1} 0%, ${battery.color2} 100%);`"
      />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    battery: {
      type: Object,
      default: () => {
        return {
          bg: require('@/static/mapData/blue_new_bg_1@2x.png'),
          w: 0,
          color1: '#FFCC66',
          color2: '#FFBB33'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.batteryData {
  padding: 20px;
  .top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    .title {
      font-size: 14px;
      color: $mapFontColorDefault1-1;
    }
    .number {
      font-size: 24px;
      color: $mapFontColor3-1;
    }
  }
  .battery {
    margin-top: 7px;
    position: relative;
    height: 22px;
    // background: url('~@/static/battery/yellow_bg_1@2x.png') 0 0 no-repeat;
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    &::before{
      content: '';
      position: absolute;
      left: 1px;
      top: 4px;
      width: calc(100% - 2px);
      height: 14px;
      background: url('~@/static/battery/bg_3@2x.png') 0 0 no-repeat;
      background-size: 100% 100%;
      z-index: 1;
    }
    .progress {
      position: absolute;
      left: 1px;
      top: 3px;
      // width: calc(100% - 8px);
      width: 240px;
      // margin: 0 1px;
      height: 14px;
      // background: linear-gradient(270deg, #FFCC66 0%, #FFBB33 100%);
      border-radius: 1.5px;
    }
  }
}
</style>