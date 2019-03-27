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
        <lib-toolbar></lib-toolbar>

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
import Toolbar from './components/Toolbar.vue'

export default {
  name: 'libratron3000',
  components: {
    'lib-toolbar': Toolbar
  },
  data() {
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
