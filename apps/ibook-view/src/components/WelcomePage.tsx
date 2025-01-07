import { FC } from 'react'
import { ThemeToggle } from './ThemeToggle'

interface WelcomePageProps {
  onFetchData: () => void
  loading: boolean
}

export const WelcomePage: FC<WelcomePageProps> = ({ onFetchData, loading }) => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">iBooks Viewer</h1>
          <ThemeToggle />
          <p className="py-6">Welcome! Click below to fetch your iBooks data.</p>
          <button 
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            onClick={onFetchData}
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Get iBooks Data'}
          </button>
        </div>
      </div>
    </div>
  )
}