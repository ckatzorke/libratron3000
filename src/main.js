import 'vuetify/dist/vuetify.min.css'
import 'pretty-checkbox/dist/pretty-checkbox.min.css'

import Vue from 'vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import PrettyCheckbox from 'pretty-checkbox-vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import { router } from './router'
import { store } from './store/store'
import firebase from 'firebase/app'
import 'firebase/firestore'

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
Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(PrettyCheckbox)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
