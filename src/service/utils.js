import { format } from 'date-fns'
// import firebase from 'firebase/app'

export const formatDate = (date) => {
  return date ? format(date, 'DD.MM.YYYY') : ''
}

export const toDate = (timestamp) => {
  return timestamp ? timestamp.toDate() : ''
}
