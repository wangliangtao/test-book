<template>
  <div class="tab-container">
    <el-card class="page-content">
      <el-row>
        <el-col :span="20">
          <el-form
            :inline="true"
            :model="searchForm"
            label-width="100px"
            class="searchForm"
          >
            <el-form-item label="热销编号">
              <el-input
                v-model.trim="searchForm.saleSerialNo"
                placeholder="请输入热销编号"
                clearable
                @change="initSearch"
              />
            </el-form-item>
            <el-form-item label="商品编号">
              <el-input
                v-model.trim="searchForm.goodSerialNo"
                placeholder="请输入商品编号"
                clearable
                @change="initSearch"
              />
            </el-form-item>
            <el-form-item label="商家昵称">
              <el-input
                v-model.trim="searchForm.merchantName"
                placeholder="请输入商家昵称"
                clearable
                @change="initSearch"
              />
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input
                v-model.trim="searchForm.merchantPhone"
                placeholder="请输入手机号码"
                clearable
                @change="initSearch"
              />
            </el-form-item>
            <el-form-item label="更新时间">
              <el-date-picker
                v-model="searchForm.createDate"
                value-format="timestamp"
                :default-time="['00:00:00', '23:59:59']"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="formatCreateDate"
              />
            </el-form-item>
            <el-form-item label="热销状态">
              <el-select
                v-model="searchForm.enableStatus"
                placeholder="请选择热销状态"
                clearable
                @change="initSearch"
              >
                <el-option
                  v-for="item in saleStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col
          :span="5"
          class="button-wrapper"
        >
          <el-button
            icon="el-icon-refresh-right"
            plain
            @click="resetSearch"
          >
            重置
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="initSearch"
          >
            查询
          </el-button>
        </el-col>
      </el-row>

      <div>
        <el-table
          v-loading="loading"
          :data="tableData"
          class="elTable"
          style="width: 100%"
        >
          <el-table-column
            v-for="col in cols"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :formatter="col.formatter"
            :width="col.width"
            :min-width="col.minWidth"
            :show-overflow-tooltip="col.overflow"
            :fixed="col.fixed"
            :class="col.class"
          />
          <el-table-column
            label="热销状态"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <p :class="[`class-${scope.row.enableStatus ? '1' : '2'}`]">
                {{ getLable(scope.row.enableStatus, saleStatusOptions) }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            min-width="150"
            align="left"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  v-if="!scope.row.enableStatus"
                  type="text"
                  size="mini"
                  @click="toOperation('edit', scope.row)"
                >
                  编辑
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          :current-page.sync="currentPage"
          :page-sizes="[10, 50, 100, 1000]"
          :page-size="pagesize"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-drawer
      ref="drawer"
      size="640px"
      :visible.sync="drawer"
      :with-header="false"
      destroy-on-close
      :wrapper-closable="false"
      :close-on-press-escape="false"
    >
      <detailDrawer
        :operation-status="operationStatus"
        :data="selectRow"
        @close="closeDrawer"
        @resetSearch="resetSearch"
      />
    </el-drawer>
  </div>
</template>

<script>
import listPageDto from '@/mixin/listPageDto'
import { postSalePageList } from '@/api/saleAdmin'
import { saleStatusOptions } from '@/utils/lookup'
import { formatterAll, formatterDate } from '@/utils/tableFormatter'
import detailDrawer from './components/detailDrawer'
import { getLable } from '@/utils/function'

export default {
  components: { detailDrawer },
  mixins: [listPageDto],
  data () {
    return {
      saleStatusOptions,
      cols: [
        {
          label: '热销编号',
          prop: 'saleSerialNo',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '商品标题',
          prop: 'goodsTitle',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '商家昵称',
          prop: 'merchantName',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '手机号码',
          prop: 'merchantPhone',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          formatter: (row, col, cell) => formatterDate(row, col, cell, 'yyyy-MM-dd HH:mm:ss')
        }
      ],
      drawer: false,
      operationStatus: '',
      loading: false,
      searchForm: {
        saleSerialNo: '',
        goodSerialNo: '',
        merchantName: '',
        merchantPhone: '',
        updateBeginTime: '',
        updateEndTime: '',
        enableStatus: null
      },
      tableData: [],
      selectRow: {}
    }
  },
  created () {
    this.resetSearch()
  },
  methods: {
    getLable,
    initSearch () {
      this.currentPage = 1
      this.getData()
    },
    closeDrawer () {
      this.$refs.drawer.closeDrawer()
    },
    getData () {
      this.loading = true
      this.searchForm.pageSize = this.pagesize
      this.searchForm.pageNo = this.currentPage
      postSalePageList(this.searchForm).then(res => {
        const data = res.body || {}
        this.tableData = data.content || []
        this.currentPage = data.pageNo || 1
        this.pagesize = data.pageSize || 10
        this.total = data.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    // 重置
    resetSearch () {
      this.searchForm = {}
      this.initSearch()
    },
    formatCreateDate (val = []) {
      val = val ? val : []
      const params = {
        updateBeginTime: val[0],
        updateEndTime: val[1]
      }
      this.searchForm = Object.assign(this.searchForm, params)
      this.initSearch()
    },
    toOperation (type, row) {
      this.operationStatus = type
      this.selectRow = row
      this.drawer = true
    }
  }
}
</script>

<style lang="scss">
:focus {
  outline: none;
}
.el-drawer__body {
  height: 100%;
}
::v-deep .el-drawer__header {
  margin-bottom: none;
}
</style>

<style scoped lang="scss">
@import '@/styles/global.scss';

.tab-container {
  @include page-margin;
  .page-header {
    @include page-header;
  }
  .page-content {
    @include page-content;
    // padding: 24px;
    ::v-deep.el-form-item--medium .el-form-item__content {
      width: 240px;
    }
    ::v-deep .el-select {
      width: 100%;
    }
    ::v-deep .el-date-editor {
      width: 100%;
      .el-range-input {
        font-size: 12px;
      }
    }
    .button-wrapper {
      position: absolute;
      bottom: 20px;
      right: 0;
      // ::v-deep.el-button + .el-button {
      //   margin-left: 0px !important;
      // }
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
.searchForm {
  // margin-top: -10px;
  // margin-bottom: -18px;
}
.exportButton {
  float: right;
  margin-right: 1rem;
}
.elTable {
  ::v-deep .warning-row {
    // background: oldlace;
    > td:first-child {
      border-left: 1px solid $op-color-danger;
    }
  }
  .class {
    &-1 {
      color: #14cc55;
    }
    &-2 {
      color: #c2c5c8;
    }
    &-3 {
      color: #fabb32;
    }
    &-4 {
      color: #c2c5c8;
    }
    &-5 {
      color: #c2c5c8;
    }
    &-6 {
      color: #c2c5c8;
    }
  }
}
.pagination {
  float: right;
  margin: 1rem auto;
}
.tableCenter {
  margin: 0 auto;
}
.addButton {
  float: right;
  margin-right: 1rem;
}
</style>
