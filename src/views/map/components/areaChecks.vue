<template>
  <div class="areaChecks-wrap">
    <header>
      <span class="label">当前区域：</span>
      <!-- <div>{{ form.province + ' ' + form.city }}</div> -->
      <div>{{ form.province + ' ' + form.city + ' ' + ' ' + form.l3Region }}</div>
      <el-popover
        v-model="showToggle"
        popper-class="map-changePark-popover"
        :visible-arrow="false"
        placement="right-start"
        trigger="manual"
        width="345"
      >
        <div class="change-header">
          切换区域
          <svg-icon
            class="closed"
            icon-class="icon_close_14"
            @click="showToggle = false"
          />
        </div>
        <div class="change-content">
          <el-cascader
            ref="addPoint"
            v-model="selectedOptions"
            popper-class="map-cascader-popper checkStrictly"
            class="map-cascader"
            :options="cityOptions"
            filterable
            :props="cityProps"
            clearable
            @change="closeCascader"
          />
          <el-button
            class="map-btn-noBorder"
            type="primary"
            round
            @click="confirmToggle"
          >
            确定
          </el-button>
        </div>
        <span
          slot="reference"
          class="replace"
          @click="isShowToggle"
        >
          <svg-icon icon-class="icon_replace" />
          切换区域
        </span>
      </el-popover>
    </header>
    <div class="operation-wrap">
      <div class="operation-item">
        <span class="label">场地类型</span>
        <Checks
          ref="parking"
          :default-checkeds="form.parking"
          :data="parkinglotTypesOptions"
        />
      </div>
      <div class="operation-item">
        <span class="label">显示点位</span>
        <Checks
          ref="device"
          :default-checkeds="form.device"
          :data="mapIconTypesOptions"
        />
      </div>
    </div>
    <div class="btns-wrap">
      <el-button
        class="map-btn-border"
        round
        @click.stop="cancle"
      >
        取消
      </el-button>
      <el-button
        class="map-btn-noBorder"
        type="primary"
        round
        @click.stop="confirm"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import Checks from '@/components/Checks'
import { parkinglotTypesOptions, mapIconTypesOptions } from '@/utils/lookup'
import { getAreaDetails } from '@/api/parking'
export default {
  components: {
    Checks
  },
  data () {
    return {
      showToggle: false,
      parkinglotTypesOptions: [...parkinglotTypesOptions], // 停车场类型
      mapIconTypesOptions, // 显示点位
      form: {},
      cityOptions: [],
      selectedOptions: [],
      cityProps: {
        value: 'areaName',
        label: 'areaName',
        children: 'subArea',
        checkStrictly: true
      }
    }
  },
  computed: {
    ...mapState({
      mapSearch: state => state.mapDetails.mapSearch
    })
  },
  watch: {
    mapSearch: {
      handler () {
        this.form = { ...this.mapSearch }
        this.getAreaDetails()
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    getAreaDetails () {
      getAreaDetails().then(res => {
        this.cityOptions = this.getTreeData(res.body)
      })
    },
    getTreeData (data) {
      /* 递归处理末尾项subArea为0的空项 */
      data.forEach(item => {
        item.orginSubArea = [...item.subArea]
        if (item.subArea.length < 1 || item.level === 'l3Region') {
          item.subArea = undefined
        } else {
          this.getTreeData(item.subArea)
        }
      })
      return data
    },
    cancle () {
      this.$emit('close')
    },
    confirm () {
      const params = {
        ...this.form,
        parking: this.$refs.parking.getChecks(),
        device: this.$refs.device.getChecks()
      }
      this.$emit('confirm', params)
    },
    confirmToggle () {
      // 重置筛选项 start
      this.form = {
        province: this.selectedOptions[0] || '',
        city: this.selectedOptions[1] || '',
        l3Region: this.selectedOptions[2] || '',
        l4Region: '',
        resourceName: '',
        resourceType: [],
        parking: parkinglotTypesOptions.map(item => item.value),
        device: []
      }
      // 重置筛选项 end
      this.showToggle = false
    },
    isShowToggle () {
      const { province, city, l3Region } = this.form
      this.selectedOptions = [province, city]
      l3Region && this.selectedOptions.push(l3Region)
      this.showToggle = true
    },
    closeCascader () {
      this.$refs.addPoint.dropDownVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
.areaChecks-wrap {
  min-width: 480px;
  padding: 10px 15px 15px;
  background: url('~@/static/maps/decoration1.png') 0 0 no-repeat;
  background-size: 100% 100%;
  border: 1px solid $mapColor4-1;
  border-radius: 4px;
  header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    font-size: 12px;
    color: $mapFontColorDefault1-1;
    border-bottom: 1px solid $mapColor4-1;
    .label {
      color: $mapFontColorDefault1-2;
    }
    div {
      font-weight: bold;
    }
    .replace {
      margin-left: 20px;
      font-size: 12px;
      color: $mapMainColor1-1;
      cursor: pointer;
    }
  }
  .operation-wrap {
    margin-top: 10px;
    .operation-item + .operation-item {
      margin-top: 15px;
    }
    .operation-item {
      display: flex;
      align-items: baseline;
      .label {
        margin-right: 15px;
        width: 48px;
        color: $mapFontColorDefault1-1;
        font-weight: bold;
      }
    }
  }
  .btns-wrap {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
