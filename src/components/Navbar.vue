<template>
<nav>
  <v-toolbar app flat>
    <lib-notification></lib-notification>
    <v-toolbar-side-icon @click.stop="drawer = !drawer" class="grey--text"></v-toolbar-side-icon>
    <v-toolbar-title>
      <div>
        <span class="font-weight-light">Libratron</span><span class="font-weight-medium">3000</span><span>&trade;</span>
      </div>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat to="/">
        <span v-if="loggedIn">
          <img :src="profilePicture" height="40" style="border-radius: 50%"/>
        </span>
        <span v-else>
          <v-icon>account_circle</v-icon>
        </span>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>

  <v-navigation-drawer
      v-model="drawer"
      class=""
      dark
      app
    >
      <v-list>
        <v-list-tile
          v-for="item in navitems"
          :key="item.label"
          router :to="item.to"
          active-class="grey--text"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.label }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
</nav>
</template>
<script>
import Notification from './Notification'
export default {
  components: {
    'lib-notification': Notification
  },
  data() {
    return {
      drawer: false,
      navitems: [
        { icon: 'dashboard', label: 'Dashboard', to: '/' },
        { icon: 'list', label: 'Collection', to: '/collection' },
        { icon: 'add', label: 'Add', to: '/add' }
      ]
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
