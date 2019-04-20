import Vue from 'vue'
import VueRouter from 'vue-router'

import Collection from '@/views/Collection'
import AddGame from '@/views/AddGame'
import Dashboard from '@/views/Dashboard'
import {
  store
} from './store/store'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    component: Dashboard
  },
  {
    path: '/collection',
    component: Collection,
    beforeEnter: (to, from, next) => {
      if (store.state.user === null) {
        console.log('Not authenticated yet...')
        next('/')
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
        next('/')
      }
      next()
    }
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior() {
    return {
      x: 0, y: 0
    }
  }
})
