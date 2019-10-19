import Vue from 'vue'
import Vuex from 'vuex'

import { platforms } from '@/service/platforms'

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
    displaySettings: {
      filter: '',
      sortOrder: 'ID', // ID, NAME, RATING
      page: 1
    },
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
     * returns the part of the collection that is currently displayed (regarding sorting, filtering, paging)
     */
    getDisplayCollection: state => {
      let dc = []
      let collectionListSize = 20
      // filter all sold games
      // dc = state.collection.filter(g => !g.sellDate)
      dc = state.collection
      if (state.displaySettings.filter) {
        dc = dc.filter(c => c.title.toLowerCase().indexOf(state.displaySettings.filter.toLowerCase()) > -1)
      }
      return dc.slice((state.displaySettings.page - 1) * collectionListSize, (state.displaySettings.page) * collectionListSize)
    },
    getDisplaySettings: state => {
      return state.displaySettings
    },
    /**
     * Filters the actual collection by sold games. A sold game contains a timestamp when it was sold.
     */
    getSoldGames: state => {
      return state.collection.filter(g => g.sellDate)
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
    },
    updateSearchFilter: (state, filtertext) => {
      state.displaySettings.filter = filtertext
    },
    updateSortOrder: (state, sortOrder) => {
      state.displaySettings.sortOrder = sortOrder
    },
    updateDisplayPage: (state, page) => {
      state.displaySettings.page = page
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
          router.push('/')
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
            // console.log('Change type =', change.type)
            if (change.type === 'added') {
              console.log('adding ' + change.doc.data().title)
              collection.push({
                ...change.doc.data(),
                id: change.doc.id
              })
            }
            if (change.type === 'modified') {
              console.log('updating ' + change.doc.data().title)
              collection.forEach((c, index) => {
                if (c.id === change.doc.id) {
                  console.log('updating existing entry....')
                  c = {
                    ...change.doc.data()
                  }
                  console.log('old', collection[index])
                  console.log('new', c)
                  collection[index] = c
                }
              })
              context.commit('updateCollection', collection)
            }
            if (change.type === 'removed') {
              console.log('removing ' + change.doc.data().title)
              collection.forEach((c, index) => {
                if (c.id === change.doc.id) {
                  console.log('removing existing entry....')
                  collection.splice(index, 1)
                }
              })
              context.commit('updateCollection', collection)
            }
          })
          // sort
          context.commit('updateCollection', collection)
          context.dispatch('sort', context.state.displaySettings.sortOrder)
          context.commit('updateLoading', false)
          // context.dispatch('notify', `Added ${changes.length} entries.`)
        })
    },
    /**
     * Sorts the entries according given order
     */
    sort: (context, orderBy) => {
      debugger
      const sortOrder = orderBy
      let collection = context.state.collection
      if (sortOrder === 'NAME') {
        context.commit('updateSortOrder', sortOrder)
        collection.sort((a, b) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1
          }
          if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1
          }
          return 0
        })
      } else if (sortOrder === 'RATING') {
        context.commit('updateSortOrder', sortOrder)
        collection.sort((a, b) => {
          const ratingA = a.rating ? a.rating : 0
          const ratingB = b.rating ? b.rating : 0
          return ratingB - ratingA
        })
      } else if (sortOrder === 'PLATFORM') {
        context.commit('updateSortOrder', sortOrder)
        collection.sort((a, b) => {
          if (a.platform.toLowerCase() < b.platform.toLowerCase()) {
            return -1
          }
          if (a.platform.toLowerCase() > b.platform.toLowerCase()) {
            return 1
          }
          return 0
        })
      } else {
        // Default is ID
        context.commit('updateSortOrder', 'ID')
        collection.sort((a, b) => b.number - a.number)
      }
      context.commit('updateCollection', collection)
    },
    /**
     * Adds the given game to collection
     */
    addGame: (context, game) => {
      const db = firebase.firestore()
      db.collection(`users/${context.state.user.uid}/collection`).add(game)
        .then(function(docRef) {
          console.log('Document written with ID: ', docRef.id)
          context.commit('updateCollection', context.state.collection)
          context.dispatch('notify', `Added '${game.title}' to collection.`)
        })
        .catch(function(error) {
          console.error('Error adding document: ', error)
          context.dispatch('notify', 'Document could not be added!')
        })
    },
    /**
     * Updates an existing game entry. paylouad must contain a field 'id' and an object 'values' with the fields that should be merged with the original doc.
     */
    updateGame: (context, payload) => {
      const db = firebase.firestore()
      const gameRef = db.collection(`users/${context.state.user.uid}/collection`).doc(payload.id)
      console.log(`Updating doc '${payload.id}' with:`, payload.values)
      gameRef.set({
        ...payload.values
      }, { merge: true })
        .then(() => {
          console.log('Updated.')
          context.commit('updateCollection', context.state.collection)
          context.dispatch('notify', `Updated successfully.`)
        })
        .catch(function(error) {
          console.error('Error updating document: ', error)
          context.dispatch('notify', 'Document could not be updated!')
        })
    },
    deleteGame: (context, game) => {
      const db = firebase.firestore()
      db.collection(`users/${context.state.user.uid}/collection`).doc(game.id).delete()
        .then(function() {
          console.log('Document deleted')
          context.commit('updateCollection', context.state.collection)
          context.dispatch('notify', `Removed from collection.`)
        })
        .catch(function(error) {
          console.error('Error removing document: ', error)
          context.dispatch('notify', 'Document could not be removed!')
        })
    }
  }
})
