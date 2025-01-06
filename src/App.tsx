import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'

interface Book {
  id: number
  title: string
  author: string
  path: string
}

interface Annotation {
  id: number
  book_id: number
  text: string
  note: string
}

interface IBooksData {
  books: Book[]
  annotations: Annotation[]
}

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: IBooksData = await invoke('get_ibooks_data')
        setBooks(data.books)
        setAnnotations(data.annotations)
        setError(null)
      } catch (err) {
        setError(err as string)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading iBooks data...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">iBooks Viewer</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Books</h2>
          <ul className="space-y-2">
            {books.map(book => (
              <li key={book.id} className="p-2 border rounded">
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Annotations</h2>
          <ul className="space-y-2">
            {annotations.map(annotation => (
              <li key={annotation.id} className="p-2 border rounded">
                <p className="text-gray-800">{annotation.text}</p>
                {annotation.note && (
                  <p className="text-sm text-gray-600 mt-1">Note: {annotation.note}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
