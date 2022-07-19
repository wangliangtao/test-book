export default {
  data () {
    return {
      timer: null
    }
  },
  methods: {
    setRegular (targetHour = '00:00', cb) {
      if (this.timer) clearInterval(this.timer)
      let targetList = targetHour.split(':')
      let timeInterval, nowTime, nowSeconds, targetSeconds
      nowTime = new Date()
      // 计算当前时间的秒数
      nowSeconds = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()
      // 计算目标时间对应的秒数
      targetSeconds = Number(targetList[0]) * 3600 + Number(targetList[1]) * 60
      //  判断是否已超过今日目标小时，若超过，时间间隔设置为距离明天目标小时的距离
      timeInterval = targetSeconds > nowSeconds ? targetSeconds - nowSeconds : targetSeconds + 24 * 3600 - nowSeconds
      this.timer = setTimeout(cb, timeInterval * 1000)
    }
  }
}