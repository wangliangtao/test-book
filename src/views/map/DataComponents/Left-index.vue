<template>
  <div class="map-left map-box">
    <div class="map-box-top" />
    <div class="map-box-bottom" />
    <div class="header">
      <div class="title">
        {{ list.title }}
      </div>
      <div class="operation">
        <div
          class="item setting"
          @click="editMapData"
        >
          <svg-icon
            class="hidden"
            icon-class="icon_bar_settings"
          />
          设置
        </div>
        <div
          class="item"
          @click="$emit('close')"
        >
          <svg-icon
            class="hidden"
            icon-class="icon_hidden_statistical"
          />
          隐藏统计
        </div>
      </div>
    </div>
    <div class="datas-wrap">
      <el-scrollbar wrap-class="x-hidden">
        <div
          v-for="(item,index,key) in list.componentList"
          :key="key"
          :class="['data-box']"
        >
          <component
            :is="item.value"
            :id="'' + index + Date.now() + item.value"
            :params="mapSearch"
            :checked="index === checked"
            @changeCheck="(methods,data) => changeMapCheck(methods, data, index)"
          />
        </div>
      </el-scrollbar>
    </div>
    <div
      v-show="list.componentList.length === 0"
      class="noCom"
    >
      <img src="~@/static/no_red.png">
      <p>还没配置图表哟，快去添加吧~</p>
      <el-button
        class="map-btn-border"
        round
        @click.stop="editMapData"
      >
        <svg-icon
          class="hidden"
          icon-class="icon_component_add"
        />
        去添加
      </el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapGetters } from 'vuex'
import mapBus from '../mapBus'
import importDataComponent from './importDataComponent'
export default {
  mixins: [importDataComponent],
  data() {
    return {
      list: {componentList: []},
      checked: null
    }
  },
  computed: {
    ...mapState('mapDetails',{
      mapSearch: state => state.mapSearch
    }),
    ...mapGetters('mapDetails', ['leftSidebarList'])
  },
  watch: {
    leftSidebarList: {
      handler() {
        this.list = this.leftSidebarList
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    mapBus.$on('changeMapCheck', (index, type) => {
      mapBus.$emit('clearMapLoca')
      this.checked = type === 'left' ? index : null
    })
  },
  methods: {
    changeMapCheck(methods, data, index) {
      mapBus.$emit('changeMapCheck', index, 'left')
      if (methods) {
        mapBus.$emit(methods, data)
      }
    },
    editMapData() {
      mapBus.$emit('changeMapCheck')
      this.checked = null
      this.$emit('editMapData', 'left')
    }
  }
}
</script>

<style scoped lang="scss">
.map-left {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0;
  height: 100%;
  background-color: $mapColor1-3;
  border: 1px solid $mapColor4-1;
  border-radius: 4px;
  box-sizing: border-box;
  .header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $mapFontColorDefault1-1;
    &:hover {
      .operation {
        .setting {
          display: block;
        }
      }
    }
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .operation {
      display: flex;
      .item + .item {
        margin-left: 30px;
      }
      .item {
        font-size: 14px;
        cursor: pointer;
        opacity: 0.7;
        transition: all .3s;
        &:hover {
          opacity: 1;
        }
      }
      .setting {
        display: none;
      }
    }
  }
  .datas-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .data-box + .data-box {
      margin-top: 20px;
    }
    .data-box:last-of-type {
      margin-bottom: 20px;
    }
    .data-box {
      background-color: $mapColor3-3;
      border-radius: 4px;
      overflow: hidden;
    }
  }
  .noCom {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    img {
      width: 120px;
      height: 120px;
    }
    p {
      margin: 15px 0 20px;
      font-size: 14px;
      color: $mapFontColorDefault1-2;
    }
  }
}
</style>