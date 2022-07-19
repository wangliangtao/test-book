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
      <div :class="['status', `status-${formData.saleStatus ? '1' : '2'}`]" />
      <el-form
        ref="ruleForm"
        :model="formData"
        label-width="120px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item
          label="热销编号"
          required
        >
          <span>{{ formData.saleSerialNo }}</span>
        </el-form-item>
        <el-form-item
          label="商家昵称"
          required
        >
          <span>{{ formData.goodsVo.nickname }}</span>
        </el-form-item>
        <el-form-item
          label="手机号码"
          required
        >
          <span>{{ formData.goodsVo.phone }}</span>
        </el-form-item>
        <el-form-item
          label="商品编号"
          required
        >
          <span>{{ formData.goodsSerialNo }}</span>
        </el-form-item>
        <el-form-item
          label="商品标题"
          required
        >
          <span>{{ formData.goodsVo.goodsTitle }}</span>
        </el-form-item>
        <el-form-item
          label="热销封面"
          required
        >
          <ul class="redList">
            <template v-for="(item, index, key) in redList">
              <li
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
        <el-form-item
          label="热销现价"
          prop="currentPrice"
        >
          <el-input-number
            v-model="formData.currentPrice"
            class="wid"
            :precision="1"
            :max="99999.9"
            :controls="false"
          />
        </el-form-item>
        <el-form-item
          label="库存数量"
          prop="inventory"
        >
          <el-input-number
            v-model="formData.inventory"
            class="wid"
            :precision="0"
            :max="9999"
            :controls="false"
          />
        </el-form-item>
        <el-form-item
          label="购买数量限制"
          prop="limitType"
        >
          <el-radio-group v-model="formData.limitType">
            <el-radio
              v-for="(item,index,key) in saleTypeOptions"
              :key="key"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
          <el-select
            v-show="formData.limitType < 4"
            v-model="formData.limitQuantity"
            class="wid"
            placeholder="请选择购买数量"
          >
            <el-option
              v-for="(item, key) in 10"
              :key="key"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="可抵扣乐币数量"
          prop="deductionLebiEnable"
        >
          <el-switch
            v-model="formData.deductionLebiEnable"
            active-color="#1B77FC"
            inactive-color="#DEE0E2"
          />
          <span>（每100乐币抵扣1元）</span>
          <div
            v-if="formData.deductionLebiEnable"
            class="box"
          >
            <el-form-item
              label="每个最高抵扣"
              required
            >
              <el-input-number
                v-model="formData.deductionLebi"
                class="wid"
                :precision="0"
                :min="1"
                :max="10000"
                :controls="false"
                placeholder="请输入可抵扣乐币数量"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          label="拼手气"
          prop="luckEnable"
        >
          <el-switch
            v-model="formData.luckEnable"
            active-color="#1B77FC"
            inactive-color="#DEE0E2"
          />
          <span>（开启后，用户有机会免单）</span>
          <div
            v-if="formData.luckEnable"
            class="box"
          >
            <el-form-item
              label="抽奖花费"
              required
            >
              <el-input-number
                v-model="formData.luckLebiSpend"
                class="wid"
                :precision="0"
                :min="1"
                :max="10000"
                :controls="false"
                placeholder="请输入抽奖花费（乐币数量）"
              />
            </el-form-item>
            <el-form-item
              label="中奖概率"
              required
              style="margin-top: 10px"
            >
              <el-input-number
                v-model="formData.luckWinPercentage"
                class="wid"
                :precision="0"
                :min="1"
                :max="100"
                :controls="false"
                placeholder="请输入中奖概率"
              />
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
    </article>
    <footer>
      <el-button @click="close">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="submitForm"
      >
        提交
      </el-button>
    </footer>
  </div>
</template>

<script>
import { getSaleDetail, postSaveSale } from '@/api/saleAdmin'
import { getLable } from '@/utils/function'
import { saleTypeOptions } from '@/utils/lookup'
export default {
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
    const validLimitType = (rule, value, callback) => {
      if (value === 4) {
        callback()
      } else {
        if (!this.formData.limitQuantity) {
          callback(new Error("请选择购买数量"))
        } else {
          callback()
        }
      }
    }
    const validDeductionLebi = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!this.formData.deductionLebi) {
          callback(new Error("请输入可抵扣乐币数量"))
        } else {
          callback()
        }
      }
    }
    const validLuckEnable = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!this.formData.luckWinPercentage || !this.formData.luckLebiSpend){
          callback(new Error("请输入拼手气数据"))
        } else {
          callback()
        }
      }
    }
    return {
      saleTypeOptions,
      operation: {
        edit: '编辑热销'
      },
      redList: [ // 封面数据
        { title: '默认', path: 'http://3rd.mvpcs.cn/lec/static/merchant/test/17625343281/15c5a986a3c54bc59662408ec4cdb2e4.png' }
      ],
      formData: {
        goodsVo: {}
      },
      rules: {
        currentPrice: [
          {required: true, type: 'number', message: "请输入现价", trigger: "blur"}
        ],
        inventory: [
          {required: true, type: 'number', message: "请输入库存数量", trigger: "blur"}
        ],
        limitType: [
          {required: true, validator: validLimitType, trigger: 'change'}
        ],
        deductionLebiEnable: [
          {required: false, validator: validDeductionLebi, trigger: 'change'}
        ],
        luckEnable: [
          {required: false, validator: validLuckEnable, trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.getData(this.data.saleSerialNo)
  },
  methods: {
    getLable,
    getData (id) {
      getSaleDetail(id).then(res => {
        this.formData = res.body || {}
        this.formData.currentPrice = this.formData.currentPrice / 100
        this.formData.deductionLebiEnable = this.formData.deductionLebiEnable || false
        this.formData.luckEnable = this.formData.luckEnable || false
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
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      });
    },
    // 编辑
    save () {
      const params = { ...this.formData }
      params.currentPrice = params.currentPrice * 100
      postSaveSale(params).then(() => {
        this.$message({
          message: '编辑成功',
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
        background: url('~@/static/sale/enable.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-2 {
        background: url('~@/static/sale/disable.png') 0 0 no-repeat;
        background-size: 100% 100%;
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
.box {
  margin-top: 10px;
  padding: 20px 0;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>
