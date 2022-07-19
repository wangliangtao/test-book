<template>
  <div class="module-container">
    <ul class="module-wrap">
      <li
        v-for="(item,index,key) in list"
        :key="key"
        class="item"
      >
        <div class="title-wrap">
          <div class="title">
            {{ index + 1 }}号展位
          </div>
          <ul
            v-if="operationStatus !== 'examine'"
            class="operation"
          >
            <li
              v-show="index !== 0"
              @click="moveUp(item, index)"
            >
              <svg-icon icon-class="icon_move_up" />
              上移
            </li>
            <li
              v-show="index !== list.length - 1"
              @click="moveDown(item, index)"
            >
              <svg-icon icon-class="icon_move_down" />
              下移
            </li>
            <li
              v-show="list.length !== 1"
              @click="del(index)"
            >
              <svg-icon icon-class="icon_delete" />
              删除
            </li>
          </ul>
        </div>
        <div class="choose-wrap">
          <el-radio-group
            v-model="item.boothType"
            :disabled="operationStatus === 'examine'"
          >
            <el-radio label="HOT_SALE">
              热销
            </el-radio>
            <el-radio label="MERCHANT_LINK">
              链接
            </el-radio>
          </el-radio-group>
        </div>
        <template v-if="item.boothType === 'HOT_SALE'">
          <div class="item-content">
            <el-form
              ref="ruleForm"
              :model="item"
              label-position="right"
            >
              <el-form-item
                :label="item.saleSerialNo && '已选热销'"
                required
              >
                <span v-show="item.goodsTitle">
                  （{{ getLable(item.enableStatus, saleStatusOptions) }}）
                  {{ item.goodsTitle }}
                </span>
                <el-button
                  v-if="operationStatus !== 'examine'"
                  type="primary"
                  round
                  @click="showDrawer(index, 'HOT_SALE')"
                >
                  {{ item.saleSerialNo ? '重新选择' : '选择热销' }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
        <template v-if="item.boothType === 'MERCHANT_LINK'">
          <div class="item-content">
            <el-form
              ref="ruleForm"
              :model="item"
              label-position="right"
            >
              <el-form-item
                label="封面图"
                required
              >
                <div class="uploader">
                  <div
                    v-if="item.linkImage"
                    class="address"
                    @click="showUpload(index)"
                  >
                    <img :src="item.linkImage">
                    <span v-if="operationStatus !== 'examine'">
                      <svg-icon icon-class="icon_upload" />
                      重新上传
                    </span>
                  </div>
                  <div
                    v-else
                    class="upload"
                    @click="showUpload(index)"
                  />
                  <p>
                    推荐尺寸：800px *800px，支持jpg、jpeg、png格式图片，最大支持5M的图片
                  </p>
                </div>
              </el-form-item>
              <el-form-item
                :label="item.linkMerchantLoginId && '已选商家'"
                required
              >
                <div class="merchahant-wrap">
                  <div
                    v-show="item.linkMerchantLoginId"
                    class="merchahant-container"
                  >
                    <img :src="item.merchantLogo | defaultImg">
                    <div class="merchahant-content">
                      <div>{{ item.merchantName }}</div>
                      <div>{{ item.linkMerchantPhone }}</div>
                    </div>
                  </div>
                  <el-button
                    v-if="operationStatus !== 'examine'"
                    type="primary"
                    round
                    @click="showDrawer(index, 'MERCHANT_LINK')"
                  >
                    {{ item.linkMerchantLoginId ? '重新选择' : '选择商家' }}
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </li>
    </ul>
    <div
      v-show="list.length < 4 && operationStatus !== 'examine'"
      class="btns"
    >
      <el-button @click="add">
        <svg-icon icon-class="icon_add" />
        添加展位
      </el-button>
    </div>
    <el-drawer
      ref="drawer"
      class="btt-drawer"
      :visible.sync="drawer"
      :with-header="false"
      destroy-on-close
      size="80%"
      :wrapper-closable="false"
      :close-on-press-escape="false"
      append-to-body
      direction="btt"
    >
      <chooseSale
        v-show="chooseComponent ==='HOT_SALE'"
        @close="closeDrawer"
        @confirmData="chooseSale"
      />
      <chooseMerchant
        v-show="chooseComponent ==='MERCHANT_LINK'"
        @close="closeDrawer"
        @confirmData="chooseMerchant"
      />
    </el-drawer>
    <el-upload
      v-show="false"
      ref="uploadBox"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :headers="headers"
      accept="image/*"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import upload from '@/mixin/upload'
import chooseSale from './chooseSale'
import chooseMerchant from './chooseMerchant'
import { getLable } from '@/utils/function'
import { saleStatusOptions } from '@/utils/lookup'
export default {
  components: {
    chooseSale,
    chooseMerchant
  },
  mixins: [upload],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data () {
    return {
      saleStatusOptions,
      drawer: false,
      list: [
      ],
      defaultListItem: {
        boothIndex: 1,
        boothType: 'HOT_SALE', // HOT_SALE/MERCHANT_LINK
        saleSerialNo: '',
        saleTitle: '',
        linkImage: '',
        linkMerchantLoginId: '',
        linkMerchantPhone: ''
      },
      chooseComponent: 'chooseSale',
      confirmIndex: undefined
    }
  },
  watch: {
    list: {
      handler () {
        this.$nextTick(() => this.submitItemForm())
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getLable,
    init () {
      this.list = JSON.parse(JSON.stringify(this.data))
      this.list.length === 0 && this.list.push({ ...this.defaultListItem })
      this.initUploadOptions({
        maxSize: 1024 * 1024 * 5,
        maxSizeTitle: '上传图片大小不能超过 5MB'
      })
    },
    closeDrawer () {
      this.$refs.drawer.closeDrawer()
    },
    showDrawer (index, type) {
      this.drawer = true
      this.chooseComponent = type
      this.confirmIndex = index
    },
    showUpload (index) {
      if (this.operationStatus === 'examine') return
      this.confirmIndex = index
      this.$refs.uploadBox.$children[0].$refs.input.click()
    },
    handleSuccess (data) {
      this.list[this.confirmIndex].linkImage = data.body || ''
    },
    chooseSale ({ saleSerialNo, goodsTitle, enableStatus }) {
      this.list[this.confirmIndex] = Object.assign(this.list[this.confirmIndex], { saleSerialNo, goodsTitle, enableStatus })
      this.confirmIndex = undefined
      this.closeDrawer()
    },
    chooseMerchant ({ linkMerchantLoginId, linkMerchantPhone, merchantLogo, merchantName }) {
      this.list[this.confirmIndex].merchantLogo = ''
      this.list[this.confirmIndex] = Object.assign(this.list[this.confirmIndex], { linkMerchantLoginId, linkMerchantPhone, merchantLogo, merchantName })
      this.confirmIndex = undefined
      this.closeDrawer()
    },
    add () {
      if (this.list.length >= 4) return
      this.list.push({ ...this.defaultListItem })
    },
    del (index) {
      this.list.splice(index, 1)
    },
    // 上移
    moveUp (val, index) {
      const on = this.list[index - 1]
      const current = val
      this.list[index - 1] = current
      this.list[index] = on
      this.$forceUpdate()
    },
    // 下移
    moveDown (val, index) {
      const current = val
      const next = this.list[index + 1]
      this.list[index + 1] = current
      this.list[index] = next
      this.$forceUpdate()
    },
    submitItemForm () {
      this.$emit('update:data', this.list)
    }
  }
}
</script>

<style scoped lang="scss">
.btt-drawer {
  ::v-deep .el-drawer.btt {
    width: 640px;
    left: auto;
    border-radius: 8px 8px 0px 8px;
  }
}
.module-container {
  .module-wrap {
    .item {
      margin-top: 20px;
      padding: 15px 20px 20px;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      .title-wrap {
        margin-bottom: 15px;
        display: flex;
        font-size: 12px;
        color: $title;
        .title {
          font-weight: bold;
        }
        .operation {
          margin-left: auto;
          display: flex;
          color: #1b77fc;
          li {
            cursor: pointer;
          }
          li + li {
            margin-left: 30px;
          }
        }
      }
      .item-content {
        margin-top: 10px;
        .uploader {
          display: flex;
          p {
            margin-left: 10px;
          }
          .upload {
            flex: 1 0 100px;
            height: 100px;
            background: url('~@/static/icon_upload.png') 0 0 no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }
          .address {
            position: relative;
            width: 320px;
            line-height: 0;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
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
        .merchahant-wrap {
          display: flex;
          align-items: flex-start;
          .merchahant-container {
            margin-right: 20px;
            padding: 15px;
            display: flex;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
            border: 2px solid #ffffff;
            img {
              width: 42px;
              height: 42px;
              box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
              border: 2px solid #ffffff;
              border-radius: 50%;
            }
            .merchahant-content {
              display: flex;
              flex-wrap: wrap;
              div {
                margin-left: 13px;
                flex: 0 0 100%;
                color: $title;
                font-size: 16px;
                line-height: 1;
              }
              div:last-of-type {
                font-size: 12px;
                color: $subTitle;
              }
            }
          }
        }
      }
    }
  }
  .btns {
    margin-top: 20px;
    button {
      width: 100%;
      font-size: 12px;
      color: #1b77fc;
      border: 1px dashed #1b77fc;
      border-radius: 4px;
    }
  }
}
</style>
