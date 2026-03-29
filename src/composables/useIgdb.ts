import { ref } from 'vue'
import type { IgdbGame } from '@/types/game'

export function useIgdb() {
  const results = ref<IgdbGame[]>([])
  const searching = ref(false)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function search(term: string) {
    if (debounceTimer) clearTimeout(debounceTimer)

    if (!term.trim()) {
      results.value = []
      return
    }

    debounceTimer = setTimeout(async () => {
      searching.value = true
      try {
        const res = await fetch(
          `/.netlify/functions/igdbSearch?search=${encodeURIComponent(term)}`
        )
        if (res.ok) {
          const data = await res.json()
          results.value = data.result ?? []
        } else {
          results.value = []
        }
      } catch {
        results.value = []
      } finally {
        searching.value = false
      }
    }, 700)
  }

  function clear() {
    if (debounceTimer) clearTimeout(debounceTimer)
    results.value = []
    searching.value = false
  }

  return { results, searching, search, clear }
}
