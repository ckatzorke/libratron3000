<template>
  <div id="chart"></div>
</template>
<script>
import ApexCharts from 'apexcharts'

let options = {
  chart: {
    type: 'pie'
  },
  theme: {
    mode: 'dark'
  },
  legend: {
    show: true
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  series: [44, 55, 13, 43, 22],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          show: false
        }
      }
    }
  ]
}

export default {
  components: {},
  data() {
    return {}
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
      let data = {
        datasets: [
          {
            data: []
          }
        ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: []
      }
      for (const [platform, count] of Object.entries(gamesByPlatforms)) {
        console.log(`There are ${count} ${platform} games`)
        data.datasets[0].data.push(count)
        data.labels.push(platform)
      }
      return data
    }
  },
  mounted() {
    var chart = new ApexCharts(document.querySelector('#chart'), options)

    chart.render()
  }
}
</script>
