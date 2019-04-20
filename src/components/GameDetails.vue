<template>
  <v-layout row wrap ma-2>
    <v-flex xs12 md3 lg2 px-1>
      <v-checkbox v-model="game.completed" label="Completed"></v-checkbox>
    </v-flex>
    <v-flex xs12 md3 lg1 px-1>
      <v-checkbox v-model="game.hundredpercent" label="100%"></v-checkbox>
    </v-flex>
    <v-flex xs12 md6 lg3 px-1>
        <v-text-field
          :value="game.completionDateAsString"
          label="Date of completion"
          prepend-icon="event"
          readonly
        ></v-text-field>
    </v-flex>
    <v-flex xs12 md12 lg6 px-1>
      <v-tooltip top>
        <v-slider
          v-model="game.rating"
          label="Rating"
          :prepend-icon="rating"
          max="10"
          min="0"
          step="1"
          slot="activator"
        ></v-slider>
        <span>{{ game.rating }}</span>
      </v-tooltip>
    </v-flex>
    <v-flex xs12>{{game}}</v-flex>
  </v-layout>
</template>

<script>
import { formatDate, toDate } from '@/service/utils'

export default {
  props: ['game'],
  methods: {
    formatDate(date) {
      return formatDate(date)
    }
  },
  computed: {
    rating() {
      let rating = 'radio_button_unchecked'
      switch (this.game.rating) {
        case 0:
          break
        case 1:
        case 2:
          rating = 'sentiment_very_dissatisfied'
          break
        case 3:
        case 4:
        case 5:
          rating = 'sentiment_dissatisfied'
          break
        case 6:
        case 7:
        case 8:
          rating = 'sentiment_satisfied'
          break
        case 9:
        case 10:
          rating = 'sentiment_very_satisfied'
          break
        default:
      }
      return rating
    }
  },
  mounted() {
    this.game.completiondateAsDate = toDate(this.game.completiondate)
    this.game.completiondateAsString = formatDate(this.game.completiondateAsDate)
  }
}
</script>
