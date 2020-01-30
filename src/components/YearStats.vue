<template>
  <v-container class="">
    <v-row>
      <v-col
        cols="12"
        sm="4"
      >
        <div
          class="pa-2"
        >
          <div
            class="py-2 text-center display-1 orange--text hand"
            @click="switchListingAdded()">
              {{ added.length }}
          </div>
          <div class="body-2 text-center font-weight-light">Added {{ year }}</div>
        </div>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <div
          class="pa-2"
        >
          <div
            class="py-2 text-center display-1 orange--text hand"
            @click="switchListingPlayed()">
              {{ played.length }}
          </div>
          <div class="body-2 text-center font-weight-light">Played {{ year }}</div>
        </div>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <div
          class="pa-2"
        >
          <div
            class="py-2 text-center display-1 orange--text hand"
            @click="switchListingFinished()">
              {{ finished.length }}
          </div>
          <div class="body-2 text-center font-weight-light">Finished {{ year }}</div>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <div class="font-weight-light text-left font-italic">
          {{ listingType }}
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters pa-2>
      <v-col
        xs="3"
        sm="2"
        lg="1"
        v-for="(game) in listing"
        :key="game.id"
        class="text-center"
        >
        <div @click="showDetails(game.id)" class="hand">
          <img
              :src="thumbnail(game.cover)"
              height="128px"
              width="90px"
              :title="game.rating + ' / 10'"
            />
          <div class="caption text-center">
            {{ formatDate(game.completiondate) }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { toDate, prettyDate } from '@/service/utils.js'
import { coverSmall } from '@/service/igdb.js'
export default {
  data() {
    return {
      listing: [],
      listingType: 'Finished'
    }
  },
  props: ['year'],
  computed: {
    added() {
      let collection = this.$store.getters.getCollection
      let added = []
      collection.forEach(item => {
        let buydate = toDate(item.buydate)
        if (buydate.getFullYear() === this.year) {
          added.push(item)
        }
      })
      return added
    },
    played() {
      let collection = this.$store.getters.getCollection
      let played = []
      collection.forEach(item => {
        let buydate = toDate(item.buydate)
        let completiondate = toDate(item.completiondate)
        // either completed this year or bought and rated this year. Should be close enough to reality
        if ((completiondate && completiondate.getFullYear() === this.year) || (buydate.getFullYear() === this.year && item.rating && item.rating > 0)) {
          played.push(item)
        }
      })
      return played
    },
    finished() {
      let collection = this.$store.getters.getCollection
      let finished = collection
        .filter(item => item.completiondate)
        .filter(item => toDate(item.completiondate).getFullYear() === this.year && item.completed)
        .sort((a, b) => {
          const ratingA = a.rating ? a.rating : 0
          const ratingB = b.rating ? b.rating : 0
          return ratingB - ratingA
        })
      return finished
    }
  },
  methods: {
    thumbnail(cover) {
      return coverSmall(cover)
    },
    formatDate(timestamp) {
      return prettyDate(timestamp)
    },
    showDetails(id) {
      this.$router.push(`/details/${id}`)
    },
    switchListingFinished() {
      this.listingType = 'Finished'
      this.listing = this.finished
    },
    switchListingPlayed() {
      this.listingType = 'Played'
      this.listing = this.played
    },
    switchListingAdded() {
      this.listingType = 'Added'
      this.listing = this.added
    }
  },
  mounted() {
    this.switchListingFinished()
  }
}
</script>
<style>
.hand {
  cursor: pointer
}
</style>
