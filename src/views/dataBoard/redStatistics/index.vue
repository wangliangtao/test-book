<template>
  <div class="redStatistics-wrap">
    <section>
      <div class="header">
        <span>刷红包总计</span>
      </div>
      <ul class="statistics-wrap row3">
        <li
          v-for="(item, index, key) in PCRPSumList"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{
                PCRPSumData[item.key] ||
                  0 | formatNumber(...(item.filters || [2, ',']))
              }}
            </p>
          </div>
          <div class="right">
            <svg-icon :icon-class="item.iconClass" />
          </div>
        </li>
      </ul>
    </section>
    <section>
      <div class="header">
        <span>刷红包统计</span>
        <div class="serch-wrap">
          <el-date-picker
            v-model="PCRPDate"
            type="daterange"
            align="right"
            unlink-panels
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
            @change="changePCRPDate"
          />
        </div>
      </div>
      <ul class="statistics-wrap row3">
        <li
          v-for="(item, index, key) in PCRPList"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{ PCRPTitleData[item.key] || 0 | formatNumber(2, ',') }}
            </p>
          </div>
          <div class="right">
            <svg-icon :icon-class="item.iconClass" />
          </div>
        </li>
      </ul>
      <div class="chart-wrap">
        <div
          class="download"
          @click="downloadPCRPData"
        >
          <svg-icon icon-class="icon_download" />下载图表
        </div>
        <chart
          :id="'paymentChart' + Date.now()"
          width="100%"
          height="400px"
          :data="PCRPChartData"
          title="商家消耗乐币数"
        />
      </div>
    </section>
    <section>
      <div class="header">
        <span>用户行为统计</span>
        <div class="serch-wrap">
          <el-date-picker
            v-model="UserBehaDate"
            type="daterange"
            align="right"
            unlink-panels
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
            @change="changeUserBehaDate"
          />
        </div>
      </div>
      <ul class="statistics-wrap row3">
        <li
          v-for="(item, index, key) in UserBehaList"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{
                UserBehaTitleData[item.key] ||
                  0 | formatNumber(...(item.filters || [2, 0]))
              }}
            </p>
          </div>
          <div class="right">
            <svg-icon :icon-class="item.iconClass" />
          </div>
        </li>
      </ul>
      <div class="chart-wrap">
        <div
          class="download"
          @click="downloadUserBehaData"
        >
          <svg-icon icon-class="icon_download" />下载图表
        </div>
        <chart
          :id="'chart' + Date.now()"
          width="100%"
          height="400px"
          :data="UserBehaChartData"
        />
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
import chart from './components/chart'
import { getComputePCRPSum, getComputePCRP, getComputePCRPChart, getComputeUserBeha, getComputeBrowseTimesChart, getComputeBrowsePersonNumChart } from '@/api/rp'
const excel = require('@/vendor/Export2Excel')
const oneDay = 3600 * 1000 * 24 // 一天的时间戳
export default {
  components: {
    chart
  },
  data () {
    return {
      PCRPSumList: [ // 刷红包总计
        { title: '商家消耗乐币总数', key: 'merchantConsumeSum', iconClass: 'icon_merchants_54' },
        { title: '用户获取乐币总数', key: 'userVariationSum', iconClass: 'icon_user_54' },
        { title: '系统回收乐币总数', key: 'drawSum', iconClass: 'icon_recycle_54' },
        { title: '广告观看总次数', key: 'manCoinBrowseTimesInfoSum', iconClass: 'icon_watch_54', filters: [0, ','] },
        { title: '抢红包人数', key: 'manUserNumSum', iconClass: 'icon_red_54', filters: [0, ','] },
      ],
      PCRPSumData: {}, // 刷红包总计数据
      PCRPList: [ // 刷红包统计三个总数
        { title: '商家消耗乐币数', key: 'consumeSum', iconClass: 'icon_merchants_54' },
        { title: '用户获取乐币数', key: 'userVariationSum', iconClass: 'icon_user_54' },
        { title: '系统回收乐币数', key: 'drawSum', iconClass: 'icon_recycle_54' }
      ],
      PCRPTitleData: {}, // 刷红包统计三个总数数据
      PCRPData: {}, // 刷红包统计图表原始数据
      PCRPDate: [], // 刷红包统计日期
      PCRPChartData: { // 刷红包统计图表数据
        xData: [],
        yData: []
      },
      UserBehaList: [ // 用户行为统计总数
        { title: '广告观看次数', key: 'manCoinBrowseTimesInfoSum', iconClass: 'icon_watch_54', filters: [0, ','] },
        { title: '抢红包人数', key: 'manUserNumSum', iconClass: 'icon_red_54', filters: [0, ','] }
      ],
      UserBehaTitleData: {}, // 用户行为统计总数数据
      UserBehaDate: [],  // 用户行为统计日期
      UserBehaData: [], // 用户行为统计原始数据
      UserBehaChartData: { // 用户行为统计图表数据
        xData: [],
        yData: [],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#979BA0'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff', // x坐标轴的轴线颜色
                width: 0 //这里是坐标轴的宽度,为0就是不显示
              }
            },
            splitLine: {
              lineStyle: {
                color: '#F1F2F3'
              }
            }
          },
          {
            type: 'value',
            axisLabel: {
              color: '#979BA0'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff', // x坐标轴的轴线颜色
                width: 0 //这里是坐标轴的宽度,为0就是不显示
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#F1F2F3'
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    pickerOptions () {
      let _this = this
      return {
        shortcuts: [{
          text: '最近31天',
          onClick (picker) {
            const end = new Date()
            end.setTime(end.getTime() - oneDay)
            const start = new Date()
            start.setTime(start.getTime() - oneDay * 31)
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate (time) {
          const times = oneDay * 30//30天的毫秒数
          let curSelectTime = new Date(_this.minDate).getTime()
          let before = curSelectTime - times//前30天毫秒数
          let after = curSelectTime + times//后30天毫秒数
          return time.getTime() > after || time.getTime() < before || time.getTime() > Date.now() - 8.64e7
        },
        onPick ({ maxDate, minDate }) {
          if (!maxDate) {
            _this.minDate = minDate
          }
        }
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      const params = {
        beginTime: new Date().getTime() - oneDay * 31,
        endTime: new Date().getTime() - oneDay
      }
      this.PCRPDate = Object.values(params)
      this.UserBehaDate = Object.values(params)
      this.getPCRPSum()
      this.getPCRP(params)
      this.getUserBeha(params)
    },
    // PC刷红包总计
    getPCRPSum () {
      getComputePCRPSum().then(res => {
        this.PCRPSumData = res.body || {}
      })
    },
    // 刷红包统计三个总数及图表数据
    getPCRP (params) {
      getComputePCRP(params).then(res => {
        this.PCRPTitleData = res.body || {}
      })
      getComputePCRPChart(params).then(res => {
        this.PCRPData = res.body || []
        const userVariationSum = [], drawSum = []
        this.PCRPChartData.xData = []
        this.PCRPData.forEach((item, index) => {
          item.index = index + 1
          // 推入 x 轴数据
          this.PCRPChartData.xData.push(item.computeDate)
          userVariationSum.push({
            value: item.userVariationSum || 0,
            color: ['#F9CE4C', '#F9A54C'],
            name: '用户获取乐币数',
            stack: '总量',
            all: item.consumeSum
          })
          drawSum.push({
            value: item.drawSum || 0,
            color: ['#16D9A8', '#2BD97B'],
            name: '系统回收乐币数',
            stack: '总量',
            all: item.consumeSum
          })
        })
        this.PCRPChartData.yData = [userVariationSum, drawSum]
      })
    },
    // 用户行为统计总数及图表数据
    getUserBeha (params) {
      getComputeUserBeha(params).then(res => {
        this.UserBehaTitleData = res.body || {}
      })
      Promise.all([getComputeBrowseTimesChart(params), getComputeBrowsePersonNumChart(params)]).then(res => {
        const data = res.map(item => item.body || [])
        this.UserBehaData = []
        data.forEach(item => {
          item.forEach((v, k) => {
            !this.UserBehaData[k] && (this.UserBehaData[k] = {})
            this.UserBehaData[k]['index'] = k + 1
            v.computeDate && (this.UserBehaData[k].computeDate = v.computeDate);

            (v.browseTimes || v.browseTimes === 0) && (this.UserBehaData[k].browseTimes = v.browseTimes);

            (v.userNum || v.userNum === 0) && (this.UserBehaData[k].userNum = v.userNum)
          })
        })


        const browseTimes = [], userNum = [], maxData = []
        this.UserBehaChartData.xData = []
        this.UserBehaData.forEach(item => {
          // 推入 x 轴数据
          this.UserBehaChartData.xData.push(item.computeDate)
          browseTimes.push({
            value: item.browseTimes || 0,
            color: ['#16D9A8', '#2BD97B'],
            name: '广告观看次数',
            yAxisIndex: 0
          })
          userNum.push({
            value: item.userNum || 0,
            color: ['#FF7566', '#FF7566'],
            name: '抢红包人数',
            yAxisIndex: 1,
            type: 'line'
          })
          maxData.push(item.userNum || 0)
        })
        this.UserBehaChartData.yData = [browseTimes, userNum]
      })
    },
    // 切换刷红包统计时间
    changePCRPDate (val) {
      const params = {
        beginTime: val[0],
        endTime: val[1]
      }
      this.getPCRP(params)
    },
    // 下载刷红包统计数据
    downloadPCRPData () {
      const tHeader = ['序号', '刷红包时间', '商家消耗乐币数量', '用户获取乐币数量', '系统回收乐币数量']
      const filterVal = ['index', 'computeDate', 'consumeSum', 'userVariationSum', 'drawSum'] // tableData里对象的属性key值
      const data = this.formatJson(filterVal, this.PCRPData)
      excel.export_json_to_excel({
        header: tHeader, //表头 必填
        data, //具体数据 必填
        filename: `生活圈-刷红包统计 ${this.$moment(this.PCRPDate[0]).format('YYYY.MM.DD')}-${this.$moment(this.PCRPDate[1]).format('YYYY.MM.DD')}` //非必填
      })
    },
    // 切换用户行为统计时间
    changeUserBehaDate (val) {
      const params = {
        beginTime: val[0],
        endTime: val[1]
      }
      this.getUserBeha(params)
    },
    // 下载用户行为统计数据
    downloadUserBehaData () {
      const tHeader = ['序号', '刷红包时间', '广告观看次数', '抢红包人数']
      const filterVal = ['index', 'computeDate', 'browseTimes', 'userNum'] // tableData里对象的属性key值
      const data = this.formatJson(filterVal, this.UserBehaData)
      excel.export_json_to_excel({
        header: tHeader, //表头 必填
        data, //具体数据 必填
        filename: `生活圈-刷红包行为统计 ${this.$moment(this.UserBehaDate[0]).format('YYYY.MM.DD')}-${this.$moment(this.UserBehaDate[1]).format('YYYY.MM.DD')}` //非必填
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(item => v[item]))
    }
  }
}
</script>

<style scoped lang="scss">
.redStatistics-wrap {
  & > section {
    @include page-wrap;
    & > .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > span {
        font-size: 16px;
        color: $title;
        font-weight: bold;
      }
      .serch-wrap {
      }
    }
    .statistics-wrap {
      display: flex;
      flex-wrap: wrap;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        margin-top: 20px;
        background-color: #fff;
        box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        .left {
          p + p {
            margin-top: 5px;
          }
          .subTitle {
            font-size: 12px;
            color: $subTitle;
          }
          .count {
            font-weight: bold;
            font-size: 24px;
            color: $title;
          }
        }
        .right {
          font-size: 54px;
        }
      }
      &.row3 {
        li {
          flex: 0 0 33%;
          margin-right: 0.5%;
        }
        li:nth-of-type(3n) {
          margin-right: 0;
        }
      }
      &.row4 {
        li {
          flex: 0 0 24.5%;
          margin-right: 0.6666666%;
        }
        li:nth-of-type(4n) {
          margin-right: 0;
        }
      }
    }
    .chart-wrap {
      position: relative;
      margin-top: 20px;
      .download {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 12px;
        color: $c2;
        cursor: pointer;
        z-index: 100;
      }
    }
  }
}
</style>
