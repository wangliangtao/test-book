<template>
  <div class="orderDetails-wrap">
    <div class="header">
      <span class="title">订单详情</span>
      <svg-icon
        class="closed"
        icon-class="icon_close_14"
        @click="$emit('close')"
      />
    </div>
    <div class="container">
      <div
        v-for="(item, index, key) in data.parkingFeeList"
        :key="key"
        class="box"
      >
        <RecordItem
          :params="item"
          @refund="showDialog"
        />
      </div>
      <div class="box settlement">
        <div class="item">
          <div class="li">
            <div class="label">
              应付金额：
            </div>
            <div class="content">
              {{ data.totalAmount || 0 | RMBstr }}
            </div>
          </div>
          <div class="li">
            <div class="label">
              优惠金额：
            </div>
            <div class="content">
              -{{ data.discountAmount || 0 | RMBstr }}
            </div>
          </div>
        </div>
        <div class="item">
          <div class="li">
            <div class="label">
              乐币抵扣：
            </div>
            <div class="content">
              -{{ data.actualLebiRmb || 0 | RMBstr }}
            </div>
          </div>
          <div class="li">
            <div class="label">
              实际付款：
            </div>
            <div class="content">
              {{ data.actualRmb || 0 | RMBstr }}
            </div>
          </div>
        </div>
      </div>
      <div class="box settlement">
        <div class="item">
          <div class="li">
            <div class="label">
              用户昵称：
            </div>
            <div class="content">
              <img
                class="userAvatar"
                :src="data.userAvatarUrl"
              >
              {{ data.userNickname }}
            </div>
          </div>
          <div class="li">
            <div class="label">
              手机号码：
            </div>
            <div class="content">
              {{ data.userPhone }}
            </div>
          </div>
        </div>
        <div class="item">
          <div class="li">
            <div class="label">
              订单编号：
            </div>
            <div class="content">
              {{ data.orderId }}
            </div>
          </div>
        </div>
        <div class="item">
          <div class="li">
            <div class="label">
              下单时间：
            </div>
            <div class="content">
              {{ data.initAtTimestamp | dateformat('YYYY-MM-DD HH:mm') }}
            </div>
          </div>
          <div class="li">
            <div class="label">
              支付方式：
            </div>
            <div class="content">
              {{ data.paymentChannel }}
            </div>
          </div>
        </div>
        <div class="item">
          <div class="li">
            <div class="label">
              支付时间：
            </div>
            <div class="content">
              {{ data.payAtTimestamp | dateformat('YYYY-MM-DD HH:mm') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      custom-class="map-dialog"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      destroy-on-close
      :modal="false"
      top="0"
    >
      <div class="dialog-body">
        <div class="title">
          是否确认退款？
        </div>
        <div class="content">
          一次停车记录仅可退款一次，请谨慎操作
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="map-btn-border"
          @click="dialogVisible = false"
        >取 消</el-button>
        <el-button
          class="map-btn-noBorder"
          type="primary"
          @click="refundOrder"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import RecordItem from './recordItem'
import { getParkingFeeOrderMnt, postRefundParkingGoods } from '@/api/parking'
export default {
  components: {
    RecordItem
  },
  props: {
    operationStatus: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default:() => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      data: {
        parkingFeeList: []
      },
      refundData: {}
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    getDetails() {
      this.dialogVisible = false
      getParkingFeeOrderMnt(this.params.orderId)
        .then(res => {
          this.data = {
            parkingFeeList: []
          }
          this.$nextTick(() => {
            this.data = res.body || {parkingFeeList: []}
            this.$forceUpdate()
          })
        })
    },
    showDialog(data = {}) {
      this.refundData = data
      this.dialogVisible = true
    },
    refundOrder() {
      const params = {...this.refundData}
      params.refundAmount = params.refundAmount * 100
      postRefundParkingGoods(params)
        .then(() => {
          this.$message({
            message: '退款成功',
            type: 'success'
          })
          this.getDetails()
          this.$emit('resetSearch')
        })
    }
  }
}
</script>

<style scoped lang="scss">
.orderDetails-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    color: $mapFontColorDefault1-1;
    background-color: $mapColor3-1;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .closed {
      font-size: 14px;
      color: $mapFontColorDefault1-2;
      cursor: pointer;
      &:hover {
        color: $mapFontColorDefault1-1;
      }
    }
  }
  .container {
    flex: 1;
    padding: 20px;
    overflow: auto;
    .box + .box {
      margin-top: 20px;
    }
    .box {
      background-color: $mapColor3-1;
      border-radius: 4px;
      overflow: hidden;
    }
    .settlement {
      padding: 20px;
      .item + .item {
        margin-top: 15px;
      }
      .item {
        display: flex;
        align-items: center;
        .li {
          flex: 1;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $mapFontColorDefault1-1;
          .label {
            color: $mapFontColorDefault1-2;
          }
          .content {
            display: flex;
            align-items: center;
            .userAvatar {
              margin-right: 5px;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 1px solid $mapFontColorDefault1-1;
            }
          }
        }
      }
    }
  }
  .el-dialog__wrapper {
    background-color: rgba(0,0,0,.6);
  }
}
</style>