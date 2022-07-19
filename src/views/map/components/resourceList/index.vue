<template>
  <div class="resourceList-wrap">
    <div class="resource-container">
      <div class="tabHeader">
        <div class="tabs-wrap">
          <el-tabs
            v-model.trim="activeName"
            class="map-tabs"
            tab-click="changeTabs"
          >
            <template v-for="(item,index,key) in tabsData">
              <el-tab-pane
                :key="key"
                :disabled="item.value !== 'park'"
                :label="item.label"
                :name="item.value"
              />
            </template>
          </el-tabs>
          <div
            class="close"
            @click="close"
          >
            <svg-icon icon-class="icon_close_14" />
          </div>
        </div>
        <div class="tabsItems-wrap">
          <Checks
            styles="style2"
            :data="tabsDataItem[activeName]"
            :default-checkeds="itemChecks"
            @change="changeTabItem"
          />
        </div>
      </div>
      <el-scrollbar wrap-class="x-hidden">
        <div class="list">
          <div
            v-show="tableData.length < 1"
            class="empty"
          >
            没有找到与“<span>{{ mapSearch.resourceName }}</span>”相关的数据
          </div>
          <div
            v-if="tableData.length > 0"
            class="list-container"
          >
            <ul class="list-content">
              <li
                v-for="(item,index,key) in tableData"
                :key="key"
                :class="['parking-item', {cur: item.parkingSn === mapSearchData.cacheData.parkingSn}]"
                @mouseenter.stop="inOut(item, index, true)"
                @mouseleave.stop="inOut(item, index, false)"
                @click="clickParking(item, index)"
              >
                <div :class="['left', item.parkingType]" />
                <div class="right">
                  <div class="title">
                    {{ item.parkingName }}
                  </div>
                  <div class="type">
                    {{ getLable(item.parkingType, parkinglotTypesOptions) }}
                  </div>
                  <div class="address">
                    所属地区：{{ item.province + ' ' + item.city + ' ' + item.l3Region + ' ' + item.l4Region }}
                  </div>
                </div>
              </li>
            </ul>
            <div class="map-pagination-wrap">
              <el-pagination
                class="map-pagination"
                background
                :current-page.sync="currentPage"
                :page-size="pagesize"
                layout="prev, pager, next"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="footer">
        <div class="left">
          共 {{ total }} 条
        </div>
        <div
          class="right mapText"
          @click="isOpen(false)"
        >
          收起搜索结果
          <svg-icon
            class="open"
            icon-class="icon_more_show_12"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { deviceTypesOptions, parkinglotTypesOptions } from '@/utils/lookup'
import Checks from '@/components/Checks'
import listPageDto from '@/mixin/listPageDto'
import { postResourceList } from '@/api/parking'
import { getLable } from '@/utils/function'
export default {
  name: 'ResourceList',
  components: { Checks },
  mixins: [listPageDto],
  data () {
    return {
      parkinglotTypesOptions,
      activeName: 'park',
      tabsData: [
        {
          label: '停车场',
          value: 'park'
        },
        ...deviceTypesOptions
      ],
      tabsDataItem: {
        park: [...parkinglotTypesOptions]
      },
      itemChecks: [],
      tableData: [],
      resourceType: []
    }
  },
  computed: {
    ...mapState('mapDetails', {
      mapSearch: state => state.mapSearch,
      mapSearchData: state => state.mapSearchData
    })
  },
  watch: {
    mapSearch: {
      handler () {
        this.initSearchData()
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    // this.initSearchData()
  },
  methods: {
    getLable,
    to () {
      this.$emit('to', { activeName: 'parkDetail', isCache: true })
    },
    close () {
      this.$emit('close')
    },
    changeTabs () {
      this.itemChecks = this.tabsDataItem[this.activeName].map(item => item.value)
      this.resourceType = this.itemChecks
    },
    changeTabItem (val) {
      this.resourceType = [...val]
      this.initData()
    },
    initSearchData () {
      this.activeName = 'park'
      this.changeTabs()
      this.initData()
    },
    initData () {
      this.currentPage = 1
      this.getData()
    },
    getData () {
      const params = {
        ...this.mapSearch,
        resourceType: [...this.resourceType],
        pageSize: this.pagesize,
        pageNo: this.currentPage
      }
      postResourceList(params).then(res => {
        const data = res.body || {}
        this.currentPage = data.pageNo || 1
        this.pagesize = data.pageSize || 10
        this.total = data.total || 0
        if (this.activeName === 'park') {
          this.tableData = data.parkingList || []
        } else if (this.activeName === 'gate') {
          this.tableData = data.deviceGates || []
        } else if (this.activeName === 'guide') {
          this.tableData = data.deviceGuides || []
        } else if (this.activeName === 'monitor') {
          this.tableData = data.deviceMonitors || []
        }
        this.isOpen()
        this.$emit('change')
      })
    },
    isOpen (open = true) {
      this.$store.dispatch('mapDetails/changeMapSearchData', { isOpen: open, total: this.total, resultData: this.tableData })
    },
    clickParking (val = {}, index) {
      this.$store.dispatch('mapDetails/changeMapCurData', val)
      this.$emit('click', index)
      this.to()
    },
    inOut (data = null, index, inOut = false) {
      this.$emit('inOut', data, index, inOut)
    }
  }
}
</script>
<style scoped lang="scss">
.el-scrollbar {
  flex: 1;
}
.resourceList-wrap {
  position: relative;
  height: 100%;
  background-color: $mapColor1-2;
  border-radius: 4px;
  overflow: hidden;
  &::after,
  &::before {
    content: '';
    position: absolute;
    left: 0;
    height: 14px;
    width: 100%;
    z-index: 1;
    background-image: url('~@/static/maps/decoration2.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
  &::after {
    top: 0;
    background-position: left top;
  }
  &::before {
    bottom: 0;
    background-position: left bottom;
  }
  .resource-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid $mapColor4-1;
    .tabHeader {
      background-color: $mapColor3-1;
      .tabs-wrap {
        display: flex;
        .map-tabs {
          flex: 1;
          overflow: auto;
          ::v-deep {
            .el-tabs__nav-scroll {
              padding: 0 15px;
              // display: flex;
              // justify-content: center;
            }
          }
        }
        .close {
          width: 40px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          color: $mapFontColorDefault1-1;
          text-align: center;
          border-left: 1px solid $mapColor4-1;
          border-bottom: 1px solid $mapColor4-1;
          background-color: $mapColor3-1;
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
      .tabsItems-wrap {
        padding: 10px 15px;
        border-bottom: 1px solid $mapColor4-1;
      }
    }
    .footer {
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: $mapFontColorDefault1-1;
      background-color: $mapColor3-1;
      .right {
        cursor: pointer;
        transition: all 0.3s;
        .open {
          transform: rotate(180deg);
        }
      }
    }
    .list {
      flex: 1;
      padding: 15px;
      overflow: auto;
      .empty {
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 14px;
        color: $mapFontColorDefault1-1;
        justify-content: center;
        span {
          max-width: 150px;
          color: $mapMainColor1-1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .parking-item {
        display: flex;
        margin-bottom: 15px;
        padding: 10px;
        background-color: $mapColor3-2;
        border-radius: 4px;
        cursor: pointer;
        &.cur,
        &:hover {
          background-color: $mapColor4-2;
        }
        .left {
          margin-right: 10px;
          width: 40px;
          height: 40px;
          &.common_park {
            background: url('~@/static/mapData/icon_list_park_1@2x.png') 0 0
              no-repeat;
            background-size: 100% 100%;
          }
          &.road_park {
            background: url('~@/static/mapData/icon_list_park_2@2x.png') 0 0
              no-repeat;
            background-size: 100% 100%;
          }
          &.PR_park {
            background: url('~@/static/mapData/icon_list_park_3@2x.png') 0 0
              no-repeat;
            background-size: 100% 100%;
          }
        }
        .right {
          font-size: 12px;
          color: $mapFontColorDefault1-1;
          .title {
            margin-bottom: 6px;
            font-size: 16px;
          }
          .type {
            display: inline-block;
            margin-bottom: 5px;
            padding: 0 4px;
            height: 20px;
            line-height: 20px;
            background-color: $mapMainColor1-1;
            border-radius: 2px;
          }
          .address {
            color: $mapFontColorDefault1-2;
          }
        }
      }
    }
  }
}
</style>
