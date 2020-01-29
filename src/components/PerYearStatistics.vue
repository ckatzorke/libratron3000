<template>
  <div>
    Statistics for <v-combobox
                v-model="year"
                :items="years"
              ></v-combobox>
    <lib-yearstats :year="year"></lib-yearstats>
  </div>
</template>
<script>
import { toDate } from '@/service/utils.js'
import YearStats from '@/components/YearStats.vue'
export default {
  data() {
    return {
      year: new Date().getFullYear()
    }
  },
  components: {
    'lib-yearstats': YearStats
  },
  computed: {
    years() {
      let collection = this.$store.getters.getCollection
      return collection
        .filter(item => item.buydate)
        .map(item => toDate(item.buydate).getFullYear())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort()
    }
  },
  methods: {
  }
}
</script>
