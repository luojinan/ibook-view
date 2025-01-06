export interface Book {
  id: number
  title: string
  author: string
  path: string
}

export interface Annotation {
  id: number
  book_id: number
  text: string
  note: string
}

export interface IBooksData {
  books: Book[]
  annotations: Annotation[]
  lastUpdated?: number
}
export interface ProcessedIBooksData {
  books: Book[]
  annotationsByBookId: Map<string, Annotation[]>
}