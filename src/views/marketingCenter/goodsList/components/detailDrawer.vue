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
      <div :class="['status', `status-${formData.status}`]" />
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="110px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item
          label="商品编号"
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
          label="商品标题"
          prop="goodsTitle"
        >
          <el-input
            v-model.trim="formData.goodsTitle"
            :disabled="operationStatus !== 'edit'"
            maxlength="25"
            placeholder="请输入商品标题"
          />
        </el-form-item>
        <el-form-item
          label="商品图片"
          required
        >
          <el-upload
            class="uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleGoodsImgSuccess"
            :before-upload="beforeUpload"
            :headers="headers"
            accept="image/*"
            :disabled="operationStatus !== 'edit'"
          >
            <div
              class="goodsImg"
            >
              <img
                :src="formData.goodsImg"
              >
              <span v-show="operationStatus === 'edit'">重新上传</span>
            </div>
            <p slot="tip">
              推荐尺寸：800px * 800px，支持jpg、jpeg、png格式图片，最大支持5M的图片
            </p>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="logo"
          required
        >
          <el-upload
            class="uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeUpload"
            :headers="headers"
            accept="image/*"
            :disabled="operationStatus !== 'edit'"
          >
            <div
              class="logo"
            >
              <img
                :src="formData.logo"
              >
              <span v-show="operationStatus === 'edit'">重新上传</span>
            </div>
            <p slot="tip">
              推荐尺寸：200px * 200px，支持jpg、jpeg、png格式图片，最大支持5M的图片
            </p>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="商品原价"
          prop="commercialValue"
        >
          <el-input-number
            v-model="formData.commercialValue"
            :precision="1"
            :max="99999.9"
            :controls="false"
            :disabled="operationStatus !== 'edit'"
          />
        </el-form-item>
        <div class="other-form">
          <div class="label">
            兑换地址
          </div>
          <chooseAddress
            ref="chooseAddress"
            :data.sync="formData.addressList"
            :operation-status="operationStatus"
          />
        </div>
        <div class="other-form">
          <div class="label">
            图文详情
          </div>
          <chooseDetail
            ref="chooseDetail"
            :data.sync="formData.detailList"
            :operation-status="operationStatus"
          />
        </div>
        <el-form-item
          label=" 核销扣除乐币"
          prop="rate"
        >
          <el-input-number
            v-model="formData.rate"
            :precision="0"
            :max="100"
            :controls="false"
            :disabled="operationStatus === 'examine'"
          />
          <div>按用户购买价计算，单位“%”</div>
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
          v-if="formData.status !== 1"
          @click="dialogFormVisible = true"
        >
          驳回
        </el-button>

        <el-button
          v-if="formData.status !== 4"
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
          提交后商品将变为“审核通过”状态。挂靠此商品的热销将变为“禁用状态”。
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
import chooseAddress from './chooseAddress'
import chooseDetail from './chooseDetail'
import { postGoodsEdit, postAuditReject, postAuditApproval } from '@/api/manager'
import {getOneBySerialNo} from '@/api/user'
import { getLable } from '@/utils/function'
import upload from '@/mixin/upload'
export default {
  components: {chooseAddress, chooseDetail},
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
      operation: {
        edit: '编辑商品',
        examine: '查看商品',
        audit: '审核商品'
      },
      dialogFormVisible: false,
      submitVisible: false,
      auditData: {
        serialNo: '',
        rejectReason: ''
      },
      formData: {
        serialNo: '',
        rate: 0,
        goodsTitle: '',
        goodsImg: '',
        logo: '',
        commercialValue: undefined,
        addressList: [],
        detailList: []
      },
      rules: {
        goodsTitle: [
          { required: true, message: "请输入商品标题", trigger: "blur" },
          { max: 25, message: "最长可输入 25 个字", trigger: "blur" }
        ],
        commercialValue: [
          {required: true, type: 'number', message: "请输入原价", trigger: "blur"}
        ],
        rate: [
          {required: true, type: 'number', message: "请输入核销扣除乐币", trigger: "blur"}
        ]
      }
    }
  },
  created () {
    this.initUploadOptions({
      maxSize: 1024 * 1024 * 5,
      maxSizeTitle: '上传图片大小不能超过 5MB'
    })
    this.getData(this.data.serialNo)
  },
  methods: {
    getLable,
    getData (id) {
      getOneBySerialNo(id).then(res => {
        this.formData = res.body || {}
        this.formData.commercialValue = this.formData.commercialValue / 100
        this.$nextTick(() => {
          this.$refs.chooseAddress.init()
          this.$refs.chooseDetail.init()
        })
        this.auditData.serialNo = this.formData.serialNo
      })
    },
    close () {
      this.$emit('close')
    },
    resetSearch () {
      this.close()
      this.$emit('resetSearch')
    },
    handleGoodsImgSuccess(res) {
      this.formData.goodsImg = res.body || ''
    },
    handleLogoSuccess (res) {
      this.formData.logo = res.body || ''
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const addressList = this.$refs.chooseAddress.getSubmitResult()
          const detailList = this.$refs.chooseDetail.getSubmitResult()
          if (addressList && detailList) {
            this.submitVisible = true
          }
        } else {
          return false;
        }
      });
    },
    // 编辑
    draftInteraction () {
      const params = { ...this.formData }
      params.commercialValue = params.commercialValue * 100
      postGoodsEdit(params).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.resetSearch()
      })
    },
    // 通过
    approval () {
      const params = {
        serialNo: this.formData.serialNo,
        rate: this.formData.rate
      }
      postAuditApproval(params).then(() => {
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
          postAuditReject(this.auditData).then(() => {
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
    overflow: auto;
    .status {
      position: absolute;
      right: 20px;
      top: 0;
      width: 64px;
      height: 39px;
      &-1 {
        background: url('~@/static/goods/fail.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-2 {
        background: url('~@/static/goods/draft.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-3 {
        background: url('~@/static/goods/wait.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-4 {
        background: url('~@/static/goods/success.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
    .uploader {
      display: flex;
      p {
        margin-left: 10px;
        font-size: 12px;
        line-height: 1.5;
      }
      .upload {
        width: 100px;
        height: 100px;
        background: url('~@/static/icon_upload.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      .goodsImg {
        position: relative;
        width: 320px;
        height: 320px;
        line-height: 0;
        border-radius: 8px;
        overflow: hidden;
      }
      .logo {
        position: relative;
        width: 100px;
        height: 100px;
        border: 2px dashed #dee0e2;
        border-radius: 50%;
        overflow: hidden;
      }
      .goodsImg, .logo {
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
    .other-form + .other-form {
      border-top: 1px dashed #F1F2F3;
      .label {
        margin-top: 15px;
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
