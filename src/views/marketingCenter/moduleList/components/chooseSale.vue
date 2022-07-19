<template>
  <div class="wrapper">
    <header>
      <section class="t">
        <span>选择热销</span>
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
        <label>热销编号</label>
        <el-input
          v-model.trim="searchForm.saleSerialNo"
          class="wid"
          placeholder="请输入热销编号"
          clearable
        />
        <el-button
          icon="el-icon-search"
          type="primary"
          round
          @click="initSearch"
        >
          查询
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
            label="操作"
            fixed="right"
            align="left"
            width="80"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  type="text"
                  size="mini"
                  @click="choose(scope.row)"
                >
                  选择
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          :current-page.sync="currentPage"
          :page-sizes="[5, 50, 100, 1000]"
          :page-size="pagesize"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </article>
  </div>
</template>

<script>
import listPageDto from '@/mixin/listPageDto'
import { postSalePageList } from '@/api/saleAdmin'
import { saleStatusOptions } from '@/utils/lookup'
import { formatterAll, formatterGetLable } from '@/utils/tableFormatter'
export default {
  mixins: [listPageDto],
  props: {
    data: {
      type: Object,
      default: () => {return {} }
    },
    operationStatus: { // 操作状态
      type: String,
      default: ''
    }
  },
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
          label: '热销标题',
          prop: 'goodsTitle',
          width: '200px',
          formatter: (row, col, cell) => formatterAll(row, col, cell)
        },
        {
          label: '热销状态',
          prop: 'enableStatus',
          formatter: (row, col, cell) => formatterGetLable(row, col, cell, saleStatusOptions)
        }
      ],
      searchForm: {
        saleSerialNo: ''
      },
      tableData: [],
      loading: false
    }
  },
  created () {
    this.pagesize = 5
    this.getData()
  },
  methods: {
    initSearch () {
      this.currentPage = 1
      this.getData()
    },
    getData () {
      this.loading = true
      this.searchForm.pageSize = this.pagesize
      this.searchForm.pageNo = this.currentPage
      postSalePageList(this.searchForm).then(res => {
        const data = res.body || {}
        this.tableData = data.content || []
        this.currentPage = data.pageNo || 1
        this.pagesize = data.pageSize || 5
        this.total = data.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    choose({saleSerialNo, goodsTitle, enableStatus}){
      const params = {
        saleSerialNo: saleSerialNo,
        goodsTitle: goodsTitle,
        enableStatus: enableStatus
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
  }
}
</style>
