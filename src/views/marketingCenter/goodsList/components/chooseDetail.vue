<template>
  <div class="choose-wrap">
    <el-form
      ref="formDetail"
      :model="formDetail"
    >
      <transition-group
        name="slide-fade"
        mode="out-in"
      >
        <div
          v-for="(item,index) in formDetail.detailList"
          :key="index+'index'"
          class="item-wrap"
        >
          <ul
            v-if="operationStatus === 'edit'"
            class="operation-wrap"
          >
            <li
              v-if="index !== 0"
              @click="moveUp(item, index)"
            >
              <svg-icon icon-class="icon_move_up" />
              上移
            </li>
            <li
              v-if="index < formDetail.detailList.length - 1"
              @click="moveDown(item, index)"
            >
              <svg-icon icon-class="icon_move_down" />
              下移
            </li>
            <li
              v-if="item.type === 'image'"
              @click="replaceUpload(index)"
            >
              <svg-icon icon-class="icon_replace" />
              更换
            </li>
            <li @click="del(index)">
              <svg-icon icon-class="icon_delete" />
              删除
            </li>
          </ul>
          <div class="title">
            {{ item.type === 'text' ? '文本' : '图片' }}
          </div>
          <el-form-item
            :prop="'detailList.'+index + '.detail'"
            :rules="{
              required: true, message: '文本不能为空', trigger: 'blur'
            }"
          >
            <el-input
              v-if="item.type === 'text'"
              v-model.trim="item.detail"
              maxlength="500"
              placeholder="请输入文本"
              show-word-limit
              autosize
              type="textarea"
              :disabled="operationStatus !== 'edit'"
            />
            <img
              v-if="item.type === 'image'"
              :src="item.detail"
            >
          </el-form-item>
        </div>
      </transition-group>
    </el-form>
    <div
      v-if="operationStatus === 'edit'"
      class="btns"
    >
      <el-button
        :class="{dis: formDetail.detailList.length >= 50}"
        @click="addMsg"
      >
        <svg-icon
          v-show="formDetail.detailList.length < 50"
          icon-class="icon_add"
        />
        {{ formDetail.detailList.length >= 50 ? '文本已达上限' : '添加文本' }}
      </el-button>
      <el-button
        :class="{dis: formDetail.detailList.length >= 50}"
        @click="addImg"
      >
        <svg-icon
          v-show="formDetail.detailList.length < 50"
          icon-class="icon_add"
        />
        {{ formDetail.detailList.length >= 50 ? '图片已达上限' : '添加图片' }}
      </el-button>
    </div>
    <el-upload
      v-show="false"
      ref="uploadBox"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :headers="headers"
      accept="image/*"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import upload from '@/mixin/upload'
export default {
  mixins: [upload],
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formDetail: {
        detailList: []
      },
      clickIndex: undefined,
      flag: true
    }
  },
  watch: {
    formDetail: {
      handler () {
        this.$nextTick(() => this.submit())
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init () {
      this.formDetail.detailList = JSON.parse(JSON.stringify(this.data))
      this.initUploadOptions({
        maxSize: 1024 * 1024 * 5,
        maxSizeTitle: '上传图片大小不能超过 5MB'
      })
    },
    del (index) {
      if (this.operationStatus !== 'edit') return
      this.formDetail.detailList.splice(index, 1)
    },
    // 添加文本
    addMsg () {
      if (this.operationStatus !== 'edit') return
      if (this.formDetail.detailList.length >= 50) return
      this.formDetail.detailList.push({
        type: 'text',
        detail: ''
      })
    },
    addImg () {
      if (this.operationStatus !== 'edit') return
      if (this.formDetail.detailList.length >= 50) return
      this.clickIndex = this.formDetail.detailList.length
      this.$refs.uploadBox.$children[0].$refs.input.click()
    },
    // 变更图片
    replaceUpload (index) {
      if (this.operationStatus !== 'edit') return
      this.clickIndex = index
      this.$refs.uploadBox.$children[0].$refs.input.click()
    },
    handleSuccess (data) {
      if (!this.formDetail.detailList[this.clickIndex]) {
        this.formDetail.detailList.push({
          type: 'image',
          detail: ''
        })
      }
      this.formDetail.detailList[this.clickIndex].detail = data.body || ''
      this.clickIndex = undefined
    },
    // 上移
    moveUp (val, index) {
      const on = this.formDetail.detailList[index - 1]
      const current = val
      this.formDetail.detailList[index - 1] = current
      this.formDetail.detailList[index] = on
      this.$forceUpdate()
    },
    // 下移
    moveDown (val, index) {
      const current = val
      const next = this.formDetail.detailList[index + 1]
      this.formDetail.detailList[index + 1] = current
      this.formDetail.detailList[index] = next
      this.$forceUpdate()
    },
    getSubmitResult () {
      return this.flag && this.formDetail.detailList
    },
    submit () {
      this.$refs['formDetail'].validate((valid) => {
        this.flag = valid
        if (valid) {
          this.$emit('update:data', this.formDetail.detailList)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.choose-wrap {
  .item-wrap {
    position: relative;
    margin-top: 20px;
    padding: 15px 20px 20px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    .operation-wrap {
      display: flex;
      position: absolute;
      right: 20px;
      top: 15px;
      font-size: 12px;
      color: #1b77fc;
      li {
        cursor: pointer;
      }
      li + li {
        margin-left: 30px;
      }
    }
    .title {
      margin-bottom: 15px;
      font-size: 12px;
      color: $title;
      font-weight: bold;
    }
    img {
      width: 319px;
      border-radius: 8px;
    }
  }
  .btns {
    margin-top: 20px;
    display: flex;
    button + button {
      margin-left: 20px;
    }
    button {
      flex: 1;
      font-size: 12px;
      color: #1b77fc;
      border: 1px dashed #1b77fc;
      border-radius: 4px;
      &.dis {
        color: #c2c5c8;
        border: 1px dashed #c2c5c8;
        :hover {
          background-color: inherit;
        }
      }
    }
  }
}
::v-deep.el-input-number .el-input__inner {
  text-align: left;
}
</style>
