<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="5">
        <div class="text-center mb-8">
          <div class="text-h3 font-weight-light mb-2">Libratron 3000+</div>
          <div class="text-subtitle-1 text-medium-emphasis">Your personal game collection manager</div>
        </div>

        <v-card rounded="xl" elevation="4">
          <v-card-text class="pa-8">
            <div class="text-body-1 mb-6 text-medium-emphasis text-center">
              Track your games, rate what you've played, and keep your collection organized.
            </div>

            <v-list lines="one" class="mb-6 bg-transparent">
              <v-list-item
                v-for="feature in features"
                :key="feature.text"
                :prepend-icon="feature.icon"
                :title="feature.text"
                density="compact"
              />
            </v-list>

            <v-btn
              block
              size="large"
              variant="elevated"
              color="primary"
              rounded="lg"
              :loading="loading"
              @click="login"
            >
              <v-icon start>mdi-google</v-icon>
              Sign in with Google
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)

const features = [
  { icon: 'mdi-gamepad-variant', text: 'Catalog your entire game collection' },
  { icon: 'mdi-star', text: 'Rate and review games you have played' },
  { icon: 'mdi-magnify', text: 'Search and filter by platform, genre, or format' },
  { icon: 'mdi-chart-bar', text: 'Track statistics across your collection' }
]

async function login() {
  loading.value = true
  try {
    await authStore.login()
  } finally {
    loading.value = false
  }
}
</script>
