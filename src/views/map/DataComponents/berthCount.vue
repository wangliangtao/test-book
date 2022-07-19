<template>
  <div
    :class="['berthCount-wrap', {edit: operationStatus === 'edit', checked: checked}]"
    @click.stop="renderMapLoca()"
  >
    <div class="tips">
      <svg-icon
        icon-class="icon_thermal"
      />
      热力图
    </div>
    <div class="item1">
      <div class="header">
        <span class="cur" />
        泊位数量
        <span
          class="download"
        >
          <svg-icon
            icon-class="icon_export"
          />
          导出报表
        </span>
      </div>
      <div class="count-wrap">
        <div
          class="title"
          @click.stop="renderMapLoca()"
        >
          泊位数量
        </div>
        <div class="count-container moneyFont">
          <template v-for="(item,index,key) in slotNum">
            <div
              :key="key"
              :class="[Number(item) >= 0 ? 'item' : 'other']"
            >
              {{ item }}
            </div>
          </template>
        </div>
      </div>
      <div class="count-item">
        <Item
          :text="Item1.text"
          :count-obj="Item1.countObj"
          :battery="Item1.battery"
          @click="renderMapLoca(Item1)"
        />
      </div>
      <div class="count-item">
        <Item
          :text="Item2.text"
          :count-obj="Item2.countObj"
          :battery="Item2.battery"
          @click="renderMapLoca(Item2)"
        />
      </div>
      <div class="count-item">
        <Item
          :text="Item3.text"
          :count-obj="Item3.countObj"
          :battery="Item3.battery"
          @click="renderMapLoca(Item3)"
        />
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Item from './berthCountComponents/berthItem'
import {postSlots} from '@/api/report'
const DEFAULTTIME = 60 * 60 * 1000
export default {
  components: {
    Item
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: {},
      Item1: {},
      Item2: {},
      Item3: {},
      slotNum: []
    }
  },
  watch: {
    params: {
      handler() {
        this.getData()
      },
      deep: true,
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    getData() {
      this.init()
      postSlots({...this.params})
        .then(res => {
          this.data = res.body || {}
          this.Item1.countObj.count = this.data.commonSlotNum 
          this.Item1.battery.w = this.data.commonSlotNumUse / this.data.commonSlotNum * 100
          this.Item2.countObj.count = this.data.prslotNum
          this.Item2.battery.w = this.data.prslotNumUse / this.data.prslotNum * 100
          this.Item3.countObj.count = this.data.roadSlotNum
          this.Item3.battery.w = this.data.roadSlotNumUse / this.data.roadSlotNum * 100
          this.getSlotNum(this.data.slotNum)
        })
        .then(() => {
          if (this.timer) clearInterval(this.timer)
          this.timer = setTimeout(this.getData, DEFAULTTIME)
        })
    },
    getSlotNum(num) {
      const slots = '' + num
      const str = '0'.repeat(7 - slots.length) + slots
      const c = str.replace(/\d{1,3}(?=(\d{3})+$)/g,s => s+',')
      this.slotNum = Array.from(c)
    },
    clickWrap(data) {
      if (data) {
        this.$emit('changeCheck', 'renderMapLoca', data)
      } else {
        this.$emit('changeCheck')
      }
    },
    init() {
      this.data = {}
      this.Item1 = {
        resourceType: ['common_park'],
        text: '普通停车场',
        countObj: {
          color: '#80B5FF',
          count: 0,
          hoverClass: 'common'
        },
        battery: {
          bg: require('@/static/mapData/blue_new_bg_1@2x.png'),
          w: 0,
          color1: '#80B5FF',
          color2: '#3388FF'
        }
      }
      this.Item2 = {
        resourceType: ['PR_park'],
        text: 'P+R停车场',
        countObj: {
          color: '#FFCC66',
          count: 0,
          hoverClass: 'pr'
        },
        battery: {
          bg: require('@/static/mapData/yellow_new_bg_1@2x.png'),
          w: 0,
          color1: '#FFCC66',
          color2: '#FFBB33'
        }
      }
      this.Item3 = {
        resourceType: ['road_park'],
        text: '路内泊位',
        countObj: {
          color: '#66CC88',
          count: 0,
          hoverClass: 'road'
        },
        battery: {
          bg: require('@/static/mapData/green_new_bg_1@2x.png'),
          w: 0,
          color1: '#66CC88',
          color2: '#14CC52'
        }
      }
      this.slotNum = []
    },
    renderMapLoca(data = {}) {
      if (this.operationStatus === 'edit') return
      const params = {
        ...this.params,
        resourceType: data.resourceType || [],
        methods: 'postSlotsHeatMap'
      }
      this.clickWrap(params)
    }
  }
}
</script>

<style scoped lang="scss">
.tips {
  position: absolute;
  right: -3px;
  top: -3px;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  color: $mapFontColorDefault1-1;
  background: linear-gradient(225deg, #80B5FF 0%, #3388FF 100%);
  border-radius: 0px 4px 0px 4px;
  z-index: 1;
}
.berthCount-wrap {
  position: relative;
  border: 3px solid transparent;
  border-radius: 4px;
  &.edit {
    .tips {
      top: 35px;
      border-radius: 4px 0 0 4px;
    }
    .item1 {
      padding: 35px 20px 20px;
      height: 244px;
    }
  }
  &:not(.edit, .checked):hover {
    border-color: $mapColor3-4;
    .item1 {
      background-color: $mapColor3-4;
    }
  }
  &.checked {
    border-color: $mapFontColor1-1;
    .item1 {
      background-color: $mapColor3-4;
    }
  }
  .item1 {
    padding: 15px 20px;
    height: 224px;
    cursor: pointer;
    .header {
      margin-bottom: 15px;
      display: flex;
      font-size: 12px;
      color: $mapFontColorDefault1-1;
      font-weight: bold;
      .cur {
        margin-right: 5px;
        width: 3px;
        background-color: $mapFontColor1-1;
        border-radius: 1px;
      }
      .download {
        margin-left: 20px;
        color: $mapFontColor1-1;
        cursor: pointer;
      }
    }
    .count-wrap {
      padding: 2px;
      margin-bottom: 16px;
      display: flex;
      border-radius: 2px;
      border: 2px solid $mapColor4-1;
      cursor: pointer;
      &:hover {
        .title {
          background-color: $mapColor5-1;
        }
      }
      .title {
        display: flex;
        align-items: center;
        padding: 0 10px;
        width: 65px;
        height: 56px;
        font-size: 18px;
        text-align: center;
        color: $mapFontColorDefault1-1;
        background-color: $mapColor10-1;
        transition: all .3s;
      }
      .count-container {
        flex: 1;
        margin-left: 2px;
        display: flex;
        font-size: 40px;
        color: $mapFontColorDefault1-1;
        .item + .item {
          margin-left: 2px;
        }
        .item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #80B4FF 0%, #3287FF 100%);
        }
        .other {
          margin: 0 5px;
          align-self: center;
          font-weight: bold;
        }
      }
    }
    .count-item + .count-item {
      margin-top: 14px;
    }
  }
}
</style>