<template>
  <div class="details">
    <lib-gamedetails :id="$route.params.id"/>
  </div>
</template>
<script>
import GameDetails from '@/components/GameDetails'

export default {
  components: {
    'lib-gamedetails': GameDetails
  }
}
</script>
