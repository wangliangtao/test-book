<template>
  <div class="wrapper">
    <header>
      <section class="t">
        <span>选择商家</span>
      </section>
      <section>
        <i
          class="el-icon-close"
          @click="close"
        />
      </section>
    </header>
    <article>
      <div class="search-wrap">
        <label>商家手机号</label>
        <el-input
          v-model.trim="phone"
          class="wid"
          placeholder="请输入商家手机号"
          clearable
        />
        <el-button
          icon="el-icon-search"
          type="primary"
          round
          :disabled="!phone"
          @click="search"
        >
          查询
        </el-button>
      </div>
      <div
        v-if="userInfo.phone"
        class="merchahant-container"
      >
        <img
          :src="userInfo.avatarPicAddr | defaultImg"
          alt=""
        >
        <div class="merchahant-content">
          <div>{{ userInfo.avatarName }}</div>
          <div>{{ userInfo.phone }}</div>
        </div>
        <div style="margin-left: auto;">
          <el-button
            type="primary"
            round
            @click="choose"
          >
            选择
          </el-button>
        </div>
      </div>
      <div
        v-show="flag"
        class="noMore"
      >
        <img src="~@/static/no_red.png">
        <div class="noMore-content">
          <p>未搜索到该商家</p>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { getUserPhone } from '@/api/user'
export default {
  props: {
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
  data () {
    return {
      userInfo: {},
      phone: '',
      loading: false,
      flag: false
    }
  },
  created () {
  },
  methods: {
    search() {
      if (this.loading) return
      this.loading = true
        getUserPhone(this.phone).then(res => {
          this.userInfo = res.body || {}
          this.flag = !this.userInfo.phone
        }).finally(() => setTimeout(() => {
          this.loading = false
        }, 400))
    },
    choose(){
      const {loginId, phone, avatarPicAddr, avatarName} = this.userInfo
      const params = {
        linkMerchantLoginId: loginId,
        linkMerchantPhone: phone,
        merchantLogo: avatarPicAddr,
        merchantName: avatarName
      }
      this.$emit('confirmData', params)
    },
    close () {
      this.$emit('close')
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
    padding: 20px;
    flex: 1;
    border-top: 1px solid #f1f2f3;
    overflow: auto;
    .search-wrap {
      margin: 20px 0;
      display: flex;
      align-items: center;
      label {
        margin-right: 25px;
      }
      button {
        margin-left: 30px;
      }
    }
    .merchahant-container {
      margin-right: 20px;
      padding: 15px;
      display: flex;
      width: 400px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
      border: 2px solid #FFFFFF;
      img {
        width: 42px;
        height: 42px;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
        border: 2px solid #FFFFFF;
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
    .noMore {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      img {
        width: 120px;
        height: 120px;
      }
      .noMore-content {
        margin-top: 15px;
        font-size: 14px;
        color: #C2C5C8;
      }
    }
  }
}
</style>
