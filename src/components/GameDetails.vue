<template>
  <v-container>
    <lib-searchresultpopup :searchResults="searchResults" :show="showSearchResults" @entrySelected="selectSearchEntry"></lib-searchresultpopup>
    <v-card>
      <v-layout row wrap pa-1 ma-1>
        <v-flex xs12 md3 ma-1 pa-1 text-center>
          <img :src="cover()" />
        </v-flex>
        <v-flex xs12 md8>
          <v-layout row wrap>
            <v-flex xs12 >
              <div class="display-2">{{ game.title }}</div>
            </v-flex>
            <v-flex xs12 mx-2>
              <div class="caption grey--text">{{ shortPlatform }}</div>
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
        <v-flex xs11 md11 lg5 px-1>
          <div class="hidden-xs-only caption grey--text text--darken-1">Rating</div>
          <v-label>
            <v-rating
              v-model="game.rating"
              background-color="yellow lighten-3"
              color="yellow"
              dense
              hover
              length="10"
            ></v-rating>
          </v-label>
        </v-flex>
        <v-flex xs1 md1 lg1 px-1>
          <div class="hidden-xs-only caption grey--text text--darken-1">Favorite</div>
          <p-check class="p-icon p-plain p-bigger" color="danger-o" toggle v-model="game.favorite">
              <i slot="extra" class="icon mdi mdi-heart"></i>
              <i slot="off-extra" class="icon mdi mdi-heart-outline"></i>
              <label slot="off-label"></label>
          </p-check>
        </v-flex>
        <v-flex xs12 px-1>
          <v-combobox
            v-if="!isSold"
            v-model="game.loaned"
            label="Loan to"
            prepend-icon="compare_arrows"
            clearable
          ></v-combobox>
          <div v-else class=" font-weight-light font-italic py-2">
            This game is no longer in your collection, sold at {{ prettyDate(game.sellDate) }}.
          </div>
        </v-flex>
        <v-flex xs12>
          <v-btn
            outlined
            rounded
            color="primary"
            @click="update"><v-icon>save</v-icon><span class="hidden-xs-only">Update</span></v-btn>
          <v-btn
            outlined
            rounded
            color="white"
            @click="linkWithIgdb"><v-icon>link</v-icon><span class="hidden-xs-only">Link with IGDB</span></v-btn>
          <v-btn
            outlined
            rounded
            color="error"
            @click="deleteEntry"><v-icon>delete</v-icon><span class="hidden-xs-only">Delete</span></v-btn>
          <v-btn
            outlined
            rounded
            :disabled="isSold"
            color="green"
            @click="sellEntry"><v-icon>attach_money</v-icon><span class="hidden-xs-only">Sell</span></v-btn>
          <v-btn
            outlined
            rounded
            color="blue-grey lighten-1"
            @click="back"><v-icon>keyboard_backspace</v-icon><span class="hidden-xs-only">Back</span></v-btn>
        </v-flex>
        <v-flex xs12>
          <!-- {{ game }} -->
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import PrettyCheck from 'pretty-checkbox-vue/check'
import { format } from 'date-fns'
import firebase from 'firebase/app'
import SearchResultPopup from '@/components/SearchResultPopup'
import { shortPlatform } from '@/service/platforms.js'
import { toDate, formatDate } from '@/service/utils'
import { coverBig } from '@/service/igdb'

export default {
  props: ['id'],
  components: {
    'p-check': PrettyCheck,
    'lib-searchresultpopup': SearchResultPopup
  },
  data() {
    return {
      completiondateMenu: false,
      formattedCompletiondate: null,
      game: {},
      searchResults: [],
      showSearchResults: false
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
    deleteEntry() {
      if (confirm(`Do you really want to delete "${this.game.title}?`)) {
        this.$store.dispatch('deleteGame',
          {
            id: this.game.id,
            values: {
              ...this.game
            }
          })
      }
      this.$router.push('/collection')
    },
    sellEntry() {
      if (confirm(`Sell '${this.game.title}'?`)) {
        // do not remove, set state to sold
        this.game.sellDate = firebase.firestore.Timestamp.fromDate(new Date())
        this.$store.dispatch('updateGame', { id: this.game.id, values: this.game })
      }
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
    },
    prettyDate(timestamp) {
      if (timestamp) {
        let date = new Date(timestamp.seconds * 1000)
        const formatted = format(date, 'DD.MM.YYYY')
        return formatted === '01.01.2000' ? 'n/a' : formatted
      } else {
        return 'n/a'
      }
    },
    linkWithIgdb() {
      if (!this.game.igdbId || (this.game.igdbId && confirm(`'${this.game.title}' is already linked, update?`))) {
        console.log('link to igdb')
        if (this.game.title) {
          // this.$http.get(`https://ckatzorke.lib.id/igdb@dev/search/?search=${this.searchTerm}`)
          let search = this.game.title
          search = search.replace(/[&\-:]*/g, '')
          debugger
          this.$http.get(`https://libratron3000.katzorke.io/.netlify/functions/igdbSearch?search=${search}`)
          // this.$http
          //  .get('/assets/results.json')
            .then(res => {
              if (res.status !== 200) {
                console.error('Error from res ', res)
              } else {
                console.log('Search response ', res)
                this.searchResults = res.data.result
                if (this.searchResults.length > 0) {
                  this.showSearchResults = true
                } else {
                  this.$store.dispatch('notify', 'No entries found...')
                }
              }
            })
            .catch(e => {
              console.error(e)
            })
        }
      }
    },
    selectSearchEntry(searchEntry) {
      console.log('Searchentry', searchEntry)
      let newGame = {
        ...this.game,
        title: searchEntry.name,
        description: searchEntry.summary,
        genres: searchEntry.genres ? searchEntry.genres.map(g => g.name) : [],
        releaseDate: searchEntry.first_release_date ? new Date(searchEntry.first_release_date * 1000) : new Date('2000-0-01'),
        igdbId: searchEntry.id,
        cover: searchEntry.cover ? searchEntry.cover.image_id : '',
        poweredBy: 'IGDB'
      }
      this.game = newGame
      // update releaseDate
      this.game.releasedateAsISOString = this.game.releaseDate.toISOString().substring(0, 10)
      this.setReleaseDate()
      // reset search results
      this.searchResults = []
      this.showSearchResults = false
    },
    setReleaseDate() {
      const newDate = new Date(this.game.releasedateAsISOString.split('-'))
      this.game.releaseDate = firebase.firestore.Timestamp.fromDate(newDate)
      const [year, month, day] = this.game.releasedateAsISOString.split('-')
      this.formattedReleasedate = `${day}.${month}.${year}`
      this.releasedateMenu = false
    }
  },
  computed: {
    shortPlatform() {
      return shortPlatform(this.game.platform)
    },
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
    },
    isSold() {
      if (this.game.sellDate) {
        return true
      }
      return false
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
