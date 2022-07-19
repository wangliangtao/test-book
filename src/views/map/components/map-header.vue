<template>
  <div :class="['mapHeader-wrap', {isFocus: isFocus, showResult: mapSearchData.show && mapSearchData.isOpen, packUp: mapSearchData.show && !mapSearchData.isOpen}]">
    <div class="map-header">
      <img
        src="@/static/logo.png"
        alt=""
        class="logo"
      >
      <div class="map-search">
        <div
          class="search-select"
          @click="isSearchCheck = true"
        >
          <div class="search-keywords">
            {{ mapSearch.l3Region || mapSearch.city }}
            <i :class="['arrow', 'el-icon-arrow-down', isSearchCheck && 'checked']" />
          </div>
          <transition name="el-zoom-in-top">
            <div
              v-if="isSearchCheck"
              class="search-content"
            >
              <areaChecks
                @close="closeSearch"
                @confirm="confirm"
              />
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div :class="['search-wrap']">
      <el-autocomplete
        ref="autocomplete"
        v-model.trim="resourceName"
        :popper-append-to-body="false"
        :fetch-suggestions="querySearchAsync"
        :trigger-on-focus="false"
        class="search-input"
        clearable
        placeholder="搜索停车场"
        popper-class="map-autocomplete"
        value-key="name"
        @focus="focusAutocomplete"
        @blur="blurAutocomplete"
        @select="search"
        @keyup.enter.native="search"
        @clear="clearComplete"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        />
      </el-autocomplete>
      <transition name="el-zoom-in-top">
        <ul
          v-if="showHistory"
          class="history-wrap"
        >
          <li
            v-for="(item,index,key) in mapSearchHistory"
            :key="key"
            class="history"
            @click.stop="searchPark(item)"
          >
            <span>
              <svg-icon icon-class="icon_time" />
              {{ item }}
            </span>
          </li>
          <div class="clearable">
            <span
              class="mapText"
              @click="clearHistory"
            >
              <svg-icon icon-class="icon_delete" />
              清空历史记录
            </span>
          </div>
        </ul>
      </transition>
      <div
        v-if="mapSearchData.show"
        class="result-wrap"
      >
        <div :class="['mapResultView-wrap', {hide: !mapSearchData.isOpen}]">
          <div
            v-show="!mapSearchData.isOpen"
            class="hide-wrap"
          >
            <span
              class="mapText"
              @click="isOpen"
            >
              展开{{ mapSearchData.total }}条搜索结果
              <svg-icon icon-class="icon_more_show_12" />
            </span>
            <div
              class="close"
              @click="clearComplete"
            >
              <svg-icon icon-class="icon_close_14" />
            </div>
          </div>
          <transition name="el-zoom-in-top">
            <keep-alive :include="cacheComponent">
              <component
                :is="activeName"
                v-show="mapSearchData.isOpen"
                class="animate__animated"
                @to="to"
                @close="clearComplete"
                @change="changeMapSearchData"
                @click="clickMapSearchData"
                @inOut="inOutMapSearchData"
                @showDetailDialog="showDetailDialog"
                @showPicture="showPicture"
              />
            </keep-alive>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import mapBus from '../mapBus'
import { postResourceNameList } from '@/api/parking'
import areaChecks from './areaChecks'
import resourceList from './resourceList/index'
import parkDetail from './parkDetail/index'
export default {
  components: {
    areaChecks,
    resourceList,
    parkDetail
  },
  data () {
    return {
      cacheComponent: [],
      isFocus: false, // 输入框是否聚焦
      resourceName: '',
      isSearchCheck: false, // 区域选择是否选中
      showHistory: false, // 显示历史记录
      activeName: ''
    }
  },
  computed: {
    ...mapState('mapDetails', {
      mapSearch: state => state.mapSearch,
      mapSearchHistory: state => state.mapSearchHistory,
      mapSearchData: state => state.mapSearchData
    })
  },
  methods: {
    querySearchAsync (querySearchAsync, cb) {
      this.showHistory = false
      const params = {
        ...this.mapSearch,
        resourceType: [...this.mapSearch.parking, ...this.mapSearch.device],
        resourceName: this.resourceName
      }
      postResourceNameList(params).then(res => {
        cb(res.body || [])
      })
    },
    closeSearch () {
      this.isSearchCheck = false
      // this.isShowHistory()
    },
    confirm (params = {}) {
      // 重置搜索项的内容
      this.resourceName = ''
      this.$store.dispatch('mapDetails/changeMapSearchData', { show: false })
      this.$store.dispatch('mapDetails/changeMapSearch', params)
      this.closeSearch()
      mapBus.$emit('mapSearch')
    },
    search () {
      this.cacheComponent = ['ResourceList']
      if (this.resourceName) {
        this.$refs.autocomplete.activated = false
        const params = {
          ...this.mapSearch,
          resourceName: this.resourceName
        }
        this.$store.dispatch('mapDetails/changeMapSearch', params)
        this.$store.dispatch('mapDetails/setMapHistory', this.resourceName)
        this.$store.dispatch('mapDetails/changeMapSearchData', { show: true })
        this.$store.dispatch('mapDetails/changeMapCurData', {})
        mapBus.$emit('clearCurIcon')
        this.activeName = 'resourceList'
      } else {
        // 没有查询内容关闭下拉框
        this.$store.dispatch('mapDetails/changeMapSearchData', { show: false })
      }
    },
    isShowHistory () {
      // 没有查询关键字段且历史记录存在则显示历史记录
      this.showHistory = !this.resourceName && this.mapSearchHistory.length > 0
    },
    focusAutocomplete () {
      if (!this.resourceName) {
        this.$refs.autocomplete.suggestions = []
      }
      this.isFocus = true
      this.isShowHistory()
      this.$emit('hideSearchInArea')
    },
    // 清空查询数据及地图上的查询数据覆盖物和选中覆盖物
    clearComplete () {
      this.resourceName = ''
      this.cacheComponent = []
      this.$store.dispatch('mapDetails/changeMapSearchData', { show: false, isOpen: true, total: 0, resultData: [], cacheData: [] })
      // 我也忘了这里不写会有啥影响。。
      this.mapSearch.resourceName && this.$store.dispatch('mapDetails/changeMapSearch', { resourceName: '' });
      mapBus.$emit('clearMapSearchData')
    },
    blurAutocomplete () {
      this.isFocus = false
      setTimeout(() => this.showHistory = false, 100)
    },
    searchPark (val) {
      this.resourceName = val
      this.search()
    },
    clearHistory () {
      this.$store.dispatch('mapDetails/removeMapHistory')
    },
    to ({ activeName, resourceName, isCache = false }) {
      this.activeName = activeName
      resourceName && (this.resourceName = resourceName)
      isCache && (this.cacheComponent = ['ResourceList'])
      mapBus.$emit('clearCurIcon')
    },
    isOpen () {
      this.$store.dispatch('mapDetails/changeMapSearchData', { isOpen: true })
    },
    // 绘制查询数据的地图覆盖物
    changeMapSearchData () {
      mapBus.$emit('mapSearchData')
    },
    // 选中地图上的对应覆盖物坐标
    clickMapSearchData (index) {
      mapBus.$emit('clickMapSearchData', index)
    },
    // 移入移除停车场列表
    inOutMapSearchData (data, index, inOut) {
      this.$store.dispatch('mapDetails/changeMapSearchData', { cacheData: data })
      mapBus.$emit('inOutMapSearchData', inOut, index)
    },
    // 打开停车场详情
    showDetailDialog () {
      this.clearComplete()
      this.$emit('showDetailDialog')
    },
    // 显示全貌
    showPicture () {
      this.$emit('showPicture')
    }
  }
}
</script>

<style scoped lang="scss">
.mapHeader-wrap {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 10px 0 40px 20px;
  // height: 100%;
  max-height: 100%;
  z-index: 1;
  &.isFocus {
    height: 300px;
  }
  &.showResult {
    height: 100%;
    .search-wrap {
      overflow: hidden;
    }
  }
  .map-header {
    display: flex;
    align-items: center;
    z-index: 10;
    flex-wrap: wrap;
    overflow: auto inherit;
    .logo {
      width: 252px;
      height: 61px;
    }
    .map-search {
      margin-left: 30px;
      display: flex;
      align-items: center;
      .search-select {
        position: relative;
        .search-keywords {
          display: flex;
          align-items: center;
          padding: 15px;
          min-width: 118px;
          max-width: 260px;
          height: 40px;
          font-size: 14px;
          color: #fff;
          background-color: $mapColor3-2;
          border: 1px solid $mapColor4-1;
          border-radius: 4px;
          cursor: pointer;
          .arrow {
            margin-left: auto;
            transition: all 0.3s;
            &.checked {
              transform: rotate(-180deg);
            }
          }
        }
        .search-content {
          position: absolute;
          top: 50px;
          background-color: $mapColor1-2;
          border-radius: 4px;
          transition: all 0.3s;
          z-index: 1;
          overflow: hidden;
        }
      }
    }
  }
  .search-wrap {
    flex: 1;
    margin-top: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 400px;
    // max-height: 100%;
    .search-input {
      ::v-deep {
        .el-input {
          input {
            height: 40px;
            color: $mapFontColorDefault1-1;
            line-height: 40px;
            background-color: $mapColor3-2;
            border: 1px solid $mapColor4-1;
            border-right: none;
          }
          .el-input-group__append {
            border: 0;
            .el-button {
              height: 40px;
              color: $mapFontColorDefault1-1;
              background-color: $mapMainColor1-1;
              border-color: $mapMainColor1-1;
              border-radius: 0 4px 4px 0;
              &:hover {
                background-color: $mapColor7-1;
                border-color: $mapColor7-1;
              }
              &:active {
                background-color: $mapColor5-1;
                border-color: $mapColor5-1;
              }
            }
          }
        }
        .map-autocomplete {
          left: 0 !important;
          margin: 0;
          background-color: $mapColor4-1;
          border: 1px solid $mapColor3-2;
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
          .popper__arrow {
            display: none;
          }
          .el-scrollbar {
            .el-autocomplete-suggestion__wrap {
              padding: 0;
              li {
                font-size: 12px;
                color: $mapFontColorDefault1-1;
                background-color: $mapColor3-1;
                &.highlighted,
                &:hover {
                  background: $mapMainColor1-1;
                }
              }
            }
          }
        }
      }
    }
    .history-wrap {
      position: absolute;
      left: 0;
      top: 39px;
      width: 100%;
      font-size: 12px;
      color: $mapFontColorDefault1-1;
      background-color: $mapColor3-1;
      border: 1px solid $mapColor4-1;
      border-radius: 0px 0px 3px 3px;
      overflow: auto;
      z-index: 10;
      .history {
        padding: 0 15px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        transition: all 0.3s;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          svg {
            margin-right: 10px;
          }
        }
        &:hover {
          background-color: $mapMainColor1-1;
        }
      }
      .clearable {
        margin: 17px 15px 15px;
        text-align: right;
        span {
          cursor: pointer;
          svg {
            margin-right: 3px;
          }
        }
      }
    }
    .result-wrap {
      margin-top: 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .mapResultView-wrap {
        position: relative;
        height: 100%;
        overflow: auto;
        &.hide {
          height: 50px;
        }
        .hide-wrap {
          position: relative;
          height: 40px;
          font-size: 14px;
          line-height: 40px;
          text-align: center;
          background-color: $mapColor3-1;
          span {
            cursor: pointer;
          }
          .close {
            position: absolute;
            right: 0;
            top: 0;
            width: 40px;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            color: $mapFontColorDefault1-1;
            text-align: center;
            border-left: 1px solid $mapColor4-1;
            transition: all 0.3s;
            cursor: pointer;
            &:hover {
              background-color: $mapMainColor1-1;
              border-color: $mapMainColor1-1;
            }
            &:active {
              background-color: $mapColor5-1;
              border-color: $mapColor5-1;
            }
          }
        }
      }
    }
  }
}
</style>
