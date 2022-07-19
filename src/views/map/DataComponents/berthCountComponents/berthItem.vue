<template>
  <div
    :class="['battery-wrap', countObj.hoverClass]"
    @click.stop="$emit('click', countObj)"
  >
    <span class="text">{{ text }}</span>
    <div
      class="battery"
      :style="`background-image:url(${battery.bg})`"
    >
      <div
        class="progress"
        :style="`width:calc(${battery.w}% - 2px);background: linear-gradient(270deg, ${battery.color1} 0%, ${battery.color2} 100%);`"
      />
    </div>
    <div
      class="count moneyFont"
      :style="`color:${countObj.color}`"
    >
      {{ countObj.count | formatNumber(0,',') }}
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
          w: 80,
          color1: '#FFCC66',
          color2: '#FFBB33'
        }
      }
    },
    countObj: {
      type: Object,
      default: () => {
        return {
          color: '#fff',
          count: 0,
          hoverClass: ''
        }
      }
    }
  },
  data() {
    return {
      w: {}
    }
  },
  mounted() {
    setTimeout(() => {
      this.w = {
        width: 'calc(80% - 2px)'
      }
    },1000)
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.battery-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  .text {
    width: 60px;
    font-size: 12px;
    color: $mapFontColorDefault1-1;
    transition: all .3s;
  }
  .battery {
    margin: 0 12px;
    flex: 1;
    position: relative;
    height: 16px;
    // background-image: url('~@/static/mapData/blue_new_bg_1@2x.png');
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    &::before{
      content: '';
      position: absolute;
      left: 1px;
      top: 1px;
      width: calc(100% - 2px);
      height: 14px;
      background: url('~@/static/mapData/wireframe_new_bg@2x.png') 0 0 no-repeat;
      background-size: 100% 100%;
      z-index: 1;
    }
    .progress {
      position: absolute;
      left: 1px;
      top: 1px;
      width: 0;
      // width: 240px;
      // margin: 0 1px;
      height: 14px;
      // background: linear-gradient(270deg, #FFCC66 0%, #FFBB33 100%);
      border-radius: 1.5px;
      transition: all .3s;
    }
  }
  .count {
    width: 44px;
    font-size: 16px;
    text-align: center;
    transition: all .3s;
  }
  &.common:hover {
    .text,.count {
      color: $mapMainColor1-1 !important;
    }
  }
  &.pr:hover {
    .text,.count {
      color: $mapMainColor1-3 !important;
    }
  }
  &.road:hover {
    .text,.count {
      color: $mapMainColor1-2 !important;
    }
  }
}
</style>