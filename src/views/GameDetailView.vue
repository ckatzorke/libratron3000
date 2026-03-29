<template>
  <v-container class="py-6">
    <div v-if="!game">
      <v-alert type="error">Game not found.</v-alert>
    </div>

    <template v-else>
      <!-- Sold banner -->
      <v-alert
        v-if="game.sellDate"
        type="warning"
        variant="tonal"
        class="mb-4"
        prepend-icon="mdi-cash"
      >
        This game is no longer in your collection — sold on {{ prettyDate(game.sellDate) }}.
      </v-alert>

      <v-row>
        <!-- Cover -->
        <v-col cols="12" sm="3" md="2" class="text-center">
          <v-img
            :src="coverBig(game.cover) || game.imageUrl || '/assets/dummy.png'"
            width="160"
            :aspect-ratio="0.75"
            cover
            rounded="md"
            class="mx-auto"
          />
        </v-col>

        <!-- Header info -->
        <v-col cols="12" sm="9" md="10">
          <div class="text-h5 font-weight-medium mb-1">{{ game.title }}</div>
          <div class="text-caption text-medium-emphasis mb-3">{{ shortPlatform(game.platform) }}</div>
          <div class="text-body-2 text-medium-emphasis mb-4">{{ game.description }}</div>

          <v-row dense>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Developer</div>
              <div class="text-body-2">{{ game.developer || 'n/a' }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Publisher</div>
              <div class="text-body-2">{{ game.publisher || 'n/a' }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Genres</div>
              <div class="text-body-2">{{ game.genres?.join(', ') || 'n/a' }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Format</div>
              <div>
                <v-icon size="small" :color="game.digital ? 'info' : 'secondary'">
                  {{ game.digital ? 'mdi-cloud-download' : 'mdi-disc' }}
                </v-icon>
                {{ game.digital ? 'Digital' : 'Physical' }}
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Release</div>
              <div class="text-body-2">{{ prettyDate(game.releaseDate) }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Purchased</div>
              <div class="text-body-2">{{ prettyDate(game.buydate) }}</div>
            </v-col>
          </v-row>

          <!-- Tags -->
          <div v-if="game.tags?.length" class="mt-3">
            <v-chip
              v-for="tag in game.tags"
              :key="tag"
              size="small"
              variant="tonal"
              color="secondary"
              class="mr-1 mb-1"
            >{{ tag }}</v-chip>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <!-- Editable section -->
      <v-row>
        <!-- Notes -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="game.notes"
            label="Notes"
            prepend-inner-icon="mdi-note-text"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
          />
        </v-col>

        <!-- Loan to -->
        <v-col cols="12" md="6">
          <v-combobox
            v-if="!game.sellDate"
            v-model="game.loaned"
            label="Loaned to"
            prepend-inner-icon="mdi-account-arrow-right"
            variant="outlined"
            density="comfortable"
            clearable
          />
        </v-col>

        <!-- Completed -->
        <v-col cols="6" sm="3" class="d-flex align-center">
          <v-checkbox v-model="game.completed" label="Completed" hide-details />
        </v-col>
        <v-col cols="6" sm="3" class="d-flex align-center">
          <v-checkbox v-model="game.hundredpercent" label="100%" hide-details />
        </v-col>

        <!-- Completion date -->
        <v-col v-if="game.completed" cols="12" sm="6">
          <v-menu v-model="completionDateMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field
                :model-value="formatIso(game.completiondateAsISOString)"
                label="Completion date"
                prepend-inner-icon="mdi-flag-checkered"
                variant="outlined"
                density="comfortable"
                readonly
                v-bind="props"
              />
            </template>
            <v-date-picker
              v-model="completionDatePicker"
              @update:model-value="onCompletionDateChange"
            />
          </v-menu>
        </v-col>

        <!-- Rating -->
        <v-col cols="12">
          <div class="text-caption text-medium-emphasis mb-1">Rating</div>
          <v-rating
            v-model="game.rating"
            length="10"
            color="yellow-darken-2"
            active-color="yellow"
            hover
            density="comfortable"
          />
        </v-col>

        <!-- Favourite -->
        <v-col cols="12">
          <v-btn
            :icon="game.favorite ? 'mdi-heart' : 'mdi-heart-outline'"
            :color="game.favorite ? 'red' : 'default'"
            variant="text"
            @click="game.favorite = !game.favorite"
          />
          <span class="text-body-2 text-medium-emphasis ml-1">Favourite</span>
        </v-col>
      </v-row>

      <!-- Action buttons -->
      <v-row class="mt-4">
        <v-col cols="12" class="d-flex flex-wrap gap-2">
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-content-save"
            :loading="saving"
            @click="update"
          >
            Save
          </v-btn>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-link"
            @click="openIgdbDialog"
          >
            Link with IGDB
          </v-btn>
          <v-btn
            variant="outlined"
            color="success"
            prepend-icon="mdi-cash"
            :disabled="!!game.sellDate"
            @click="sellEntry"
          >
            Sell
          </v-btn>
          <v-btn
            variant="outlined"
            color="error"
            prepend-icon="mdi-delete"
            @click="deleteEntry"
          >
            Delete
          </v-btn>
          <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()">
            Back
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <!-- IGDB Link dialog -->
    <v-dialog v-model="igdbDialog" max-width="800">
      <v-card rounded="lg">
        <v-card-title class="pa-4">
          Link with IGDB
          <v-btn icon="mdi-close" variant="text" class="float-right" @click="igdbDialog = false" />
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="igdbSearch"
            label="Search game title"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            autofocus
            @update:model-value="igdbComposable.search"
          />
          <v-progress-linear v-if="igdbComposable.searching.value" indeterminate color="primary" class="mb-2" />
          <IgdbSearchResult
            v-if="igdbComposable.results.value.length > 0"
            :results="igdbComposable.results.value"
            @select="onIgdbLink"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Confirm dialogs -->
    <v-dialog v-model="confirmDelete" max-width="360">
      <v-card rounded="lg">
        <v-card-title>Delete game?</v-card-title>
        <v-card-text>This will permanently remove "{{ game?.title }}" from your collection.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDelete = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="confirmDeleteAction">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmSell" max-width="360">
      <v-card rounded="lg">
        <v-card-title>Mark as sold?</v-card-title>
        <v-card-text>This will mark "{{ game?.title }}" as sold. It stays in your collection as a sold item.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmSell = false">Cancel</v-btn>
          <v-btn color="success" variant="elevated" @click="confirmSellAction">Sell</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Timestamp } from 'firebase/firestore'
import { useCollectionStore } from '@/stores/collection'
import { useNotificationStore } from '@/stores/notification'
import { useIgdb } from '@/composables/useIgdb'
import { coverBig } from '@/services/igdb'
import { shortPlatform } from '@/services/platforms'
import { prettyDate } from '@/services/utils'
import type { Game, IgdbGame } from '@/types/game'
import IgdbSearchResult from '@/components/IgdbSearchResult.vue'

const route = useRoute()
const router = useRouter()
const collectionStore = useCollectionStore()
const notificationStore = useNotificationStore()
const igdbComposable = useIgdb()

const saving = ref(false)
const completionDateMenu = ref(false)
const completionDatePicker = ref<Date | null>(null)
const igdbDialog = ref(false)
const igdbSearch = ref('')
const confirmDelete = ref(false)
const confirmSell = ref(false)

const game = ref<Game | null>(null)

onMounted(() => {
  const id = route.params.id as string
  const found = collectionStore.games.find(g => g.id === id)
  if (found) {
    game.value = { ...found }
    if (found.completiondate) {
      const d = (found.completiondate as Timestamp).toDate()
      game.value.completiondateAsISOString = d.toISOString().substring(0, 10)
      completionDatePicker.value = d
    }
  }
})

function formatIso(iso: string | undefined): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function onCompletionDateChange(date: Date | null) {
  if (!date) return
  completionDateMenu.value = false
  if (!game.value) return
  game.value.completiondateAsISOString = date.toISOString().substring(0, 10)
  game.value.completiondate = Timestamp.fromDate(date)
}

async function update() {
  if (!game.value?.id) return
  saving.value = true
  try {
    await collectionStore.updateGame(game.value.id, { ...game.value })
    notificationStore.notify('Saved successfully.')
  } catch {
    notificationStore.notify('Could not save. Please try again.')
  } finally {
    saving.value = false
  }
}

function deleteEntry() {
  confirmDelete.value = true
}

async function confirmDeleteAction() {
  if (!game.value?.id) return
  confirmDelete.value = false
  await collectionStore.deleteGame(game.value.id)
  notificationStore.notify(`Removed "${game.value.title}" from collection.`)
  router.push('/collection')
}

function sellEntry() {
  confirmSell.value = true
}

async function confirmSellAction() {
  if (!game.value?.id) return
  confirmSell.value = false
  game.value.sellDate = Timestamp.fromDate(new Date())
  await collectionStore.updateGame(game.value.id, { sellDate: game.value.sellDate })
  notificationStore.notify(`"${game.value.title}" marked as sold.`)
}

function openIgdbDialog() {
  igdbSearch.value = game.value?.title ?? ''
  igdbComposable.search(igdbSearch.value)
  igdbDialog.value = true
}

function onIgdbLink(entry: IgdbGame) {
  if (!game.value) return
  game.value.title = entry.name
  game.value.description = entry.summary ?? game.value.description
  game.value.genres = entry.genres?.map(g => g.name) ?? game.value.genres
  game.value.igdbId = entry.id
  game.value.cover = entry.cover?.image_id ?? game.value.cover
  game.value.poweredBy = 'IGDB'
  if (entry.first_release_date) {
    const d = new Date(entry.first_release_date * 1000)
    game.value.releasedateAsISOString = d.toISOString().substring(0, 10)
    game.value.releaseDate = Timestamp.fromDate(d)
  }
  igdbComposable.clear()
  igdbDialog.value = false
  notificationStore.notify('IGDB data applied — save to persist.')
}
</script>

<style scoped>
.gap-2 { gap: 8px; }
</style>
