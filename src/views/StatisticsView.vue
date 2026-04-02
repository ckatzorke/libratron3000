<template>
  <v-container class="py-6">
    <v-row v-if="collectionStore.loading" justify="center" class="mt-12">
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-row>

    <template v-else>
      <!-- Header + year filter -->
      <v-row class="mb-6" align="center">
        <v-col>
          <div class="text-h5 font-weight-light">Statistics</div>
          <div class="text-caption text-medium-emphasis">
            {{ filteredGames.length }} game{{ filteredGames.length !== 1 ? 's' : '' }} in view
          </div>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-select
            v-model="selectedYear"
            :items="yearItems"
            label="Filter by year"
            density="compact"
            variant="outlined"
            hide-details
            style="min-width: 160px"
          />
        </v-col>
      </v-row>

      <!-- Top stat chips -->
      <v-row class="mb-6">
        <v-col cols="6" sm="3" v-for="stat in summaryStats" :key="stat.label">
          <v-card rounded="lg" variant="tonal" :color="stat.color">
            <v-card-text class="text-center pa-4">
              <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
              <div class="text-caption text-medium-emphasis mt-1">{{ stat.label }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts row 1: Status, Platform, Genre -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6" lg="4">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-subtitle-1 pt-4 pl-4">Collection Status</v-card-title>
            <v-card-text>
              <StatStatusChart :games="filteredGames" />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-subtitle-1 pt-4 pl-4">By Platform</v-card-title>
            <v-card-text>
              <StatPlatformChart :games="filteredGames" />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-subtitle-1 pt-4 pl-4">By Genre</v-card-title>
            <v-card-text>
              <StatGenreChart :games="filteredGames" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts row 2: Timeline, Rating -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-subtitle-1 pt-4 pl-4">
              {{ selectedYear === 'all' ? 'Games Added per Year' : `Games Added in ${selectedYear} by Month` }}
            </v-card-title>
            <v-card-text>
              <StatTimelineChart :games="collectionStore.games" :selected-year="selectedYear" />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card rounded="lg" elevation="1">
            <v-card-title class="text-subtitle-1 pt-4 pl-4">Rating Distribution</v-card-title>
            <v-card-text>
              <StatRatingChart :games="filteredGames" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Timestamp } from 'firebase/firestore'
import { useCollectionStore } from '@/stores/collection'
import StatStatusChart from '@/components/stats/StatStatusChart.vue'
import StatPlatformChart from '@/components/stats/StatPlatformChart.vue'
import StatGenreChart from '@/components/stats/StatGenreChart.vue'
import StatTimelineChart from '@/components/stats/StatTimelineChart.vue'
import StatRatingChart from '@/components/stats/StatRatingChart.vue'

const collectionStore = useCollectionStore()
const selectedYear = ref<string | number>('all')

const availableYears = computed(() => {
  const years = new Set<number>()
  for (const g of collectionStore.games) {
    if (g.buydate) {
      years.add((g.buydate as Timestamp).toDate().getFullYear())
    }
  }
  return [...years].sort((a, b) => b - a)
})

const yearItems = computed(() => [
  { title: 'All years', value: 'all' },
  ...availableYears.value.map(y => ({ title: String(y), value: y }))
])

const filteredGames = computed(() => {
  if (selectedYear.value === 'all') return collectionStore.games
  const year = Number(selectedYear.value)
  return collectionStore.games.filter(g => {
    if (!g.buydate) return false
    return (g.buydate as Timestamp).toDate().getFullYear() === year
  })
})

const summaryStats = computed(() => [
  {
    label: 'Total Games',
    value: filteredGames.value.length,
    color: 'primary'
  },
  {
    label: 'Completed',
    value: filteredGames.value.filter(g => g.completed).length,
    color: 'success'
  },
  {
    label: 'Favourites',
    value: filteredGames.value.filter(g => g.favorite).length,
    color: 'warning'
  },
  {
    label: '100% Complete',
    value: filteredGames.value.filter(g => g.hundredpercent).length,
    color: 'secondary'
  }
])
</script>
