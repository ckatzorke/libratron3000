<template>
  <v-container grid-list-xs>
    <v-layout row wrap px-2 justify-start>
      <v-flex xs12>
        <v-card  class="text-center pa-1 fill-height">
          <v-card-title primary-title>
            <h3 class="headline mb-0">Games by Platform</h3>
          </v-card-title>
          <v-card-text>
            <lib-platformstats></lib-platformstats>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap px-2 justify-start>
      <v-flex xs12>
        <v-card  class="text-center pa-1 fill-height">
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
import PlatformStatistics from '@/components/PlatformStatistics'
import PerYearStatistics from '@/components/PerYearStatistics'
export default {
  components: {
    'lib-platformstats': PlatformStatistics,
    'lib-peryear': PerYearStatistics
  },
  data() {
    return {

    }
  }
}
</script>
