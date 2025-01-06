import { Book, Annotation, ProcessedIBooksData } from '../types'

export const processIBooksData = (books: Book[], annotations: Annotation[]): ProcessedIBooksData => {
  const annotationsByBookId = new Map()
  
  annotations.forEach(annotation => {
    if (!annotationsByBookId.has(annotation.book_id)) {
      annotationsByBookId.set(annotation.book_id, [])
    }
    annotationsByBookId.get(annotation.book_id).push(annotation)
  })
  
  return {
    books,
    annotationsByBookId
  }
}