<template>
  <v-container grid-list-xs>
    <v-layout row wrap px-2 align-center justify-space-between>
      <v-flex xs2 >
        <v-btn small flat to="/add"><v-icon small>add</v-icon>Add</v-btn>
      </v-flex>
      <v-flex xs6 >
        <v-text-field
          v-model="search"
          append-icon="search"
          @input="searchTitle"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap pa-1 ma-1
      v-for="item in mycollection"
      :key="item.id"
      @click="showDetails(item.id)">
      <v-flex xs2 sm1>
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
      <v-flex xs2 md1>
        <div class="text-xs-right caption grey--text">Platform</div>
        <div
          :class="`text-xs-right ${shortPlatform(item.platform)}`"
        >{{ shortPlatform(item.platform) }}</div>
      </v-flex>
      <v-flex xs12>
        <div class="caption grey--text">Rated</div>
        <div v-if="item.rating">{{ item.rating }}/10</div>
      </v-flex>
      <v-flex xs12>
        <v-divider />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12> Showing first 25 only</v-flex>
    </v-layout>

  </v-container>
</template>
<script>
// import GameDetails from './GameDetails'
import { format } from 'date-fns'
import { shortPlatform } from '@/service/platforms.js'
import { setInterval, clearInterval } from 'timers'

let searchIntervalId = null

export default {
  /*
  components: {
    'lib-gamedetails': GameDetails
  },
  */
  data() {
    return {
      search: '',
      mycollection: []
    }
  },
  methods: {
    prettyDate(timestamp) {
      let date = new Date(timestamp.seconds * 1000)
      const formatted = format(date, 'DD.MM.YYYY')
      return formatted === '01.01.2000' ? 'n/a' : formatted
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
        console.log(this.search)
        const filtered = this.$store.getters.getCollection.filter(g => g.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1).slice(0, 25)
        this.mycollection = filtered
      }, 500)
    }
  },
  computed: {
  },
  created() {
    this.mycollection = this.$store.getters.getCollection.slice(0, 25)
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
