import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted() {
    console.log('Rendering Doughnut: ', this.chartdata)
    this.renderChart(this.chartdata, this.options)
  }
}
