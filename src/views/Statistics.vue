<template>
  <v-container grid-list-xs>
    <v-layout row wrap px-2 justify-start>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">Games by Platform</h3>
          </v-card-title>
          <v-card-text>
            <lib-platformstats></lib-platformstats>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PlatformStatistics from '@/components/PlatformStatistics'

export default {
  components: {
    'lib-platformstats': PlatformStatistics
  },
  data() {
    return {

    }
  }
}
</script>
