<template>
  <v-container grid-list-xs>
    <div v-if="!loaned">
      All your game are belong to us
    </div>
    <v-layout v-else row wrap pa-1 ma-1
      v-for="item in loaned"
      :key="item.id">
      <v-flex xs4 sm2>
        {{ item.loaned }}
      </v-flex>
      <v-flex xs8 sm8>
        {{ item.title }}
      </v-flex>
      <v-flex xs12 sm2>
        <v-btn
          small
          @click="returnLoaned(item)">
          <v-icon small>arrow_back</v-icon> Return
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-divider />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    returnLoaned(game) {
      game.loaned = null
      this.$store.dispatch('updateGame',
        {
          id: game.id,
          values: {
            ...game
          }
        })
    }
  },
  computed: {
    loaned() {
      return this.$store.getters.getCollection.filter(e => e.loaned)
    }
  },
  created() {}
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
