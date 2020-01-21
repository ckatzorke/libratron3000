<template>
  <div>
    <div class="hidden-xs-only">
      <apexchart type="pie" :options="platformStats.options" :series="platformStats.data" ></apexchart>
    </div>
    <div class="hidden-sm-and-up text-left">
      <ul>
        <li
          v-for="(value, name) in gamesByPlatform"
          :key="name">
          {{ name }} ({{ value }})
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    'apexchart': VueApexCharts
  },
  data() {
    return {
      options: {
        theme: {
          mode: 'dark'
        },
        legend: {
          show: true
        }
      }
    }
  },
  computed: {
    gamesByPlatform() {
      let gamesByPlatform = this.$store.getters.getCollection
        .map(game => game.platform)
        .reduce((acc, current) => {
          // console.log(`reducing. adding ${current}`, acc)
          if (!acc[current]) {
            acc[current] = 0
          }
          acc[current] += 1
          return {
            ...acc
          }
        }, {})
      return gamesByPlatform
    },
    platformStats() {
      let gamesByPlatforms = this.gamesByPlatform
      let dataset = {
        data: [],
        options: {
          labels: [],
          theme: {
            mode: 'dark'
          }
        }
      }
      for (const [platform, count] of Object.entries(gamesByPlatforms)) {
        console.log(`There are ${count} ${platform} games`)
        dataset.data.push(count)
        dataset.options.labels.push(platform)
      }
      return dataset
    }
  },
  mounted() {
  }
}
</script>
