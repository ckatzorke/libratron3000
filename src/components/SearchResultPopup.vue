<template>
  <v-dialog v-model="show">
    <div class="searchresultpopup">
      <lib-searchresult :searchResults="searchResults" @entrySelected="selectEntry"></lib-searchresult>
    </div>
  </v-dialog>
</template>
<script>
import SearchResult from '@/components/IgdbSearchResult'

export default {
  data() {
    return {
    }
  },
  props: ['searchResults', 'show'],
  components: {
    'lib-searchresult': SearchResult
  },
  methods: {
    selectEntry(entry) {
      this.$emit('entrySelected', entry)
      this.show = false
    }
  },
  created() {
    console.log(this.searchResults)
  }
}
</script>
<style>
.searchresultpopup {
}
</style>
