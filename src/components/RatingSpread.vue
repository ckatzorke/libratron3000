<template>
  <v-container class="">
    <v-row>
      <v-col
        cols="12"
      >
        <div
          class="pa-2"
        >
          <apexchart type="bar" :options="options" :series="ratingSpread"></apexchart>
        </div>
      </v-col>
    </v-row>
  </v-container>
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
        chart: {
          id: 'rating-spread'
        },
        theme: {
          mode: 'dark'
        },
        legend: {
          show: false
        },

        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              position: 'bottom'
            }
          }
        }
      }
    }
  },
  props: ['year'],
  computed: {
    ratingSpread() {
      let collection = this.$store.getters.getCollection
      let ratingSpread = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      collection.filter(game => game.rating)
        .forEach(item => {
          ratingSpread[item.rating]++
        })
      console.log('RatingSpread:', ratingSpread)
      return [{
        data: ratingSpread
      }]
    }
  },
  methods: {
  }
}
</script>
