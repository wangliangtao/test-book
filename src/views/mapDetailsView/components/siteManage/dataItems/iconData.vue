<template>
  <div class="iconData">
    <div class="left">
      <div
        class="number moneyFont"
        :style="`color: ${color};`"
      >
        {{ data | formatNumber(...formatNumber) }} {{ dataTail }}
      </div>
      <div class="text">
        {{ text }}
      </div>
    </div>
    <div class="right">
      <img :src="icon">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    data: {
      type: [Number, String],
      default: 0
    },
    formatNumber: {
      type: Array,
      default:() => [0, ',']
    },
    dataTail: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#80B5FF'
    },
    icon: {
      type: String,
      default: require('@/static/park/icon_online@2x.png')
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="scss">
.iconData {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    text-align: center;
    .number {
      font-size: 24px;
    }
    .text {
      margin-top: 10px;
      font-size: 12px;
      color: $mapFontColorDefault1-1;
    }
  }
  .right {
    img {
      width: 54px;
      height: 54px;
    }
  }
}
</style>