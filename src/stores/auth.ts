import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '@/firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserSessionPersistence,
  setPersistence,
  type User
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loggedIn = computed(() => user.value !== null)

  function bootstrapAuth(onLogin: () => void, onLogout: () => void) {
    onAuthStateChanged(auth, (u) => {
      user.value = u
      if (u) {
        onLogin()
      } else {
        onLogout()
      }
    })
  }

  async function login() {
    await setPersistence(auth, browserSessionPersistence)
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  async function logout() {
    await signOut(auth)
  }

  return { user, loggedIn, bootstrapAuth, login, logout }
})
