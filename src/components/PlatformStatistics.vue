<template>
  <div>
    <lib-doughnut :chartdata="platformStats" />
  </div>
</template>
<script>
import Doughnut from '@/components/Doughnut'
export default {
  components: {
    'lib-doughnut': Doughnut
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
  }
}
</script>
