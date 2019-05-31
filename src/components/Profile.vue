<template>
  <v-container>
    <v-layout row wrap v-if="loggedIn" justify-space-around >
      <v-flex xs12  >
        <v-card class="text-xs-center pa-1 ma-3">
          <v-avatar size="125" class="text-xs-center ma-2 grey lighten-2">
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
      <v-flex xs12 sm12 md6>
        <v-card class="text-xs-center pa-1 ma-3">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <div v-else>
            <div>
              <v-btn
                flat
                to="/collection"
                class="my-2"
              ><v-icon>list</v-icon> Collection</v-btn>
            </div>
            <div>
              {{ collectionCount }} Games
            </div>
          </div>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md6>
        <v-card class="text-xs-center pa-1 ma-3">
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            class="my-2"
          ></v-progress-circular>
          <v-btn
          v-else
          flat
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
              <div class="headline">Please sign in to use Libratron 3000&trade;</div>
              <div class="title grey--text">In order to use Libratron3000&trade;, you need to sign in (using Google sign in).</div>
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
