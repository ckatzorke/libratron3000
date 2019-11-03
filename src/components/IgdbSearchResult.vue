<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="result in searchResults" :key="result.id">
      <v-expansion-panel-header>
        <v-layout row wrap class="pa-3">
          <v-flex xs6>
            <div class="caption grey--text">Title</div>
            <div>
              {{ result.name }}&nbsp;
              <a :href="result.url" target="_blank">
                <v-icon small>link</v-icon>
              </a>
            </div>
          </v-flex>
          <v-flex xs6 sm6 md2>
            <div class="caption grey--text">Release Date</div>
            <div>{{ displayDate(result.first_release_date) }}</div>
          </v-flex>
          <v-flex xs6 sm6 md2>
            <div class="caption grey--text">Genres</div>
            <div>{{ displayGenres(result.genres) }}</div>
          </v-flex>
          <v-flex xs6 sm6 md2>
            <div class="caption grey--text">Platforms</div>
            <div>{{ displayPlatforms(result.platforms) }}</div>
          </v-flex>
        </v-layout>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-layout row wrap class="pa-3">
          <v-flex hidden-sm-and-down md2 text-md-center>
            <img :src="coverImage(result.cover)" height="125" />
          </v-flex>
          <v-flex xs12 sm12 md10>
            <div v-html="result.summary"></div>
            <div>
              <v-btn @click="selectEntry(result)">
                <v-icon small>check_box</v-icon>Use this entry
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import { format } from 'date-fns'
import { coverBig } from '@/service/igdb.js'

export default {
  props: ['searchResults'],
  methods: {
    selectEntry(entry) {
      this.$emit('entrySelected', entry)
    },
    displayDate(timestamp) {
      if (timestamp) {
        return format(new Date(timestamp * 1000), 'DD.MM.YYYY')
      }
      return ''
    },
    coverImage(cover) {
      if (cover && cover.image_id) {
        return coverBig(cover.image_id)
      }
      return '' // todo placeholder
    },
    displayGenres(genres) {
      if (genres) {
        return genres.map(g => g.name).join(', ')
      }
      return 'n/a'
    },
    displayPlatforms(platforms) {
      if (platforms) {
        return platforms.map(p => p.name).join(', ')
      }
      return 'n/a'
    }
  }
}
</script>
