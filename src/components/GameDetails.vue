<template>
  <v-container>
    <v-btn @click="back" left><v-icon>keyboard_backspace</v-icon>Back</v-btn>
    <v-card pa-3 ma-2>
      <v-layout row wrap ma-2>
        <v-flex xs12 md3 lg2 px-1>
          <v-checkbox v-model="game.completed" label="Completed"></v-checkbox>
        </v-flex>
        <v-flex xs12 md3 lg1 px-1>
          <v-checkbox v-model="game.hundredpercent" label="100%"></v-checkbox>
        </v-flex>
        <v-flex xs12 md6 lg3 px-1>
          <v-menu
            v-model="completiondateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="formattedCompletiondate"
                label="Date of completion"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="game.completiondateAsISOString"
              @input="setCompletionDate">
            </v-date-picker>
          </v-menu>
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
    </v-card>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import { toDate } from '@/service/utils'

export default {
  props: ['id'],
  data() {
    return {
      completiondateMenu: false,
      formattedCompletiondate: null,
      game: {}
    }
  },
  methods: {
    back() {
      this.$router.push('/collection')
    },
    setCompletionDate(date) {
      const newDate = new Date(this.game.completiondateAsISOString.split('-'))
      this.game.completiondate = firebase.firestore.Timestamp.fromDate(newDate)
      const [year, month, day] = this.game.completiondateAsISOString.split('-')
      this.formattedCompletiondate = `${day}.${month}.${year}`
      this.completiondateMenu = false
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
    console.log('loading id', this.id)
    const game = this.$store.state.collection.filter(g => g.id === this.id)
    console.log('got', game)
    this.game = game[0]
    if (this.game.completiondate) {
      console.log('Game is completed', this.game.completiondate)
      const completiondateAsDate = toDate(this.game.completiondate)
      this.game.completiondateAsISOString = completiondateAsDate.toISOString().substring(0, 10)
      const [year, month, day] = this.game.completiondateAsISOString.split('-')
      this.formattedCompletiondate = `${day}.${month}.${year}`
    } else {
      this.game.completiondateAsISOString = null
    }
  }
}
</script>
