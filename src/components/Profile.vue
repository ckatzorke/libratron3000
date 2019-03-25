<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card v-if="loggedIn">
        <v-img :src="profilePicture" contain="true" height="100"></v-img>

        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{ displayName }}</h3>
            <div>{{ email }}</div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="orange" @click="logout">
            <v-icon>meeting_room</v-icon> Logout
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Please sign in to use Libratron 3000&trade;</h3>
            <div>bla</div>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat color="orange" @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      profilePicture: this.$store.getters.getUser.photoURL,
      displayName: this.$store.getters.getUser.displayName,
      email: this.$store.getters.getUser.email
    };
  },
  computed: {
    loggedIn() {
      if (this.$store.getters.getUser === null) {
        return false;
      }
      return true;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    login() {
      this.$store.dispatch("login");
    }
  }
};
</script>

