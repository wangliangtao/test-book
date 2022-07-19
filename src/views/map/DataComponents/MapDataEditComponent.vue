<template>
  <div :class="['component-wrap', type]">
    <div class="preview-wrap map-box">
      <div class="map-box-top" />
      <div class="map-box-bottom" />
      <div class="title-wrap">
        <el-input
          v-model="form.title"
          class="map-input"
          maxlength="10"
        />
      </div>
      <div class="preview-container">
        <el-scrollbar wrap-class="x-hidden">
          <transition-group
            id="content-footer"
            enter-active-class="fadeIn"
            leave-active-class="fadeOut"
          >
            <div
              v-for="(item,index,key) in form.componentList"
              :key="''+index + key"
              class="data-box"
            >
              <div class="btns">
                <div
                  v-show="index !== 0"
                  class="btn move_up"
                  @click="up(index,item)"
                >
                  <svg-icon
                    icon-class="icon_move_up"
                  />
                  上移
                </div>
                <div
                  v-show="index !== form.componentList.length - 1"
                  class="btn move_down"
                  @click="down(index,item)"
                >
                  <svg-icon
                    icon-class="icon_move_down"
                  />
                  下移
                </div>
                <div
                  class="btn delete"
                  @click.stop="remove(index)"
                >
                  <svg-icon
                    icon-class="icon_delete"
                  />
                  删除
                </div>
              </div>
              <component
                :is="item.value"
                :id="'' + index + Date.now() + item.value"
                operation-status="edit"
                :params="mapSearch"
              />
            </div>
          </transition-group>
          <div
            v-show="form.componentList.length < 10 && form.componentList.length > 1"
            class="tip"
          >
            点击组件库中目标组件的“添加”按钮，可新增图表
          </div>
        </el-scrollbar>
        <div
          v-show="form.componentList.length === 0"
          class="noCom"
        >
          点击组件库中目标组件的“添加”按钮，可新增图表
        </div>
      </div>
      <div class="btns-wrap">
        <el-button
          class="map-btn-border"
          round
          @click="close"
        >
          取消
        </el-button>
        <el-button
          class="map-btn-noBorder"
          type="primary"
          round
          @click="save"
        >
          保存
        </el-button>
      </div>
    </div>
    <div class="library-wrap map-box">
      <div class="map-box-top" />
      <div class="map-box-bottom" />
      <div class="title">
        组件库
      </div>
      <div class="library-container">
        <el-scrollbar wrap-class="x-hidden">
          <div class="item">
            <div
              v-for="(item,index,key) in mapSidebarComponents"
              v-show="!item.hidden"
              :key="key"
            >
              <div class="btns">
                <div
                  class="btn add"
                  @click="add(item)"
                >
                  <svg-icon
                    icon-class="icon_component_add"
                  />
                  添加
                </div>
              </div>
              <img
                :src="item.imgSrc"
                alt=""
              >
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import { mapSidebarComponents } from '@/utils/lookup'
import importDataComponent from './importDataComponent'
export default {
  mixins: [importDataComponent],
  props: {
    type: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      form: {componentList: []},
      mapSidebarComponents
    }
  },
  computed: {
    ...mapState('mapDetails',{
      mapSearch: state => state.mapSearch
    })
  },
  mounted() {
    const {title, componentList} = this.$store.getters[`mapDetails/${this.type}SidebarList`]
    this.form = { title, componentList: [...componentList]}
  },
  methods: {
    add({label, value}) {
      if (this.form.componentList.length >= 10) return
      this.form.componentList.push({label, value})
      this.$nextTick(() => {
        var div=document.getElementById("content-footer");
        div.scrollIntoView(false)
      })
    },
    remove(index) {
      this.form.componentList.splice(index, 1)
    },
    up(index,data) {
      const on = this.form.componentList[index - 1]
      const current = data
      this.form.componentList[index - 1] = current
      this.form.componentList[index] = on
      this.$forceUpdate()
    },
    down(index,data) {
      const current = data
      const next = this.form.componentList[index + 1]
      this.form.componentList[index + 1] = current
      this.form.componentList[index] = next
      this.$forceUpdate()
    },
    save() {
      const params = {
        ...this.form,
        type: this.type
      }
      this.$store.dispatch('mapDetails/changeDataSidebar', params).then(() => {
        this.close()
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.btns {
  position: absolute;
  width: 100%;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  z-index: 10;
  .btn {
    margin-left: 1px;
    padding: 0 15px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    color: $mapFontColorDefault1-1;
    background-color: $mapColor4-1;
    cursor: pointer;
    transition: all .3s;
    &:first-of-type {
      border-top-right-radius: 4px;
    }
    &:last-of-type {
      border-bottom-left-radius: 4px;
    }
  }
  .move_up, .move_down {
    &:hover {
      background-color: $mapMainColor1-1;
    }
    &:active {
      background-color: $mapColor5-1;
    }
  }
  .delete {
    &:hover {
      background-color: $mapMainColor1-4;
    }
    &:active {
      background-color: $mapStarColor2-1;
    }
  }
  .add {
    background-color: $mapMainColor1-1;
    &:hover {
      background-color: $mapColor7-1;
    }
    &:active {
      background-color: $mapColor5-1;
    }
  }
}

.component-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9999999;
  display: flex;
  padding: 20px;
  background: rgba(0,0,0,0.95);
  &.right {
    flex-direction: row-reverse;
  }
  .preview-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 0 0 455px;
    height: 100%;
    border: 1px solid $mapColor4-1;
    background-color: $mapColor1-3;
    .title-wrap {
      padding: 20px 20px 0;
    }
    .preview-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px 20px 0;
      overflow: auto;
      .data-box + .data-box {
        margin-top: 20px;
      }
      .data-box {
        position: relative;
        background-color: $mapColor3-3;
        border-radius: 4px;
      }
      .tip {
        padding: 20px;
        font-size: 12px;
        color: $mapFontColorDefault1-1;
        text-align: center;
      }
    }
    .btns-wrap {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 10px 20px;
      background-color: $mapColor3-1;
      border-top: 1px solid $mapColor4-1;
    }
    .noCom {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      font-size: 12px;
      color: $mapFontColorDefault1-1;
      white-space: nowrap;
    }
  }
  .library-wrap {
    margin: 40px 60px;
    display: flex;
    flex: 0 0 890px;
    flex-direction: column;
    border: 1px solid $mapColor4-1;
    background-color: $mapColor1-3;
    .title {
      padding-left: 20px;
      height: 52px;
      line-height: 52px;
      font-size: 18px;
      color: $mapFontColorDefault1-1;
      background-color: $mapColor3-1;
      border-bottom: 1px solid $mapColor4-1;
    }
    .library-container {
      padding: 20px;
      flex: 1;
      overflow: auto;
      .item {
        column-count: 2;
        column-gap: 20px;
        &>div {
          position: relative;
          margin-bottom: 20px;
          img {
            width: 100%;
            min-height: 274px;
          }
        }
      }
    }
  }
}
</style>