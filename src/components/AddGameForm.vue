<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2>Add a new game (#{{ game.number }})</h2>
        <v-spacer/>
        <lib-search-dialog v-bind:searchTerm="game.title" @entrySelected="selectSearchEntry"></lib-search-dialog>
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
                clearable
              ></v-combobox>
            </v-flex>
             <v-flex xs12 md2 lg2 px-1>
              <v-menu>
                <v-text-field
                  slot="activator"
                  :value="formatReleaseDate"
                  label="Release Date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="game.releaseDate"
                  ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 md2 lg2 px-1>
              <v-combobox
                v-model="game.developer"
                :items="getAvailableDevelopers"
                label="Developer"
                prepend-icon="gavel"
              >
              </v-combobox>
            </v-flex>
            <v-flex xs12 md2 lg2 px-1>
              <v-combobox
                v-model="game.publisher"
                :items="getAvailablePublishers"
                label="Publisher"
                prepend-icon="publish"
              >
              </v-combobox>
            </v-flex>
            <v-flex xs12 md4 lg4 px-1>
              <v-combobox
                v-model="game.platform"
                :items="getPlatforms"
                label="Platform"
                prepend-icon="airplay"
                clearable
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
                clearable
              ></v-combobox>
            </v-flex>

            <v-flex xs12 md3 lg2 px-1>
              <v-checkbox
                v-model="game.completed"
                label="Completed"
              ></v-checkbox>
            </v-flex>
            <v-flex xs12 md3 lg1 px-1>
              <v-checkbox
                v-model="game.hundredpercent"
                label="100%"
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
            <v-flex xs12>
              <v-btn
                rounded
                color="primary"
                dark
                block
                @click="add">Add</v-btn>
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
import SearchGameDialog from './SearchGameDialog'
import firebase from 'firebase/app'
import format from 'date-fns/format'
import StarRating from 'vue-star-rating'

const blankGame = {
  number: 0,
  title: '',
  description: '',
  platform: '',
  genres: [],
  developer: '',
  publisher: '',
  notes: '',
  tags: [],
  releaseDate: null,
  buydate: null,
  digital: false,
  completed: false,
  hundredpercent: false,
  completiondate: null,
  rating: 0
}

export default {
  components: {
    'lib-search-dialog': SearchGameDialog,
    'star-rating': StarRating
  },
  data() {
    return {
      game: blankGame
    }
  },
  methods: {
    add() {
      console.log('ADD')
      // convert dates
      let game2Add = this.game
      if (game2Add.buydate) {
        game2Add.buydate = firebase.firestore.Timestamp.fromDate(new Date(game2Add.buydate))
      }
      if (game2Add.releaseDate) {
        game2Add.releaseDate = firebase.firestore.Timestamp.fromDate(new Date(game2Add.releaseDate))
      }
      if (game2Add.completiondate) {
        game2Add.completiondate = firebase.firestore.Timestamp.fromDate(new Date(game2Add.completiondate))
      }
      this.$store.dispatch('addGame', game2Add)
      this.game = blankGame
    },
    selectSearchEntry(searchEntry) {
      console.log('Searchentry', searchEntry)
      let newGame = {
        ...this.game,
        title: searchEntry.name,
        description: searchEntry.summary,
        platform: searchEntry.platforms ? searchEntry.platforms.map(p => p.name)[0] : '',
        genres: searchEntry.genres ? searchEntry.genres.map(g => g.name) : [],
        releaseDate: searchEntry.first_release_date ? new Date(searchEntry.first_release_date * 1000) : new Date('2000-0-01'),
        igdbId: searchEntry.id,
        cover: searchEntry.cover ? searchEntry.cover.image_id : '',
        poweredBy: 'IGDB'
      }
      this.game = newGame
    }
  },
  computed: {
    formatBuyDate() {
      return this.game.buydate ? format(this.game.buydate, 'DD.MM.YYYY') : ''
    },
    formatCompletionDate() {
      return this.game.completiondate ? format(this.game.completiondate, 'DD.MM.YYYY') : ''
    },
    formatReleaseDate() {
      return this.game.releaseDate ? format(this.game.releaseDate, 'DD.MM.YYYY') : ''
    },
    getAvailableGenres() {
      let genres = this.$store.state.collection.flatMap(c => c.genre).filter(g => g)
      return [...new Set(genres)].sort()
    },
    getAvailableDevelopers() {
      let developers = this.$store.state.collection.flatMap(c => c.developer).filter(d => d)
      return [...new Set(developers)].sort()
    },
    getAvailablePublishers() {
      let publishers = this.$store.state.collection.flatMap(c => c.publisher).filter(p => p)
      return [...new Set(publishers)].sort()
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

  },
  created() {
    let largest = this.$store.state.collection
      .map(v => v.number)
      .reduce((prev, current) => (prev > current ? prev : current))
    const newNumber = largest + 1
    this.game.number = newNumber
  }
}
</script>
