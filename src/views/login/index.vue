<template>
  <div class="login-container">
    <div class="login-left">
      <h2>智慧运营中心</h2>
      <h3>智慧城市</h3>
    </div>
    <div class="login-right">
      <div class="login-form-wrap">
        <div class="title">
          <p>智慧运营中心</p>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <div class="formItem">
            <div class="userPassword">
              用户名
            </div>
            <el-form-item prop="phone">
              <el-input
                ref="phone"
                v-model="loginForm.phone"
                placeholder="请输入用户名"
                maxlength="18"
                name="phone"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>
            <div class="userPassword">
              密码
            </div>
            <el-tooltip
              v-model="capsTooltip"
              content="Caps lock is On"
              placement="right"
              manual
            >
              <el-form-item prop="authCode">
                <el-input
                  :key="passwordType"
                  ref="authCode"
                  v-model="loginForm.authCode"
                  :type="passwordType"
                  placeholder="请输入验证码"
                  maxlength="6"
                  name="authCode"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-s-promotion"
                    @click="getAuthCode"
                  >
                    获取验证码
                  </el-button>
                </el-input>
              </el-form-item>
            </el-tooltip>
          </div>
          <!-- <div class="forgotPassword">
            <router-link to="/accountManage/accountAdd">忘记密码？</router-link>
          </div>-->
          <div class="buttonFather">
            <el-button
              :loading="loading"
              type="primary"
              class="loginButton"
              @click.native.prevent="handleLogin"
            >
              登录
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
  <!-- <div>
    <div class="bottom">
      <p>
        © 2019 乐泊吴江商户管理平台
        <a href="#">苏ICP备18057579号-1</a>
      </p>
      <p>版权所有 苏州市吴越智博信息技术有限公司</p>
    </div>
  </div>-->
</template>

<script>
import { authCode } from '@/api/power'

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '',
        authCode: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validateUsername }],
        authCode: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'authCode',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created () {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted () {
    if (this.loginForm.phone === '') {
      this.$refs.phone.focus()
    } else if (this.loginForm.authCode === '') {
      this.$refs.authCode.focus()
    }
  },
  destroyed () {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock ({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    getAuthCode () {
      authCode(this.loginForm.phone).then()
    },
    showPwd () {
      if (this.passwordType === 'authCode') {
        this.passwordType = ''
      } else {
        this.passwordType = 'authCode'
      }
      this.$nextTick(() => {
        this.$refs.authCode.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.$router.push({ path: '/' })
              this.loading = false
            })
            .catch(err => {
              console.log(err)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
// $bg: #2d3a4b;
// $dark_gray: #889aa4;
// $light_gray: #eee;

.login-container {
  // position: fixed;
  // top: 1;
  display: flex;
  height: 100%;
  width: 100%;
  color: #fff;
  // background: url("../../assets/login/loginBackground.png") no-repeat center; // 需要修改图片背景在这里改
  .login-left {
    display: flex;
    flex-wrap: wrap;
    padding: 12.938rem 0 8.125rem;
    flex: 0 0 38.1%;
    text-align: center;
    background: url('../../assets/login/loginPage.jpeg') 0 0 no-repeat;
    background-size: 100% 100%;
    h2,
    h3 {
      flex: 1 0 100%;
      color: #fff;
    }
    h2 {
      font-size: $bigFs;
      font-weight: 500;
      font-family: PingFangSC-Semibold, PingFangSC;
    }
    h3 {
      align-self: flex-end;
      font-size: $bigFs;
      font-weight: lighter;
    }
  }
  .login-right {
    position: relative;
    flex: 1;
    .login-form-wrap {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 410px;
      .title {
        margin-bottom: 115px;
        font-size: 26px;
        color: $title;
      }
      .login-form {
        // color: $title;
        // font-size: 20px;
        .userPassword {
          margin-bottom: 12px;
          font-size: 14px;
          color: $title;
        }
        .el-form-item {
          margin-bottom: 36px;
        }
        .buttonFather {
          margin-top: 50px;
          .loginButton {
            width: 100%;
            height: 48px;
            font-size: 24px;
            background: rgba(22, 67, 110, 1);
            box-shadow: 0px 0px 6px 0px rgba(22, 67, 110, 0.61);
            border-radius: 41px;
          }
          .loginButton:hover {
          }
        }
      }
    }
  }
  .thirdparty-button {
    // position: absolute;
    // right: 35px;
    // bottom: 28px;
  }
}
// .formItem {
//   margin: 3rem 2rem;
// }
.forgotPassword {
  position: absolute;
  top: 14rem;
  right: 2.5rem;
  color: #fff;
}
// ::v-deep .el-form-item.is-success .el-input__inner {
//   border-color: rgba(18, 26, 71, 1);
// }
</style>
