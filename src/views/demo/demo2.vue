<template>
  <div
    id="demo2"
    class="maps"
  />
</template>

<script type="text/ecmascript-6">
import mapMixin from '@/views/map/mapMixin'
import Loca from 'Loca'
import qipao from './qipao'
export default {
  mixins: [mapMixin],
  data() {
    return {
      
    }
  },
  mounted() {
    this.initMap('demo2').then(() => {
      this.init()
    })
  },
  methods: {
    // 圆点图
    // 可以动态调大小、颜色
    // 数据上没有聚合效果，一个数据就是一个点
    init() {
      var layer = new Loca.RoundPointLayer({
        map: this.map,
        fitView: true
      });
      layer.setData(qipao, {
        lnglat: data => {
          var item = data.value;
          return [item.lng, item.lat]
        }
      });

      layer.setOptions({
        style: {
          radius: 100,
          color: function (data) {
            var item = data.value;
            var mag = item.mag;
            console.log(mag);
            if (mag > 7) {
                return '#82cf9c';
            } else if (mag <= 7 && mag >= 5.5) {
                return '#10b3b0';
            } else {
                return '#2033ab';
            }
          },
          opacity: 0.84,
          borderWidth: 0,
          borderColor: '#eee',
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