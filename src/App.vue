<template>
  <v-app>
    <AppNavigation v-if="authStore.loggedIn" />
    <v-main>
      <router-view />
    </v-main>
    <AddGameFab v-if="authStore.loggedIn" />
    <AppNotification />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCollectionStore, setCurrentUid } from '@/stores/collection'
import AppNavigation from '@/components/AppNavigation.vue'
import AddGameFab from '@/components/AddGameFab.vue'
import AppNotification from '@/components/AppNotification.vue'

const router = useRouter()
const authStore = useAuthStore()
const collectionStore = useCollectionStore()

onMounted(() => {
  authStore.bootstrapAuth(
    () => {
      const uid = authStore.user!.uid
      setCurrentUid(uid)
      collectionStore.loadCollection(uid)
      if (router.currentRoute.value.path === '/') {
        router.push('/dashboard')
      }
    },
    () => {
      collectionStore.clearCollection()
      router.push('/')
    }
  )
})
</script>
