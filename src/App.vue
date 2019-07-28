<template>
  <v-app id="libratron">
    <lib-navigation/>
    <lib-notification></lib-notification>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation'
import Notification from './components/Notification'
export default {
  props: {
    source: String
  },
  components: {
    'lib-navigation': Navigation,
    'lib-notification': Notification
  },
  data: () => ({
  }),
  created() {
    this.$vuetify.theme.dark = true
    console.log('Created... Logging in.')
    this.$store.dispatch('bootstrapLogin')
  }
}
</script>
