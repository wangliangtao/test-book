<template>
  <div
    id="demo1"
    class="maps"
  />
</template>

<script type="text/ecmascript-6">
import mapMixin from '@/views/map/mapMixin'
import Loca from 'Loca'
import fengwo from './fengwo'
export default {
  mixins: [mapMixin],
  data() {
    return {
      
    }
  },
  mounted() {
    this.initMap('demo1').then(() => {
      this.init()
    })
  },
  methods: {
    // 蜂窝热力图
    // 可以动态调颜色、文字
    // 相对sum(值求和)、max(最大值)、min(最小值)、mean(平均值)、median(中位数)、count(个数)聚合
    init() {
      var layer = new Loca.HexagonLayer({
        map: this.map,
        fitView: true
      });
      layer.setData(fengwo, {
        lnglat: function (obj) {
          var val = obj.value;
          return [val['lng'], val['lat']]
        },
        value: 'count',
      });

      layer.setOptions({
          mode: 'count',
          unit: 'meter',
          style: {
            color: ['#0868AC', '#43A2CA', '#43A2CA', '#7BCCC4', '#BAE4BC', '#F0F9E8', '#F0F9E8'],
            // color: e => {
            //   console.log(e);
            //   return '#BAE4BC'
            // },
            radius: 5000,
            opacity: 0.9,
            // gap: 300,
            height: [0, 100000],
            text: {
              content: 10,
              direction: 'center',  // 文字方位 
              //offset: [2, -5],  // 偏移大小
              fontSize: 12,  // 文字大小
              fillColor: '#03101F',
              strokeColor: 'rgba(255,255,255,0)',  // 文字描边颜色
              strokeWidth: 0,  // 文字描边宽度
            }
          }
      });
      layer.render();
    }
  }
}
</script>

<style scoped lang="scss">
.maps {
  height: calc(100vh - 50px);
}
</style>