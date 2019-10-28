<template>
  <v-container v-if="loggedIn">
    <v-row>
      <v-col xs="12">
        <v-card class="text-center pa-1 ma-3">
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
    <v-row>
      <v-col xs="12" sm="6">
        <v-card class="text-center pa-1 ma-3 fill-height">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <div v-else>
            <div class="body-1 text-center font-weight-bold">
              # of Games
            </div>
            <div class="py-2 text-right display-1 orange--text ">
              {{ collectionCount }}
            </div>
            <div class="body-1 text-center font-weight-bold">
              Unplayed
            </div>
            <div class="py-2 text-right display-1 orange--text ">
              {{ unplayed }}
            </div>
            <div class="body-1 text-center font-weight-bold">
              Added {{ thisYear }}
            </div>
            <div class="py-2 text-right display-1 orange--text ">
              {{ addedThisYear }}
            </div>
            <div class="body-1 text-center font-weight-bold">
              Played {{ thisYear }}
            </div>
            <div class="py-2 text-right display-1 orange--text ">
              {{ playedThisYear }}
            </div>
            <div class="body-1 text-center font-weight-bold">
              Added this month
            </div>
            <div class="py-2 text-right display-1 orange--text ">
              {{ addedThisMonth }}
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col xs="12" sm="6">
        <v-card class="text-center pa-1 ma-3 fill-height">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <div v-else>
            <div class="body-1 text-center font-weight-bold">
              Finished {{ thisYear }}
            </div>
            <div class="py-2 text-right display-1 orange--text ">
              {{ finishedThisYear.length }}
            </div>
            <div class="text-left">
              <div
                v-for="finished in finishedThisYear"
                :key="finished.id">
                {{ finished.title }} ({{ formatDate(finished.completiondate) }}) - {{ finished.rating }}/10
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col xs="12" sm="6">
        <v-card class="text-center pa-1 ma-3 fill-height">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <div v-else>
            <div class="body-1 text-center font-weight-bold">
              Top platforms
            </div>
            <div
              v-for="(platform) in platforms"
              :key="platform[0]"
              class="platformcontainer px-2 text-right orange--text">
              <span class="platformleft">
                <span class="hidden-lg-and-up">{{ short(platform[0]) }}</span>
                <span class="hidden-md-and-down">{{ platform[0] }}</span>
              </span>
              <span class="platformright">{{ platform[1] }}</span>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col xs="12" sm="6">
        <v-card class="text-center pa-1 ma-3 fill-height">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <div v-else>
            <div class="body-1 text-center font-weight-bold">
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
  <v-container v-else>
    <v-layout>
      <v-flex xs12 justify-space-around>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h1 class="headline">Please sign in to use Libratron 3000&trade;</h1>
              <p class="body-2 grey--text py-2">
                <strong>Libratron3000&trade;</strong> is <a href="https://github.com/ckatzorke/libratron3000" target="_blank" rel="noopener">my little side project</a>, that helps you keep track of your games collection, or - like in my case - your pile of shame.<br/>
                See also <a href="https://piletron3000.katzorke.io/" target="_blank" rel="noopener">Piletron3000&trade;</a> to keep track of your pile of shame.
              </p>
              <p class="body-2 grey--text py-2">
                Libratron3000&trade; uses data from the Internet Games Database, when adding a new game to your database, you are able to search for this game in the IGDB to link these entries.
                <a href="https://www.igdb.com/" rel="noopener" target="_blank">Check out their great work!</a></p>
              <p class="subheading  py-2">In order to use Libratron3000&trade;, you need to sign in (using Google sign in).</p>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn  @click="login">
              Login<v-icon right>perm_identity</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { toDate, prettyDate } from '@/service/utils.js'
import { shortPlatform } from '@/service/platforms.js'

export default {
  data: () => ({
  }),
  components: {
  },
  computed: {
    loggedIn() { return this.$store.getters.loggedIn },
    profilePicture() { return this.$store.getters.getUser.photoURL },
    displayName() { return this.$store.getters.getUser.displayName },
    email() { return this.$store.getters.getUser.email },
    loading() { return this.$store.getters.loading },
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
    addedThisYear() {
      let collection = this.$store.getters.getCollection
      let added = 0
      let now = new Date(Date.now())
      let year = now.getFullYear()
      collection.forEach(item => {
        let buydate = toDate(item.buydate)
        if (buydate.getFullYear() === year) {
          added++
        }
      })
      return added
    },
    playedThisYear() {
      let collection = this.$store.getters.getCollection
      let played = 0
      let now = new Date(Date.now())
      let year = now.getFullYear()
      collection.forEach(item => {
        let buydate = toDate(item.buydate)
        if (buydate.getFullYear() === year && item.rating && item.rating > 0) {
          played++
        }
      })
      return played
    },
    finishedThisYear() {
      let collection = this.$store.getters.getCollection
      let thisYear = new Date(Date.now()).getFullYear()
      let finished = collection
        .filter(item => item.completiondate)
        .filter(item => toDate(item.completiondate).getFullYear() === thisYear && item.completed)
        .sort((a, b) => {
          const ratingA = a.rating ? a.rating : 0
          const ratingB = b.rating ? b.rating : 0
          return ratingB - ratingA
        })
      return finished
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
    testNotify() {
      this.$store.dispatch('notify', 'Hellooooo')
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
.platformcontainer {
  width: 100%;
}
.platformleft {
  width: 80%;
  text-align: left;
  float: left;
}
.platformright {
  width: 20%;
  text-align: right;
  float: right;
}
</style>
