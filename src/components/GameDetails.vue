<template>
  <v-container>
    <v-card>
      <v-layout row wrap pa-1 ma-1>
        <v-flex xs12 md3 ma-1 pa-1 text-xs-center>
          <img :src="cover()" />
        </v-flex>
        <v-flex xs12 md8>
          <v-layout row wrap>
            <v-flex xs12 >
              <div class="display-2">{{ game.title }}</div>
            </v-flex>
            <v-flex xs12 ma-2>
              <div class="body-1">{{ game.description }}</div>
            </v-flex>
            <v-flex xs4 ma-2>
              <div class="caption grey--text">Developed By</div>
              <div>{{ developer }}</div>
            </v-flex>
            <v-flex xs4 ma-2>
              <div class="caption grey--text">Published By</div>
              <div>{{ publisher }}</div>
            </v-flex>
            <v-flex xs4 ma-2>
              <div class="caption grey--text">Genres</div>
              <div>{{ genres }}</div>
            </v-flex>
            <v-flex xs4 ma-2>
              <div class="caption grey--text">Format</div>
              <div><v-icon>{{ format }}</v-icon></div>
            </v-flex>
            <v-flex xs4 ma-2>
              <div class="caption grey--text">Release Date</div>
              <div>{{ release }}</div>
            </v-flex>
            <v-flex xs4 ma-2>
              <div class="caption grey--text">Purchase Date</div>
              <div>{{ purchase }}</div>
            </v-flex>
            <v-flex xs12 ma-2>
              <div>
                <v-chip
                  v-for="tag in game.tags"
                  :key="tag"
                  dark
                  color="blue-grey darken-1">{{ tag }}</v-chip>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="game.notes" xs12 md3 lg2 px-1>
          <div class="caption grey--text">Notes</div>
          <div>{{ game.notes }}</div>
        </v-flex>
        <v-flex xs8 md3 lg2 px-1>
          <v-checkbox
            v-model="game.completed"
            label="Completed"
          ></v-checkbox>
        </v-flex>
        <v-flex xs4 md3 lg1 px-1>
          <v-checkbox
            v-model="game.hundredpercent"
            label="100%"
          ></v-checkbox>
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
          <div class="hidden-xs-only caption grey--text text--darken-1">Rating</div>
          <v-label>
            <star-rating
                v-model="game.rating"
                :max-rating="10"
                :show-rating="true"
                :star-size="25"
                :glow="2"
                class="v-input"
            ></star-rating>
          </v-label>
        </v-flex>
        <v-flex xs12 px-1>
          <v-combobox
            v-model="game.loaned"
            label="Loan to"
            prepend-icon="compare_arrows"
            clearable
          ></v-combobox>
        </v-flex>
        <v-flex xs12>
          <v-btn
            round
            color="primary"
            dark
            @click="update">Update</v-btn>
          <v-btn
            round
            color="secondary"
            @click="back"><v-icon>keyboard_backspace</v-icon>Back</v-btn>
          {{ game }}
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import { toDate, formatDate } from '@/service/utils'
import { coverBig } from '@/service/igdb'
import StarRating from 'vue-star-rating'

export default {
  props: ['id'],
  components: {
    'star-rating': StarRating
  },
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
    update() {
      this.$store.dispatch('updateGame',
        {
          id: this.game.id,
          values: {
            ...this.game
          }
        })
    },
    setCompletionDate(date) {
      const newDate = new Date(this.game.completiondateAsISOString.split('-'))
      this.game.completiondate = firebase.firestore.Timestamp.fromDate(newDate)
      const [year, month, day] = this.game.completiondateAsISOString.split('-')
      this.formattedCompletiondate = `${day}.${month}.${year}`
      this.completiondateMenu = false
    },
    cover() {
      return coverBig(this.game.cover)
    }
  },
  computed: {
    developer() {
      if (this.game.developer) {
        return this.game.developer
      }
      return 'n/a'
    },
    publisher() {
      if (this.game.publisher) {
        return this.game.publisher
      }
      return 'n/a'
    },
    genres() {
      if (this.game.genres) {
        return this.game.genres.join(', ')
      }
      return 'n/a'
    },
    format() {
      if (this.game.digital && this.game.digital === true) {
        return 'cloud_download'
      }
      return 'album'
    },
    release() {
      if (this.game.releaseDate) {
        return formatDate(toDate(this.game.releaseDate))
      }
      return 'n/a'
    },
    purchase() {
      if (this.game.buydate) {
        return formatDate(toDate(this.game.buydate))
      }
      return 'n/a'
    },
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
<style>
</style>
