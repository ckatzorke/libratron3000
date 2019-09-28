<template>
  <div id="chart">Bla
  </div>
</template>
<script>
import ApexCharts from 'apexcharts'

let options = {
  chart: {
    type: 'line'
  },
  series: [{
    name: 'sales',
    data: [30,40,35,50,49,60,70,91,125]
  }],
  xaxis: {
    categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
  }
}


export default {
  components: {
  },
  data() {
    return {
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
        }, {}
        )
      let data = {
        datasets: [{
          data: []
        }],
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
    var chart = new ApexCharts(document.querySelector("#chart"), options)

    chart.render()

  }
}
</script>
