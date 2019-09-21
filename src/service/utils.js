import { format } from 'date-fns'
// import firebase from 'firebase/app'

export const formatDate = (date) => {
  return date ? format(date, 'DD.MM.YYYY') : ''
}

export const toDate = (timestamp) => {
  return timestamp ? timestamp.toDate() : ''
}

export const prettyDate = (timestamp) => {
  if (timestamp) {
    let date = new Date(timestamp.seconds * 1000)
    const formatted = format(date, 'DD.MM.YYYY')
    return formatted === '01.01.2000' ? 'n/a' : formatted
  } else {
    return 'n/a'
  }
}
