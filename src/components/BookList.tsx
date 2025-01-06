import { FC } from 'react'
import { Book } from '../types'

interface BookListProps {
  books: Book[]
  selectedBookId: string | null
  onSelectBook: (bookId: string) => void
}

export const BookList: FC<BookListProps> = ({ books, selectedBookId, onSelectBook }) => {
  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-4">Books</h2>
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
        {books.map(book => (
          <div
            key={book.id}
            className={`card bg-base-100 shadow-md mb-2 cursor-pointer 
              ${selectedBookId === book.id ? 'border-2 border-primary' : ''}`}
            onClick={() => onSelectBook(book.id)}
          >
            <div className="card-body p-4">
              <h3 className="card-title text-lg">{book.title}</h3>
              <p className="text-sm opacity-70">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}