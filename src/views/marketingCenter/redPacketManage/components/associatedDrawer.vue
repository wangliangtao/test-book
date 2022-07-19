<template>
  <div class="wrapper">
    <header>
      <section class="t">
        关联活动
      </section>
      <section>
        <i
          class="el-icon-close"
          @click="close"
        />
      </section>
    </header>
    <article>
      <el-form
        label-width="130px"
        label-position="right"
      >
        <el-form-item
          label="红包编号"
          required
        >
          <span>{{ formData.id }}</span>
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
          required
        >
          <span>{{ formData.rpTitle }}</span>
        </el-form-item>
        <el-form-item
          label="互动"
          class="select"
        >
          <el-select
            v-model="formData.interactionSerialNo"
            placeholder="请选择互动"
            clearable
            @change="changeSerialNo"
            @clear="clearSerialNo"
          >
            <el-option
              v-for="item in interactionList"
              :key="item.serialNo"
              :label="item.puzzleTitle"
              :value="item.serialNo"
            />
          </el-select>
          <div class="subTitle">
            选择互动后，红包将包含此互动
          </div>
          <div
            v-if="interactionForm.puzzleContentList.length > 0"
            class="puzzle"
          >
            <span>{{ interactionForm.puzzleContentList.join('') }}</span>
          </div>
        </el-form-item>
        <el-form-item
          label="奖券"
          class="select"
        >
          <el-select
            v-model="formData.ruleId"
            placeholder="请选择奖券"
            clearable
            @change="changeRuleId"
            @clear="clearRuleId"
          >
            <el-option
              v-for="item in ruleList"
              :key="item.ruleId"
              :label="item.awardTitle"
              :value="item.ruleId"
            />
          </el-select>
          <div class="subTitle">
            选择奖券后，红包将包含此奖券
          </div>
          <div
            v-if="ruleForm.awardDescription"
            class="rule"
          >
            <div class="left">
              <img
                v-if="ruleForm.awardImages && ruleForm.awardImages[0]"
                :src="
                  ruleForm.awardImages[0] +
                    '?x-oss-process=image/resize,m_fill,w_48,h_48'
                "
                alt
              >
            </div>
            <div class="right">
              <div>
                <label>原价：</label>
                {{ ruleForm.originalPrice || 0 }}
              </div>
              <div>
                <label>描述：</label>
                <span>
                  {{ ruleForm.awardDescription }}
                </span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </article>
    <footer>
      <el-button
        :loading="loading"
        @click="close"
      >
        取消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="submit"
      >
        提交
      </el-button>
    </footer>
  </div>
</template>

<script>
import { getLable } from '@/utils/function'
import { interactionBinding, getSimpleRuleList } from '@/api/admin'
import { queryInteractionPage } from '@/api/manager'
import { giftBagStatusOptions, interactionStatusOptions } from '@/utils/lookup'
export default {
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      formData: {
        rpParentId: '',
        interactionSerialNo: '',
        ruleId: ''
      },
      interactionList: [],
      interactionForm: {
        puzzleContentList: []
      },
      ruleList: [],
      ruleForm: {},
      loading: false,
      value: '选项1',
      options: []
    }
  },
  mounted () {
    this.formData = { ...this.data }
    this.formData.rpParentId = this.data.id
    this.queryInteractionPage(this.data.merchantId)
    this.getSimpleRuleList(this.data.merchantId)
  },
  methods: {
    getLable,
    close () {
      this.$emit('close')
    },
    resetSearch () {
      this.close()
      this.$emit('resetSearch')
    },
    changeSerialNo (val) {
      this.interactionList.forEach(item => {
        if (item.serialNo === val) {
          this.interactionForm.puzzleContentList = item.puzzleContentList
        }
      })
    },
    changeRuleId (val) {
      this.ruleList.forEach(item => {
        if (item.ruleId === val) {
          this.ruleForm = item
        }
      })
    },
    clearSerialNo () {
      this.interactionForm = {
        puzzleContentList: []
      }
    },
    clearRuleId () {
      this.ruleForm = {}
    },
    queryInteractionPage (id) {
      const params = {
        pageSize: 9999999,
        pageNo: 1,
        rpUserLoginId: id
      }
      queryInteractionPage(params).then(res => {
        this.interactionList = res.body.content || []
        this.interactionList.forEach(item => {
          if (item.serialNo === this.formData.interactionSerialNo) {
            this.interactionForm.puzzleContentList = item.puzzleContentList
          }
          const msg = getLable(item.status, interactionStatusOptions)
          item.puzzleTitle = `${item.puzzleTitle} (${msg || ''})`
        })
        this.formData.interactionSerialNo = this.data.interactionSerialNo
      })
    },
    getSimpleRuleList (id) {
      getSimpleRuleList(id).then(res => {
        this.ruleList = res.body || []
        this.ruleList.forEach(item => {
          if (item.ruleId === this.formData.ruleId) {
            this.ruleForm = item
          }
          const msg = getLable(item.ruleStatus, giftBagStatusOptions)
          item.awardTitle = `${item.awardTitle} (${msg || ''})`
        })
      })
    },
    submit () {
      const params = { ...this.formData }
      this.loading = true
      interactionBinding(params)
        .then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.resetSearch()
        })
        .finally(() => this.loading = false)
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
    .select {
      .subTitle {
        font-size: 12px;
        color: $subTitle;
      }
      .puzzle,
      .rule {
        margin-top: 12px;
        padding: 12px;
        font-size: 14px;
        color: $title;
        background-color: #faf9f9;
        border-radius: 4px;
      }
      .puzzle {
        span {
          word-break: break-all;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      .rule {
        display: flex;
        flex-wrap: wrap;
        .left {
          width: 100px;
          height: 100px;
          border-radius: 4px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .right {
          flex: 1;
          margin-left: 12px;
          display: flex;
          flex-direction: column;
          div + div {
            margin-top: 12px;
          }
          div {
            display: flex;
            flex-wrap: wrap;
            font-size: 12px;
            color: $title;
            label {
              color: $title;
            }
            span {
              flex: 1;
              word-break: break-all;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
    }
  }
  footer {
    height: 62px;
    border-top: 1px solid #f1f2f3;
  }
}
</style>
