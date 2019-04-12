<template>
  <v-container grid-list-xs>
    <v-card class="card--flex--toolbar" v-if="showSpinner">
      <v-layout row wrap px-2>
        <v-flex xs12 ma-5 text-xs-center>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-card>
    <v-card v-else >
      <v-layout row wrap pa-1 ma-1 v-for="item in collection" :key="item.number">
        <v-flex xs1>
          <div class="caption grey--text">#</div>
          <div>{{ item.number }}</div>
        </v-flex>
        <v-flex xs7>
          <div class="caption grey--text">Title</div>
          <div>{{ item.title }}</div>
        </v-flex>
        <v-flex xs1>
          <div class="caption grey--text">release</div>
          <div>{{ item.release }}</div>
        </v-flex>
        <v-flex xs1>
          <div class="caption grey--text">Bought on</div>
          <div>{{ buyDate(item.buydate) }}</div>
        </v-flex>
        <v-flex xs2>
          <div
            :class="`right ${shortPlatform(item.platform)} font-weight-bold`"
          >{{ shortPlatform(item.platform) }}</div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    buyDate(timestamp) {
      let date = new Date(timestamp.seconds)
      return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
    },
    getIcon(platform) {
      const path = '/assets/platforms/'
      if (platform === 'Nintendo 3DS') {
        return path + '3ds.png'
      }
      if (platform === 'Nintendo DS') {
        return path + 'ds.jpg'
      }
      if (platform === 'PC') {
        return path + 'pc.png'
      }
      if (platform === 'PlayStation') {
        return path + 'ps.png'
      }
      if (platform === 'PlayStation 2') {
        return path + 'ps.png'
      }
      if (platform === 'PlayStation 3') {
        return path + 'ps.png'
      }
      if (platform === 'PlayStation 4') {
        return path + 'ps4.png'
      }
      if (platform === 'PSP') {
        return path + 'psp.png'
      }
      if (platform === 'PlayStation Vita') {
        return path + 'vita.png'
      }
      if (platform === 'Nintendo Switch') {
        return path + 'switch.png'
      }
      if (platform === 'Wii') {
        return path + 'wii.png'
      }
      if (platform === 'Wii U') {
        return path + 'wiiu.svg'
      }
      if (platform === 'Xbox 360') {
        return path + 'xbox.png'
      }
      if (platform === 'Xbox One') {
        return path + 'xone.png'
      }
    },
    shortPlatform(platform) {
      if (platform === 'Nintendo 3DS') {
        return 'threeDS'
      }
      if (platform === 'Nintendo DS') {
        return 'DS'
      }
      if (platform === 'PC') {
        return 'PC'
      }
      if (platform === 'PlayStation') {
        return 'PSX'
      }
      if (platform === 'PlayStation 2') {
        return 'PS2'
      }
      if (platform === 'PlayStation 3') {
        return 'PS3'
      }
      if (platform === 'PlayStation 4') {
        return 'PS4'
      }
      if (platform === 'PSP') {
        return 'PSP'
      }
      if (platform === 'PlayStation Vita') {
        return 'PSVITA'
      }
      if (platform === 'Nintendo Switch') {
        return 'Switch'
      }
      if (platform === 'Wii') {
        return 'Wii'
      }
      if (platform === 'Wii U') {
        return 'WiiU'
      }
      if (platform === 'Xbox 360') {
        return 'Xbox360'
      }
      if (platform === 'Xbox One') {
        return 'XOne'
      }
    }
  },
  computed: {
    collection() {
      return this.$store.getters.getCollection
    },
    showSpinner() {
      return this.$store.getters.getCollection === null
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
