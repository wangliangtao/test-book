<template>
  <div class="redStatistics-wrap">
    <section>
      <div class="header">
        <span>缴费总计</span>
      </div>
      <ul class="statistics-wrap row3">
        <li
          v-for="(item, index, key) in payTotalTitleList"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{
                payTotalTitleData[item.key] ||
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
        <span>缴费统计</span>
        <div class="serch-wrap">
          <el-date-picker
            v-model="payDayliyDate"
            type="daterange"
            align="right"
            unlink-panels
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
            @change="changePayDayliyDate"
          />
        </div>
      </div>
      <ul class="statistics-wrap row4">
        <li
          v-for="(item, index, key) in payDayliyTitleList"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{ payDayliyTitleData[item.key] || 0 | formatNumber(2, ',') }}
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
          @click="downloadPayDayliyChartData"
        >
          <svg-icon icon-class="icon_download" />下载图表
        </div>
        <chart
          :id="'paymentChart' + Date.now()"
          width="100%"
          height="400px"
          :data="payDayliyChartData"
          title="应缴金额"
        />
      </div>
    </section>
    <section>
      <div class="header">
        <span>用户行为统计</span>
        <div class="serch-wrap">
          <el-date-picker
            v-model="payDaliyUserDate"
            type="daterange"
            align="right"
            unlink-panels
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
            @change="changePayDaliyUserDate"
          />
        </div>
      </div>
      <ul class="statistics-wrap row3">
        <li
          v-for="(item, index, key) in payDaliyUserTitleList"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{
                payDaliyUserTitleData[item.key] ||
                  0 | formatNumber(...(item.filters || [2, ',']))
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
          @click="downloadpayDaliyUserChartData"
        >
          <svg-icon icon-class="icon_download" />下载图表
        </div>
        <chart
          :id="'chart' + Date.now()"
          width="100%"
          height="400px"
          :data="payDaliyUserChartData"
        />
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
import chart from './components/chart'
import { parkingPayTotal, parkingPayDayliy, parkingPayDayliyChart, parkingPayDaliyUser, parkingPayDayliyUserChart, parkingPayDayliyPayChart } from '@/api/reconciliation'
const excel = require('@/vendor/Export2Excel')
const oneDay = 3600 * 1000 * 24 // 一天的时间戳
export default {
  components: {
    chart
  },
  data () {
    return {
      payTotalTitleList: [ // 所有的支付金额统计
        { title: '应缴总额（¥）', key: 'totalAmount', iconClass: 'icon_should_pay_54' },
        { title: '实缴总额（¥）', key: 'realAmount', iconClass: 'icon_paid_in_54' },
        { title: '优惠总额（¥）', key: 'discountAmount', iconClass: 'icon_preferential_54' },
        { title: '抵扣总额（¥）', key: 'lebiAmount', iconClass: 'icon_deduction_54' },
        { title: '支付总笔数', key: 'orderNumber', iconClass: 'icon_number_54', filters: [0, ','] },
        { title: '支付总人数', key: 'userNumber', iconClass: 'icon_total_people_54', filters: [0, ','] }
      ],
      payTotalTitleData: {}, // 所有的支付金额统计数据
      payDayliyTitleList: [ // 支付金额总计
        { title: '应缴总额（¥）', key: 'totalAmount', iconClass: 'icon_should_pay_54' },
        { title: '实缴总额（¥）', key: 'realAmount', iconClass: 'icon_paid_in_54' },
        { title: '优惠总额（¥）', key: 'discountAmount', iconClass: 'icon_preferential_54' },
        { title: '抵扣总额（¥）', key: 'lebiAmount', iconClass: 'icon_deduction_54' }
      ],
      payDayliyTitleData: {}, // 支付金额总计数据
      payDayliyDate: [], // 支付金额总计日期
      payDayliyChartOriginData: {}, // 支付金额图表原始数据
      payDayliyChartData: { // 支付金额总计图表数据
        xData: [],
        yData: []
      },
      payDaliyUserTitleList: [ // 支付总数统计
        { title: '支付笔数', key: 'payNumber', iconClass: 'icon_number_54', filters: [0, ','] },
        { title: '支付用户数', key: 'userNumber', iconClass: 'icon_total_people_54', filters: [0, ','] }
      ],
      payDaliyUserTitleData: {}, // 支付总数统计数据
      payDaliyUserDate: [],  // 支付总数统计日期
      payDaliyUserChartOriginData: [], // 日支付数统计原始数据
      payDaliyUserChartData: { // 日支付数统计图表数据
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
      this.payDayliyDate = Object.values(params)
      this.payDaliyUserDate = Object.values(params)
      this.parkingPayTotal()
      this.getPayDay(params)
      this.getUserBeha(params)
    },
    // 所有的支付金额统计
    parkingPayTotal () {
      parkingPayTotal().then(res => {
        this.payTotalTitleData = res.body || {}
      })
    },
    // 支付金额总计及图表数据
    getPayDay (params) {
      parkingPayDayliy(params).then(res => {
        this.payDayliyTitleData = res.body || {}
      })
      parkingPayDayliyChart(params).then(res => {
        this.payDayliyChartOriginData = res.body || []
        const realAmount = [], discountAmount = [], lebiAmount = []
        this.payDayliyChartData.xData = []
        this.payDayliyChartOriginData.forEach((item, index) => {
          item.index = index + 1
          // 推入 x 轴数据
          this.payDayliyChartData.xData.push(item.computeDate)
          realAmount.push({
            value: item.realAmount || 0,
            color: ['#70CFFF', '#70ABFF'],
            name: '实缴金额',
            stack: '总量',
            all: item.totalAmount
          })
          discountAmount.push({
            value: item.discountAmount || 0,
            color: ['#F9CE4C', '#F9A54C'],
            name: '优惠金额',
            stack: '总量',
            all: item.discountAmount
          }),
            lebiAmount.push({
              value: item.lebiAmount || 0,
              color: ['#16D9A8', '#2BD97B'],
              name: '抵扣金额',
              stack: '总量',
              all: item.totalAmount
            })
        })
        this.payDayliyChartData.yData = [realAmount, discountAmount, lebiAmount]
      })
    },
    // 支付总数统计及图表数据
    getUserBeha (params) {
      parkingPayDaliyUser(params).then(res => {
        this.payDaliyUserTitleData = res.body || {}
      })
      Promise.all([parkingPayDayliyUserChart(params), parkingPayDayliyPayChart(params)]).then(res => {
        const data = res.map(item => item.body || [])
        this.payDaliyUserChartOriginData = []
        data.forEach(item => {
          item.forEach((v, k) => {
            !this.payDaliyUserChartOriginData[k] && (this.payDaliyUserChartOriginData[k] = {})
            this.payDaliyUserChartOriginData[k]['index'] = k + 1
            v.computeDate && (this.payDaliyUserChartOriginData[k].computeDate = v.computeDate);

            (v.payNumber || v.payNumber === 0) && (this.payDaliyUserChartOriginData[k].payNumber = v.payNumber);

            (v.userNumber || v.userNumber === 0) && (this.payDaliyUserChartOriginData[k].userNumber = v.userNumber)
          })
        })


        const payNumber = [], userNumber = []
        this.payDaliyUserChartData.xData = []
        this.payDaliyUserChartOriginData.forEach(item => {
          // 推入 x 轴数据
          this.payDaliyUserChartData.xData.push(item.computeDate)
          payNumber.push({
            value: item.payNumber || 0,
            color: ['#F9CE4C', '#F9A54C'],
            name: '支付笔数',
            yAxisIndex: 0
          })
          userNumber.push({
            value: item.userNumber || 0,
            color: ['#6DA9FF', '#6DA9FF'],
            name: '支付用户数',
            yAxisIndex: 1,
            type: 'line'
          })
        })
        this.payDaliyUserChartData.yData = [payNumber, userNumber]
      })
    },
    // 切换刷红包统计时间
    changePayDayliyDate (val) {
      const params = {
        beginTime: val[0],
        endTime: val[1]
      }
      this.getPayDay(params)
    },
    // 下载停车缴费统计数据
    downloadPayDayliyChartData () {
      const tHeader = ['序号', '缴费时间', '实缴金额', '优惠金额', '抵扣金额', '应缴金额']
      const filterVal = ['index', 'computeDate', 'realAmount', 'discountAmount', 'lebiAmount', 'totalAmount'] // tableData里对象的属性key值
      const data = this.formatJson(filterVal, this.payDayliyChartOriginData)
      excel.export_json_to_excel({
        header: tHeader, //表头 必填
        data, //具体数据 必填
        filename: `生活圈-停车缴费统计 ${this.$moment(this.payDayliyDate[0]).format('YYYY.MM.DD')}-${this.$moment(this.payDayliyDate[1]).format('YYYY.MM.DD')}` //非必填
      })
    },
    // 切换用户行为统计时间
    changePayDaliyUserDate (val) {
      const params = {
        beginTime: val[0],
        endTime: val[1]
      }
      this.getUserBeha(params)
    },
    // 下载用户行为统计数据
    downloadpayDaliyUserChartData () {
      const tHeader = ['序号', '缴费时间', '支付笔数', '支付用户数']
      const filterVal = ['index', 'computeDate', 'payNumber', 'userNumber'] // tableData里对象的属性key值
      const data = this.formatJson(filterVal, this.payDaliyUserChartOriginData)
      excel.export_json_to_excel({
        header: tHeader, //表头 必填
        data, //具体数据 必填
        filename: `生活圈-缴费行为统计 ${this.$moment(this.payDaliyUserDate[0]).format('YYYY.MM.DD')}-${this.$moment(this.payDaliyUserDate[1]).format('YYYY.MM.DD')}` //非必填
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
