<template>
  <div class="paymentOrder-wrap">
    <div class="search-wrap">
      <div class="search-row">
        <div class="search-item">
          <span class="label">订单编号：</span>
          <el-input
            v-model="form.orderId"
            class="map-input"
            placeholder="请输入订单编号"
            @change="initSearch"
          />
        </div>
        <div class="search-item">
          <span class="label">用户昵称：</span>
          <el-input
            v-model="form.userNickname"
            class="map-input"
            placeholder="请输入用户昵称"
            @change="initSearch"
          />
        </div>
        <div class="search-item">
          <span class="label">场地名称：</span>
          <el-select
            v-model="form.prkCodeList"
            class="map-select multiple"
            multiple
            collapse-tags
            filterable
            :popper-append-to-body="false"
            placeholder="请输入关键字"
          >
            <el-option
              v-for="item in parkingList"
              :key="item.parkingSn"
              :label="item.parkingName"
              :value="item.parkingSn"
            />
          </el-select>
        </div>
      </div>
      <div class="search-row">
        <div class="search-item">
          <span class="label">手机号码：</span>
          <el-input
            v-model="form.userPhone"
            class="map-input"
            placeholder="请输入手机号码"
            @change="initSearch"
          />
        </div>
        <div class="search-item">
          <span class="label">支付时间：</span>
          <el-date-picker
            v-model="form.createDate"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            class="map-datePicker"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            popper-class="map-datePicker-popper"
            @change="formatCreateDate"
          />
        </div>
        <div class="search-item">
          <span class="label">订单状态：</span>
          <el-select
            v-model="form.orderPayStatus"
            class="map-select"
            placeholder="请选择"
            :popper-append-to-body="false"
            @change="initSearch"
          >
            <el-option
              v-for="item in parkingOrderPayStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="search-row">
        <div class="buttons">
          <el-button
            class="map-btn-border"
            round
            @click="resetSearch"
          >
            <svg-icon icon-class="icon_reset_12" />
            重置
          </el-button>
          <el-button
            class="map-btn-noBorder"
            type="primary"
            round
            @click="initSearch"
          >
            <i class="el-icon-search" />
            查询
          </el-button>
        </div>
      </div>
    </div>
    <div class="paymentOrder-container">
      <el-table
        v-loading="loading"
        class="map-table"
        :data="tableData"
        style="width: 100%"
        stripe
        :row-class-name="tableRowClassName"
        header-cell-class-name="tableHeaderRow"
      >
        <template v-for="(col,index,key) in cols">
          <el-table-column
            v-if="index < 1"
            :key="key"
            :prop="col.prop"
            :label="col.label"
            :formatter="col.formatter"
            :width="col.width"
            :min-width="col.minWidth"
            :show-overflow-tooltip="col.overflow"
            :fixed="col.fixed"
            :class="col.class"
          />
        </template>
        <el-table-column
          prop="name"
          label="用户昵称"
          show-overflow-tooltip
          width="150"
        >
          <template slot-scope="scope">
            <div class="user">
              <img
                class="avatar"
                :src="scope.row.userAvatarUrl"
              >
              {{ scope.row.userNickname }}
            </div>
          </template>
        </el-table-column>
        <template v-for="(col,index,key) in cols">
          <el-table-column
            v-if="index > 1 && index < 8"
            :key="key"
            :prop="col.prop"
            :label="col.label"
            :formatter="col.formatter"
            :width="col.width"
            :min-width="col.minWidth"
            :show-overflow-tooltip="col.overflow"
            :fixed="col.fixed"
            :class-name="col.class"
          />
        </template>
        <el-table-column
          prop="name"
          label="订单状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p :class="[`class-${scope.row.orderPayStatus}`]">
              {{ getLable(scope.row.orderPayStatus, parkingOrderPayStatusOptions) }}
            </p>
          </template>
        </el-table-column>
        <template v-for="(col,index,key) in cols">
          <el-table-column
            v-if="index > 8"
            :key="key"
            :prop="col.prop"
            :label="col.label"
            :formatter="col.formatter"
            :width="col.width"
            :min-width="col.minWidth"
            :show-overflow-tooltip="col.overflow"
            :fixed="col.fixed"
            :class-name="col.class"
          />
        </template>
        <el-table-column
          label="操作"
          align="left"
          width="120"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="operation">
              <el-button
                type="text"
                size="mini"
                @click="toOperation('detail', scope.row)"
              >
                查看详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="map-pagination-wrap">
      <el-pagination
        class="map-pagination"
        background
        :current-page.sync="currentPage"
        :page-size="pagesize"
        layout="total, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-drawer
      ref="drawer"
      size="640px"
      :visible.sync="showDetails"
      :with-header="false"
      destroy-on-close
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      custom-class="map-drawer"
    >
      <Details
        :operation-status="operationStatus"
        :params="selectRow"
        @close="closeDetails"
        @resetSearch="resetSearch"
      />
    </el-drawer>
  </div>
</template>

<script type="text/ecmascript-6">
import listPageDto from '@/mixin/listPageDto'
import { formatterAll, formatterDate, formatterAmount } from '@/utils/tableFormatter'
import { getLable } from '@/utils/function'
import { postParkingFeeMntPage, postParkingNameList } from '@/api/parking'
import Details from './components/Details'
export default {
  components: { Details },
  mixins: [listPageDto],
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    childData: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      showDetails: false,
      loading: false,
      parkingOrderPayStatusOptions: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '支付成功',
          value: 'PAY_SUCCESS'
        },
        {
          label: '已经退款',
          value: 'REFUND'
        }
      ],
      parkingList: [],
      defaultForm: {
        orderStartTimestamp: '',
        orderEndTimestamp: '',
        userNickname: '',
        userPhone: '',
        prkCodeList: [],
        plateNo: '',
        orderId: '',
        orderPayStatus: ''
      },
      form: {},
      tableData: [],
      cols: [
        {
          label: '订单编号',
          prop: 'orderId',
          width: '130',
          formatter: (row, col, cell) => formatterAll(row, col, cell),
          fixed: "left"
        },
        {
          label: '用户昵称',
          prop: 'userNickname',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '停车场名称',
          prop: 'prkNameSet',
          width: '180',
          formatter: (row, col, cell) => formatterAll(row, col, cell),
          overflow: true
        },
        {
          label: '手机号码',
          prop: 'userPhone',
          width: '120',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '应付金额（¥）',
          prop: 'totalAmount',
          width: '120',
          formatter: (row, col, cell) => formatterAmount(row, col, cell)
        },
        {
          label: '优惠金额（¥）',
          prop: 'discountAmount',
          width: '120',
          formatter: (row, col, cell) => formatterAmount(row, col, cell)
        },
        {
          label: '乐币抵扣（¥）',
          prop: 'actualLebiRmb',
          width: '120',
          formatter: (row, col, cell) => formatterAmount(row, col, cell)
        },
        {
          label: '实付金额（¥）',
          prop: 'actualRmb',
          width: '120',
          formatter: (row, col, cell) => formatterAmount(row, col, cell)
        },
        {
          label: '订单状态',
          prop: 'orderPayStatus',
          // formatter: (row, col, cell) => formatterDate(row, col, cell, 'yyyy-MM-dd HH:mm:ss'),
        },
        {
          label: '支付时间',
          prop: 'payAtTimestamp',
          width: '100',
          formatter: (row, col, cell) => formatterDate(row, col, cell, 'yyyy-MM-dd HH:mm:ss')
        }
      ],
      selectRow: {},
      operationStatus: ''
    }
  },
  mounted () {
    this.getParkingName()
  },
  methods: {
    getLable,
    formatterpPrkNameSet (row, col) {
      return row[col.property].join(',')
    },
    tableRowClassName ({ rowIndex }) {
      return rowIndex % 2 === 0 ? 'odd' : 'even'
    },
    initSearch () {
      this.currentPage = 1
      this.getData()
    },
    // 重置
    resetSearch (data = {}) {
      this.form = { ...this.defaultForm, ...data }
      this.pagesize = 6
      this.initSearch()
    },
    getParkingName () {
      postParkingNameList().then(res => {
        this.parkingList = res.body || []
        const { orderId } = this.childData
        const { parkingSn } = this.data
        if (orderId) {
          this.form.orderId = orderId
        } else {
          parkingSn && (this.form.prkCodeList = [parkingSn])
        }
        this.resetSearch(this.form)
      })
    },
    getData () {
      this.loading = true
      this.form.pageSize = this.pagesize
      this.form.pageNo = this.currentPage
      const params = { ...this.form }
      postParkingFeeMntPage(params).then(res => {
        const data = res.body || {}
        this.tableData = data.content || []
        this.currentPage = data.pageNo || 1
        this.pagesize = data.pageSize || 10
        this.total = data.total || 0
      }).finally(() => {
        // this.loading = false
      })
    },
    formatCreateDate (val = []) {
      val = val ? val : []
      const params = {
        orderStartTimestamp: val[0],
        orderEndTimestamp: val[1]
      }
      this.form = Object.assign(this.form, params)
      this.initSearch()
    },
    toOperation (type, row) {
      this.operationStatus = type
      this.selectRow = row
      this.showDetails = true
    },
    closeDetails () {
      this.$refs.drawer.closeDrawer()
    }
  }
}
</script>

<style scoped lang="scss">
.paymentOrder-wrap {
  position: relative;
  padding: 20px;
  // height: 100%;
  height: calc(754px - 50px + 20px);
  overflow: auto;
  .search-wrap {
    .search-row + .search-row {
      margin-top: 15px;
    }
    .search-row {
      display: flex;
      .search-item {
        margin-right: 30px;
        display: flex;
        align-items: center;
        .label {
          margin-right: 10px;
          font-size: 14px;
          color: $mapFontColorDefault1-1;
          white-space: nowrap;
        }
      }
      .el-button + .el-button {
        margin-left: 15px;
      }
    }
  }
  .paymentOrder-container {
    margin-top: 20px;
    .user {
      display: flex;
      align-items: center;
      .avatar {
        margin-right: 5px;
        width: 24px;
        height: 24px;
        border: 1px solid $mapFontColorDefault1-1;
        border-radius: 50%;
      }
    }
    .class-PAY_SUCCESS {
      color: $mapMainColor1-2;
    }
    .operation {
      padding-right: 20px;
      font-size: 14px;
      color: $mapMainColor1-1;
      white-space: nowrap;
    }
  }
  .map-pagination-wrap {
    margin-top: 20px;
  }
}
</style>
