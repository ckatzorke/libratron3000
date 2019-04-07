<template>
  <v-container>
    <v-layout row wrap px-2>
      <v-flex xs12 ma-5 text-xs-center>
        <v-card>
          <v-card-title>
            <h2>Add a new game (#{{ collectionNumberAdd }})</h2>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3">
              <v-text-field label="Title" v-model="game.title"></v-text-field>
              <v-btn @click="add">Add</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      game: {
        title: '',
        description: '',
        platforms: [],
        notes: '',
        tags: [],
        release: null,
        buydate: null,
        genres: []
      }
    }
  },
  methods: {
    add() {
      console.log('ADD')
    }
  },
  computed: {
    collectionNumberAdd() {
      let largest = this.$store.state.collection.map(v => v.number).reduce((prev, current) => prev > current ? prev : current)
      return largest + 1
    }
  }
}
</script>
