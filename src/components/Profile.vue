<template>
  <v-container v-if="loggedIn">
    <v-row>
      <v-col xs="12">
        <v-card class="text-center pa-1">
          <v-avatar size="125" class="text-center ma-2 grey lighten-2">
            <img :src="profilePicture"/>
          </v-avatar>
          <v-card-text>
            <div class="title">{{ displayName }}</div>
            <div class="subtitle grey--text"><v-icon flat small>email</v-icon>{{ email }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              to="/collection"
              class="my-2"
            >
              <v-icon>list</v-icon> <span class="hidden-xs-only">Collection</span>
            </v-btn>
            <v-btn
              to="/add"
              class="my-2"
            >
              <v-icon>add</v-icon> <span class="hidden-xs-only">Add Games</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="logout">
              Logout<v-icon right>exit_to_app</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row  v-if="loading">
      <v-col xs="12">
        <v-card class="text-center pa-1 fill-height">
          <v-progress-circular
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
        </v-card>
      </v-col>
    </v-row>
    <div v-else>
      <v-card>
        <v-row no-gutters>
          <v-col>
            <div class="font-weight-light text-left font-italic pa-3">
              Recently added
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters pa-3 justify-space-around>
          <v-col
            xs="3"
            sm="2"
            lg="1"
            v-for="(game) in recently"
            :key="game.id"
            class="px-3 text-center"
            >
            <div @click="showDetails(game.id)" class="hand">
              <img
                  :src="thumbnail(game.cover)"
                  height="128px"
                  width="90px"
                />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            sm="4"
          >
            <div
              class="pa-2"
            >
              <div class="py-2 text-center display-1 orange--text ">{{ collectionCount }}</div>
              <div class="body-2 text-center font-weight-light"># of Games</div>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <div
              class="pa-2"
            >
              <div class="py-2 text-center display-1 orange--text ">{{ unplayed }}</div>
              <div class="body-2 text-center font-weight-light">Unplayed</div>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <div
              class="pa-2"
            >
              <div class="py-2 text-center display-1 orange--text ">{{ addedThisMonth }}</div>
              <div class="body-2 text-center font-weight-light">Added this month</div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
              <diV>
                <lib-yearstats :year="thisYear"></lib-yearstats>
              </diV>
          </v-col>
        </v-row>
        <!-- v-row>
          <v-col>
              <diV>
                <lib-ratingspread></lib-ratingspread>
              </diV>
          </v-col>
        </v-row -->
      </v-card>
    </div>
    <v-row>
      <v-col xs="12">
        <v-card class="text-center pa-1 fill-height">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <div v-else  class="ma-3">
            <div class="body-2 text-center font-weight-bold">
              Top platforms
            </div>
            <div
              v-for="(platform) in platforms"
              :key="platform[0]"
              class="profilecontainer px-2 text-right ">
              <span class="profileleft">
                <span class="hidden-sm-and-up">{{ short(platform[0]) }}</span>
                <span class="hidden-xs-only ">{{ platform[0] }}</span>
              </span>
              <span class="profileright orange--text">{{ platform[1] }}</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col  xs="12">
        <v-card class="text-center pa-1  fill-height">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <div v-else class="ma-3">
            <div class="body-2 text-center font-weight-bold">
              Top genres
            </div>
            <div
              v-for="(genre) in genres"
              :key="genre[0]"
              class="text-left px-2">
              <span class="">{{ genre[0] }}</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <div v-else>
    <v-container>
      <v-layout>
        <v-flex xs12 justify-space-around>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h1 class="headline">Welcome to Libratron 3000&trade;</h1>
                <p class="body-2 grey--text  py-2">In order to use Libratron3000&trade;, you need to sign in (using Google sign in).</p>
              </div>
            </v-card-title>

            <div class="text-center">
              <img src="/assets/btn_google_signin_light_normal_web.png" @click="login" class="hand"/>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container>
      <v-layout>
        <v-flex xs12 justify-space-around>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h1 class="headline">What is Libratron 3000&trade;?</h1>
                <p class="body-2 grey--text py-2">
                  <strong>Libratron3000&trade;</strong> is <a href="https://github.com/ckatzorke/libratron3000" target="_blank" rel="noopener">my little side project</a>, that helps you keep track of your games collection, or - like in my case - your pile of shame.<br/>
                  See also <a href="https://piletron3000.katzorke.io/" target="_blank" rel="noopener">Piletron3000&trade;</a> to keep track of your pile of shame.
                </p>
                <p class="body-2 grey--text py-2">
                  Libratron3000&trade; uses data from the Internet Games Database, when adding a new game to your database, you are able to search for this game in the IGDB to link these entries.
                  <a href="https://www.igdb.com/" rel="noopener" target="_blank">Check out their great work!</a></p>
              </div>
            </v-card-title>

          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { toDate, prettyDate } from '@/service/utils.js'
import { coverSmall } from '@/service/igdb.js'
import { shortPlatform } from '@/service/platforms.js'
import YearStats from '@/components/YearStats.vue'

export default {
  data: () => ({
  }),
  components: {
    'lib-yearstats': YearStats
  },
  computed: {
    loggedIn() { return this.$store.getters.loggedIn },
    profilePicture() { return this.$store.getters.getUser.photoURL },
    displayName() { return this.$store.getters.getUser.displayName },
    email() { return this.$store.getters.getUser.email },
    loading() { return this.$store.getters.loading },
    recently() {
      let recently = this.$store.getters.getCollection
      return recently.sort((a, b) => {
        const pDateA = toDate(a.buydate)
        const pDateB = toDate(b.buydate)
        return pDateB.getTime() - pDateA.getTime()
      }).slice(0, 10)
    },
    collectionCount() { return this.$store.getters.getCollection.length },
    thisYear() { return new Date(Date.now()).getFullYear() },
    addedThisMonth() {
      let collection = this.$store.getters.getCollection
      let added = 0
      let now = new Date(Date.now())
      let month = now.getMonth()
      let year = now.getFullYear()
      collection.forEach(item => {
        let buydate = toDate(item.buydate)
        if (buydate.getMonth() === month && buydate.getFullYear() === year) {
          added++
        }
      })
      return added
    },
    unplayed() {
      let collection = this.$store.getters.getCollection
      return collection.filter(item => item.rating && item.rating > 0).length
    },
    platforms() {
      let gamesByPlatforms = this.$store.getters.getCollection
        .map(game => game.platform)
        .reduce((acc, current) => {
          // console.log(`reducing. adding ${current}`, acc)
          if (!acc[current]) {
            acc[current] = 0
          }
          acc[current] += 1
          return {
            ...acc
          }
        }, {}
        )
      let platforms = []
      // transform object to array for sorting
      for (var platform in gamesByPlatforms) {
        if (gamesByPlatforms.hasOwnProperty(platform)) {
          platforms.push([platform, gamesByPlatforms[platform]])
        }
      }
      // sort and select top 4
      let topPlatforms = platforms.sort((a, b) => b[1] - a[1]).slice(0, 4)
      return topPlatforms
    },
    genres() {
      let gamesByGenre = this.$store.getters.getCollection
        .map(game => game.genres)
        .flatMap(genres => genres)
        .reduce((acc, current) => {
          // console.log(`reducing. adding ${current}`, acc)
          if (!acc[current]) {
            acc[current] = 0
          }
          acc[current] += 1
          return {
            ...acc
          }
        }, {}
        )
      let genres = []
      // transform object to array for sorting
      for (var genre in gamesByGenre) {
        if (gamesByGenre.hasOwnProperty(genre)) {
          genres.push([genre, gamesByGenre[genre]])
        }
      }
      // sort and select top 10
      let topGenres = genres.sort((a, b) => b[1] - a[1]).slice(0, 10)
      console.log('Genres', genres)
      console.log('Top Genres', topGenres)
      return topGenres
    }
  },
  methods: {
    formatDate(timestamp) {
      return prettyDate(timestamp)
    },
    short(platform) {
      return shortPlatform(platform)
    },
    thumbnail(cover) {
      return coverSmall(cover)
    },
    showDetails(id) {
      this.$router.push(`/details/${id}`)
    },
    logout() {
      this.$store.dispatch('logout')
    },
    login() {
      this.$store.dispatch('login')
    }
  }
}
</script>
<style>
.hand {
  cursor: pointer;
}
.profilecontainer {
  width: 100%;
}
.profileleft {
  width: 80%;
  text-align: left;
  float: left;
}
.profileright {
  width: 20%;
  text-align: right;
  float: right;
}
</style>
