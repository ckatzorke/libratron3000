<template>
  <v-container grid-list-xs>
    <v-layout row wrap justify-start>
      <v-flex xs12>
        <v-card  class="text-center fill-height">
          <v-card-title primary-title>
            <h3 class="headline mb-0">Games by Year</h3>
          </v-card-title>
          <v-card-text>
            <lib-peryear></lib-peryear>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PerYearStatistics from '@/components/PerYearStatistics'
export default {
  components: {
    'lib-peryear': PerYearStatistics
  },
  data() {
    return {

    }
  }
}
</script>
