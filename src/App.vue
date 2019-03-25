<template>
  <div id="app">
     <v-app id="inspire" light>
      <v-navigation-drawer
        clipped
        fixed
        v-model="drawer"
        :mini-variant="mini"
        hide-overlay
        stateless
        app
      >
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-btn
                icon
                @click.stop="mini = !mini"
              >
                <v-icon>{{ menuFlyoutDirection }}</v-icon>
              </v-btn>

              <v-list-tile-content>
                <v-list-tile-title>Choose your fate</v-list-tile-title>
              </v-list-tile-content>

            </v-list-tile>
          </v-list>
        </v-toolbar>

        <v-list class="pt-0">
          <v-divider></v-divider>
          <v-list-tile @click.stop="go('/')">
            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Home
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile  @click.stop="go('/collection')">
            <v-list-tile-action>
              <v-icon>list</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              View collection
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile  @click.stop="go('/import')">
            <v-list-tile-action>
              <v-icon>input</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              Import Collection
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app fixed clipped-left>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Libratron3000</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat @click.stop="go('/profile')"><v-icon>account_circle</v-icon></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <router-view></router-view>
        </v-container>
      </v-content>
      <v-footer app fixed>
        <span>&copy; 2019</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Collection from './components/Collection.vue'
import Import from './components/Import.vue'

import firebase from 'firebase'

export default {
  name: 'libratron3000',
  components: {
    'lib-home': Home,
    'lib-collection': Collection,
    'lib-import': Import
  },
  data () {
    return {
      drawer: true,
      mini: true
    }
  },
  props: {
    source: String
  },
  methods: {
    go(path) {
      this.$router.push(path)
    }
  },
  computed: {
    menuFlyoutDirection() {
      return this.mini ? 'chevron_right' : 'chevron_left'
    }
  },
  created() {
    console.log('Created... Logging in.')
    this.$store.dispatch('bootstrapLogin')
  }
}
</script>

<style>
</style>
