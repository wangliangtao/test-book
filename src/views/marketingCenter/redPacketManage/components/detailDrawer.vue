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
      <div :class="['status', `status-${formData.rpStatus}`]" />
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="130px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item
          label="红包编号"
          required
        >
          <span>{{ formData.rpParentId }}</span>
        </el-form-item>
        <el-form-item
          label="商家昵称"
          required
        >
          <span>{{ formData.merchantName }}</span>
        </el-form-item>
        <el-form-item
          label="手机号码"
          required
        >
          <span>{{ formData.merchantPhone }}</span>
        </el-form-item>
        <el-form-item
          label="红包标题"
          prop="title"
        >
          <el-input
            v-model.trim="formData.title"
            :disabled="operationStatus !== 'edit'"
            maxlength="6"
            placeholder="请输入红包标题"
          />
        </el-form-item>
        <el-form-item label="红包Slogan">
          <el-input
            v-model.trim="formData.slogan"
            :disabled="operationStatus !== 'edit'"
            type="textarea"
            maxlength="25"
            resize="none"
            placeholder="请输入红包Slogan"
          />
        </el-form-item>
        <el-form-item
          label="红包封面"
          required
        >
          <ul class="redList">
            <template v-for="(item, index, key) in redList">
              <li
                v-if="operationStatus === 'edit' || item.path === formData.theme"
                :key="key"
                class="item"
                @click="changeRed(item)"
              >
                <div :class="['choose', item.path === formData.theme ? 'cur' : '']" />
                <img :src="item.path">
              </li>
            </template>
          </ul>
        </el-form-item>
        <el-form-item label="红包Logo">
          <el-upload
            class="uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeUpload"
            :headers="headers"
            :disabled="operationStatus !== 'edit'"
          >
            <div
              v-if="formData.logoAddress"
              class="logo"
            >
              <img :src="formData.logoAddress">
              <span v-show="operationStatus === 'edit'">重新上传</span>
            </div>
            <div
              v-else
              class="upload"
            />
          </el-upload>
        </el-form-item>
        <el-form-item
          label="广告海报"
          required
        >
          <el-upload
            class="uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleMediaSuccess"
            :before-upload="beforeUpload"
            :headers="headers"
            :disabled="operationStatus !== 'edit'"
          >
            <div
              v-if="formData.mediaAddress"
              class="address"
            >
              <img :src="formData.mediaAddress">
              <span v-show="operationStatus === 'edit'">
                <svg-icon icon-class="icon_upload" />
                重新上传
              </span>
            </div>
            <div
              v-else
              class="upload"
            />
          </el-upload>
        </el-form-item>
        <el-form-item label="规则函数">
          <el-select
            v-model="formData.rules"
            placeholder="请选择规则函数"
            :disabled="operationStatus !== 'edit'"
          >
            <el-option
              v-for="item in rule"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 上架 && 下架中 -->
        <template v-if="formData.rpStatus > 4">
          <!-- 上架操作 && 下架中 -->
          <el-form-item
            v-if="operationStatus === 'open' && formData.rpStatus === 5"
            label="红包额度"
            required
          >
            <el-radio-group
              v-model="coinUpNumber"
              class="coinUp-wrap"
              @change="changeCoinUp"
            >
              <el-radio
                v-for="(item, index, key) in coinUpList"
                :key="key"
                :label="item"
                :disabled="item > userInfo.lebi"
              >
                {{ item | formatNumber(0, ',') }}
              </el-radio>
              <el-radio
                label="自定义"
                @change="isCustomCoinUp = true"
              />
            </el-radio-group>
            <el-input-number
              v-if="isCustomCoinUp"
              v-model="inputCoinUp"
              :precision="0"
              :max="Math.floor(userInfo.lebi)"
              placeholder="请输入红包额度"
              :controls="false"
              @change="changeCustomCoinUp"
            />
            <div class="subTitle">
              当前剩余乐币{{
                userInfo.lebi | formatNumber(2, ',')
              }}，上架后乐币将立即扣除
            </div>
          </el-form-item>
          <!-- 上架中 && 不是上架操作 或 下架中 && 上架操作 -->
          <template v-if="
              (formData.rpStatus === 6 && operationStatus !== 'open') ||
                (formData.rpStatus === 5 && operationStatus === 'open')
            ">
            <el-form-item
              label="乐币数量限制"
              required
            >
              <el-radio-group
                v-model="formData.coinAloneType"
                class="coinAlone-wrap"
                :disabled="operationStatus !== 'open' || orginData.coinAloneType > 0"
              >
                <el-radio
                  v-for="(item, index, key) in coinAloneTypeOptions"
                  :key="key"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
              <ul class="coinAloneType-wrap">
                <li
                  v-for="(item,index,key) in coinAloneTypeOptions[formData.coinAloneType - 1
                  ].data"
                  :key="key"
                  :class="[
                    {
                      cur: item.value === formData.coinUserMax,
                      dis: operationStatus !== 'open' || orginData.coinAloneType > 0
                    }
                  ]"
                  @click="changeCoinUserMax(item)"
                >
                  <div>{{ item.label }}</div>
                  <div>{{ item.value }}</div>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="下架时间">
              <template v-if="formData.rpStatus === 6 && operationStatus !== 'open'">
                <div v-if="formData.endDate">
                  {{ formData.endDate | dateformat('YYYY-MM-DD HH:mm') }}
                </div>
                <div v-else>
                  未设置
                </div>
              </template>
              <template v-else>
                <el-date-picker
                  v-model="formData.endDate"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm"
                  value-format="timestamp"
                  :picker-options="pickeroptions"
                  :disabled="operationStatus !== 'open'"
                />
              </template>
              <div class="subTit">
                不设置则余额为0时自动下架
              </div>
            </el-form-item>
            <el-form-item
              label="广告时长"
              required
            >
              <el-radio-group
                v-model="formData.displayTime"
                :disabled="operationStatus !== 'open'"
              >
                <el-radio
                  v-for="(item, index, key) in adDurationList"
                  :key="key"
                  :label="item.duration"
                >
                  {{ item.tip }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </template>
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
      <!-- 上架 -->
      <template v-if="operationStatus === 'open'">
        <el-button @click="close">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitEnable"
        >
          上架
        </el-button>
      </template>
      <!-- 审核 -->
      <template v-if="operationStatus === 'audit'">
        <el-button
          v-if="formData.rpStatus !== 1"
          @click="dialogFormVisible = true"
        >
          驳回
        </el-button>

        <el-button
          v-if="formData.rpStatus <= 4"
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
          提交后红包将变为“下架中”状态。已经上架的红包系统将自动结算并返还商家剩余乐币。
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
    <el-dialog
      width="40%"
      append-to-body
      title="提示"
      :visible.sync="openVisible"
      :modal="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="tips">
        <p class="title">
          确定上架？
        </p>
        <p class="subTitle">
          上架后，系统将立即扣除商家“{{ userInfo.avatarName }}”的“{{ formData.coinUp | formatNumber(0, ',') }}”乐币，并推送提示短信。
        </p>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="openVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="clickEnable"
        >
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ajaxUpdateAuditStatus } from '@/api/rp'
import { getRpDetail, updateRpInfo, publishUp } from '@/api/admin'
import { getUserProfileByLoginId } from '@/api/user'
import { rpStatusOptions, coinAloneTypeOptions, coinUserMaxOptions } from '@/utils/lookup'
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
      operation: {
        edit: '编辑红包',
        examine: '查看红包',
        audit: '审核红包',
        open: '上架红包'
      },
      rule: [
        {
          label: '种子函数',
          value: 1
        }
      ],
      coinAloneTypeOptions,
      coinUserMaxOptions,
      rpStatusOptions,
      isCustomCoinUp: false,  // 是否显示自定义红包额度
      customCoinUp: '', // 自定义红包额度
      coinUpNumber: 0, // 选择红包额度
      inputCoinUp: 0,
      coinUpList: [100000, 200000, 300000, 500000, 1000000], // 红包额度
      adDurationList: [
        { duration: 5, tip: '5s（观看广告超过5s后才能领取奖励）' }
      ],
      redList: [ // 红包封面数据
        { title: '默认', path: 'http://static.atwujiang.com/merchant/test/17625343281/db5b9c8804f04386bfb5c9c30784c3c6.png' },
        { title: '酷炫描边', path: 'http://static.atwujiang.com/merchant/test/17625343281/f2e10dd99af14f55bbbe1d50fa4ed5c9.png' },
        { title: '百家乐', path: 'http://static.atwujiang.com/merchant/test/17625343281/3e80d88f96e14c9490c0863df6203584.png' },
        { title: '暖意浓浓', path: 'http://static.atwujiang.com/merchant/test/17625343281/b40ff3a3908b4c83a1d5c0f0d2861927.png' },
        { title: '卡通店', path: 'http://static.atwujiang.com/merchant/test/17625343281/698fc46ad71b434890d44fa27d1c4119.png' },
        { title: '国风祥云', path: 'http://static.atwujiang.com/merchant/test/17625343281/0968061c74994e64a6b1a163b85d3466.png' },
        { title: '端午节', path: 'http://static.atwujiang.com/merchant/test/17625343281/0a0e3df5c18e4bfc80614444e2ed5b99.png' },
        { title: '鼠年大吉', path: 'http://static.atwujiang.com/merchant/test/17625343281/639e5e5fc9784000a8516b60838f0ebc.png' },
        { title: '中国结', path: 'http://static.atwujiang.com/merchant/test/17625343281/a36083ceeb86486bb4b7aa75fb609610.png' }
        // { title: '默认红包', path: 'http://3rd.mvpcs.cn/lec/static/merchant/test/17625343281/89fda868c77e4a5b803fb463c90bbd37.png' },
        // { title: '红包1', path: 'http://3rd.mvpcs.cn/lec/static/merchant/test/17625343281/433f3655b3dc4939aff9c5f840788e0f.png' },
        // { title: '红包2', path: 'http://3rd.mvpcs.cn/lec/static/merchant/test/17625343281/34d6497a848d45fd934c25ffef11a2ea.png' },
        // { title: '红包3', path: 'http://3rd.mvpcs.cn/lec/static/merchant/test/17625343281/643152f89b004735b1443a049c509b76.png' },
        // { title: '红包4', path: 'http://3rd.mvpcs.cn/lec/static/merchant/test/17625343281/8aae37d1fa3240e9821cdedbbdcdf6a9.png' },
        // { title: '红包5', path: 'http://3rd.mvpcs.cn/lec/static/merchant/test/17625343281/2514bab62ea949768acf301ef2157283.png' },
        // { title: '红包6', path: 'http://3rd.mvpcs.cn/lec/static/merchant/test/17625343281/46f327a223ed4b479cb515dff2704a4e.png' }
      ],
      dialogFormVisible: false,
      submitVisible: false,
      openVisible: false,
      auditData: {
        rpId: this.data.id,
        auditStatus: '',
        auditErrorMessage: ''
      },
      orginData: {},
      formData: {
        rpParentId: '',
        merchantName: '',
        merchantPhone: '',
        title: '',
        slogan: '',
        theme: '',
        logoAddress: '',
        jumpAddress: '',
        coinUp: 0,
        coinAloneType: 1,
        coinUserMax: '',
        endDate: '',
        displayTime: 5
      },
      userInfo: {},
      rules: {
        title: [
          { required: true, message: "请输入红包标题", trigger: "blur" },
          { max: 6, message: "最长可输入 6 个字", trigger: "blur" }
        ],
        coinUp: [
          { required: true, message: "请输入红包额度", trigger: "blur" }
        ]
      },
      pickeroptions: {
        disabledDate: time => {
          const minDate = this.$moment().subtract(1, "days").valueOf()
          const maxDate = this.$moment().add(1, 'y').endOf('year').valueOf()
          return time.getTime() <= minDate || time.getTime() > maxDate
        }
      }
    }
  },
  created () {
    this.getData(this.data.id).then(({ merchantId }) => {
      getUserProfileByLoginId(merchantId).then(res => {
        this.userInfo = res.body || {}
      })
    })
  },
  methods: {
    getLable,
    getData (id) {
      return getRpDetail(id).then(res => {
        this.formData = { ...res.body || {} }
        this.orginData = { ...res.body || {} }
        this.formData.rules = 1
        this.formData.coinAloneType = this.formData.coinAloneType || 1
        this.formData.endDate && (this.$moment(this.formData.endDate).valueOf())
        return Promise.resolve(res.body)
      })
    },
    close () {
      this.$emit('close')
    },
    resetSearch () {
      this.close()
      this.$emit('resetSearch')
    },
    changeRed (val) {
      this.formData.theme = val.path
    },
    handleLogoSuccess (res) {
      this.formData.logoAddress = res.body || ''
    },
    handleMediaSuccess (res) {
      this.formData.mediaAddress = res.body || ''
    },
    changeCoinUp (val) {
      if (Number(val)) {
        this.isCustomCoinUp = false
        this.formData.coinUp = val
      } else {
        this.formData.coinUp = this.inputCoinUp
      }
    },
    changeCustomCoinUp (val) {
      this.inputCoinUp = val
      this.formData.coinUp = val
    },
    changeCoinUserMax (val) {
      if (val.value === this.formData.coinUserMax) return
      if (this.operationStatus !== 'open' || this.orginData.coinAloneType > 0) return
      this.formData.coinUserMax = val.value
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
      updateRpInfo(params).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.resetSearch()
      })
    },
    // 通过 / 驳回
    ajaxUpdateAuditStatus (status) {
      if (!status) return
      this.auditData.auditStatus = status
      if (status === 1) {
        ajaxUpdateAuditStatus(this.auditData).then(() => {
          this.$message({
            message: '通过成功',
            type: 'success'
          })
          this.resetSearch()
        })
      } else {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            ajaxUpdateAuditStatus(this.auditData).then(() => {
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
    },
    submitEnable () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.openVisible = true
        } else {
          return false;
        }
      });
    },
    // 上架
    clickEnable () {
      let params = { ...this.formData }
      params.rpId = params.rpParentId
      params.endDate && (params.endDate = this.$moment(params.endDate).format('YYYY-MM-DDTHH:mm:ss'))
      publishUp(params).then(() => {
        this.$message({
          message: '上架成功',
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
    .subTitle {
      font-size: 12px;
      color: $subTitle;
    }
    .status {
      position: absolute;
      right: 20px;
      top: 0;
      width: 64px;
      height: 39px;
      &-1 {
        background: url('~@/static/listStatus/fail.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-2 {
        background: url('~@/static/listStatus/draft.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-3 {
        background: url('~@/static/listStatus/wait.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-5 {
        background: url('~@/static/listStatus/close.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-6 {
        background: url('~@/static/listStatus/open.png') 0 0 no-repeat;
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
      .address {
        position: relative;
        width: 360px;
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
      .address,
      .logo {
        img {
          width: 100%;
          height: 100%;
        }
        span {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          font-size: 12px;
          line-height: 32px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.6);
          text-align: center;
          transition: all 0.3s;
        }
        &:hover {
          span {
            background-color: rgba(0, 0, 0, 0.8);
          }
        }
      }
    }
    .redList {
      display: flex;
      flex-wrap: wrap;
      .item {
        margin: 0 10px 10px 0;
        position: relative;
        width: 100px;
        height: 146px;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
        .choose {
          position: absolute;
          right: 0;
          top: 0;
          width: 26px;
          height: 26px;
          background: url('~@/static/unselected.png') 0 0 no-repeat;
          background-size: 100% 100%;
          transition: all 0.3s;
          &.cur {
            background: url('~@/static/selected.png') 0 0 no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
    .coinUp-wrap,
    .coinAlone-wrap {
      display: flex;
      flex-wrap: wrap;
      .el-radio {
        margin-bottom: 5px;
        margin-right: 43px;
        width: 120px;
      }
    }
    .coinAloneType-wrap {
      display: flex;
      flex-wrap: wrap;
      li {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0;
        margin-right: 10px;
        flex: 0 0 100px;
        text-align: center;
        background-color: #f3f4f5;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        div {
          flex: 1 0 100%;
          line-height: initial;
        }
        div:first-of-type {
          font-size: 12px;
          color: $subTitle;
        }
        div:last-of-type {
          font-size: 16px;
          color: $title;
          font-weight: bold;
        }
      }
      li.dis {
        div {
          color: $subTitle;
        }
      }
      li.cur {
        background-color: #1b77fc;
        box-shadow: 0px 2px 6px 0px rgba(27, 119, 252, 0.4);
        div {
          color: #fff;
        }
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
