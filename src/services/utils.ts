import { format } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'

export function formatDate(date: Date | null | undefined): string {
  return date ? format(date, 'dd.MM.yyyy') : ''
}

export function toDate(timestamp: Timestamp | Date | null | undefined): Date {
  if (!timestamp) return new Date(0)
  if (timestamp instanceof Date) return timestamp
  return timestamp.toDate()
}

export function prettyDate(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return 'n/a'
  const date = toDate(timestamp)
  const formatted = format(date, 'dd.MM.yyyy')
  return formatted === '01.01.2000' ? 'n/a' : formatted
}
