<template>
  <div class="statistics">
    <lib-platformstats></lib-platformstats>
  </div>
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
