import type { Timestamp } from 'firebase/firestore'

export interface Game {
  id?: string
  number: number
  title: string
  description?: string
  platform?: string
  genres?: string[]
  developer?: string
  publisher?: string
  notes?: string
  tags?: string[]
  releaseDate?: Timestamp
  releasedateAsISOString?: string
  buydate?: Timestamp
  purchasedateAsISOString?: string
  digital?: boolean
  completed?: boolean
  hundredpercent?: boolean
  completiondate?: Timestamp
  completiondateAsISOString?: string
  rating?: number
  favorite?: boolean
  cover?: string
  igdbId?: number
  poweredBy?: string
  sellDate?: Timestamp
  loaned?: string
  imageUrl?: string
}

export interface IgdbGame {
  id: number
  name: string
  summary?: string
  first_release_date?: number
  url?: string
  cover?: { image_id: string }
  genres?: { id: number; name: string }[]
  platforms?: { id: number; name: string }[]
  involved_companies?: {
    developer: boolean
    company: { name: string }
  }[]
}
