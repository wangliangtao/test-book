<template>
  <div
    id="demo3"
    class="maps"
  />
</template>

<script type="text/ecmascript-6">
import mapMixin from '@/views/map/mapMixin'
import Loca from 'Loca'
import wangge from './wangge'
import { areaColors } from '@/views/map/mapIconStyles'
export default {
  mixins: [mapMixin],
  data () {
    return {

    }
  },
  mounted () {
    this.initMap('demo3').then(() => {
      this.aaa()
      this.init()
    })
  },
  methods: {
    // 网格图
    // 可以动态调大小、颜色
    // 数据上没有聚合效果，一个数据就是一个点
    init () {
      var layer = new Loca.GridLayer({
        map: this.map,
        fitView: true
      });

      layer.setData(wangge, {
        lnglat: function (obj) {
          var val = obj.value;
          return [val['lng'], val['lat']]
        },
        value: 'count',
        // type: 'tsv'
      });

      layer.setOptions({
        unit: 'px',
        mode: 'count',
        style: {
          color: ['#A6CBFF', '#80B5FF', '#599EFF', '#3388FF', '#0D72FF'],
          radius: 17,
          opacity: 1,
          gap: 2,
          height: [0, 0],
          text: {
            content: function (v) {
              return v.value.count;
            },
            direction: 'center',  // 文字方位
            //offset: [2, -5],  // 偏移大小
            fontSize: 12,  // 文字大小
            fillColor: '#fff',
            strokeColor: 'rgba(255,255,255,0)',  // 文字描边颜色
            strokeWidth: 0,  // 文字描边宽度
          }
        }
      });
      layer.render();
    },
    aaa () {
      this.getCoordinates('山东省').then(res => {
        res.districtList.forEach(item => {
          item.districtList.forEach((cItem, index) => {
            const style = {
              strokeWeight: 6,
              strokeColor: '#99C4FF',
              fillColor: areaColors[index] || areaColors[0],
              fillOpacity: 0,
              strokeStyle: 'dashed',
              zIndex: -1
            }
            this.getCoordinates(cItem.adcode).then(data => {
              this.setLayers(data.districtList[0], style).then(() => {
                // this.layersData.push(cRes)
              })
            })
          })
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.maps {
  height: calc(100vh - 50px);
}
</style>
