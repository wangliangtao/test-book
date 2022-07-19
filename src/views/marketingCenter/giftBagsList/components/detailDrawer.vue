<template>
  <div class="wrapper">
    <header>
      <section class="t">
        <span v-if="operationStatus === 'edit'">编辑奖券</span>
        <span v-if="operationStatus === 'examine'">查看奖券</span>
        <span v-if="operationStatus === 'audit'">审核奖券</span>
      </section>
      <section>
        <i
          class="el-icon-close"
          @click="close"
        />
      </section>
    </header>
    <article>
      <div :class="['status', `status-${formData.ruleStatus}`]" />
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="80px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item
          label="奖券编号"
          required
        >
          <span>{{ formData.ruleId }}</span>
        </el-form-item>
        <el-form-item
          label="商家昵称"
          required
        >
          <span>{{ formData.merchantNickName }}</span>
        </el-form-item>
        <el-form-item
          label="手机号码"
          required
        >
          <span>{{ formData.merchantPhone }}</span>
        </el-form-item>
        <el-form-item
          label="奖券标题"
          prop="awardTitle"
        >
          <el-input
            v-model.trim="formData.awardTitle"
            :disabled="operationStatus !== 'edit'"
            maxlength="10"
            placeholder="请输入奖券标题"
          />
        </el-form-item>
        <el-form-item
          label="奖券内容"
          prop="awardDescription"
        >
          <el-input
            v-model.trim="formData.awardDescription"
            :disabled="operationStatus !== 'edit'"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 20 }"
            maxlength="500"
            show-word-limit
            resize="none"
            placeholder="请输入奖券内容"
          />
        </el-form-item>
        <el-form-item
          label="奖品图片"
          prop="awardImages"
        >
          <el-upload
            class="uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAwardSuccess"
            :before-upload="beforeUpload"
            :headers="headers"
            :disabled="operationStatus !== 'edit'"
          >
            <img
              v-if="formData.awardImages"
              :src="formData.awardImages[0]"
              class="award"
            >
            <div
              v-else
              class="upload"
            />
          </el-upload>
        </el-form-item>
        <el-form-item
          label="奖券原价"
          prop="originalPrice"
        >
          <el-input-number
            v-model="formData.originalPrice"
            :precision="1"
            :max="99999"
            :controls="false"
            :disabled="operationStatus !== 'edit'"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.auditErrorMessage"
          label="驳回理由"
        >
          <span>{{ formData.auditErrorMessage }}</span>
        </el-form-item>
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
      <!-- 编辑 -->
      <template v-if="operationStatus === 'edit'">
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
      <!-- 审核 -->
      <template v-if="operationStatus === 'audit'">
        <el-button
          v-if="formData.ruleStatus !== 1"
          @click="dialogFormVisible = true"
        >
          驳回
        </el-button>

        <el-button
          v-if="formData.ruleStatus <= 4"
          type="primary"
          @click="ajaxUpdateAuditStatus(1)"
        >
          通过
        </el-button>
      </template>
    </footer>

    <el-dialog
      append-to-body
      title="失败原因"
      :visible.sync="dialogFormVisible"
      :modal="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="dialogForm"
        :model="auditData"
        label-width="80px"
        label-position="right"
      >
        <el-form-item
          label="失败理由"
          prop="auditErrorMessage"
          :rules="[
            {
              required: true,
              message: '请输入失败理由（最多100字）',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model.trim="auditData.auditErrorMessage"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            maxlength="100"
            show-word-limit
            placeholder="请输入失败理由（最多100字）"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="ajaxUpdateAuditStatus(-1)"
        >
          提 交
        </el-button>
      </div>
    </el-dialog>
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
          提交后奖券将变为“禁用中”状态。
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
          @click="updateRuleInfo"
        >
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRuleDetail, auditRule, updateRuleInfo } from '@/api/admin'
import { interactionStatusOptions } from '@/utils/lookup'
import { getLable } from '@/utils/function'
import upload from '@/mixin/upload'
export default {
  mixins: [upload],
  props: {
    operationStatus: { // 操作状态
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      interactionStatusOptions,
      dialogFormVisible: false,
      submitVisible: false,
      auditData: {
        ruleId: this.data.ruleId,
        auditStatus: '',
        auditErrorMessage: ''
      },
      formData: {
        ruleId: this.data.ruleId,
        awardTitle: '',
        awardDescription: '',
        awardImages: [],
        originalPrice: undefined
      },
      rules: {
        awardTitle: [
          { required: true, message: "请输入互动标题", trigger: "blur" },
          { max: 10, message: "最长可输入 10 个字", trigger: "blur" }
        ],
        awardDescription: [
          { required: true, message: '请输入互动内容', trigger: "blur" },
          { max: 500, message: "最长可输入 500 个字", trigger: "blur" }
        ],
        awardImages: [
          { required: true, message: '请选择奖品图片', trigger: "blur" }
        ],
        originalPrice: [
          { required: true, message: '不能为空' },
          { type: 'number', max: 99999, message: '必须为数字' }
        ]
      }
    }
  },
  created () {
    this.getData(this.data.ruleId)
  },
  methods: {
    getLable,
    getData (id) {
      getRuleDetail(id).then(res => {
        this.formData = res.body || {}
      })
    },
    close () {
      this.$emit('close')
    },
    resetSearch () {
      this.close()
      this.$emit('resetSearch')
    },
    handleAwardSuccess (res) {
      this.formData.awardImages = [res.body || '']
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitVisible = true
        } else {
          return false;
        }
      });
    },
    // 编辑
    updateRuleInfo () {
      const params = { ...this.formData }
      updateRuleInfo(params).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.resetSearch()
      })

    },
    ajaxUpdateAuditStatus (status) {
      if (!status) return
      this.auditData.auditStatus = status
      if (status === 1) {
        auditRule(this.auditData).then(() => {
          this.$message({
            message: '通过成功',
            type: 'success'
          })
          this.resetSearch()
        })
      } else {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            auditRule(this.auditData).then(() => {
              this.$message({
                message: '驳回成功',
                type: 'success'
              })
              this.resetSearch()
            })
          } else {
            return false;
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/styles/global.scss';
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
    padding: 0 20px;
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
        background: url('~@/static/puzzle/fail.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-2 {
        background: url('~@/static/puzzle/draft.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-3 {
        background: url('~@/static/puzzle/wait.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-5 {
        background: url('~@/static/puzzle/disable.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-6 {
        background: url('~@/static/puzzle/enable.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
    .uploader {
      .upload {
        width: 100px;
        height: 100px;
        background: url('~@/static/icon_upload.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      .award {
        width: 320px;
        height: 320px;
        border-radius: 8px;
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
