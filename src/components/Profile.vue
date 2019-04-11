<template>
  <v-container>
    <v-layout row wrap v-if="loggedIn">
      <v-flex xs12 justify-space-around>
        <v-card class="text-xs-center ma-3">
          <v-avatar size="150" class="text-xs-center ma-2 grey lighten-2">
            <img :src="profilePicture"/>
          </v-avatar>
          <v-card-text>
            <div class="headline">{{ displayName }}</div>
            <div class="title grey--text"><v-icon flat>email</v-icon>{{ email }}</div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="logout">
              Logout<v-icon right>exit_to_app</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs6 justify-space-around>
        <v-card>
          <v-btn
          flat
          to="/add"
          >
            <v-icon>add</v-icon>Add Game</v-btn>
        </v-card>
      </v-flex>
      <v-flex xs6 justify-space-around>
        <v-card>
          <v-btn
            flat
            to="/collection"
          ><v-icon>list</v-icon> Collection</v-btn>
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
    email() { return this.$store.getters.getUser.email }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    login() {
      this.$store.dispatch('login')
    }
  }
}
</script>
