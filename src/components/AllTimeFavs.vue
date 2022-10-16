<template>
  <v-container grid-list-xs>
    <div v-if="!favs">
      No favorite games. You think you have a life?
    </div>
    <div v-else>
      <v-layout row wrap pa-1 ma-1>
        <v-flex xs2 sm2>
          Rating
        </v-flex>
        <v-flex xs2 sm2>
          Release
        </v-flex>
        <v-flex xs2 sm2>
          Completed
        </v-flex>
        <v-flex xs6 sm6>
          Title
        </v-flex>
      </v-layout>
      <v-flex xs12>
        <v-divider />
      </v-flex>
      <v-layout row wrap pa-1 ma-1
        v-for="item in favs"
        :key="item.id">
        <v-flex xs2 sm2>
          {{ item.rating }}
        </v-flex>
        <v-flex xs2 sm2>
          {{ releaseYear(item) }}
        </v-flex>
        <v-flex xs2 sm2>
          {{ completionYear(item) }}
        </v-flex>
        <v-flex xs6 sm6>
          {{ item.title }}
        </v-flex>
        <v-flex xs12>
          <v-divider />
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>
<script>
import { format } from 'date-fns'

export default {
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    releaseYear(item) {
      return this.yearOnly(item.releaseDate)
    },
    completionYear(item) {
      return this.yearOnly(item.completiondate)
    },
    yearOnly(timestamp) {
      if (timestamp) {
        let date = new Date(timestamp.seconds * 1000)
        const formatted = format(date, 'YYYY')
        return formatted === '2000' ? 'n/a' : formatted
      } else {
        return 'n/a'
      }
    }
  },
  computed: {
    favs() {
      return this.$store.getters.getCollection.filter(e => e.favorite).sort((a, b) => b.rating - a.rating)
    }
  },
  created() {}
}
</script>
