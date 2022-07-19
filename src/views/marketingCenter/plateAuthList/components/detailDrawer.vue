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
        class="elForm"
        label-width="120px"
        label-position="left"
      >
        <div class="label">
          用户信息
        </div>
        <el-form-item label="用户昵称：">
          <span>{{ formData.applyNickname }}</span>
        </el-form-item>
        <el-form-item label="手机号码：">
          <span>{{ formData.applyPhone }}</span>
        </el-form-item>
        <el-form-item label="提交时间：">
          <span>{{ formData.createdAtTimestamp | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </el-form-item>
      </el-form>
      <el-form
        class="elForm"
        label-width="120px"
        label-position="left"
      >
        <div class="label">
          车牌信息
        </div>
        <el-form-item label="认证车牌：">
          <div class="plateColor">
            <div :class="['type','type' + formData.plateColor]" />
            {{ formData.plateNo }}
          </div>
        </el-form-item>
        <el-form-item label="行驶证照：">
          <el-image
            style="width: 320px; height: 218px;border-radius: 5px;"
            :src="formData.drivingLicenseImg"
            :preview-src-list="[formData.drivingLicenseImg]"
            :z-index="3000"
          />
        </el-form-item>
      </el-form>
      <el-form
        class="elForm"
        label-width="120px"
        label-position="left"
      >
        <div class="label">
          认证信息
        </div>
        <el-form-item label="审核人员：">
          <span>{{ formData.approveNickname }}</span>
        </el-form-item>
        <el-form-item label="手机号码：">
          <span>{{ formData.plateNo }}</span>
        </el-form-item>
        <el-form-item label="认证结果：">
          <span>{{ formData.statusMessage }}</span>
        </el-form-item>
        <el-form-item label="认证时间：">
          <span>{{ formData.operationAtTimestamp | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </el-form-item>
      </el-form>
    </article>
    <footer>
      <el-button
        v-show="operationStatus === 'toView'"
        type="primary"
        @click="close"
      >
        返回
      </el-button>
      <el-button
        v-show="operationStatus === 'audit'"
        type="primary"
      >
        认证失败
      </el-button>
      <el-button
        v-show="operationStatus === 'audit'"
        type="primary"
      >
        认证成功
      </el-button>
    </footer>
  </div>
</template>

<script>
import { getOne } from '@/api/plate'
import { getLable } from '@/utils/function'
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
    return {
      operation: {
        toView: '查看车辆认证',
        audit: '审核车辆认证'
      },
      formData: {}
    }
  },
  created () {
    this.getData(this.data.plateAuthId)
  },
  methods: {
    getLable,
    getData (id) {
      getOne(id).then(res => {
        this.formData = res.body || {}
        console.log(this.formData);
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
    // 编辑
    // save () {
    //   const params = { ...this.formData }
    //   params.currentPrice = params.currentPrice * 100
    //   postSaveSale(params).then(() => {
    //     this.$message({
    //       message: '编辑成功',
    //       type: 'success'
    //     })
    //     this.resetSearch()
    //   })
    // }
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
      &-USER_APPLY {
        background: url('~@/static/plateAuth/USER_APPLY.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-REJECT {
        background: url('~@/static/plateAuth/REJECT.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &-PASS {
        background: url('~@/static/plateAuth/PASS.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
    .elForm + .elForm {
      border-top: 1px solid #f1f2f3;
    }
    .elForm {
      .label {
        margin: 15px 0;
        font-size: 14px;
        color: #31353a;
        font-weight: bold;
      }
      .plateColor {
        display: flex;
        align-items: center;
        .type {
          margin-right: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .type001 {
          background-color: $mapMainColor1-1;
        }
        .type002 {
          background-color: $mapMainColor1-3;
        }
        .type003 {
          background-color: $mapMainColor1-2;
        }
        .type004 {
          background-color: $mapFontColorDefault1-1;
        }
        .type005 {
          background-color: $mapColor9-1;
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
