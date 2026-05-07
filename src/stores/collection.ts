import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { Game } from '@/types/game'

export type SortOrder = 'PURCHASE' | 'NAME' | 'RATING' | 'PLATFORM' | 'ID'
export type FormatFilter = 'all' | 'physical' | 'digital'
export type StatusFilter = 'none' | 'completed' | 'favorite' | 'this-month' | 'hundred-percent'

const PAGE_SIZE = 20

export const useCollectionStore = defineStore('collection', () => {
  const games = ref<Game[]>([])
  const loading = ref(false)
  const filterText = ref('')
  const filterPlatform = ref('')
  const filterGenre = ref('')
  const filterFormat = ref<FormatFilter>('all')
  const filterStatus = ref<StatusFilter>('none')
  const filterYear = ref<number | 'all'>('all')
  const sortOrder = ref<SortOrder>('PURCHASE')
  const currentPage = ref(1)

  let unsubscribe: Unsubscribe | null = null

  // --- Computed: derived lists for comboboxes ---
  const availablePlatforms = computed(() => {
    const set = new Set(games.value.map(g => g.platform).filter((p): p is string => !!p))
    return [...set].sort()
  })

  const availableGenres = computed(() => {
    const set = new Set(games.value.flatMap(g => g.genres ?? []).filter(Boolean))
    return [...set].sort()
  })

  const availableDevelopers = computed(() => {
    const set = new Set(games.value.map(g => g.developer).filter((d): d is string => !!d))
    return [...set].sort()
  })

  const availablePublishers = computed(() => {
    const set = new Set(games.value.map(g => g.publisher).filter((p): p is string => !!p))
    return [...set].sort()
  })

  const availableTags = computed(() => {
    const set = new Set(games.value.flatMap(g => g.tags ?? []).filter(Boolean))
    return [...set].sort()
  })

  // --- Computed: filtered + sorted view ---
  const filteredCollection = computed(() => {
    let result = [...games.value]

    if (filterText.value) {
      const q = filterText.value.toLowerCase()
      result = result.filter(g => g.title.toLowerCase().includes(q))
    }
    if (filterPlatform.value) {
      result = result.filter(g => g.platform === filterPlatform.value)
    }
    if (filterGenre.value) {
      result = result.filter(g => g.genres?.includes(filterGenre.value))
    }
    if (filterFormat.value === 'digital') {
      result = result.filter(g => g.digital === true)
    } else if (filterFormat.value === 'physical') {
      result = result.filter(g => !g.digital)
    }
    if (filterStatus.value === 'completed') {
      result = result.filter(g => g.completed === true)
    } else if (filterStatus.value === 'favorite') {
      result = result.filter(g => g.favorite === true)
    } else if (filterStatus.value === 'hundred-percent') {
      result = result.filter(g => g.hundredpercent === true)
    } else if (filterStatus.value === 'this-month') {
      const now = new Date()
      result = result.filter(g => {
        if (!g.buydate) return false
        const d = (g.buydate as Timestamp).toDate()
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      })
    }
    if (filterYear.value !== 'all') {
      const y = filterYear.value
      result = result.filter(g => {
        if (!g.buydate) return false
        return (g.buydate as Timestamp).toDate().getFullYear() === y
      })
    }

    return sortGames(result, sortOrder.value)
  })

  const totalFilteredPages = computed(() =>
    Math.max(1, Math.ceil(filteredCollection.value.length / PAGE_SIZE))
  )

  const displayCollection = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE
    return filteredCollection.value.slice(start, start + PAGE_SIZE)
  })

  const nextNumber = computed(() =>
    games.value.length > 0 ? Math.max(...games.value.map(g => g.number)) + 1 : 1
  )

  // --- Actions ---
  function loadCollection(uid: string) {
    loading.value = true
    const gamesRef = collection(db, `users/${uid}/collection`)
    const q = query(gamesRef, orderBy('number', 'desc'))

    const localGames: Game[] = []

    unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        const data = { ...change.doc.data(), id: change.doc.id } as Game
        if (change.type === 'added') {
          localGames.push(data)
        } else if (change.type === 'modified') {
          const idx = localGames.findIndex(g => g.id === change.doc.id)
          if (idx !== -1) localGames[idx] = data
        } else if (change.type === 'removed') {
          const idx = localGames.findIndex(g => g.id === change.doc.id)
          if (idx !== -1) localGames.splice(idx, 1)
        }
      })
      games.value = [...localGames]
      loading.value = false
    })
  }

  function clearCollection() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    games.value = []
    currentPage.value = 1
  }

  async function addGame(game: Omit<Game, 'id'>): Promise<void> {
    const uid = getCurrentUid()
    const sanitized = Object.fromEntries(Object.entries(game).filter(([, v]) => v !== undefined))
    await addDoc(collection(db, `users/${uid}/collection`), sanitized)
  }

  async function updateGame(id: string, values: Partial<Game>): Promise<void> {
    const uid = getCurrentUid()
    const gameRef = doc(db, `users/${uid}/collection`, id)
    await setDoc(gameRef, values, { merge: true })
  }

  async function deleteGame(id: string): Promise<void> {
    const uid = getCurrentUid()
    await deleteDoc(doc(db, `users/${uid}/collection`, id))
  }

  function setFilter(text: string) {
    filterText.value = text
    currentPage.value = 1
  }

  function setPlatformFilter(platform: string) {
    filterPlatform.value = platform
    currentPage.value = 1
  }

  function setGenreFilter(genre: string) {
    filterGenre.value = genre
    currentPage.value = 1
  }

  function setFormatFilter(format: FormatFilter) {
    filterFormat.value = format
    currentPage.value = 1
  }

  function setStatusFilter(status: StatusFilter) {
    filterStatus.value = status
    currentPage.value = 1
  }

  function setYearFilter(year: number | 'all') {
    filterYear.value = year
    currentPage.value = 1
  }

  function setSortOrder(order: SortOrder) {
    sortOrder.value = order
    currentPage.value = 1
  }

  function clearFilters() {
    filterText.value = ''
    filterPlatform.value = ''
    filterGenre.value = ''
    filterFormat.value = 'all'
    filterStatus.value = 'none'
    filterYear.value = 'all'
    currentPage.value = 1
  }

  return {
    games,
    loading,
    filterText,
    filterPlatform,
    filterGenre,
    filterFormat,
    filterStatus,
    filterYear,
    sortOrder,
    currentPage,
    totalFilteredPages,
    availablePlatforms,
    availableGenres,
    availableDevelopers,
    availablePublishers,
    availableTags,
    filteredCollection,
    displayCollection,
    nextNumber,
    loadCollection,
    clearCollection,
    addGame,
    updateGame,
    deleteGame,
    setFilter,
    setPlatformFilter,
    setGenreFilter,
    setFormatFilter,
    setStatusFilter,
    setYearFilter,
    setSortOrder,
    clearFilters
  }
})

// --- Internal helpers ---
let _uid = ''
export function setCurrentUid(uid: string) { _uid = uid }
function getCurrentUid(): string {
  if (!_uid) throw new Error('No authenticated user')
  return _uid
}

function sortGames(list: Game[], order: SortOrder): Game[] {
  const sorted = [...list]
  switch (order) {
    case 'NAME':
      sorted.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
      break
    case 'RATING':
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      break
    case 'PURCHASE':
      sorted.sort((a, b) => {
        const tA = (a.buydate as Timestamp | undefined)?.seconds ?? 0
        const tB = (b.buydate as Timestamp | undefined)?.seconds ?? 0
        return tB - tA
      })
      break
    case 'PLATFORM':
      sorted.sort((a, b) => (a.platform ?? '').toLowerCase().localeCompare((b.platform ?? '').toLowerCase()))
      break
    case 'ID':
      sorted.sort((a, b) => b.number - a.number)
      break
  }
  return sorted
}
