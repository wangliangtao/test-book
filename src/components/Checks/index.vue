<template>
  <ul :class="['map-checks', styles]">
    <li
      v-for="(item,index,key) in data"
      :key="key"
      :class="{checked: item.isChecked}"
      @click="change(item, index)"
    >
      {{ item[labelKey] }}
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    styles: {
      type: String,
      default: 'style1' // style2
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
    defaultCheckeds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: [],
      ids: []
    }
  },
  watch: {
    defaultCheckeds: {
      handler() {
        this.ids = this.defaultCheckeds
        this.init()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      this.list = this.data.map(item => {
        item['isChecked'] = false
        this.ids.some(c => item['isChecked'] = item[this.valueKey] === c)
        return item
      })
      this.$forceUpdate()
    },
    change(item) {
      item.isChecked = !item.isChecked
      const checkData = this.list.filter(item => item.isChecked)
      this.ids = checkData.map(item => item[this.valueKey])
      this.$emit('change', this.ids)
      this.$forceUpdate()
    },
    getChecks() {
      return this.ids
    }
  }
}
</script>

<style scoped lang="scss">
.map-checks {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  &.style1 {
    li {
      margin: 0 5px 5px 0;
      padding: 2px 5px;
      font-size: 12px;
      color: $mapFontColorDefault1-2;
      border-radius: 2px;
      border: 1px solid $mapFontColorDefault1-3;
      cursor: pointer;
      transition: all .3s;
      &:hover {
        color: $mapFontColorDefault1-1;
        border: 1px solid $mapFontColorDefault1-2;
      }
      &.checked {
        color: $mapFontColorDefault1-1;
        border: 1px solid $mapFontColorDefault1-4;
        background-color: $mapFontColorDefault1-4;
        &:hover {
          background-color: $mapFontColorDefault1-3;
        }
      }
    }
  }
  &.style2 {
    li {
      margin-right: 10px;
      padding: 0 15px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: $mapFontColorDefault1-2;
      cursor: pointer;
      border-radius: 3px;
      border: 1px solid $mapFontColorDefault1-2;
      transition: all .3s;
      &:hover {
        color: $mapFontColorDefault1-1;
        border: 1px solid $mapColor5-1;
        background-color: $mapColor5-1;
      }
      &.checked {
        position: relative;
        color: $mapFontColorDefault1-1;
        border: 1px solid $mapMainColor1-1;
        background-color: $mapMainColor1-1;
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          width: 16px;
          height: 16px;
          background: url('~@/static/subscript.png') 0 0 no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>