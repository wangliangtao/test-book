export default {
  props: {},
  data () {
    return {
      currentPage: 1, // 初始页
      pagesize: 10, // 每页数据
      total: 0 // 获取到的总数据量
    }
  },
  created () { },
  methods: {
    handleSizeChange (size) {
      // console.log(size) // 每页下拉显示数据
      this.pagesize = size
      this.currentPage = 1
      this.getData()
    },
    handleCurrentChange () {
      this.getData()
    }
  }
}
