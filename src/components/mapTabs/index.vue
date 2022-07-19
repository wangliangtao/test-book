<template>
  <div :class="['mapTabs-wrap', position, className]">
    <div
      v-for="(item,index,key) in list"
      :key="key"
      :class="{active: item.isChecked}"
      @click.stop="change(item, index)"
    >
      {{ item[labelKey] }}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: 'style1'
    },
    position: {
      type: String,
      default: 'center'
    },
    checked: {
      type: Array,
      default: () => []
    },
    data: { // 数据源
      type: Array,
      default: () => []
    },
    labelKey: { // 显示的 key 值
      type: String,
      default: 'label'
    },
    valueKey: { // 绑定的 value 值
      type: String,
      default: 'value'
    },
    max: {
      type: Number, // 最多选取几个
      default: 1
    }
  },
  data () {
    return {
      list: [],
      checkedList: []
    }
  },
  watch: {
    defaultCheckeds: {
      handler () {
        // this.checkedList = this.checked
        this.init()
      },
      deep: true,
      immediate: true
    },
    multiple: {
      handler () {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.checkedList = this.checked
      this.list = this.data.map(item => {
        item['isChecked'] = false
        this.checkedList.some(c => item['isChecked'] = item[this.valueKey] === c)
        return item
      })
      this.$forceUpdate()
    },
    change (item, index) {
      // 多选
      if (this.multiple) {
        // item.isChecked = !item.isChecked
        // const checkData = this.list.filter(item => item.isChecked)
        // this.checkedList = checkData.map(item => item[this.valueKey])
        // this.$emit('change', this.checkedList)
        // this.$forceUpdate()
      } else {
        this.changeRadio(item, index)
      }
    },
    changeCheckbox (item) {
      // 多选还没测试过~~~~~~~想象一下
      // false 说明是要选择，需要判断 max
      if (!item.isChecked) {
        if (this.max >= this.checkedList.length) return
        item.isChecked = true
      } else {
        item.isChecked = false
      }
      const checkData = this.list.filter(item => item.isChecked)
      this.checkedList = checkData.map(item => item[this.valueKey])
      this.$emit('change', this.checkedList)
      this.$forceUpdate()
    },
    changeRadio (item, index) {
      if (item.isChecked) return
      this.list.forEach(item => item.isChecked = false)
      this.list[index].isChecked = true
      this.checkedList = [item[this.valueKey]]

      this.$emit('change', this.checkedList)
      this.$forceUpdate()
    },
    getChecks () {
      return this.checkedList
    }
  }
}
</script>

<style scoped lang="scss">
.mapTabs-wrap {
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  &.center {
    justify-content: center;
  }
  div {
    width: 75px;
    font-size: 12px;
    color: $mapFontColorDefault1-1;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    &:hover,
    &.active {
      font-weight: bold;
    }
  }
  div:first-of-type {
    border-radius: 3px 0px 0px 3px;
  }
  div:last-of-type {
    border-radius: 0px 3px 3px 0px;
  }
  &.style1 {
    div {
      background-color: $mapColor10-1;
      &.active {
        background-color: $mapColor5-1;
      }
    }
  }
  &.style2 {
    div {
      background-color: $mapColor5-1;
      &.active {
        background-color: $mapMainColor1-1;
      }
    }
  }
}
</style>
