<template>
  <div class="wrapper">
    <header>
      <section class="t">
        <span>{{ operation[operationStatus] }}</span>
      </section>
      <section>
        <i
          class="el-icon-close"
          @click="close"
        />
      </section>
    </header>
    <article>
      <div :class="['status', `status-${formData.enableStatus ? '1' : '2'}`]" />
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="120px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item
          label="魔窗标题"
          prop="moduleTitle"
        >
          <el-input
            v-model.trim="formData.moduleTitle"
            class="wid"
            :disabled="operationStatus === 'examine'"
            maxlength="8"
            placeholder="请输入魔窗标题，最多8个字"
          />
        </el-form-item>
        <el-form-item
          label="魔窗Logo"
          prop="moduleLogo"
        >
          <el-upload
            class="uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeUpload"
            :headers="headers"
            accept="image/*"
            :disabled="operationStatus === 'examine'"
          >
            <div
              v-if="formData.moduleLogo"
              class="logo"
            >
              <img
                :src="formData.moduleLogo"
              >
              <span v-show="operationStatus !== 'examine'">重新上传</span>
            </div>
            <div
              v-else
              class="upload"
            />
            <p slot="tip">
              推荐尺寸：200px * 200px，支持jpg、jpeg、png格式图片，最大支持5M的图片
            </p>
          </el-upload>
        </el-form-item>
        <div class="other-form">
          <div class="label">
            配置热销/链接
          </div>
          <module
            ref="module"
            :data.sync="formData.moduleLinkModels"
            :operation-status="operationStatus"
          />
        </div>
      </el-form>
    </article>
    <footer>
      <el-button
        v-if="operationStatus === 'examine'"
        type="primary"
        @click="close"
      >
        返回
      </el-button>
      <template v-if="operationStatus !== 'examine'">
        <el-button @click="close">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          提交
        </el-button>
      </template>
    </footer>
    <el-dialog
      width="40%"
      append-to-body
      title="确认提示"
      :visible.sync="submitVisible"
      :modal="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="tips">
        <p class="title">
          确定提交？
        </p>
        <p class="subTitle">
          提交后魔窗将变为“禁用中”状态。
        </p>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="submitVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="save"
        >
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getModuleDetail, postSaveModule } from '@/api/adminModule'
import { getLable } from '@/utils/function'
import { saleTypeOptions } from '@/utils/lookup'
import upload from '@/mixin/upload'
import module from './module'
export default {
  components: {module},
  mixins: [upload],
  props: {
    operationStatus: { // 操作状态
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {return {} }
    }
  },
  data () {
    return {
      saleTypeOptions,
      operation: {
        edit: '编辑魔窗',
        add: '创建魔窗',
        examine: '查看魔窗'
      },
      formData: {
        moduleTitle: '',
        moduleLogo: '',
        moduleLinkModels: []
      },
      rules: {
        moduleTitle: [
          {required: true, message: "请输入魔窗标题", trigger: "blur"}
        ],
        moduleLogo: [
          {required: true, message: "请上传魔窗 logo", trigger: "blur"}
        ]
      },
      submitVisible: false
    }
  },
  mounted () {
    this.initUploadOptions({
      maxSize: 1024 * 1024 * 5,
      maxSizeTitle: '上传图片大小不能超过 5MB'
    })
    this.getData(this.data.moduleSerialNo)
  },
  methods: {
    getLable,
    getData (id) {
      if (!id) {return this.$refs.module.init()}
      getModuleDetail(id).then(res => {
        this.formData = res.body || {}
        this.$nextTick(() => this.$refs.module.init())
      })
    },
    close () {
      this.$emit('close')
    },
    resetSearch () {
      this.close()
      this.$emit('resetSearch')
    },
    handleLogoSuccess (res) {
      this.formData.moduleLogo = res.body || ''
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let flag = false
          for (let i = 0; i < this.formData.moduleLinkModels.length; i++) {
            const item = this.formData.moduleLinkModels[i]
            item.boothIndex = i + 1
            if (item.boothType === 'HOT_SALE' && !item.saleSerialNo) {
              flag = true
              break
            }
            if (item.boothType === 'MERCHANT_LINK' && (!item.linkMerchantLoginId || !item.linkImage)) {
              flag = true
              break
            }
          }
          if (flag) {
            this.$message({
              message: '请填写完整信息',
              type: 'warning'
            })
          } else {
            this.submitVisible = true
          }
        } else {
          return false
        }
      });
    },
    // 编辑
    save () {
      const params = { ...this.formData }
      postSaveModule(params).then(() => {
        this.$message({
          message: this.data.moduleSerialNo ? '编辑成功' : '保存成功',
          type: 'success'
        })
        this.resetSearch()
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/styles/global.scss';
.el-radio {
  margin-right: 20px;
}
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  header,
  footer {
    padding: 0 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
  header {
    position: relative;
    height: 55px;
    justify-content: space-between;
    .t {
      font-size: 18px;
      color: $defaultColor;
    }
    section i {
      cursor: pointer;
      font-size: 16px;
    }
  }
  article {
    position: relative;
    padding: 20px;
    flex: 1;
    border-top: 1px solid #f1f2f3;
    overflow: auto;
    .status {
      position: absolute;
      right: 20px;
      top: 0;
      width: 64px;
      height: 39px;
      &-1 {
        background: url('~@/static/moduleStatus/enable.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-2 {
        background: url('~@/static/moduleStatus/disable.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
    .uploader {
      display: flex;
      .upload {
        width: 100px;
        height: 100px;
        background: url('~@/static/icon_upload.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      p {
        margin-left: 10px;
        font-size: 12px;
        line-height: 1.5;
      }
      .logo {
        position: relative;
        width: 100px;
        height: 100px;
        border: 2px dashed #dee0e2;
        border-radius: 50%;
        overflow: hidden;
      }
      .logo {
        img {
          width: 100%;
          height: 100%;
        }
        span{
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          font-size: 12px;
          line-height: 32px;
          color: #fff;
          background-color: rgba(0,0,0,0.6);
          text-align: center;
          transition: all .3s;
        }
        &:hover{
          span {
            background-color: rgba(0,0,0,0.8);
          }
        }
      }
    }
    .other-form {
      margin-bottom: 15px;
      .label {
        font-size: 14px;
        color: $title;
        font-weight: bold;
      }
    }
  }
  footer {
    height: 62px;
    border-top: 1px solid #f1f2f3;
  }
}
.tips {
  font-size: 12px;
  .title {
    color: $title;
  }
  .subTitle {
    margin-top: 5px;
    font-size: 12px;
    color: $subTitle;
  }
}
</style>
