<template>
  <v-container grid-list-xs>
      <v-layout row wrap px-2 justify-start>
        <v-flex xs1 >
          <v-btn small flat><v-icon small>add</v-icon>Add</v-btn>
        </v-flex>
      </v-layout>
    <v-card>
      <v-layout row wrap pa-1 ma-1 v-for="item in collection" :key="item.number">
        <v-flex xs2 md1>
          <div class="caption grey--text">#</div>
          <div>{{ item.number }}</div>
        </v-flex>
        <v-flex xs10 md6>
          <div class="caption grey--text">Title</div>
          <div>{{ item.title }}</div>
        </v-flex>
        <v-flex xs4 md2>
          <div class="caption grey--text">Release</div>
          <div>{{ prettyDate(item.releaseDate) }}</div>
        </v-flex>
        <v-flex xs4 md2>
          <div class="caption grey--text">Bought on</div>
          <div>{{ prettyDate(item.buydate) }}</div>
        </v-flex>
        <v-flex xs4 md1>
          <div
            :class="`right ${shortPlatform(item.platform)} font-weight-bold`"
          >{{ shortPlatform(item.platform) }}</div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>
<script>
import { format } from 'date-fns'
import { shortPlatform } from '@/service/platforms.js'
export default {
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
