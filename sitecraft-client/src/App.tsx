import { useState, useEffect } from 'react'

function App() {
  const [apiMessage, setApiMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/hello')
      const data = await response.json()
      setApiMessage(JSON.stringify(data, null, 2))
    } catch (error) {
      setApiMessage('Failed to connect to API: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-indigo-600 mb-2">
            SiteCraft
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Website Builder
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <h2 className="text-lg font-semibold text-indigo-800 mb-2">
              🎉 Frontend Setup Complete!
            </h2>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>✅ React 19 + TypeScript</li>
              <li>✅ Vite Development Server</li>
              <li>✅ Tailwind CSS</li>
              <li>✅ React Router (Ready)</li>
              <li>✅ Axios + React Query (Ready)</li>
              <li>✅ Zustand (Ready)</li>
            </ul>
          </div>

          <div className="border-t pt-6">
            <button
              onClick={testAPI}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test Backend Connection'}
            </button>
            
            {apiMessage && (
              <div className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
                <pre>{apiMessage}</pre>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-500 pt-4">
            <p>Backend: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5000</code></p>
            <p>Frontend: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5173</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
