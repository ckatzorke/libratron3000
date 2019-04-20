<template>
  <v-container grid-list-xs>
    <v-layout row wrap px-2 justify-start>
      <v-flex xs1 >
        <v-btn small flat><v-icon small>add</v-icon>Add</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap pa-1 ma-1
      v-for="item in collection"
      :key="item.id"
      @click="showDetails(item.id)">
      <v-flex xs2 md1>
        <div class="caption grey--text">#</div>
        <div>{{ item.number }}</div>
      </v-flex>
      <v-flex xs10 md6>
        <div class="caption grey--text">Title</div>
        <div>{{ item.title }}</div>
      </v-flex>
      <v-flex xs4 md2>
        <div class="caption grey--text"></div>
        <div><v-icon>{{ completedIndicator(item.completed, item.hundredpercent) }}</v-icon></div>
      </v-flex>
      <v-flex xs4 md2>
        <div class="caption grey--text">Purchased</div>
        <div>{{ prettyDate(item.buydate) }}</div>
      </v-flex>
      <v-flex xs4 md1>
        <div class="text-xs-right caption grey--text">Platform</div>
        <div
          :class="`text-xs-right ${shortPlatform(item.platform)}`"
        >{{ shortPlatform(item.platform) }}</div>
      </v-flex>
      <v-flex xs12>
        <v-divider />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
// import GameDetails from './GameDetails'
import { format } from 'date-fns'
import { shortPlatform } from '@/service/platforms.js'
export default {
  /*
  components: {
    'lib-gamedetails': GameDetails
  },
  */
  data() {
    return {}
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
      console.log('Load deatils: ', id)
    }
  },
  computed: {
    collection() {
      return this.$store.getters.getCollection
    }
  },
  created() {
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
