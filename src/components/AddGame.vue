<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h2>Add a new game (#{{ collectionNumberAdd }})</h2>
        <v-spacer/>
        <lib-search></lib-search>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                label="Title"
                v-model="game.title"
                prepend-icon="title"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                label="Description"
                v-model="game.description"
                prepend-icon="description"
              ></v-textarea>
            </v-flex>
            <v-flex xs12 md4 lg3 px-1>
              <v-combobox
                v-model="game.platform"
                :items="getPlatforms"
                label="Platform"
                prepend-icon="airplay"
              ></v-combobox>
            </v-flex>
            <v-flex xs12 md4 lg3 px-1>
              <v-menu>
                <v-text-field
                  slot="activator"
                  :value="formatBuyDate"
                  label="Date of purchase"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="game.buydate" @input="menu2 = false"></v-date-picker>
              </v-menu>
            </v-flex>
            <!-- TODO add possible tags from backend :items="items"-->
            <v-flex xs12 md4 lg4 px1>
              <v-combobox
                v-model="game.tags"
                label="Tags"
                multiple
                prepend-icon="label"
              ></v-combobox>
            </v-flex>
            <v-flex xs12 md4 lg2 px-1>
              <v-checkbox
                v-model="game.digital"
                label="Digital"
                prepend-icon="cloud_download"
              ></v-checkbox>
            </v-flex>
            <v-flex xs12>
              <v-btn @click="add">Add</v-btn>
              {{ game }}
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import SearchGame from './SearchGame'

import format from 'date-fns/format'
export default {
  components: {
    'lib-search': SearchGame
  },
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
        digital: false,
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
      let largest = this.$store.state.collection
        .map(v => v.number)
        .reduce((prev, current) => (prev > current ? prev : current))
      return largest + 1
    },
    formatBuyDate() {
      return this.game.buydate ? format(this.game.buydate, 'DD.MM.YYYY') : ''
    },
    ...mapGetters([
      'getPlatforms'
    ])

  }
}
</script>
