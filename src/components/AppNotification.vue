<template>
  <v-snackbar
    v-model="notificationStore.show"
    :timeout="4000"
    location="bottom"
    color="surface"
  >
    {{ notificationStore.text }}
    <template #actions>
      <v-btn variant="text" icon="mdi-close" @click="notificationStore.hide()" />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
</script>
