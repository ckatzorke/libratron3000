import 'vuetify/dist/vuetify.min.css'

import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import Vuetify from 'vuetify'
import { router } from './router'
import { store } from './store/store'
import firebase from 'firebase'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBUVKVrviQcGO7Po1cb16X538jufZ-o9dA',
  authDomain: 'piletron3000.firebaseapp.com',
  databaseURL: 'https://piletron3000.firebaseio.com',
  projectId: 'piletron3000',
  storageBucket: 'piletron3000.appspot.com',
  messagingSenderId: '302651587220'
}
firebase.initializeApp(config)

// initialize Vue
Vue.use(Vuetify)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
