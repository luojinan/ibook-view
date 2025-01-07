export interface Book {
  id: string
  title: string
  author: string
  path: string
  notesCount?: number
}

export interface Annotation {
  book_id: string
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