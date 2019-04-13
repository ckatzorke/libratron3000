<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2>Add a new game (#{{ collectionNumberAdd }})</h2>
        <v-spacer/>
        <lib-search></lib-search>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                label="Title"
                v-model="game.title"
                prepend-icon="title"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                label="Description"
                v-model="game.description"
                prepend-icon="description"
              ></v-textarea>
            </v-flex>
            <v-flex xs12 md6 lg6 px-1>
              <v-combobox
                v-model="game.genres"
                :items="getAvailableGenres"
                label="Genre(s)"
                multiple
                prepend-icon="assignment"
              ></v-combobox>
            </v-flex>
            <v-flex xs12 md3 lg3 px-1>
              <v-text-field
                label="Developer"
                v-model="game.developer"
                prepend-icon="gavel"
              ></v-text-field>
            </v-flex>
            <!-- TODO autocomplete with value from backend -->
            <v-flex xs12 md3 lg3 px-1>
              <v-text-field
                label="Publisher"
                v-model="game.publisher"
                prepend-icon="publish"
              ></v-text-field>
            </v-flex>
            <!-- TODO autocomplete with value from backend -->
            <v-flex xs12 md4 lg4 px-1>
              <v-combobox
                v-model="game.platform"
                :items="getPlatforms"
                label="Platform"
                prepend-icon="airplay"
              ></v-combobox>
            </v-flex>
            <v-flex xs12 md3 lg3 px-1>
              <v-menu>
                <v-text-field
                  slot="activator"
                  :value="formatBuyDate"
                  label="Date of purchase"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="game.buydate"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 md3 lg3 px-1>
              <v-checkbox
                v-model="game.digital"
                label="Digital"
                prepend-icon="cloud_download"
              ></v-checkbox>
            </v-flex>

            <v-flex xs12 md6 lg6 px-1>
              <v-text-field
                v-model="game.notes"
                label="Notes"
                prepend-icon="notes"
              ></v-text-field>
            </v-flex>
            <!-- TODO add possible tags from backend :items="items"-->
            <v-flex xs12 md6 lg6 px-1>
              <v-combobox
                v-model="game.tags"
                label="Tags"
                multiple
                prepend-icon="label"
              ></v-combobox>
            </v-flex>

            <v-flex xs12 md6 lg3 px-1>
              <v-checkbox
                v-model="game.completed"
                label="Completed"
                prepend-icon="check"
              ></v-checkbox>
            </v-flex>
            <v-flex xs12 md6 lg3 px-1>
              <v-menu>
                <v-text-field
                  slot="activator"
                  :value="formatCompletionDate"
                  label="Date of completion"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="game.completiondate"></v-date-picker>
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
            <v-flex xs12>
              <v-btn @click="add">Add</v-btn>
              {{ game }}
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import SearchGame from './SearchGame'

import format from 'date-fns/format'
export default {
  components: {
    'lib-search': SearchGame
  },
  data() {
    return {
      game: {
        title: '',
        description: '',
        platforms: [],
        genres: [],
        developer: '',
        publisher: '',
        notes: '',
        tags: [],
        release: null,
        buydate: null,
        digital: false,
        completed: false,
        completiondate: null,
        rating: 0
      }
    }
  },
  methods: {
    add() {
      console.log('ADD')
    }
  },
  computed: {
    collectionNumberAdd() {
      let largest = this.$store.state.collection
        .map(v => v.number)
        .reduce((prev, current) => (prev > current ? prev : current))
      return largest + 1
    },
    formatBuyDate() {
      return this.game.buydate ? format(this.game.buydate, 'DD.MM.YYYY') : ''
    },
    formatCompletionDate() {
      return this.game.completiondate ? format(this.game.completiondate, 'DD.MM.YYYY') : ''
    },
    getAvailableGenres() {
      let genres = this.$store.state.collection.flatMap(c => c.genre)
      return [...new Set(genres)].sort()
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
    },
    ...mapGetters([
      'getPlatforms'
    ])

  }
}
</script>
