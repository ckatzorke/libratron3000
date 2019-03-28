<template>
  <v-toolbar app fixed clipped-left>
    <!--v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon-->
    <v-toolbar-title>
      <div @click.stop="go('/')">
        <span class="font-weight-light">Libratron</span><span class="font-weight-medium">3000</span><span>&trade;</span>
      </div>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat to="/collection"><v-icon>list</v-icon></v-btn>
      <v-btn flat to="/import"><v-icon>input</v-icon></v-btn>
      <v-btn flat to="/profile">
        <span v-if="loggedIn">
          <img :src="profilePicture" height="40" style="border-radius: 50%"/>
        </span>
        <span v-else>
          <v-icon>account_circle</v-icon>
        </span>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    profilePicture() {
      return this.$store.getters.getUser.photoURL
    }
  },
  methods: {
  }
}
</script>
