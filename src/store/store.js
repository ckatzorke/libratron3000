import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

import { router } from '../router'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null
  },
  getters: {
    getUser: state => state.user,
    loggedIn: state => {
      if (state.user === null) {
        return false
      }
      return true
    }
  },
  mutations: {
    updateUser: (state, user) => {
      state.user = user
    }
  },
  actions: {
    bootstrapLogin: context => {
      const auth = firebase.auth()
      auth.onAuthStateChanged((user) => {
        console.log('Bootstrap User:', user)
        if (user) {
          console.log('User is already logged in, updateing state', user)
          context.commit('updateUser', user)
          router.push('/collection')
        } else {
          console.log('User is not logged in. Redirecting to Profile/Login')
          context.commit('updateUser', null)
          router.push('/profile')
        }
      })
    },
    login: context => {
      const auth = firebase.auth()
      auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
        const provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider)
      }).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user
        console.log('Login done, updating user', user)
        context.commit('updateUser', user)
        // ...
      }).catch(error => {
        console.error('Error occured during login', error)
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.email
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential
        console.error('Error logging in', errorCode, errorMessage, email, credential)
        context.commit('updateUser', null)
      })
    },
    logout: context => {
      const auth = firebase.auth()
      auth.signOut()
        .then(() => {
          console.log('Successfully signed out')
          context.commit('updateUser', null)
        })
        .catch(error => {
          console.error('Error occured during signout', error)
        })
    }
  }
})
