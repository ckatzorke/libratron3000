<template>
  <v-container class="py-4">
    <!-- Filter toolbar -->
    <v-card rounded="lg" elevation="1" class="mb-4">
      <v-card-text class="pa-4">
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="localFilterText"
              label="Search by title"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              @update:model-value="onSearch"
              @click:clear="clearSearch"
            />
          </v-col>
          <v-col cols="6" sm="3">
            <v-select
              v-model="localPlatform"
              :items="platformItems"
              label="Platform"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              @update:model-value="collectionStore.setPlatformFilter(localPlatform)"
            />
          </v-col>
          <v-col cols="6" sm="3">
            <v-select
              v-model="localGenre"
              :items="genreItems"
              label="Genre"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              @update:model-value="collectionStore.setGenreFilter(localGenre)"
            />
          </v-col>
          <v-col cols="12" sm="2" class="d-flex align-center">
            <v-btn-toggle
              v-model="localFormat"
              density="compact"
              color="primary"
              variant="outlined"
              @update:model-value="collectionStore.setFormatFilter(localFormat)"
            >
              <v-btn value="all" size="small">All</v-btn>
              <v-btn value="physical" size="small">
                <v-icon size="small">mdi-disc</v-icon>
              </v-btn>
              <v-btn value="digital" size="small">
                <v-icon size="small">mdi-cloud-download</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <v-row dense class="mt-2" align="center">
          <v-col>
            <span class="text-caption text-medium-emphasis">
              {{ collectionStore.filteredCollection.length }} game(s)
            </span>
            <v-chip
              v-if="collectionStore.filterStatus !== 'none'"
              size="x-small"
              closable
              class="ml-2"
              @click:close="collectionStore.setStatusFilter('none')"
            >
              {{ statusFilterLabel }}
            </v-chip>
            <v-chip
              v-if="collectionStore.filterYear !== 'all'"
              size="x-small"
              closable
              class="ml-2"
              @click:close="collectionStore.setYearFilter('all')"
            >
              {{ collectionStore.filterYear }}
            </v-chip>
            <v-btn
              v-if="hasActiveFilters"
              size="x-small"
              variant="text"
              color="primary"
              class="ml-2"
              @click="clearAllFilters"
            >
              Clear filters
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-menu>
              <template #activator="{ props }">
                <v-btn size="small" variant="text" v-bind="props" prepend-icon="mdi-sort">
                  Sort: {{ sortLabel }}
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item
                  v-for="s in sortOptions"
                  :key="s.value"
                  :title="s.label"
                  :active="collectionStore.sortOrder === s.value"
                  @click="collectionStore.setSortOrder(s.value)"
                />
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <v-row v-if="collectionStore.loading" justify="center" class="mt-6">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <!-- List -->
    <v-card v-else rounded="lg" elevation="1">
      <v-list lines="two" class="pa-0">
        <template v-for="(game, idx) in collectionStore.displayCollection" :key="game.id">
          <v-divider v-if="idx > 0" />
          <v-list-item
            :to="`/game/${game.id}`"
            :class="{ 'sold-game': game.sellDate }"
          >
            <template #prepend>
              <v-avatar rounded="sm" size="48" class="mr-3">
                <v-img :src="coverThumb(game.cover)" cover>
                  <template #error>
                    <v-img src="/assets/dummy.png" cover />
                  </template>
                </v-img>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ game.title }}
              <v-icon v-if="game.favorite" size="x-small" color="red" class="ml-1">mdi-heart</v-icon>
              <v-icon v-if="game.completed" size="x-small" color="success" class="ml-1">mdi-flag-checkered</v-icon>
            </v-list-item-title>

            <v-list-item-subtitle>
              <span class="text-medium-emphasis mr-3">{{ shortPlatform(game.platform) }}</span>
              <span class="text-medium-emphasis">{{ prettyDate(game.buydate) }}</span>
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end">
                <v-rating
                  v-if="game.rating"
                  :model-value="game.rating"
                  length="10"
                  color="yellow-darken-2"
                  active-color="yellow"
                  density="compact"
                  size="x-small"
                  readonly
                />
                <v-icon v-if="game.digital" size="x-small" color="info" class="mt-1">mdi-cloud-download</v-icon>
                <v-icon v-else size="x-small" color="secondary" class="mt-1">mdi-disc</v-icon>
              </div>
            </template>
          </v-list-item>
        </template>

        <v-list-item v-if="collectionStore.displayCollection.length === 0">
          <v-list-item-title class="text-medium-emphasis text-center py-6 font-italic">
            No games match your filters.
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Pagination -->
    <div v-if="collectionStore.totalFilteredPages > 1" class="d-flex justify-center mt-4">
      <v-pagination
        v-model="collectionStore.currentPage"
        :length="collectionStore.totalFilteredPages"
        :total-visible="7"
        rounded="circle"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCollectionStore, type FormatFilter, type SortOrder, type StatusFilter } from '@/stores/collection'
import { thumbnail } from '@/services/igdb'
import { shortPlatform } from '@/services/platforms'
import { prettyDate } from '@/services/utils'

const collectionStore = useCollectionStore()

const localFilterText = ref(collectionStore.filterText)
const localPlatform = ref(collectionStore.filterPlatform)
const localGenre = ref(collectionStore.filterGenre)
const localFormat = ref<FormatFilter>(collectionStore.filterFormat)

const platformItems = computed(() => ['', ...collectionStore.availablePlatforms])
const genreItems = computed(() => ['', ...collectionStore.availableGenres])

const sortOptions: { label: string; value: SortOrder }[] = [
  { label: 'Purchase date', value: 'PURCHASE' },
  { label: 'Name', value: 'NAME' },
  { label: 'Rating', value: 'RATING' },
  { label: 'Platform', value: 'PLATFORM' },
  { label: 'ID', value: 'ID' }
]

const sortLabel = computed(
  () => sortOptions.find(s => s.value === collectionStore.sortOrder)?.label ?? ''
)

const statusFilterLabels: Record<StatusFilter, string> = {
  'none': '',
  'completed': 'Completed',
  'favorite': 'Favourites',
  'this-month': 'Added This Month',
  'hundred-percent': '100% Complete'
}

const statusFilterLabel = computed(() => statusFilterLabels[collectionStore.filterStatus])

const hasActiveFilters = computed(() =>
  !!(collectionStore.filterText || collectionStore.filterPlatform ||
     collectionStore.filterGenre || collectionStore.filterFormat !== 'all' ||
     collectionStore.filterStatus !== 'none' || collectionStore.filterYear !== 'all')
)

function onSearch(val: string | null) {
  collectionStore.setFilter(val ?? '')
}

function clearSearch() {
  collectionStore.setFilter('')
}

function clearAllFilters() {
  localFilterText.value = ''
  localPlatform.value = ''
  localGenre.value = ''
  localFormat.value = 'all'
  collectionStore.clearFilters()
}

function coverThumb(cover: string | undefined) {
  return thumbnail(cover)
}

// Sync local filter values from store on mount (e.g. when navigating back)
onMounted(() => {
  localFilterText.value = collectionStore.filterText
  localPlatform.value = collectionStore.filterPlatform
  localGenre.value = collectionStore.filterGenre
  localFormat.value = collectionStore.filterFormat
})
</script>

<style scoped>
.sold-game {
  opacity: 0.45;
  filter: grayscale(80%);
}
</style>
