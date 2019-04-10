<template>
  <v-dialog>
    <v-btn slot="activator" flat right>
      <v-icon left flat>search</v-icon>Search&nbsp;<img src="/assets/logo/igdb-icon.jpeg" height="32px" style="vertical-align: middle"/>I
    </v-btn>
    <v-card>
        <v-layout row wrap class="pa-3">
          <v-flex xs12>
            <h1 class="subheading grey--text"><img src="/assets/logo/igdb-icon.jpeg" height="32px" style="vertical-align: middle"/>&nbsp;IGDB Search</h1>
          </v-flex>
          <v-flex>
            <v-form class="px-3" v-on:submit.prevent>
              <v-text-field
                append-icon="search"
                label="Title"
                v-model="searchTerm"
                :autofocus="true"
                @keyup.stop="autoSearch"
              ></v-text-field>
              <v-btn @click="search" :loading="searching" :disabled="searching">search</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="result in results" :key="result.id">
            <v-card flat slot="header" >
              <v-layout row wrap class="pa-3">
                <v-flex xs1>
                  <v-tooltip top>
                    <v-btn
                      slot="activator"
                      flat
                      @click="selectEntry(result)"
                      >
                      <v-icon>check_box</v-icon>
                    </v-btn>
                    <span>Use this entry</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs5 md5>
                  <div class="caption grey--text">Title</div>
                  <div>
                    {{ result.name }}&nbsp;<a
                    :href="result.url"
                    target="_blank"
                    ><v-icon small>link</v-icon></a></div>
                </v-flex>
                <v-flex xs6 sm4 md2>
                  <div class="caption grey--text">Release Date</div>
                  <div>{{ displayDate(result.first_release_date) }}</div>
                </v-flex>
                <v-flex xs6 sm4 md2>
                  <div class="caption grey--text">Genres</div>
                  <div>{{ displayGenres(result.genres) }}</div>
                </v-flex>
                <v-flex xs6 sm4 md2>
                  <div class="caption grey--text">Platforms</div>
                  <div>{{ displayPlatforms(result.platforms) }}</div>
                </v-flex>
              </v-layout>
            </v-card>
            <v-card>
              <v-layout row wrap class="pa-3">
                <v-flex hidden-sm-and-down md2 text-md-center>
                  <img :src="coverImage(result.cover)" height="125">
                </v-flex>
                <v-flex xs12 sm12 md10>
                  <span>{{ result.summary }}</span>
                </v-flex>
              </v-layout>
            </v-card>
            <v-divider></v-divider>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card>
  </v-dialog>
</template>
<script>
import { format } from 'date-fns'

export default {
  data() {
    return {
      searchTerm: '',
      searching: false,
      results: []
    }
  },
  methods: {
    autoSearch(e) {
      if (e.keyCode === 13) {
        this.search()
      }
    },
    search() {
      this.searching = true
      // this.$http.get(`https://ckatzorke.lib.id/igdb@dev/search/?search=${this.searchTerm}`).then(res => {
      this.$http
        .get('/assets/results.json')
        .then(res => {
          if (res.status !== 200) {
            console.error('Error from res ', res)
          } else {
            console.log('Search response ', res)
            this.results = res.data.result
            this.searching = false
          }
        })
        .catch(e => {
          console.error(e)
          this.searching = false
        })
    },
    displayDate(timestamp) {
      if (timestamp) {
        return format(new Date(timestamp * 1000), 'DD.MM.YYYY')
      }
      return ''
    },
    coverImage(cover) {
      if (cover && cover.image_id) {
        return `https://images.igdb.com/igdb/image/upload/t_cover_big/${
          cover.image_id
        }.png`
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
