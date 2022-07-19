<template>
  <div class="textData">
    <div class="left">
      <div
        class="number moneyFont"
        :style="`color: ${color[0]};`"
      >
        {{ data[0] | formatNumber(0, ',') }}
      </div>
      <div class="text">
        {{ text[0] }}
      </div>
    </div>
    <div class="right">
      <div
        class="number moneyFont"
        :style="`color: ${color[1]};`"
      >
        {{ data[1] | formatNumber(0, ',') }}
      </div>
      <div class="text">
        {{ text[1] }}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    color: {
      type: Array,
      default: () => ['#FFCC66', '#66CC88']
    },
    text: {
      type: Array,
      default: () => ['', '']
    },
    data: {
      type: Array,
      default: () => [0, 0]
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
.textData {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .left,.right {
    // margin-right: 96px;
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
}
</style>