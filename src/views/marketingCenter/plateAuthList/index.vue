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
            <el-form-item label="用户昵称">
              <el-input
                v-model.trim="searchForm.applyNickname"
                placeholder="请输入用户昵称"
                clearable
                @change="initSearch"
              />
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input
                v-model.trim.number="searchForm.applyPhone"
                placeholder="请输入手机号码"
                clearable
                @change="initSearch"
              />
            </el-form-item>
            <el-form-item label="车牌号码">
              <el-input
                v-model.trim="searchForm.plateNo"
                placeholder="请输入车牌号码"
                clearable
                @change="initSearch"
              />
            </el-form-item>
            <el-form-item label="提交时间">
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
            <el-form-item label="认证状态">
              <el-select
                v-model="searchForm.status"
                placeholder="请选择认证状态"
                clearable
                @change="initSearch"
              >
                <el-option
                  v-for="item in queryPlateAuthOptions"
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
          <template v-for="(col,index,key) in cols">
            <el-table-column
              v-if="index < 3"
              :key="key"
              :prop="col.prop"
              :label="col.label"
              :formatter="col.formatter"
              :width="col.width"
              :min-width="col.minWidth"
              :show-overflow-tooltip="col.overflow"
              :fixed="col.fixed"
              :class="col.class"
              :type="col.type"
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
              v-if="index > 3"
              :key="key"
              :prop="col.prop"
              :label="col.label"
              :formatter="col.formatter"
              :width="col.width"
              :min-width="col.minWidth"
              :show-overflow-tooltip="col.overflow"
              :fixed="col.fixed"
              :class="col.class"
              :type="col.type"
            />
          </template>
          <el-table-column
            label="认证状态"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <p :class="['status', `status-${scope.row.status}`]">
                {{ getLable(scope.row.status, queryPlateAuthOptions) }}
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
                  type="text"
                  size="mini"
                  @click="toOperation('toView', scope.row)"
                >
                  查看
                </el-button>
              </div>
              <div>
                <el-button
                  v-if="scope.row.status === 'PASS'"
                  type="text"
                  size="mini"
                >
                  撤销
                </el-button>
              </div>
              <div>
                <el-button
                  v-if="scope.row.status === 'USER_APPLY'"
                  type="text"
                  size="mini"
                  @click="toOperation('audit', scope.row)"
                >
                  审核
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
import { postQueryPlateAuthPage } from '@/api/plate'
import { queryPlateAuthOptions } from '@/utils/lookup'
import { formatterAll, formatterDate } from '@/utils/tableFormatter'
import detailDrawer from './components/detailDrawer'
import { getLable } from '@/utils/function'

export default {
  components: { detailDrawer },
  mixins: [listPageDto],
  data () {
    return {
      queryPlateAuthOptions,
      cols: [
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '用户昵称',
          prop: 'applyNickname',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '手机号码',
          prop: 'applyPhone',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '车牌号码',
          prop: 'plateNo',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '提交时间',
          prop: 'createdAtTimestamp',
          formatter: (row, col, cell) => formatterDate(row, col, cell, 'yyyy-MM-dd HH:mm:ss')
        }
      ],
      drawer: false,
      operationStatus: '',
      loading: false,
      searchForm: {
        applyNickname: '',
        applyPhone: '',
        plateNo: '',
        status: 'USER_APPLY',
        startTimestamp: '',
        endTimestamp: ''
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
      postQueryPlateAuthPage(this.searchForm).then(res => {
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
      this.searchForm = { status: 'USER_APPLY' }
      this.initSearch()
    },
    formatCreateDate (val = []) {
      val = val ? val : []
      const params = {
        startTimestamp: val[0],
        endTimestamp: val[1]
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
  .status {
    color: #c2c5c8;
    &-USER_APPLY {
      color: #fabb32;
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
