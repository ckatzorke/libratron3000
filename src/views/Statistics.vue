<template>
  <v-container grid-list-xs>
    <v-layout row wrap px-2 justify-start>
      <v-flex xs12 sm6>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Games by Platform</h3>
              <lib-platformstats></lib-platformstats>
            </div>
          </v-card-title>
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
