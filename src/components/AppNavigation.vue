<template>
  <div>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item
        :prepend-avatar="authStore.user?.photoURL ?? undefined"
        :title="authStore.user?.displayName ?? ''"
        :subtitle="authStore.user?.email ?? ''"
        nav
      />
      <v-divider />
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.path"
          @click="drawer = false"
        />
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn block variant="outlined" prepend-icon="mdi-logout" @click="logout">
            Sign out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>
        <router-link to="/dashboard" class="text-decoration-none text-white">
          Libratron 3000+
        </router-link>
      </v-app-bar-title>
      <template #append>
        <v-text-field
          v-model="searchText"
          density="compact"
          variant="solo-filled"
          placeholder="Search collection..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
          class="mr-2"
          style="max-width: 260px"
          @update:model-value="onSearch"
          @click:clear="clearSearch"
        />
      </template>
    </v-app-bar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCollectionStore } from '@/stores/collection'

const router = useRouter()
const authStore = useAuthStore()
const collectionStore = useCollectionStore()

const drawer = ref(false)
const searchText = ref('')

const navItems = [
  { title: 'Dashboard', path: '/dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Collection', path: '/collection', icon: 'mdi-gamepad-variant' },
  { title: 'Statistics', path: '/statistics', icon: 'mdi-chart-pie' },
  { title: 'Add Game', path: '/add', icon: 'mdi-plus-circle' }
]

function onSearch(val: string | null) {
  collectionStore.setFilter(val ?? '')
  if (val) {
    router.push('/collection')
  }
}

function clearSearch() {
  collectionStore.setFilter('')
}

// Sync with store filter (e.g. after navigation)
watch(() => collectionStore.filterText, (val) => {
  if (val !== searchText.value) searchText.value = val
})

async function logout() {
  await authStore.logout()
}
</script>
