<template>
  <v-container>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card v-if="loggedIn" >
        <v-img :src="profilePicture" contain height="100" position="center center"></v-img>

        <v-card-title primary-title>
          <div>
            <h3 class="display-1">{{ displayName }}</h3>
            <div>{{ email }}</div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="logout">
            Logout<v-icon right>exit_to_app</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title primary-title>
          <div>
            <h3 class="display-1">Please sign in to use Libratron 3000&trade;</h3>
            <div>In order to use Libratron3000&trade;, you need to sign in (using Google sign in).</div>
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
