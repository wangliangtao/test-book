<template>
  <div class="tab-container">
    <el-card class="page-content">
      <el-row>
        <el-col :span="24">
          <el-form
            :inline="true"
            :model="searchForm"
            class="searchForm"
          >
            <el-form-item label="魔窗编号">
              <el-input
                v-model.trim="searchForm.moduleSerialNo"
                placeholder="请输入魔窗编号"
                clearable
                @change="initSearch"
              />
            </el-form-item>
            <el-form-item label="魔窗标题">
              <el-input
                v-model.trim="searchForm.moduleTitle"
                placeholder="请输入魔窗标题"
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
            <el-form-item label="魔窗状态">
              <el-select
                v-model="searchForm.enableStatus"
                placeholder="请选择魔窗状态"
                clearable
                @change="initSearch"
              >
                <el-option
                  v-for="item in moduleStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="button-wrap">
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
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="toOperation('add')"
        >
          创建魔窗
        </el-button>
      </div>
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
            label="魔窗状态"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <p :class="[`class-${scope.row.enableStatus ? '1' : '2'}`]">
                {{ getLable(scope.row.enableStatus, moduleStatusOptions) }}
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
                  @click="toOperation('examine', scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="toOperation('edit', scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="toEnable(scope.row.moduleSerialNo, scope.row.enableStatus)"
                >
                  {{ scope.row.enableStatus ? '禁用' : '启用' }}
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="toDel(scope.row.moduleSerialNo)"
                >
                  删除
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
import { postModulePageList, postEnableModule, getDeleteModule } from '@/api/adminModule'
import { moduleStatusOptions } from '@/utils/lookup'
import { formatterAll, formatterDate } from '@/utils/tableFormatter'
import detailDrawer from './components/detailDrawer'
import { getLable } from '@/utils/function'

export default {
  components: { detailDrawer },
  mixins: [listPageDto],
  data () {
    return {
      moduleStatusOptions,
      cols: [
        {
          label: '魔窗编号',
          prop: 'moduleSerialNo',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '魔窗标题',
          prop: 'moduleTitle',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '更新人员',
          prop: 'editUserName',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '更新时间',
          prop: 'updateAt',
          formatter: (row, col, cell) => formatterDate(row, col, cell, 'yyyy-MM-dd HH:mm:ss')
        }
      ],
      drawer: false,
      operationStatus: '',
      loading: false,
      searchForm: {
        moduleSerialNo: '',
        moduleTitle: '',
        updateBeginTime: '',
        updateEndTime: '',
        enableStatus: ''
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
      postModulePageList(this.searchForm).then(res => {
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
    },
    toEnable (id = '', status) {
      this.$confirm(`是否${status ? '禁用' : '启用'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postEnableModule({
          moduleSerialNo: id,
          enableStatus: !status
        }).then(() => {
          this.$message({
            type: 'success',
            message: `${status ? '禁用' : '启用'}成功`
          })
          this.resetSearch()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败，请重新操作'
          })
        })
      })
    },
    toDel (id = '') {
      this.$confirm(`是否删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getDeleteModule(id).then(() => {
          this.$message({
            type: 'success',
            message: `删除成功`
          })
          this.resetSearch()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败，请重新操作'
          })
        })
      })
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
    .button-wrap {
      display: flex;
      .el-button:last-of-type {
        margin-left: auto;
      }
    }
    .el-table {
      margin-top: 20px;
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
