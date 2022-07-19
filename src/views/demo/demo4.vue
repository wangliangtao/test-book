<template>
  <div
    id="demo4"
    class="maps"
  />
</template>

<script type="text/ecmascript-6">
import charts from './charts'
import AMap from 'AMap'
import mapMixin from '@/views/map/mapMixin'
import Vue from 'vue/dist/vue.esm.js'
export default {
  mixins: [mapMixin],
  data() {
    return {
      positions: [
        [120.618118, 31.136063],
        [120.678407,31.316892],
        [120.596783,31.147731],
        [120.621597,31.149998]
      ]
    }
  },
  mounted() {
    this.initMap('demo4').then(() => {
      // this.init1()
      // this.init2()
      let count = 0
      const time = setInterval(() => {
        // console.log(count);
        if (count >= this.positions.length) {
          console.log('end');
          clearInterval(time)
          // this.clearPolygons()
          // console.log(time);
          // setTimeout(time,2000)
        } else {
          this.init(this.positions[count], count)
          
          count += 1
        }
      }, 2000)
    })
  },
  methods: {
    init(pos, num) {
      console.log(num);
      let Content = Vue.extend({
        name: 'Charts',
        components: {
          'charts': charts
        },
        data(){
          return {
            // item: num
          }
        },
        template: `<charts id="charts${num}" :data="${num}"/>`
      });

      const component = new Content().$mount().$el;
      const position = new AMap.LngLat(...pos)
      const marker = new AMap.Marker({anchor: 'center',position, content: component})
      marker.setContent(component);
      this.map.add(marker)
      return num++
    }
  }
}
</script>

<style scoped lang="scss">
.maps {
  height: calc(100vh - 50px);
}
</style>