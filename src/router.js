import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './components/Home'
import Collection from './components/Collection'
import AddGame from './components/AddGame'
import Profile from './components/Profile'
import {
  store
} from './store/store'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/collection',
    component: Collection,
    beforeEnter: (to, from, next) => {
      if (store.state.user === null) {
        console.log('Not authenticated yet...')
        next('/profile')
      }
      next()
    }
  },
  {
    path: '/add',
    component: AddGame,
    beforeEnter: (to, from, next) => {
      if (store.state.user === null) {
        console.log('Not authenticated yet...')
        next('/profile')
      }
      next()
    }
  },
  {
    path: '/profile',
    component: Profile
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes
})
