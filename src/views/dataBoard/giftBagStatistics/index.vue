<template>
  <div class="redStatistics-wrap">
    <section>
      <div class="header">
        <span>抽奖总计</span>
      </div>
      <ul class="statistics-wrap row3">
        <template v-for="(item, index, key) in list1">
          <li
            v-if="index < 3"
            :key="key"
          >
            <div class="left">
              <p class="subTitle">
                {{ item.title }}
              </p>
              <p class="count">
                {{
                  data1[item.key] ||
                    0 | formatNumber(...(item.filters || [0, ',']))
                }}
              </p>
            </div>
            <div class="right">
              <svg-icon :icon-class="item.iconClass" />
            </div>
          </li>
        </template>
      </ul>
      <ul class="statistics-wrap row4">
        <template v-for="(item, index, key) in list1">
          <li
            v-if="index >= 3"
            :key="key"
          >
            <div class="left">
              <p class="subTitle">
                {{ item.title }}
              </p>
              <p class="count">
                {{
                  data1[item.key] ||
                    0 | formatNumber(...(item.filters || [0, ',']))
                }}
              </p>
            </div>
            <div class="right">
              <svg-icon :icon-class="item.iconClass" />
            </div>
          </li>
        </template>
      </ul>
    </section>
    <section>
      <div class="header">
        <span>抽奖统计</span>
        <div class="serch-wrap">
          <el-date-picker
            v-model="lotteryDate"
            type="daterange"
            align="right"
            unlink-panels
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
            @change="changeLotteryDate"
          />
        </div>
      </div>
      <ul class="statistics-wrap row3">
        <li
          v-for="(item, index, key) in list2"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{ data2 || 0 | formatNumber(...(item.filters || [0, ','])) }}
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
          @click="downloadData2"
        >
          <svg-icon icon-class="icon_download" />下载图表
        </div>
        <chart
          :id="'chart1' + Date.now()"
          width="100%"
          height="400px"
          :data="data2ChartData"
        />
      </div>
      <ul class="statistics-wrap row3">
        <li
          v-for="(item, index, key) in list3"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{
                data3[item.key] ||
                  0 | formatNumber(...(item.filters || [0, ',']))
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
          @click="downloadData3"
        >
          <svg-icon icon-class="icon_download" />下载图表
        </div>
        <chart
          :id="'chart2' + Date.now()"
          width="100%"
          height="400px"
          :data="data3ChartData"
        />
      </div>
    </section>
    <section>
      <div class="header">
        <span>中奖统计</span>
        <div class="serch-wrap">
          <el-date-picker
            v-model="awardDate"
            type="daterange"
            align="right"
            unlink-panels
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
            @change="changeAwardDate"
          />
        </div>
      </div>
      <ul class="statistics-wrap row3">
        <li
          v-for="(item, index, key) in list4"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{
                data4[item.key] ||
                  0 | formatNumber(...(item.filters || [0, ',']))
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
          @click="downloadData4"
        >
          <svg-icon icon-class="icon_download" />下载图表
        </div>
        <chart
          :id="'chart3' + Date.now()"
          width="100%"
          height="400px"
          :data="data4ChartData"
        />
      </div>
    </section>
    <section>
      <div class="header">
        <span>核销统计</span>
        <div class="serch-wrap">
          <el-date-picker
            v-model="writeOffDate"
            type="daterange"
            align="right"
            unlink-panels
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
            @change="changeWriteOffDate"
          />
        </div>
      </div>
      <ul class="statistics-wrap row3">
        <li
          v-for="(item, index, key) in list5"
          :key="key"
        >
          <div class="left">
            <p class="subTitle">
              {{ item.title }}
            </p>
            <p class="count">
              {{
                data5[item.key] ||
                  0 | formatNumber(...(item.filters || [0, ',']))
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
          @click="downloadData5"
        >
          <svg-icon icon-class="icon_download" />下载图表
        </div>
        <chart
          :id="'chart4' + Date.now()"
          width="100%"
          height="400px"
          :data="data5ChartData"
        />
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
import chart from './components/chart'
import { getRuleStatisticsHeader, getRecoverLebiNum, getRecoverLebiChart, getRuleLotteryNum, getRuleLotteryChart, getRuleAwardNum, getRuleAwardChart, getRuleWriteOffNum, getRuleWriteOffChart } from '@/api/admin'
const excel = require('@/vendor/Export2Excel')
const oneDay = 3600 * 1000 * 24 // 一天的时间戳
const yAxisConfig = [
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
export default {
  components: {
    chart
  },
  data () {
    return {
      list1: [ // 抽奖总计
        { title: '回收乐币总数', key: 'recoveryLebi', iconClass: 'icon_recycle_54' },
        { title: '抽奖总次数', key: 'lotteryTimes', iconClass: 'icon_lucky_draw_people_54' },
        { title: '抽奖总人数', key: 'lotteryPersonNum', iconClass: 'icon_lucky_draw_time_54' },
        { title: '中奖总次数', key: 'awardTimes', iconClass: 'icon_winning_people_54' },
        { title: '中奖总人数', key: 'awardPersonNum', iconClass: 'icon_winning_time_54' },
        { title: '核销总次数', key: 'writeOffTimes', iconClass: 'icon_verification_people_54' },
        { title: '核销总人数', key: 'writeOffPersonNum', iconClass: 'icon_verification_time_54' },
      ],
      data1: {}, // 抽奖总计数据

      list2: [ // 回收乐币数量
        { title: '回收乐币数量', key: 'recoverLebi', iconClass: 'icon_recycle_54' }
      ],
      data2: {}, // 回收乐币数量总计
      data2ChartOrginData: [], // 回收乐币数量原始数据
      data2ChartData: { // 回收乐币数量图表数据
        xData: [],
        yData: []
      },

      lotteryDate: [], // 抽奖统计日期
      list3: [ // 抽奖次数及人数
        { title: '抽奖次数', key: 'lotteryTimes', iconClass: 'icon_lucky_draw_people_54' },
        { title: '抽奖人数', key: 'lotteryPersonNum', iconClass: 'icon_lucky_draw_time_54' }
      ],
      data3: {}, // 抽奖次数及人数总计
      data3ChartOrginData: [], // 抽奖次数及人数原始数据
      data3ChartData: { // 抽奖次数及人数图表数据
        xData: [],
        yData: [],
        yAxis: yAxisConfig
      },
      awardDate: [], // 中奖统计时间
      list4: [
        { title: '中奖次数', key: 'awardTimes', iconClass: 'icon_winning_people_54' },
        { title: '中奖人数', key: 'awardPersonNum', iconClass: 'icon_winning_time_54' }
      ],
      data4: {}, // 中奖统计数据
      data4ChartOrginData: [], // 中奖统计数据原始数据
      data4ChartData: { // 中奖统计数据图表数据
        xData: [],
        yData: [],
        yAxis: yAxisConfig
      },

      writeOffDate: [], // 核销统计时间
      list5: [
        { title: '核销次数', key: 'writeOffTimes', iconClass: 'icon_verification_people_54' },
        { title: '核销人数', key: 'writeOffPersonNum', iconClass: 'icon_verification_time_54' }
      ],
      data5: {}, // 核销统计数据
      data5ChartOrginData: [], // 核销统计数据原始数据
      data5ChartData: { // 核销统计数据图表数据
        xData: [],
        yData: [],
        yAxis: yAxisConfig
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
      const params = [
        new Date().getTime() - oneDay * 31,
        new Date().getTime() - oneDay
      ]
      this.lotteryDate = params
      this.awardDate = params
      this.writeOffDate = params
      this.getRuleStatisticsHeader()
      this.getRecoverLebi(this.lotteryDate)
      this.getRuleLottery(this.lotteryDate)
      this.getRuleAward(this.awardDate)
      this.getRuleWriteOff(this.writeOffDate)
    },

    // 抽奖总计
    getRuleStatisticsHeader () {
      getRuleStatisticsHeader().then(res => {
        this.data1 = res.body || {}
      })
    },
    // 回收乐币数量及图表数据
    getRecoverLebi (params) {
      getRecoverLebiNum(...params).then(res => {
        this.data2 = res.body || 0
      })
      getRecoverLebiChart(...params).then(res => {
        this.data2ChartOrginData = res.body || []
        const recoverLebi = []
        this.data2ChartData.xData = []
        this.data2ChartOrginData.forEach((item, index) => {
          item.index = index + 1
          // 推入 x 轴数据
          this.data2ChartData.xData.push(item.computeDate)
          recoverLebi.push({
            value: item.recoverLebi || 0,
            color: ['#16D9A8', '#2BD97B'],
            name: '回收乐币数量'
          })
        })
        this.data2ChartData.yData = [recoverLebi]
      })
    },
    // 下载回收乐币数量数据
    downloadData2 () {
      const tHeader = ['序号', '回收时间', '回收乐币数量(个)']
      const filterVal = ['index', 'computeDate', 'recoverLebi'] // tableData里对象的属性key值
      const data = this.formatJson(filterVal, this.data2ChartOrginData)
      excel.export_json_to_excel({
        header: tHeader, //表头 必填
        data, //具体数据 必填
        filename: `生活圈-回收乐币统计 ${this.$moment(this.lotteryDate[0]).format('YYYY.MM.DD')}-${this.$moment(this.lotteryDate[1]).format('YYYY.MM.DD')}` //非必填
      })
    },
    // 抽奖人数和次数及图表数据
    getRuleLottery (params) {
      getRuleLotteryNum(...params).then(res => {
        this.data3 = res.body || {}
      })
      getRuleLotteryChart(...params).then(res => {
        this.data3ChartOrginData = res.body || []
        const lotteryTimes = [], lotteryPersonNum = []
        this.data3ChartData.xData = []
        this.data3ChartOrginData.forEach((item, index) => {
          item.index = index + 1
          // 推入 x 轴数据
          this.data3ChartData.xData.push(item.computeDate)
          lotteryTimes.push({
            value: item.lotteryTimes || 0,
            color: ['#70CFFF', '#70ABFF'],
            name: '抽奖次数',
            yAxisIndex: 0
          })
          lotteryPersonNum.push({
            value: item.lotteryPersonNum || 0,
            color: ['#F9A54C', '#F9A54C'],
            name: '抽奖人数',
            yAxisIndex: 1,
            type: 'line'
          })
        })
        this.data3ChartData.yData = [lotteryTimes, lotteryPersonNum]
      })
    },
    // 下载抽奖人数和次数数据
    downloadData3 () {
      const tHeader = ['序号', '抽奖时间', '抽奖次数(次)', '抽奖人数(人)']
      const filterVal = ['index', 'computeDate', 'lotteryTimes', 'lotteryPersonNum'] // tableData里对象的属性key值
      const data = this.formatJson(filterVal, this.data3ChartOrginData)
      excel.export_json_to_excel({
        header: tHeader, //表头 必填
        data, //具体数据 必填
        filename: `生活圈-抽奖统计 ${this.$moment(this.lotteryDate[0]).format('YYYY.MM.DD')}-${this.$moment(this.lotteryDate[1]).format('YYYY.MM.DD')}` //非必填
      })
    },

    // 中奖统计及图表数据
    getRuleAward (params) {
      getRuleAwardNum(...params).then(res => {
        this.data4 = res.body || {}
      })
      getRuleAwardChart(...params).then(res => {
        this.data4ChartOrginData = res.body || []
        const awardTimes = [], awardPersonNum = []
        this.data4ChartData.xData = []
        this.data4ChartOrginData.forEach((item, index) => {
          item.index = index + 1
          // 推入 x 轴数据
          this.data4ChartData.xData.push(item.computeDate)
          awardTimes.push({
            value: item.awardTimes || 0,
            color: ['#F9CE4C', '#F9A54C'],
            name: '中奖次数',
            yAxisIndex: 0
          })
          awardPersonNum.push({
            value: item.awardPersonNum || 0,
            color: ['#FF7566', '#FF7566'],
            name: '中奖人数',
            yAxisIndex: 1,
            type: 'line'
          })
        })
        this.data4ChartData.yData = [awardTimes, awardPersonNum]
      })
    },
    // 中奖数据
    downloadData4 () {
      const tHeader = ['序号', '中奖时间', '中奖次数(次)', '中奖人数(人)']
      const filterVal = ['index', 'computeDate', 'awardTimes', 'awardPersonNum'] // tableData里对象的属性key值
      const data = this.formatJson(filterVal, this.data4ChartOrginData)
      excel.export_json_to_excel({
        header: tHeader, //表头 必填
        data, //具体数据 必填
        filename: `生活圈-中奖统计 ${this.$moment(this.awardDate[0]).format('YYYY.MM.DD')}-${this.$moment(this.awardDate[1]).format('YYYY.MM.DD')}` //非必填
      })
    },

    // 核销统计及图表数据
    getRuleWriteOff (params) {
      getRuleWriteOffNum(...params).then(res => {
        this.data5 = res.body || {}
      })
      getRuleWriteOffChart(...params).then(res => {
        this.data5ChartOrginData = res.body || []
        const writeOffTimes = [], writeOffPersonNum = []
        this.data5ChartData.xData = []
        this.data5ChartOrginData.forEach((item, index) => {
          item.index = index + 1
          // 推入 x 轴数据
          this.data5ChartData.xData.push(item.computeDate)
          writeOffTimes.push({
            value: item.writeOffTimes || 0,
            color: ['#16D9A8', '#2BD97B'],
            name: '核销次数',
            yAxisIndex: 0
          })
          writeOffPersonNum.push({
            value: item.writeOffPersonNum || 0,
            color: ['#6DA9FF', '#6DA9FF'],
            name: '核销人数',
            yAxisIndex: 1,
            type: 'line'
          })
        })
        this.data5ChartData.yData = [writeOffTimes, writeOffPersonNum]
      })
    },
    // 核销数据
    downloadData5 () {
      const tHeader = ['序号', '核销时间', '核销次数(次)', '核销人数(人)']
      const filterVal = ['index', 'computeDate', 'writeOffTimes', 'writeOffPersonNum'] // tableData里对象的属性key值
      const data = this.formatJson(filterVal, this.data5ChartOrginData)
      excel.export_json_to_excel({
        header: tHeader, //表头 必填
        data, //具体数据 必填
        filename: `生活圈-核销统计 ${this.$moment(this.writeOffDate[0]).format('YYYY.MM.DD')}-${this.$moment(this.writeOffDate[1]).format('YYYY.MM.DD')}` //非必填
      })
    },

    // 切换抽奖统计
    changeLotteryDate (val) {
      this.getRecoverLebi(val)
      this.getRuleLottery(val)
    },
    // 切换中奖统计
    changeAwardDate (val) {
      this.getRuleAward(val)
    },
    // 切换核销统计
    changeWriteOffDate (val) {
      this.getRuleWriteOff(val)
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
