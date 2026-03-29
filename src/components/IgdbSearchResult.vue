<template>
  <v-expansion-panels variant="accordion" class="mb-4">
    <v-expansion-panel
      v-for="result in results"
      :key="result.id"
    >
      <v-expansion-panel-title>
        <v-row no-gutters>
          <v-col cols="12" sm="5">
            <div class="text-caption text-medium-emphasis">Title</div>
            <div class="font-weight-medium">
              {{ result.name }}
              <a v-if="result.url" :href="result.url" target="_blank" class="ml-1">
                <v-icon size="x-small">mdi-open-in-new</v-icon>
              </a>
            </div>
          </v-col>
          <v-col cols="6" sm="2" class="d-none d-sm-block">
            <div class="text-caption text-medium-emphasis">Release</div>
            <div>{{ displayDate(result.first_release_date) }}</div>
          </v-col>
          <v-col cols="6" sm="2" class="d-none d-sm-block">
            <div class="text-caption text-medium-emphasis">Genres</div>
            <div class="text-truncate">{{ displayList(result.genres) }}</div>
          </v-col>
          <v-col cols="6" sm="3" class="d-none d-sm-block">
            <div class="text-caption text-medium-emphasis">Platforms</div>
            <div class="text-truncate">{{ displayList(result.platforms) }}</div>
          </v-col>
        </v-row>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row>
          <v-col cols="auto" class="d-none d-md-block">
            <v-img
              :src="coverImage(result.cover)"
              width="80"
              height="107"
              cover
              rounded="sm"
            />
          </v-col>
          <v-col>
            <div class="text-body-2 mb-3 text-medium-emphasis">{{ result.summary }}</div>
            <v-btn
              size="small"
              color="primary"
              variant="tonal"
              prepend-icon="mdi-check"
              @click="$emit('select', result)"
            >
              Use this entry
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { IgdbGame } from '@/types/game'
import { coverBig } from '@/services/igdb'

defineProps<{ results: IgdbGame[] }>()
defineEmits<{ select: [game: IgdbGame] }>()

function displayDate(timestamp: number | undefined): string {
  if (!timestamp) return 'n/a'
  return format(new Date(timestamp * 1000), 'dd.MM.yyyy')
}

function coverImage(cover: IgdbGame['cover']): string {
  return coverBig(cover?.image_id)
}

function displayList(items: { name: string }[] | undefined): string {
  if (!items?.length) return 'n/a'
  return items.map(i => i.name).join(', ')
}
</script>
