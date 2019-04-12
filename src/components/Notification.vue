<template>
  <v-snackbar v-model="notification.show" :timeout="notification.timeout" top>
    <span v-html="notification.text" class="ma-3"></span>
    <v-btn color="pink" flat @click="hideNotification">Close</v-btn>
  </v-snackbar>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['notification'])
  },
  methods: {
    hideNotification() {
      this.$store.dispatch('hideNotification')
    }
  }
}
</script>
