import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import router from '@/router/index'
import App from './App.vue'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2E5266',
          secondary: '#0E9488',
          accent: '#FF7A50',
          background: '#F6F3FC',
          surface: '#FFFFFF',
          error: '#EF4444',
          info: '#3B82F6',
          success: '#22C55E',
          warning: '#F5A524'
        }
      },
      dark: {
        colors: {
          primary: '#7C6FCD',
          secondary: '#4A4A6A',
          accent: '#B39DDB',
          background: '#121218',
          surface: '#1E1E2E'
        }
      }
    }
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
