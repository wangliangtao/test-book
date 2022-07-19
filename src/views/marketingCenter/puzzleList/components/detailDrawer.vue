<template>
  <div class="wrapper">
    <header>
      <section class="t">
        <span v-if="operationStatus === 'edit'">编辑互动</span>
        <span v-if="operationStatus === 'examine'">查看互动</span>
        <span v-if="operationStatus === 'audit'">审核互动</span>
      </section>
      <section>
        <i
          class="el-icon-close"
          @click="close"
        />
      </section>
    </header>
    <article>
      <div :class="['status', `status-${formData.status}`]" />
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="80px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item
          label="互动ID"
          required
        >
          <span>{{ formData.serialNo }}</span>
        </el-form-item>
        <el-form-item
          label="商家昵称"
          required
        >
          <span>{{ formData.nickname }}</span>
        </el-form-item>
        <el-form-item
          label="手机号码"
          required
        >
          <span>{{ formData.phone }}</span>
        </el-form-item>
        <el-form-item
          label="互动标题"
          prop="puzzleTitle"
        >
          <el-input
            v-model.trim="formData.puzzleTitle"
            :disabled="operationStatus !== 'edit'"
            maxlength="6"
            placeholder="请输入互动标题"
          />
        </el-form-item>
        <el-form-item
          label="互动内容"
          prop="puzzleContent"
        >
          <el-input
            v-model.trim="formData.puzzleContent"
            :disabled="operationStatus !== 'edit'"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            maxlength="120"
            show-word-limit
            resize="none"
            placeholder="请输入互动内容"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.rejectReason"
          label="驳回理由"
        >
          <span>{{ formData.rejectReason }}</span>
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
          v-if="formData.status !== 1"
          @click="dialogFormVisible = true"
        >
          驳回
        </el-button>

        <el-button
          v-if="formData.status <= 4"
          type="primary"
          @click="approval"
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
          prop="rejectReason"
          :rules="[
            {
              required: true,
              message: '请输入失败理由（最多100字）',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model.trim="auditData.rejectReason"
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
          @click="reject"
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
          提交后互动将变为“禁用中”状态。
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
          @click="draftInteraction"
        >
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBySerialNo, approval, reject, draftInteraction } from '@/api/manager'
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
        interactionSerialNo: '',
        rejectReason: ''
      },
      formData: {
        puzzleTitle: '',
        puzzleContent: ''
      },
      rules: {
        puzzleTitle: [
          { required: true, message: "请输入互动标题", trigger: "blur" },
          { max: 6, message: "最长可输入 6 个字", trigger: "blur" }
        ],
        puzzleContent: [
          { required: true, message: '请输入互动内容', trigger: "blur" },
          { max: 120, message: "最长可输入 120 个字", trigger: "blur" }
        ]
      }
    }
  },
  created () {
    this.getData(this.data.serialNo)
  },
  methods: {
    getLable,
    getData (id) {
      getBySerialNo(id).then(res => {
        this.formData = res.body || {}
        this.formData.puzzleContent = this.formData.puzzleContentList.join('\n')
        this.auditData.interactionSerialNo = this.formData.serialNo
      })
    },
    close () {
      this.$emit('close')
    },
    resetSearch () {
      this.close()
      this.$emit('resetSearch')
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
    draftInteraction () {
      const params = { ...this.formData }
      params.puzzleContentList = params.puzzleContent.split('\n')
      draftInteraction(params).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.resetSearch()
      })

    },
    // 通过
    approval () {
      approval(this.auditData).then(() => {
        this.$message({
          message: '通过成功',
          type: 'success'
        })
        this.resetSearch()
      })
    },
    // 驳回
    reject () {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          reject(this.auditData).then(() => {
            this.$message({
              message: '驳回成功',
              type: 'success'
            })
            this.resetSearch()
          })
        } else {
          return false;
        }
      });

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
