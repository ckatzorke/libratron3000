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
    <v-layout row wrap pa-1 ma-1
      v-for="item in displayCollection"
      :key="item.id"
      @click="showDetails(item.id)">
      <v-flex xs2 sm2>
        <div class="caption grey--text">#</div>
        <div>{{ item.number }}</div>
      </v-flex>
      <v-flex xs8 sm6>
        <div class="caption grey--text">Title</div>
        <div>{{ item.title }}&nbsp;<v-icon small>{{ completedIndicator(item.completed, item.hundredpercent) }}</v-icon></div>
      </v-flex>
      <v-flex hidden-xs-only sm2>
        <div class="caption grey--text">Purchased</div>
        <div>{{ prettyDate(item.buydate) }}</div>
      </v-flex>
      <v-flex xs2 sm2>
        <div class="text-xs-right caption grey--text">Platform</div>
        <div
          :class="`text-xs-right ${shortPlatform(item.platform)}`"
        >{{ shortPlatform(item.platform) }}</div>
      </v-flex>
      <v-layout justify-end>
        <v-flex xs4 sm2>
          <span v-if="item.rating">
            <star-rating
            class="text-xs-right"
              v-model="item.rating"
              :max-rating="10"
              read-only
              :show-rating="false"
              :star-size="10"
              :glow="2"
            ></star-rating>
          </span>
        </v-flex>
      </v-layout>
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

import StarRating from 'vue-star-rating'

let searchIntervalId = null

export default {
  components: {
    'star-rating': StarRating
  },
  data() {
    return {
      search: '',
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
