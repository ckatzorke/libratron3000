import Vue from 'vue'
import VueRouter from 'vue-router'

import Collection from '@/views/Collection'
import Statistics from '@/views/Statistics'
import AddGame from '@/views/AddGame'
import Dashboard from '@/views/Dashboard'
import Details from '@/views/Details'
import LoanStatus from '@/views/LoanStatus'
import About from '@/views/About'

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
      } else {
        next()
      }

    }
  },
  {
    path: '/statistics',
    component: Statistics,
    beforeEnter: (to, from, next) => {
      if (store.state.user === null) {
        console.log('Not authenticated yet...')
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/details/:id',
    component: Details,
    beforeEnter: (to, from, next) => {
      if (store.state.user === null) {
        console.log('Not authenticated yet...')
        next('/')
      } else {
        next()
      }

    }
  },
  {
    path: '/add',
    component: AddGame,
    beforeEnter: (to, from, next) => {
      if (store.state.user === null) {
        console.log('Not authenticated yet...')
        next('/')
      } else {
        next()
      }

    }
  },
  {
    path: '/loan',
    component: LoanStatus,
    beforeEnter: (to, from, next) => {
      if (store.state.user === null) {
        console.log('Not authenticated yet...')
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/about',
    component: About
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
