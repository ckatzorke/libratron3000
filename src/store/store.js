import Vue from 'vue'
import Vuex from 'vuex'

import platforms from '@/service/platforms'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { router } from '@/router'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    notification: {
      timeout: 5000,
      show: false,
      text: ''
    },
    user: null,
    queryOptions: {
      sort: 'number',
      direction: 'desc'
    },
    loading: false,
    collection: null,
    platforms
  },
  getters: {
    /**
     * Get the user from state
     */
    getUser: state => state.user,
    /**
     * Get the actual login state (true|false)
     */
    loggedIn: state => {
      if (state.user === null) {
        return false
      }
      return true
    },
    /**
     * Get the collection from state
     */
    getCollection: state => {
      return state.collection
    },
    /**
     * indicates if the collection is currently loading
     */
    loading: state => {
      return state.loading
    },
    /**
     * Get the list of actually defined platforms
     */
    getPlatforms: state => {
      return state.platforms
    }
  },
  mutations: {
    updateNotification: (state, newNotification) => {
      // merge the objects
      state.notification = newNotification
    },
    updateUser: (state, user) => {
      state.user = user
    },
    updateCollection: (state, collection) => {
      state.collection = collection
    },
    updateLoading: (state, loading) => {
      state.loading = loading
    }
  },
  actions: {
    // notify stuff
    /**
     * Displays a notification/snackbar
     */
    notify: (context, text) => {
      let notification = context.state.notification
      notification.text = text
      notification.show = true
      context.commit('updateNotification', notification)
    },
    /**
     * Hdes the notification in any case
     */
    hideNotification: context => {
      let notification = context.state.notification
      notification.show = false
      context.commit('updateNotification', notification)
    },
    // login stuff
    /**
     * Try to autologin during app creation, when user was already logged in to Google.
     */
    bootstrapLogin: context => {
      const auth = firebase.auth()
      auth.onAuthStateChanged(user => {
        console.log('AuthState changed. User:', user)
        if (user) {
          console.log('User is logged in, updateing state', user)
          context.commit('updateUser', user)
          console.log('Updating user collection')
          context.dispatch('loadCollection')
        } else {
          console.log('User is not logged in. Redirecting to Profile/Login')
          context.commit('updateUser', null)
          context.commit('updateCollection', [])
          router.push('/profile')
        }
      })
    },
    /**
     * Logs in using firebase and Google.
     */
    login: context => {
      const auth = firebase.auth()
      auth
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          const provider = new firebase.auth.GoogleAuthProvider()
          return firebase.auth().signInWithPopup(provider)
        })
        .then(result => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const token = result.credential.accessToken;
          // The signed-in user info.
          // the state update is done in the onAuthStateChangedHandler
        })
        .catch(error => {
          console.error('Error occured during login', error)
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          const email = error.email
          // The firebase.auth.AuthCredential type that was used.
          const credential = error.credential
          console.error(
            'Error logging in',
            errorCode,
            errorMessage,
            email,
            credential
          )
          context.commit('updateUser', null)
        })
    },
    /**
     * Logs out.
     */
    logout: context => {
      const auth = firebase.auth()
      auth
        .signOut()
        .then(() => {
          console.log('Successfully signed out')
          context.commit('updateUser', null)
        })
        .catch(error => {
          console.error('Error occured during signout', error)
        })
    },
    // firestore stuff
    /**
     * Loads all collectionEntries and updates the global store.
     */
    loadCollection: (context, opt) => {
      context.commit('updateLoading', true)
      let options = opt || context.state.queryOptions
      let collection = []
      const db = firebase.firestore()
      db.collection(`users/${context.state.user.uid}/collection`)
        .orderBy(options.sort, options.direction)
        .onSnapshot(res => {
          const changes = res.docChanges()
          changes.forEach(change => {
            if (change.type === 'added') {
              console.log('adding ' + change.doc.data().title)
              collection.push({
                ...change.doc.data(),
                id: change.doc.id
              })
            } // TODO delete & modify
          })
          context.commit('updateCollection', collection)
          context.commit('updateLoading', false)
          context.dispatch('notify', `Collection successfully loaded <br>${collection.length} entries added.`)
        })
    },
    /**
     * Adds the given game to collection
     */
    addGame: (context, game) => {
      const db = firebase.firestore()
      db.collection(`users/${context.state.user.uid}/collection`).add(game)
        .then(function(docRef) {
          console.log('Document written with ID: ', docRef.id)
        })
        .catch(function(error) {
          console.error('Error adding document: ', error)
        })
    }
  }
})
