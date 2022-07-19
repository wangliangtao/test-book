<template>
  <div class="operation-wrap">
    <div class="totalQuantitySwitch">
      <span>总览统计</span>
      <el-switch
        v-model="isTotalQuantity"
        class="map-switch"
        active-color="#14CC52"
        inactive-color="#245FB3"
      />
    </div>
    <div class="fullScreen">
      <el-button
        class="map-fullbtn-border"
        plain
        @click="operationFull"
      >
        <svg-icon
          class="icon"
          :icon-class="isFullScreen ? 'icon_exit_full_screen' : 'icon_full_screen'"
        />
      </el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      value1: false
    }
  },
  computed: {
    isFullScreen() {
      return this.$store.getters.isFullScreen // 是否全屏
    },
    isTotalQuantity: {
      get() {
        return this.$store.state.mapDetails.isTotalQuantity
      },
      set() {
        this.$store.dispatch('mapDetails/toggleTotalQuantity')
      }
    }
  },
  methods: {
    // 是否全屏
    operationFull() {
      this.$store.dispatch('app/toggleFullScreen')
    }
  }
}
</script>
<style scoped lang="scss">
.operation-wrap {
  display: flex;
  align-items: center;
  .totalQuantitySwitch {
    display: flex;
    align-items: center;
    margin-right: 30px;
    padding: 0 15px;
    height: 40px;
    font-size: 14px;
    color: $mapFontColorDefault1-2;
    background-color: $mapColor3-2;
    border: 1px solid $mapColor4-1;
    border-radius: 4px;
    & > span {
      margin-right: 10px;
    }
  }
  .fullScreen {
    .map-fullbtn-border {
      padding: 0 12px;
      height: 40px;
      font-size: 14px;
      color: $mapFontColorDefault1-2;
      background-color: $mapColor3-2;
      border: 1px solid $mapColor4-1;
      &:hover{
        color: $mapFontColorDefault1-1;
        background-color: $mapMainColor1-1;
        border-color: $mapMainColor1-1;
      }
      &:active{
        color: $mapFontColorDefault1-1;
        background-color: $mapColor5-1;
        border-color: $mapColor5-1;
      }
    }
  }
}
</style>