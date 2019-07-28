import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
// import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi' // default - only for display purposes
  }
})
