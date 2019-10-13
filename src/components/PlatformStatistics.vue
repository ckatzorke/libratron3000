<template>
  <div>
    <apexchart type="pie" :options="platformStats.options" :series="platformStats.data" ></apexchart>
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
    platformStats() {
      let gamesByPlatforms = this.$store.getters.getCollection
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
