<template>
  <v-container>
    <v-card rounded="lg" elevation="2">
      <v-card-title class="pa-6 pb-2">
        <span class="text-h6 font-weight-light">Add a new game</span>
        <span class="text-medium-emphasis ml-2 text-body-2">#{{ collectionStore.nextNumber }}</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Title + IGDB search -->
        <v-text-field
          v-model="game.title"
          label="Title"
          prepend-inner-icon="mdi-controller"
          variant="outlined"
          density="comfortable"
          class="mb-2"
          @update:model-value="onTitleInput"
        />

        <div v-if="igdb.searching.value" class="mb-4">
          <v-progress-linear indeterminate color="primary" rounded />
          <div class="text-caption text-medium-emphasis mt-1">Searching IGDB...</div>
        </div>

        <template v-if="igdb.results.value.length > 0 && !igdb.searching.value">
          <div class="text-caption text-medium-emphasis mb-2">
            Found {{ igdb.results.value.length }} result(s) — select one to pre-fill the form:
          </div>
          <IgdbSearchResult :results="igdb.results.value" @select="onIgdbSelect" />
        </template>
        <div
          v-else-if="game.title.length > 0 && !igdb.searching.value && !igdbSelected"
          class="text-caption text-medium-emphasis mb-4 font-italic"
        >
          Nothing found on IGDB for this title.
        </div>

        <!-- Cover preview -->
        <v-row v-if="game.cover || game.imageUrl">
          <v-col cols="auto">
            <v-img
              :src="coverBig(game.cover) || game.imageUrl"
              width="90"
              height="120"
              cover
              rounded="sm"
              class="mb-2"
            />
          </v-col>
        </v-row>

        <!-- Description -->
        <v-textarea
          v-model="game.description"
          label="Description"
          prepend-inner-icon="mdi-text"
          variant="outlined"
          density="comfortable"
          rows="3"
          auto-grow
          class="mb-2"
        />

        <v-row>
          <!-- Platform -->
          <v-col cols="12" sm="6" md="4">
            <v-combobox
              v-model="game.platform"
              :items="collectionStore.availablePlatforms"
              label="Platform"
              prepend-inner-icon="mdi-monitor"
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>

          <!-- Genres -->
          <v-col cols="12" sm="6" md="8">
            <v-combobox
              v-model="game.genres"
              :items="collectionStore.availableGenres"
              label="Genre(s)"
              prepend-inner-icon="mdi-tag-multiple"
              variant="outlined"
              density="comfortable"
              multiple
              chips
              closable-chips
              clearable
            />
          </v-col>

          <!-- Developer -->
          <v-col cols="12" sm="6">
            <v-combobox
              v-model="game.developer"
              :items="collectionStore.availableDevelopers"
              label="Developer"
              prepend-inner-icon="mdi-code-braces"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <!-- Publisher -->
          <v-col cols="12" sm="6">
            <v-combobox
              v-model="game.publisher"
              :items="collectionStore.availablePublishers"
              label="Publisher"
              prepend-inner-icon="mdi-briefcase"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <!-- Release date -->
          <v-col cols="12" sm="4">
            <v-menu v-model="releaseDateMenu" :close-on-content-click="false">
              <template #activator="{ props }">
                <v-text-field
                  :model-value="formatIso(game.releasedateAsISOString)"
                  label="Release date"
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  v-bind="props"
                />
              </template>
              <v-date-picker
                v-model="releaseDatePicker"
                @update:model-value="onReleaseDateChange"
              />
            </v-menu>
          </v-col>

          <!-- Purchase date -->
          <v-col cols="12" sm="4">
            <v-menu v-model="purchaseDateMenu" :close-on-content-click="false">
              <template #activator="{ props }">
                <v-text-field
                  :model-value="formatIso(game.purchasedateAsISOString)"
                  label="Purchase date"
                  prepend-inner-icon="mdi-calendar-check"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  v-bind="props"
                />
              </template>
              <v-date-picker
                v-model="purchaseDatePicker"
                @update:model-value="onPurchaseDateChange"
              />
            </v-menu>
          </v-col>

          <!-- Digital -->
          <v-col cols="12" sm="4" class="d-flex align-center">
            <v-checkbox
              v-model="game.digital"
              label="Digital download"
              prepend-icon="mdi-cloud-download"
              hide-details
            />
          </v-col>

          <!-- Notes -->
          <v-col cols="12" sm="6">
            <v-textarea
              v-model="game.notes"
              label="Notes"
              prepend-inner-icon="mdi-note-text"
              variant="outlined"
              density="comfortable"
              rows="2"
              auto-grow
            />
          </v-col>

          <!-- Tags -->
          <v-col cols="12" sm="6">
            <v-combobox
              v-model="game.tags"
              :items="collectionStore.availableTags"
              label="Tags"
              prepend-inner-icon="mdi-label"
              variant="outlined"
              density="comfortable"
              multiple
              chips
              closable-chips
              clearable
            />
          </v-col>

          <!-- Completed + 100% -->
          <v-col cols="12" sm="4" class="d-flex align-center gap-2">
            <v-checkbox v-model="game.completed" label="Completed" hide-details />
            <v-checkbox v-model="game.hundredpercent" label="100%" hide-details />
          </v-col>

          <!-- Completion date (visible when completed) -->
          <v-col v-if="game.completed" cols="12" sm="4">
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
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          prepend-icon="mdi-plus"
          :loading="saving"
          @click="add"
        >
          Add to collection
        </v-btn>
        <v-btn variant="text" @click="reset">Clear</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Timestamp } from 'firebase/firestore'
import { useCollectionStore } from '@/stores/collection'
import { useNotificationStore } from '@/stores/notification'
import { useIgdb } from '@/composables/useIgdb'
import { coverBig } from '@/services/igdb'
import type { Game, IgdbGame } from '@/types/game'
import IgdbSearchResult from '@/components/IgdbSearchResult.vue'

const router = useRouter()
const collectionStore = useCollectionStore()
const notificationStore = useNotificationStore()
const igdb = useIgdb()

const saving = ref(false)
const igdbSelected = ref(false)

const releaseDateMenu = ref(false)
const purchaseDateMenu = ref(false)
const completionDateMenu = ref(false)
const releaseDatePicker = ref<Date | null>(null)
const purchaseDatePicker = ref<Date>(new Date())
const completionDatePicker = ref<Date | null>(null)

function blankGame(): Omit<Game, 'id'> {
  return {
    number: collectionStore.nextNumber,
    title: '',
    description: '',
    platform: '',
    genres: [],
    developer: '',
    publisher: '',
    notes: '',
    tags: [],
    releaseDate: undefined,
    releasedateAsISOString: undefined,
    buydate: Timestamp.fromDate(new Date()),
    purchasedateAsISOString: new Date().toISOString().substring(0, 10),
    digital: false,
    completed: false,
    hundredpercent: false,
    completiondate: undefined,
    completiondateAsISOString: undefined,
    rating: 0,
    favorite: false
  }
}

const game = reactive<Omit<Game, 'id'>>(blankGame())

function onTitleInput(val: string) {
  igdbSelected.value = false
  igdb.search(val)
}

function formatIso(iso: string | undefined): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function onReleaseDateChange(date: Date | null) {
  if (!date) return
  releaseDateMenu.value = false
  game.releasedateAsISOString = date.toISOString().substring(0, 10)
  game.releaseDate = Timestamp.fromDate(date)
}

function onPurchaseDateChange(date: Date | null) {
  if (!date) return
  purchaseDateMenu.value = false
  game.purchasedateAsISOString = date.toISOString().substring(0, 10)
  game.buydate = Timestamp.fromDate(date)
}

function onCompletionDateChange(date: Date | null) {
  if (!date) return
  completionDateMenu.value = false
  game.completiondateAsISOString = date.toISOString().substring(0, 10)
  game.completiondate = Timestamp.fromDate(date)
}

function onIgdbSelect(entry: IgdbGame) {
  igdbSelected.value = true
  igdb.clear()

  const involved = entry.involved_companies ?? []
  const devs = involved.filter(c => c.developer)
  const pubs = involved.filter(c => !c.developer)

  game.title = entry.name
  game.description = entry.summary ?? ''
  game.platform = entry.platforms?.[0]?.name ?? game.platform
  game.genres = entry.genres?.map(g => g.name) ?? []
  game.developer = devs[0]?.company.name ?? ''
  game.publisher = pubs[0]?.company.name ?? ''
  game.igdbId = entry.id
  game.cover = entry.cover?.image_id ?? ''
  game.poweredBy = 'IGDB'

  if (entry.first_release_date) {
    const d = new Date(entry.first_release_date * 1000)
    game.releasedateAsISOString = d.toISOString().substring(0, 10)
    game.releaseDate = Timestamp.fromDate(d)
    releaseDatePicker.value = d
  }
}

async function add() {
  if (!game.title.trim()) {
    notificationStore.notify('Please enter a game title.')
    return
  }
  saving.value = true
  try {
    game.number = collectionStore.nextNumber
    await collectionStore.addGame({ ...game })
    notificationStore.notify(`Added "${game.title}" to your collection.`)
    router.push('/collection')
  } catch (e) {
    notificationStore.notify('Could not add game. Please try again.')
  } finally {
    saving.value = false
  }
}

function reset() {
  Object.assign(game, blankGame())
  igdb.clear()
  igdbSelected.value = false
  releaseDatePicker.value = null
  purchaseDatePicker.value = new Date()
  completionDatePicker.value = null
}
</script>
