import { IBooksData } from '../types'

export const STORAGE_KEY = 'ibooks_data'

export const saveIBooksData = (data: IBooksData) => {
  const dataWithTimestamp = {
    ...data,
    lastUpdated: Date.now()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp))
}

export const getIBooksData = (): IBooksData | null => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}