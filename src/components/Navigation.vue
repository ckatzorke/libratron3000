<template>
<div id="navigation">
  <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.text"
          active-class="grey--text"
          @click="goTo(item.to)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="goTo('/')">
          <v-list-item-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">Profile</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-layout justify-center >
        <v-btn
          v-if="loggedIn"
          outlined
          rounded
          bottom
          absolute
          to="/add"
        >
          <span class="px-2 mx-2">Add Game</span>
        </v-btn>
      </v-layout>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">Libratron3000&trade;</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout
        align-center
        justify-center
        style="max-width: 650px"
        v-if="loggedIn"
      >
        <v-text-field
          append-icon-cb="clearSearch"
          placeholder="Search..."
          single-line
          append-icon="search"
          v-model="search"
          color="white"
          @input="searchTitle"
          clearable
          hide-details
        ></v-text-field>
      </v-layout>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn text to="/" class="px-3">
          <span v-if="loggedIn">
            <img :src="profilePicture" height="40" style="border-radius: 50%"/>
          </span>
          <span v-else>
            <v-icon>account_circle</v-icon>
          </span>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>
<script>
import { setInterval, clearInterval } from 'timers'

let searchIntervalId = null

export default {
  data: () => ({
    drawer: null,
    items: [
      // { icon: 'dashboard', text: 'Dashboard', to: '/' },
      { icon: 'list', text: 'Collection', to: '/collection' },
      { icon: 'all_out', text: 'Showroom', to: '/showroom' }, // TODO userid
      { icon: 'pie_chart', text: 'Statistics', to: '/statistics' },
      // { icon: 'add', text: 'Add', to: '/add' },
      { icon: 'compare_arrows', text: 'Loan Status', to: '/loan' },
      { icon: 'help_outline', text: 'About', to: '/about' }
    ],
    search: ''
  }),
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    profilePicture() {
      return this.$store.getters.getUser.photoURL
    }
  },
  methods: {
    goTo(path) {
      this.$router.push(path)
    },
    searchTitle() {
      clearInterval(searchIntervalId)
      searchIntervalId = setInterval(() => {
        clearInterval(searchIntervalId)
        this.$store.commit('updateSearchFilter', this.search)
        this.$router.push('/collection')
      }, 500)
    },
    clearSearch() {
      this.search = ''
      this.$store.commit('updateSearchFilter', this.search)
    }
  }
}
</script>
