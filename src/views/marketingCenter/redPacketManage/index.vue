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
            <el-form-item label="红包编号">
              <el-input
                v-model.trim="searchForm.rpId"
                placeholder="请输入红包编号"
                clearable
                @change="initSearch"
              />
            </el-form-item>
            <el-form-item label="红包标题">
              <el-input
                v-model.trim="searchForm.rpTitle"
                placeholder="请输入红包标题"
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
            <el-form-item label="创建时间">
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
            <el-form-item label="红包状态">
              <el-select
                v-model="searchForm.rpStatus"
                placeholder="请选择红包状态"
                clearable
                @change="initSearch"
              >
                <el-option
                  v-for="item in rpStatusOptions"
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
            label="红包状态"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <p :class="['class-' + scope.row.rpStatus]">
                {{ getLable(scope.row.rpStatus, rpStatusOptions) }}
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
                  @click="toOperation('audit', scope.row)"
                >
                  审核
                </el-button>
                <el-button
                  v-if="scope.row.rpStatus === 6"
                  type="text"
                  size="mini"
                  @click="showShelves(scope.row)"
                >
                  下架
                </el-button>
                <el-button
                  v-if="scope.row.rpStatus === 5"
                  type="text"
                  size="mini"
                  @click="toOperation('open', scope.row)"
                >
                  上架
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="toOperation('examine', scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.status !== 6"
                  type="text"
                  size="mini"
                  @click="toOperation('edit', scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.status !== 6"
                  type="text"
                  size="mini"
                  @click="showAssociated(scope.row)"
                >
                  关联
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

    <!-- 红包信息  -->
    <el-drawer
      ref="drawer"
      size="40%"
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
    <!-- 关联信息  -->
    <el-drawer
      ref="associatedDrawer"
      size="40%"
      :visible.sync="isAssociated"
      :with-header="false"
      destroy-on-close
      :wrapper-closable="false"
      :close-on-press-escape="false"
    >
      <associatedDrawer
        :data="selectRow"
        @close="closeDrawer"
        @resetSearch="resetSearch"
      />
    </el-drawer>
    <el-dialog
      width="40%"
      append-to-body
      title="确认提示"
      :visible.sync="isShelves"
      :modal="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="tips">
        <p class="title">
          是否确定下架
        </p>
        <p class="subTitle">
          下架后，红包结算的剩余乐币将返还至商家账户，同时推送提示短信。
        </p>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isShelves = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="bottomShelvesit"
        >
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import listPageDto from '@/mixin/listPageDto'
import { queryGetRpList } from '@/api/rp'
import { publishDown } from '@/api/admin'
import { rpStatusOptions } from '@/utils/lookup'
import { formatterAll, formatterDate } from '@/utils/tableFormatter'
import detailDrawer from './components/detailDrawer'
import associatedDrawer from './components/associatedDrawer'
import { getLable } from '@/utils/function'

export default {
  components: { detailDrawer, associatedDrawer },
  mixins: [listPageDto],
  data () {
    return {
      rpStatusOptions,
      cols: [
        {
          label: '红包编号',
          prop: 'id',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '红包标题',
          prop: 'rpTitle',
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
          label: '创建时间',
          prop: 'createAt',
          formatter: (row, col, cell) => formatterDate(row, col, cell, 'yyyy-MM-dd HH:mm:ss')
        }
      ],
      drawer: false,
      operationStatus: '',
      loading: false,
      searchForm: {
        rpId: '',
        rpTitle: '',
        merchantName: '',
        merchantPhone: '',
        beginDateTime: '',
        endDateTime: '',
        rpStatus: ''
      },
      tableData: [],
      selectRow: {},
      isShelves: false,
      isAssociated: false
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
      this.$refs.associatedDrawer.closeDrawer()
      this.drawer = false
      this.isAssociated = false
      this.selectRow = {}
    },
    getData () {
      this.loading = true
      this.searchForm.pageSize = this.pagesize
      this.searchForm.pageNo = this.currentPage
      queryGetRpList(this.searchForm).then(res => {
        const data = res.body || {}
        this.tableData = data.content || []
        this.currentPage = data.pageNo || 1
        this.pagesize = data.pageSize || 10
        this.total = data.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    showShelves (row) {
      this.selectRow = row
      this.isShelves = true
    },
    // 下架
    bottomShelvesit () {
      publishDown(this.selectRow.id).then(() => {
        this.$message({
          message: '下架成功',
          type: 'success'
        })
        this.resetSearch()
      }).finally(() => {
        this.selectRow = {}
        this.isShelves = false
      })
    },
    showAssociated (row) {
      this.selectRow = row
      this.isAssociated = true
    },
    // 重置
    resetSearch () {
      this.searchForm = {}
      this.initSearch()
    },
    formatCreateDate (val = []) {
      val = val ? val : []
      const params = {
        beginDateTime: val[0],
        endDateTime: val[1]
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
      color: #c2c5c8;
    }
    &-2 {
      color: #c2c5c8;
    }
    &-3 {
      color: #fabb32;
    }
    &-5 {
      color: #c2c5c8;
    }
    &-6 {
      color: #14cc55;
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
</style>
