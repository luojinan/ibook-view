import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import { IBooksData, type ProcessedIBooksData } from './types'
import { WelcomePage } from './components/WelcomePage'
import { saveIBooksData, getIBooksData } from './utils/storage'
import { ThemeToggle } from './components/ThemeToggle'
import { processIBooksData } from './utils/dataProcessing'
import { AnnotationList } from './components/AnnotationList'
import { BookList } from './components/BookList'

function App() {
  const [data, setData] = useState<ProcessedIBooksData | null>(null)
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [_error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cachedData = getIBooksData()
    if (cachedData) {
      const processedData = processIBooksData(cachedData.books, cachedData.annotations)
      console.log('---',processedData)
      setData(processedData)
    }
  }, [])

  const handleFetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await invoke<IBooksData>('get_ibooks_data')
      const processedData = processIBooksData(result.books, result.annotations)
      console.log('---',processedData)
      saveIBooksData(result)
      setData(processedData)
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
          <BookList 
            books={data?.books || []}
            selectedBookId={selectedBookId}
            onSelectBook={setSelectedBookId}
          />
        </div>
        <div>
          {selectedBookId && (
            <AnnotationList 
              annotations={data?.annotationsByBookId.get(selectedBookId) || []}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
