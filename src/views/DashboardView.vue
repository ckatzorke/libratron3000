<template>
  <v-container class="py-6">
    <v-row v-if="collectionStore.loading" justify="center" class="mt-12">
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-row>

    <template v-else>
      <!-- Welcome header -->
      <v-row class="mb-4">
        <v-col>
          <div class="text-h5 font-weight-light">
            Welcome back, {{ authStore.user?.displayName?.split(' ')[0] }}
          </div>
          <div class="text-caption text-medium-emphasis">Your collection at a glance</div>
        </v-col>
      </v-row>

      <!-- Stats row -->
      <v-row class="mb-6">
        <v-col cols="6" sm="3" v-for="stat in stats" :key="stat.label">
          <v-card rounded="lg" variant="tonal" :color="stat.color">
            <v-card-text class="text-center pa-4">
              <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
              <div class="text-caption text-medium-emphasis mt-1">{{ stat.label }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recently added -->
      <v-row class="mb-2">
        <v-col>
          <div class="text-subtitle-1 font-weight-medium">Recently Added</div>
        </v-col>
        <v-col cols="auto">
          <v-btn variant="text" size="small" to="/collection">View all</v-btn>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col
          v-for="game in recentGames"
          :key="game.id"
          cols="4" sm="3" md="2" lg="1"
          class="pa-1"
        >
          <v-card
            rounded="md"
            :to="`/game/${game.id}`"
            class="game-cover"
            elevation="2"
          >
            <v-img
              :src="coverImage(game.cover)"
              aspect-ratio="0.75"
              cover
            >
              <template #error>
                <v-img src="/assets/dummy.png" aspect-ratio="0.75" cover />
              </template>
            </v-img>
            <v-tooltip activator="parent" location="bottom">{{ game.title }}</v-tooltip>
          </v-card>
        </v-col>
      </v-row>

      <!-- Year stats + Top platforms -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-subtitle-1">{{ currentYear }} in review</v-card-title>
            <v-card-text>
              <v-list lines="one" density="compact" class="bg-transparent">
                <v-list-item
                  v-for="ys in yearStats"
                  :key="ys.label"
                  :prepend-icon="ys.icon"
                  :title="ys.label"
                >
                  <template #append>
                    <v-chip size="small" :color="ys.color">{{ ys.value }}</v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-subtitle-1">Top platforms</v-card-title>
            <v-card-text>
              <v-list lines="one" density="compact" class="bg-transparent">
                <v-list-item
                  v-for="p in topPlatforms"
                  :key="p.name"
                  :title="p.name"
                >
                  <template #append>
                    <v-chip size="small" color="secondary">{{ p.count }}</v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCollectionStore } from '@/stores/collection'
import { coverBig } from '@/services/igdb'
import { Timestamp } from 'firebase/firestore'

const authStore = useAuthStore()
const collectionStore = useCollectionStore()
const currentYear = new Date().getFullYear()

function coverImage(cover: string | undefined) {
  return coverBig(cover)
}

const stats = computed(() => [
  { label: 'Total Games', value: collectionStore.games.length, color: 'primary' },
  { label: 'Completed', value: collectionStore.games.filter(g => g.completed).length, color: 'success' },
  { label: 'This Month', value: addedThisMonth.value, color: 'info' },
  { label: 'Favourites', value: collectionStore.games.filter(g => g.favorite).length, color: 'warning' }
])

const addedThisMonth = computed(() => {
  const now = new Date()
  return collectionStore.games.filter(g => {
    if (!g.buydate) return false
    const d = (g.buydate as Timestamp).toDate()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
})

const recentGames = computed(() => {
  return [...collectionStore.games]
    .filter(g => g.buydate)
    .sort((a, b) => {
      const tA = (a.buydate as Timestamp).seconds
      const tB = (b.buydate as Timestamp).seconds
      return tB - tA
    })
    .slice(0, 12)
})

const yearStats = computed(() => {
  const gamesThisYear = collectionStore.games.filter(g => {
    if (!g.buydate) return false
    return (g.buydate as Timestamp).toDate().getFullYear() === currentYear
  })
  const finishedThisYear = collectionStore.games.filter(g => {
    if (!g.completiondate) return false
    return (g.completiondate as Timestamp).toDate().getFullYear() === currentYear
  })
  return [
    { label: 'Games added', value: gamesThisYear.length, icon: 'mdi-plus-circle', color: 'primary' },
    { label: 'Games finished', value: finishedThisYear.length, icon: 'mdi-flag-checkered', color: 'success' },
    { label: 'Digital purchases', value: gamesThisYear.filter(g => g.digital).length, icon: 'mdi-cloud-download', color: 'info' },
    { label: 'Physical purchases', value: gamesThisYear.filter(g => !g.digital).length, icon: 'mdi-disc', color: 'secondary' }
  ]
})

const topPlatforms = computed(() => {
  const counts: Record<string, number> = {}
  for (const g of collectionStore.games) {
    if (g.platform) counts[g.platform] = (counts[g.platform] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
})
</script>

<style scoped>
.game-cover {
  transition: transform 0.15s ease;
  cursor: pointer;
}
.game-cover:hover {
  transform: scale(1.04);
}
</style>
