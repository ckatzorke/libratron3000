<template>
  <v-container>
    <v-layout row wrap v-if="loggedIn" justify-space-around >
      <v-flex xs12  >
        <v-card class="text-center pa-1 ma-3">
          <v-avatar size="125" class="text-center ma-2 grey lighten-2">
            <img :src="profilePicture"/>
          </v-avatar>
          <v-card-text>
            <div class="title">{{ displayName }}</div>
            <div class="subtitle grey--text"><v-icon flat small>email</v-icon>{{ email }}</div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="logout">
              Logout<v-icon right>exit_to_app</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
        <v-card class="text-xs-center pa-1 ma-3">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <div v-else  class="text-center">
            <div>
              <span class="display-4">
                {{ collectionCount }}
              </span>
              <span>Games</span>
            </div>
            <div>
              <v-btn
                rounded
                to="/collection"
                class="my-2"
              ><v-icon>list</v-icon> Collection</v-btn>
            </div>
          </div>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
        <v-card class="text-center pa-1 ma-3">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <v-btn
            v-else
            rounded
            to="/add"
            class="my-2"
            >
            <v-icon>add</v-icon> Add Game</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else>
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
export default {
  data() {
    return {

    }
  },
  computed: {
    loggedIn() { return this.$store.getters.loggedIn },
    profilePicture() { return this.$store.getters.getUser.photoURL },
    displayName() { return this.$store.getters.getUser.displayName },
    email() { return this.$store.getters.getUser.email },
    loading() { return this.$store.getters.loading },
    collectionCount() { return this.$store.getters.getCollection.length }
  },
  methods: {
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
