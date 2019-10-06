<template>
  <v-container grid-list-xs>
    <lib-searchresultpopup :searchResults="searchResults" :show="showSearchResults" @entrySelected="selectSearchEntry"></lib-searchresultpopup>
    <v-layout row wrap px-2 justify-left>
      <v-flex xs6 >
        <v-menu
          bottom
          origin="center center"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color=""
              dark
              small
              v-on="on"
            >
              Sort By
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              @click="sortBy('RATING')"
            >
              <v-list-item-title>Rating Desc.</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="sortBy('NAME')"
            >
              <v-list-item-title>Name</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="sortBy('ID')"
            >
              <v-list-item-title>Id</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-layout row wrap  ma-1
      v-for="item in displayCollection"
      :key="item.id">
      <!--thumbnail, micro on sm, thumb on sm and up -->
      <v-flex hidden-xs-only sm2 md1 @click="showDetails(item.id)">
        <div class="thumbnail">
          <img
            :src="thumbnail(item.cover)" height="90px" width="90px"
            :class="{ sold: isSold(item) }"
            :title="isSold(item) ? 'sold at ' + prettyDate(item.sellDate) : ''">
          <div v-if="isSold(item)" class="arrow-right">
            <span>SOLD</span>
          </div>
        </div>
      </v-flex>
      <v-flex hidden-sm-and-up xs2 @click="showDetails(item.id)">
        <div><img :src="micro(item.cover)" height="35px" width="35px"></div>
      </v-flex>
      <!-- Title, completed and rating -->
      <v-flex xs9 sm6 md7 style="cursor: pointer" @click="showDetails(item.id)">
        <div class="hidden-xs-only caption grey--text">Title</div>
        <div :class="{ 'grey--text': isSold(item) }">
          {{ item.title }}&nbsp;<v-icon small>{{ completedIndicator(item.completed, item.hundredpercent) }}</v-icon>&nbsp;<v-icon small>{{ isFavorite(item) }}</v-icon>
          <span v-if="isSold(item)"><strong>&nbsp;sold at {{ prettyDate(item.sellDate) }}</strong></span>
        </div>
        <div v-if="item.rating">
            <v-rating
              v-model="item.rating"
              background-color="yellow lighten-3"
              color="yellow"
              small
              dense
              length="10"
              readonly
            ></v-rating>
            <!--star-rating
              v-model="item.rating"
              :max-rating="10"
              read-only
              :show-rating="false"
              :star-size="10"
              :glow="2"
            ></star-rating -->
        </div>
      </v-flex>
      <!-- purchase date, hidden on xs -->
      <v-flex hidden-xs-only sm1 @click="showDetails(item.id)">
        <div class="hidden-xs-only caption grey--text">Purchased</div>
        <div :class="{ 'grey--text': isSold(item) }">{{ prettyDate(item.buydate) }}</div>
      </v-flex>
      <!-- Platform, hidden on xs -->
      <v-flex hidden-xs-only sm2 @click="showDetails(item.id)">
        <div class="hidden-xs-only text-xs-right caption grey--text">Platform</div>
        <div
          :class="`text-xs-right ${shortPlatform(item.platform)}`"
        >{{ shortPlatform(item.platform) }}</div>
      </v-flex>
      <!-- context menu -->
      <v-flex xs1>
        <div class="text-xs-right caption grey--text">
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                v-on="on"
              >
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>

            <v-card
              class="mx-auto"
              max-width="300"
              tile
            >
              <v-list shaped>
                <v-list-item-group color="primary">
                  <v-list-item @click="showDetails(item.id)">
                    <v-list-item-icon>
                      <v-icon>details</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Details</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="handleFavorite(item)">
                    <v-list-item-icon>
                      <v-icon>favorite</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Favorite</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="linkWithIgdb(item)">
                    <v-list-item-icon>
                      <v-icon>link</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Link with IGDB</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="!isSold(item)"
                    @click="sellGame(item)">
                    <v-list-item-icon>
                      <v-icon>attach_money</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Sell</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </v-flex>
      <v-flex xs12>
        <v-divider />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
        <v-pagination
          v-model="page"
          :length="numberOfPages"
          @input="paginate"
        ></v-pagination>
      </v-flex>
    </v-layout>

  </v-container>
</template>
<script>
// import GameDetails from './GameDetails'
import { shortPlatform } from '@/service/platforms.js'
import { micro, thumbnail } from '@/service/igdb.js'
import { prettyDate } from '@/service/utils.js'
import firebase from 'firebase/app'

import SearchResultPopup from '@/components/SearchResultPopup'

let collectionListSize = 20

export default {
  components: {
    'lib-searchresultpopup': SearchResultPopup
  },
  data() {
    return {
      selectedGameForLink: {},
      showIgdbDialog: false,
      mycollection: [],
      page: 1,
      itemToLink: null,
      searchResults: [],
      showSearchResults: false
    }
  },
  methods: {
    sortBy(sortOrder) {
      this.$store.dispatch('sort', sortOrder)
    },
    prettyDate(timestamp) {
      return prettyDate(timestamp)
    },
    shortPlatform(platform) {
      return shortPlatform(platform)
    },
    completedIndicator(completed, hundredpercent) {
      return completed && hundredpercent ? 'done_all' : completed ? 'done' : ''
    },
    showDetails(id) {
      this.$router.push(`/details/${id}`)
    },
    paginate(page) {
      this.$store.commit('updateDisplayPage', page)
    },
    thumbnail(cover) {
      return thumbnail(cover)
    },
    micro(cover) {
      return micro(cover)
    },
    sellGame(game) {
      if (confirm(`Sell '${game.title}'?`)) {
        // do not remove, set state to sold
        game.sellDate = firebase.firestore.Timestamp.fromDate(new Date())
        this.$store.dispatch('updateGame', { id: game.id, values: game })
      }
    },
    linkWithIgdb(item) {
      if (!item.igdbId || (item.igdbId && confirm(`'${item.title}' is already linked, update?`))) {
        console.log('link to igdb')
        this.itemToLink = item
        if (item.title) {
          // this.$http.get(`https://ckatzorke.lib.id/igdb@dev/search/?search=${this.searchTerm}`)
          let search = item.title
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
    selectSearchEntry(igdbEntry) {
      console.log('Result from IGDB link dialog', igdbEntry)
      console.log('updating ', this.itemToLink)
      let update = {
        ...this.itemToLink,
        title: igdbEntry.name,
        description: igdbEntry.summary,
        // platform: igdbEntry.platforms ? igdbEntry.platforms.map(p => p.name)[0] : '',
        genres: igdbEntry.genres ? igdbEntry.genres.map(g => g.name) : [],
        releaseDate: igdbEntry.first_release_date ? new Date(igdbEntry.first_release_date * 1000) : new Date('2000-0-01'),
        igdbId: igdbEntry.id,
        cover: igdbEntry.cover ? igdbEntry.cover.image_id : '',
        poweredBy: 'IGDB'
      }
      this.$store.dispatch('updateGame', { id: update.id, values: update })
      // reset search results
      this.searchResults = []
      this.showSearchResults = false
    },
    isSold(item) {
      if (item.sellDate) {
        return true
      }
      return false
    },
    isFavorite(item) {
      if (item.favorite) {
        return 'favorite'
      }
      return ''
    },
    handleFavorite(game) {
      game.favorite = !game.favorite
      this.$store.dispatch('updateGame', { id: game.id, values: game })
    }
  },
  computed: {
    displayCollection() {
      return this.$store.getters.getDisplayCollection
    },
    numberOfPages() {
      if (this.search) {
        console.log('Displaycoll', Math.ceil(this.$store.getters.getDisplayCollection.length))
        return Math.ceil(this.$store.getters.getDisplayCollection.length / collectionListSize)
      }
      return Math.ceil(this.$store.getters.getCollection.length / collectionListSize)
    }

  },
  created() {
    this.search = this.$store.getters.getDisplaySettings.filter
    this.page = this.$store.getters.getDisplaySettings.page
  }
}
</script>
<style>
img.sold {
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
}

.threeDS {
  color: orange;
}
.DS {
  color: orange;
}

.PC {
  color: black;
}

.PSX {
  color: lightgray;
}

.PS2 {
  color: darkgray;
}

.PS3 {
  color: gray;
}

.PS4 {
  color: #003791;
}

.PSP {
  color: silver;
}

.PSVITA {
  color: gray;
}

.Switch {
  color: #e60012;
}

.GameBoy {
  color: chartreuse;
}

.GBA {
  color: blueviolet;
}
.Wii {
  color: silver;
}

.WiiU {
  color: gray;
}

.Xbox360 {
  color: #5dc21e;
}

.XOne {
  color: #107c10;
}

.thumbnail {
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.arrow-right {
  background-color: #444;
  box-shadow: 0 0 3px 2px rgba(0,0,0,0.8);
  height: 60px;
  left: -30px;
  position: absolute;
  top: -30px;
  width: 60px;
  -webkit-transform: rotate(-45deg);
}

.arrow-right span {
  color: #f5f5f5;
  font-family: sans-serif;
  font-size: 0.900em;
  font-weight: bold;
  left: 12px;
  top: 44px;
  position: absolute;
  width: 80px;
}
</style>
