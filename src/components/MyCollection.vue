<template>
  <v-container grid-list-xs>
    <v-layout row wrap px-2 justify-end>
      <v-flex xs6 >
        <v-text-field
          v-model="search"
          append-icon="search"
          @input="searchTitle"></v-text-field>
      </v-flex>
    </v-layout>
    <lib-search-dialog
      v-bind:searchTerm="selectedGameForLink.title"
      @entrySelected="selectSearchIgdbEntry"
      :hideBtn="true"
      :show="showIgdbDialog"
      >
    </lib-search-dialog>
    <v-layout row wrap  ma-1
      v-for="item in displayCollection"
      :key="item.id">
      <!--thumbnail, micro on sm, thumb on sm and up -->
      <v-flex hidden-xs-only sm2 md1>
        <div><img :src="thumbnail(item.cover)" height="90px" width="90px"></div>
      </v-flex>
      <v-flex hidden-sm-and-up xs2>
        <div><img :src="micro(item.cover)" height="35px" width="35px"></div>
      </v-flex>
      <!-- Title, completed and rating -->
      <v-flex xs9 sm6 md7 @click="showDetails(item.id)" style="cursor: pointer">
        <div class="hidden-xs-only caption grey--text">Title</div>
        <div>{{ item.title }}&nbsp;<v-icon small>{{ completedIndicator(item.completed, item.hundredpercent) }}</v-icon></div>
        <div v-if="item.rating">
            <star-rating
              v-model="item.rating"
              :max-rating="10"
              read-only
              :show-rating="false"
              :star-size="10"
              :glow="2"
            ></star-rating>
        </div>
      </v-flex>
      <!-- purchase date, hidden on xs -->
      <v-flex hidden-xs-only sm1>
        <div class="hidden-xs-only caption grey--text">Purchased</div>
        <div>{{ prettyDate(item.buydate) }}</div>
      </v-flex>
      <!-- Platform, hidden on xs -->
      <v-flex hidden-xs-only sm2>
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

            <v-list>
              <v-list-tile
                @click="showDetails(item.id)"
              >
                <v-list-tile-title><v-icon small>details</v-icon>&nbsp;Details</v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                @click="connectWithIgdb(item)"
              >
                <v-list-tile-title><v-icon small>link</v-icon>&nbsp;Link with IGDB</v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                @click="sellGame(item)"
              >
                <v-list-tile-title><v-icon small>attach_money</v-icon>&nbsp;Sell</v-list-tile-title>
              </v-list-tile>
            </v-list>
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
import { format } from 'date-fns'
import { shortPlatform } from '@/service/platforms.js'
import { setInterval, clearInterval } from 'timers'
import firebase from 'firebase/app'

import SearchGameDialog from './SearchGameDialog'

import StarRating from 'vue-star-rating'

let searchIntervalId = null

export default {
  components: {
    'lib-search-dialog': SearchGameDialog,
    'star-rating': StarRating
  },
  data() {
    return {
      search: '',
      selectedGameForLink: {},
      showIgdbDialog: false,
      mycollection: [],
      page: 1
    }
  },
  methods: {
    prettyDate(timestamp) {
      if (timestamp) {
        let date = new Date(timestamp.seconds * 1000)
        const formatted = format(date, 'DD.MM.YYYY')
        return formatted === '01.01.2000' ? 'n/a' : formatted
      } else {
        return 'n/a'
      }
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
    searchTitle() {
      clearInterval(searchIntervalId)
      searchIntervalId = setInterval(() => {
        clearInterval(searchIntervalId)
        this.$store.commit('updateSearchFilter', this.search)
      }, 500)
    },
    paginate(page) {
      this.$store.commit('updateDisplayPage', page)
    },
    thumbnail(cover) {
      if (cover) {
        return `https://images.igdb.com/igdb/image/upload/t_thumb/${cover}.png`
      }
      return 'assets/dummy.png'
    },
    micro(cover) {
      if (cover) {
        return `https://images.igdb.com/igdb/image/upload/t_micro/${cover}.png`
      }
      return 'assets/dummy.png'
    },
    sellGame(game) {
      if (confirm(`Sell '${game.title}'?`)) {
        // do not remove, set state to sold
        game.sellDate = firebase.firestore.Timestamp.fromDate(new Date())
        this.$store.dispatch('updateGame', { id: game.id, values: game })
      }
    },
    connectWithIgdb(game) {
      if (!game.igdbId || (game.igdbId && confirm(`'${game.title}' is already linked, update?`))) {
        console.log('link to igdb')
        this.selectedGameForLink = game
        this.showIgdbDialog = true
      }
    },
    selectSearchIgdbEntry(igdbEntry) {
      console.log('Result from IGDB link dialog', igdbEntry)
      let update = {
        ...this.selectedGameForLink,
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
      this.showIgdbDialog = false
    }
  },
  computed: {
    displayCollection() {
      return this.$store.getters.getDisplayCollection
    },
    numberOfPages() {
      if (this.search) {
        console.log('Displaycoll', Math.ceil(this.$store.getters.getDisplayCollection.length))
        return Math.ceil(this.$store.getters.getDisplayCollection.length / 10)
      }
      return Math.ceil(this.$store.getters.getCollection.length / 10)
    }

  },
  created() {
    this.search = this.$store.getters.getDisplaySettings.filter
    this.page = this.$store.getters.getDisplaySettings.page
  }
}
</script>
<style>
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
  color: darkblue;
}

.PSP {
  color: silver;
}

.PSVITA {
  color: gray;
}

.Switch {
  color: pink;
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
  color: green;
}

.XOne {
  color: lightgreen;
}
</style>
