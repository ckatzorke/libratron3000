<template>
  <div>Home, User: {{ getUser }} <button class="btn" @click="login">Login</button></div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    login() {
      this.$store.dispatch('login')
    }
  }


}
</script>
