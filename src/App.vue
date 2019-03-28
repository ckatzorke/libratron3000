<template>
  <div id="app">
    <v-app id="inspire" light>
      <lib-toolbar></lib-toolbar>

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
