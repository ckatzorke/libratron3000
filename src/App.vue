<template>
  <div id="app">
    <v-app id="inspire" light>
      <lib-navbar></lib-navbar>

      <v-content>
          <router-view></router-view>
      </v-content>
      <!-- v-footer app fixed>
        <span class="mx-3">&copy; 2019</span>
      </v-footer  -->
    </v-app>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'libratron3000',
  components: {
    'lib-navbar': Navbar
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
