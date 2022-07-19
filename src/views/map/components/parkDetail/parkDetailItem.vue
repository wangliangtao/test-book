<template>
  <div class="data-wrap">
    <ul class="fontData">
      <li
        v-for="(item,index,key) in data.data"
        :key="key"
      >
        <div
          class="count moneyFont"
          :style="`color:${item.valueColor}`"
        >
          <template v-if="item.format">
            {{ item.value | formatNumber(0, ',') }}
          </template>
          <template v-else>
            {{ item.value + item.tail }}
          </template>
        </div>
        <div class="label">
          {{ item.label }}
        </div>
      </li>
    </ul>
    <miniPie
      :id="chartsData.id"
      class="chart"
      :data="chartsData"
      width="100%"
      height="100%"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import miniPie from './miniPie'
export default {
  components: {
    miniPie
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          data: [],
          chartsData: {
            id: ''
          }
        }
      }
    }
  },
  computed: {
    chartsData() {
      return this.data.chartsData
    }
  }
}
</script>

<style scoped lang="scss">
.data-wrap {
  display: flex;
  padding: 20px;
  height: 166px;
  .fontData {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    li:nth-of-type(n+3) {
      margin-top: 20px;
    }
    li {
      flex: 0 0 50%;
      text-align: center;
      .count {
        font-size: 24px;
        font-weight: bold;
      }
      .label {
        margin-top: 4px;
        font-size: 12px;
        color: $mapFontColorDefault1-1;
      }
    }
  }
  .chart{
    flex: 1;
  }
}
</style>