import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const text = ref('')
  const show = ref(false)

  function notify(message: string) {
    text.value = message
    show.value = true
  }

  function hide() {
    show.value = false
  }

  return { text, show, notify, hide }
})
