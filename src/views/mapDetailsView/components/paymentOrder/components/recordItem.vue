<template>
  <div class="record-wrap">
    <div class="header-btns">
      <div class="car">
        <span class="carPlate">{{ data.plateNo }}</span>
        <span :class="['carIcon', 'type'+ data.plateColor]">{{ getLable(data.plateColor,carTypeList,'dec', 'code') }}</span>
      </div>
      <div>
        <span
          v-if="orderStatus === 'REFUND'"
          class="content"
        >已退款</span>
        <el-button
          v-else
          class="map-btn-noBorder"
          type="primary"
          round
          @click="showRefund = true"
        >
          退款
        </el-button>
      </div>
    </div>
    <div class="info-wrap">
      <div class="item">
        <div class="li">
          <div class="label">
            场地名称：
          </div>
          <div class="content">
            {{ data.prkName }}
          </div>
        </div>
      </div>
      <div class="item">
        <div class="li">
          <div class="label">
            入场时间：
          </div>
          <div class="content">
            {{ data.prkStartAtTimestamp | dateformat('YYYY-MM-DD HH:mm') }}
          </div>
        </div>
        <div class="li">
          <div class="label">
            出场时间：
          </div>
          <div class="content">
            {{ data.prkEndAtTimestamp | dateformat('YYYY-MM-DD HH:mm') }}
          </div>
        </div>
      </div>
      <div class="item">
        <div class="li">
          <div class="label">
            停车时长：
          </div>
          <div class="content">
            {{ data.parkingCostString }}
          </div>
        </div>
        <div class="li">
          <div class="label">
            停车费用：
          </div>
          <div class="content">
            {{ data.prkFee || 0 | RMBstr }}
          </div>
        </div>
      </div>
      <div class="item">
        <div class="li">
          <div class="label">
            实际付款：
          </div>
          <div class="content">
            {{ data.prkFeeRmb || 0 | RMBstr }}
          </div>
        </div>
      </div>
    </div>
    <el-collapse-transition>
      <div
        v-show="showRefund || orderStatus === 'REFUND'"
        class="form-wrap"
      >
        <div v-if="orderStatus !== 'REFUND'">
          <el-form
            ref="ruleForm"
            class="map-form"
            :model="formData"
            :rules="rules"
            label-position="top"
          >
            <el-form-item prop="refundAmount">
              <div
                slot="label"
                class="map-form-label"
              >
                退款金额
                <span class="subtitle">（最多退款 {{ data.prkFeeRmb || 0 | RMBstr }}）一次停车记录只可退款一次，请谨慎操作</span>
              </div>
              <el-input-number
                v-model="formData.refundAmount"
                class="map-input input-number"
                :min="0.01"
                :max="data.prkFeeRmb * 100"
                :precision="2"
                :controls="false"
                label="请输入退款金额"
                placeholder="请输入退款金额"
              />
            </el-form-item>
            <el-form-item>
              <div
                slot="label"
                class="map-form-label"
              >
                上传凭证
                <span class="subtitle">（最多3张，支持jpg、jpeg、png格式图片，最大支持10M的图片）</span>
              </div>
              <div class="upload-wrap">
                <el-upload
                  class="uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleLogoSuccess"
                  :before-upload="beforeUpload"
                  :headers="headers"
                  :disabled="formData.refundImgList.length >= 3"
                >
                  <div
                    v-for="(item, index, key) in formData.refundImgList"
                    :key="key"
                    class="img-wrap"
                    @click.stop
                  >
                    <svg-icon
                      class="closed"
                      icon-class="icon_close_14"
                      @click.stop="delImg(index)"
                    />
                    <img :src="item">
                  </div>
                  <div
                    v-show="formData.refundImgList.length < 3"
                    class="upload"
                  />
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item prop="remark">
              <div
                slot="label"
                class="map-form-label"
              >
                退款理由
              </div>
              <el-input
                v-model.trim="formData.remark"
                class="map-input-textarea"
                type="textarea"
                maxlength="500"
                resize="none"
                placeholder="请输入退款理由"
                show-word-limit
              />
            </el-form-item>
          </el-form>
          <div class="btns-wrap">
            <el-button
              class="map-btn-border"
              round
              @click="closeRefund"
            >
              取消
            </el-button>
            <el-button
              class="map-btn-noBorder"
              type="primary"
              round
              @click="submitForm"
            >
              确定
            </el-button>
          </div>
        </div>
        <div v-if="orderStatus === 'REFUND'">
          <div class="info-wrap">
            <div class="item">
              <div class="li">
                <div class="label">
                  退款金额：
                </div>
                <div class="content">
                  {{ data.refundAmount || 0 | RMBstr }}
                </div>
              </div>
              <div class="li">
                <div class="label">
                  操作用户：
                </div>
                <div class="content">
                  {{ data.opNickname }}({{ data.opPhone }})
                </div>
              </div>
            </div>
            <div class="item">
              <div class="li">
                <div class="label">
                  退款时间：
                </div>
                <div class="content">
                  {{ data.refundAtTimestamp | dateformat('YYYY-MM-DD HH:mm') }}
                </div>
              </div>
            </div>
            <div class="item">
              <div class="li">
                <div class="label">
                  退款凭证：
                </div>
                <div class="content">
                  <el-image
                    v-for="(item, index, key) in data.refundImgList"
                    :key="key"
                    class="img"
                    :src="item"
                    :preview-src-list="data.refundImgList"
                  />
                </div>
              </div>
              <div class="li">
                <div class="label">
                  退款理由：
                </div>
                <div class="content">
                  {{ data.remark }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script type="text/ecmascript-6">
import upload from '@/mixin/upload'
import { getLable } from '@/utils/function'
import { carTypeList } from '@/utils/lookup'

export default {
  mixins: [upload],
  props: {
    params: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      orderStatus: '',
      carTypeList,
      data: {},
      showRefund: false,
      formData: {
        refundImgList: []
      },
      rules: {
        refundAmount: [
          { required: true, message: "请输入退款金额", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入退款理由", trigger: "blur" },
        ]
      }
    }
  },
  mounted () {
    this.data = { ...this.params }
    this.initForm()
  },
  methods: {
    getLable,
    initForm () {
      this.formData = {
        refundImgList: [],
        remark: '',
        refundAmount: undefined,
        skuNo: this.data.skuNo
      }
      this.orderStatus = this.data.parkingPayStatus
    },
    handleLogoSuccess (res) {
      if (this.formData.refundImgList.length >= 3) return
      res.body && this.formData.refundImgList.push(res.body)
      this.$forceUpdate()
    },
    delImg (index) {
      this.formData.refundImgList.splice(index, 1)
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit('refund', this.formData)
        } else {
          return false
        }
      })
    },
    closeRefund () {
      this.showRefund = false
      this.initForm()
    }
  }
}
</script>

<style scoped lang="scss">
.record-wrap {
  padding: 20px 20px 0;
  .header-btns {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    .car {
      display: flex;
      align-items: center;
      .carPlate {
        margin-right: 5px;
        font-size: 18px;
        font-weight: bold;
        color: $mapFontColorDefault1-1;
      }
      .carIcon {
        padding: 0 4px;
        font-size: 12px;
        line-height: 18px;
        color: $mapFontColorDefault1-1;
        border-radius: 2px;
        &.type001 {
          background-color: $mapMainColor1-1;
        }
        &.type002 {
          background-color: $mapMainColor1-3;
        }
        &.type003 {
          background-color: $mapMainColor1-2;
        }
        &.type004 {
          color: #31353a;
          background-color: $mapMainColor1-1;
        }
        &.type005 {
          background-color: $mapColor9-1;
        }
      }
    }
    .content {
      font-size: 12px;
      color: $mapFontColorDefault1-2;
    }
  }
  .info-wrap {
    padding-bottom: 20px;
    margin-top: 8px;
    .item + .item {
      margin-top: 15px;
    }
    .item {
      display: flex;
      align-items: flex-start;
      .li {
        flex: 1;
        display: flex;
        font-size: 14px;
        color: $mapFontColorDefault1-1;
        .label {
          flex: 0 0 70px;
          color: $mapFontColorDefault1-2;
        }
        .content {
          .img {
            margin-right: 5px;
            width: 100px;
            height: 100px;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .form-wrap {
    padding: 20px 0;
    border-top: 1px dashed $mapColor4-1;
    .map-form {
      .content {
        font-size: 14px;
        color: $mapFontColorDefault1-1;
      }
      ::v-deep {
        .map-input {
          .el-input__inner {
            text-align: left;
            border-color: $mapMainColor1-1;
            background-color: $mapColor4-2;
          }
        }
      }
      .upload-wrap {
        display: flex;
        align-items: center;
        .uploader {
          height: 100px;
          ::v-deep .el-upload {
            display: flex;
          }
          .img-wrap {
            margin-right: 5px;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            .closed {
              padding: 6px;
              position: absolute;
              right: 0;
              top: 0;
              font-size: 20px;
              color: $mapFontColorDefault1-2;
              background-color: rgba(0, 0, 0, 0.6);
              cursor: pointer;
              &:hover {
                color: $mapFontColorDefault1-1;
                background-color: rgba(0, 0, 0, 0.8);
              }
            }
            img {
              width: 100px;
              height: 100px;
            }
          }
          .upload {
            width: 100px;
            height: 100px;
            background: url('~@/static/park/icon_upload_20@2x.png') 0 0
              no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
    .btns-wrap {
      text-align: right;
    }
  }
}
</style>
