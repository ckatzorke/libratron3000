import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

import { router } from '../router'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    collection: null
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
    }

  },
  mutations: {
    updateUser: (state, user) => {
      state.user = user
    },
    updateCollection: (state, collection) => {
      state.collection = collection
    }
  },
  actions: {
    // login stuff
    /**
     * Try to autologin during app creation, when user was already logged in to Google.
     */
    bootstrapLogin: context => {
      const auth = firebase.auth()
      auth.onAuthStateChanged((user) => {
        console.log('Bootstrap User:', user)
        if (user) {
          console.log('User is already logged in, updateing state', user)
          context.commit('updateUser', user)
        } else {
          console.log('User is not logged in. Redirecting to Profile/Login')
          context.commit('updateUser', null)
          router.push('/profile')
        }
      })
    },
    /**
     * Logs in using firebase and Google.
     */
    login: context => {
      const auth = firebase.auth()
      auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
        const provider = new firebase.auth.GoogleAuthProvider()
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
    /**
     * Logs out.
     */
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
    },
    // firestore stuff
    /**
     * Loads all collectionEntries and updates the global store.
     */
    loadCollection: (context, opt) => {
      let options = opt || {
        orderBy: 'title'
      }
      let db = firebase.firestore()
      let collection = []
      db.collection(`users/${context.state.user.uid}/collection`).orderBy(options.orderBy).limit(25).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          collection.push(doc.data())
        })
        context.commit('updateCollection', collection)
      })
    }
  }
})
