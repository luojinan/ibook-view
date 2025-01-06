import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import { IBooksData } from './types'
import { WelcomePage } from './components/WelcomePage'
import { saveIBooksData, getIBooksData } from './utils/storage'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  const [data, setData] = useState<IBooksData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cachedData = getIBooksData()
    if (cachedData) {
      setData(cachedData)
    }
  }, [])

  const handleFetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await invoke<IBooksData>('get_ibooks_data')
      saveIBooksData(result)
      setData(result)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  if (!data) {
    return <WelcomePage onFetchData={handleFetchData} loading={loading} />
  }

  return (
    <div className="container mx-auto p-4">
      <div className="navbar bg-base-100 rounded-box shadow-lg mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">iBooks Library</h1>
        </div>
        <div className="flex-none gap-2">
          <ThemeToggle />
          <button 
            className="btn btn-sm btn-primary"
            onClick={handleFetchData}
            disabled={loading}
          >
            {loading ? 
              <span className="loading loading-spinner"></span> : 
              'Refresh Data'
            }
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Books</h2>
          <ul className="space-y-2">
            {data.books.map(book => (
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
            {data.annotations.map(annotation => (
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
