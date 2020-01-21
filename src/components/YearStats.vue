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
          <div class="py-2 text-center display-1 orange--text ">{{ added }}</div>
          <div class="body-1 text-center font-weight-light">Added {{ year }}</div>
        </div>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <div
          class="pa-2"
        >
          <div class="py-2 text-center display-1 orange--text ">{{ played }}</div>
          <div class="body-1 text-center font-weight-light">Played {{ year }}</div>
        </div>
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <div
          class="pa-2"
        >
          <div class="py-2 text-center display-1 orange--text ">{{ finished.length }}</div>
          <div class="body-1 text-center font-weight-light">Finished {{ year }}</div>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <div class="font-weight-light text-left font-italic">
          Finished
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters pa-2>
      <v-col>
        <div
          v-for="(finishedGame) in finished"
          :key="finishedGame.id"
          class="profilecontainer px-2 text-right ">
          <span class="profileleft">
            <span>{{ finishedGame.title }} ({{ formatDate(finishedGame.completiondate) }})</span>
          </span>
          <span class="profileright orange--text">{{ finishedGame.rating }}/10</span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { toDate, prettyDate } from '@/service/utils.js'
export default {
  data() {
    return {
    }
  },
  props: ['year'],
  computed: {
    added() {
      let collection = this.$store.getters.getCollection
      let added = 0
      collection.forEach(item => {
        let buydate = toDate(item.buydate)
        if (buydate.getFullYear() === this.year) {
          added++
        }
      })
      return added
    },
    played() {
      let collection = this.$store.getters.getCollection
      let played = 0
      collection.forEach(item => {
        let buydate = toDate(item.buydate)
        let completiondate = toDate(item.completiondate)
        // either completed this year or bought and rated this year. Should be close enough to reality
        if ((completiondate && completiondate.getFullYear() === this.year) || (buydate.getFullYear() === this.year && item.rating && item.rating > 0)) {
          played++
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
    formatDate(timestamp) {
      return prettyDate(timestamp)
    }
  }
}
</script>
