<template>
  <div class="choose-wrap">
    <el-form
      ref="formAddress"
      :model="formAddress"
      label-width="100px"
      label-position="right"
    >
      <transition-group
        name="slide-fade"
        mode="out-in"
      >
        <div
          v-for="(item,index) in formAddress.addressList"
          :key="index+'index'"
          class="item-wrap"
        >
          <ul
            v-if="operationStatus === 'edit'"
            class="operation-wrap"
          >
            <li
              v-show="formAddress.addressList.length !== 1"
              @click="del(index)"
            >
              <svg-icon icon-class="icon_delete" />
              删除
            </li>
          </ul>
          <div class="title">
            兑换地址{{ index +1 }}
          </div>
          <el-form-item
            label="地址"
            :prop="'addressList.'+index + '.address'"
            :rules="{
              required: true, message: '地址不能为空', trigger: 'blur'
            }"
          >
            <el-input
              v-model.trim="item.address"
              maxlength="100"
              placeholder="请输入地址（省市区 详细地址）"
              :disabled="operationStatus !== 'edit'"
            />
          </el-form-item>
          <el-form-item
            label="联系方式"
            :prop="'addressList.'+index + '.tel'"
            :rules="{
              required: true, validator: checkMobile, message: '联系方式不能为空', trigger: 'blur'
            }"
          >
            <el-input
              v-model="item.tel"
              class="cus"
              onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
              placeholder="请输入联系方式（电话请添加区号）"
              :disabled="operationStatus !== 'edit'"
            />
          </el-form-item>
        </div>
      </transition-group>
    </el-form>
    <div
      v-if="operationStatus === 'edit'"
      class="btns"
    >
      <el-button
        :class="{dis: formAddress.addressList.length >= 20}"
        @click="add"
      >
        <svg-icon
          v-show="formAddress.addressList.length < 20"
          icon-class="icon_add"
        />
        {{ formAddress.addressList.length >= 20 ? '地址数量已达上限' : '添加地址' }}
      </el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { validateMobile, validateTel } from '@/utils/validate'
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [
          {
            address: '',
            tel: undefined
          }
        ]
      }
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formAddress: {
        addressList: []
      },
      flag: true
    }
  },
  watch: {
    formAddress: {
      handler () {
        this.$nextTick(() => this.submit())
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    checkMobile (rule, value, callback) {
      setTimeout(() => {
        if (validateMobile(value) || validateTel(value)) {
          callback()
        } else {
          callback(new Error("请输入正确的联系方式"))
        }
      }, 500)
    },
    init () {
      this.formAddress.addressList = JSON.parse(JSON.stringify(this.data))
      this.formAddress.addressList.length === 0 && this.formAddress.addressList.push({
        address: '',
        tel: undefined
      })
    },
    del (index) {
      if (this.operationStatus !== 'edit') return
      if (this.formAddress.addressList.length <= 1) return
      this.formAddress.addressList.splice(index, 1)
    },
    add () {
      if (this.operationStatus !== 'edit') return
      if (this.formAddress.addressList.length >= 20) return
      this.formAddress.addressList.push({
        address: '',
        tel: undefined
      })
    },
    getSubmitResult () {
      return this.flag && this.formAddress.addressList
    },
    submit () {
      this.$refs['formAddress'].validate((valid) => {
        this.flag = valid
        if (valid) {
          this.$emit('update:data', this.formAddress.addressList)
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
      position: absolute;
      right: 20px;
      top: 15px;
      font-size: 12px;
      color: #1b77fc;
      li {
        cursor: pointer;
      }
    }
    .title {
      margin-bottom: 15px;
      font-size: 12px;
      color: $title;
      font-weight: bold;
    }
  }
  .btns {
    margin-top: 20px;
    display: flex;
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
    button + button {
      margin-left: 20px;
    }
  }
}
::v-deep.el-input-number .el-input__inner {
  text-align: left;
}
</style>
