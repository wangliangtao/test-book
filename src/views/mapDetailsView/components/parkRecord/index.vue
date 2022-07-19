<template>
  <div class="parkRecord-wrap">
    <div class="search-wrap">
      <div class="search-row">
        <div class="search-item">
          <span class="label">场地名称：</span>
          <el-select
            v-model="form.parkingSn"
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
        <div class="search-item">
          <span class="label">车牌颜色：</span>
          <el-select
            v-model="form.plateColor"
            class="map-select"
            placeholder="请选择"
            :popper-append-to-body="false"
            @change="initSearch"
          >
            <el-option
              v-for="item in carTypeList"
              :key="item.text"
              :label="item.dec"
              :value="item.code"
            />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">车牌号码：</span>
          <el-input
            v-model="form.plateNo"
            class="map-input"
            placeholder="请输入车牌号码"
            @change="initSearch"
          />
        </div>
      </div>
      <div class="search-row">
        <div class="search-item">
          <span class="label">入场时间：</span>
          <el-date-picker
            v-model="form.inTime"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            class="map-datePicker"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            popper-class="map-datePicker-popper"
            @change="formatInTime"
          />
        </div>
        <div class="search-item">
          <span class="label">出场时间：</span>
          <el-date-picker
            v-model="form.outTime"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            class="map-datePicker"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            popper-class="map-datePicker-popper"
            @change="formatOutTime"
          />
        </div>
        <div class="search-item">
          <span class="label">流水状态：</span>
          <el-select
            v-model="form.status"
            class="map-select"
            placeholder="请选择"
            :popper-append-to-body="false"
            @change="initSearch"
          >
            <el-option
              v-for="item in orderWaterStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
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
        <div class="buttons">
          <el-button
            class="map-btn-border"
            round
            @click="resetSearch()"
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
    <div class="parkRecord-container">
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
          label="车牌号码"
          show-overflow-tooltip
          width="110"
        >
          <template slot-scope="scope">
            <div class="plateColor">
              <div :class="['type','type' + scope.row.plateColor]" />
              {{ scope.row.plateNo }}
            </div>
          </template>
        </el-table-column>
        <template v-for="(col,index,key) in cols">
          <el-table-column
            v-if="index > 1 && index < 6"
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
          label="流水状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p :class="[`class-${scope.row.statusNumber}`]">
              {{ getLable(scope.row.statusNumber, orderWaterStatusOptions) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="订单编号"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="operation">
              <el-button
                v-if="scope.row.orderSn"
                type="text"
                size="mini"
                @click="goOrder(scope.row.orderSn)"
              >
                {{ scope.row.orderSn }}
              </el-button>
              <span v-else>-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="预付订单编号"
          show-overflow-tooltip
          width="120"
        >
          <template slot-scope="scope">
            <div class="operation">
              <el-button
                v-if="scope.row.preOrderSn"
                type="text"
                size="mini"
                @click="goOrder(scope.row.preOrderSn)"
              >
                {{ scope.row.preOrderSn }}
              </el-button>
              <span v-else>-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
          width="120"
          fixed="right"
        >
          <template>
            <div class="operation">
              <el-button
                type="text"
                size="mini"
              >
                停车照片
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
  </div>
</template>

<script type="text/ecmascript-6">
import listPageDto from '@/mixin/listPageDto'
import { formatterAll, formatterDate, formatterAmount, formatterDuration } from '@/utils/tableFormatter'
import { getLable } from '@/utils/function'
import { carTypeList, orderWaterStatusOptions } from '@/utils/lookup'
import { postRecordsList, postParkingNameList } from '@/api/parking'
export default {
  mixins: [listPageDto],
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      loading: false,
      parkingList: [],
      carTypeList: [
        {
          code: '',
          text: '全部',
          dec: '全部'
        },
        ...carTypeList
      ],
      orderWaterStatusOptions: [
        {
          label: '全部',
          value: ''
        },
        ...orderWaterStatusOptions
      ],
      defaultForm: {
        parkingSn: [],
        plateColor: '',
        plateNo: '',
        recordSn: '',
        inTime: '',
        inBeginTime: '',
        inEndTime: '',
        outTime: '',
        outBeginTime: '',
        outEndTime: '',
        status: '',
        orderId: ''
      },
      form: {},
      tableData: [],
      cols: [
        {
          label: '停车场名称',
          prop: 'parkingName',
          width: '180',
          formatter: (row, col, cell) => formatterAll(row, col, cell),
          fixed: "left",
          overflow: true
        },
        {
          label: '车牌号码',
          prop: 'plateNo',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '入场时间',
          prop: 'startTime',
          width: '116',
          formatter: (row, col, cell) => formatterDate(row, col, cell, 'yyyy-MM-dd HH:mm:ss')
        },
        {
          label: '出场时间',
          prop: 'endTime',
          width: '116',
          formatter: (row, col, cell) => formatterDate(row, col, cell, 'yyyy-MM-dd HH:mm:ss')
        },
        {
          label: '停车时长',
          prop: 'parkingTime',
          width: '120',
          formatter: (row, col, cell) => formatterDuration(row, col, cell)
        },
        {
          label: '应付金额（¥）',
          prop: 'shouldPay',
          width: '120',
          formatter: (row, col, cell) => formatterAmount(row, col, cell)
        },
        {
          label: '流水状态',
          prop: 'status',
          // formatter: (row, col, cell) => formatterDate(row, col, cell, 'yyyy-MM-dd HH:mm:ss'),
        },
        {
          label: '订单编号',
          prop: 'orderSn',
          width: '160',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '预付订单编号',
          prop: 'preOrderSn',
          width: '160',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        }
      ]
    }
  },
  mounted () {
    this.getParkingName()
  },
  methods: {
    getLable,
    getParkingName () {
      postParkingNameList().then(res => {
        this.parkingList = res.body || []
        const params = {
          parkingSn: this.data.parkingSn && [this.data.parkingSn] || []
        }
        this.resetSearch(params)
      })
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
    getData () {
      this.loading = true
      this.form.pageSize = this.pagesize
      this.form.pageNo = this.currentPage
      const params = { ...this.form }
      postRecordsList(params).then(res => {
        const data = res.body || {}
        this.tableData = data.content || []
        this.currentPage = data.pageNo || 1
        this.pagesize = data.pageSize || 10
        this.total = data.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    formatInTime (val = []) {
      val = val ? val : []
      const params = {
        inBeginTime: val[0],
        inEndTime: val[1]
      }
      this.form = { ...this.form, ...params }
      this.initSearch()
    },
    formatOutTime (val = []) {
      val = val ? val : []
      const params = {
        outBeginTime: val[0],
        outEndTime: val[1]
      }
      this.form = { ...this.form, ...params }
      this.initSearch()
    },
    goOrder (orderId) {
      this.$emit('goOrder', orderId)
    }
  }
}
</script>

<style scoped lang="scss">
.parkRecord-wrap {
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
  .parkRecord-container {
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
    .class-1 {
      color: $mapMainColor1-4;
    }
    .class-2 {
      color: $mapMainColor1-2;
    }
    .operation {
      // padding-right: 20px;
      font-size: 14px;
      color: $mapMainColor1-1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .el-button {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span {
        color: $mapFontColorDefault1-1;
      }
    }
  }
  .map-pagination-wrap {
    margin-top: 20px;
  }
}
</style>
