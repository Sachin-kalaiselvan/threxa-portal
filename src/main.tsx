import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean; error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          fontFamily: 'monospace',
          backgroundColor: '#fee',
          color: '#c00',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <h1>❌ Application Error</h1>
            <pre style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '5px',
              overflow: 'auto',
              color: '#000',
              maxWidth: '600px'
            }}>
{this.state.error?.toString()}
{'\n\n'}
{this.state.error?.stack}
            </pre>
            <p>Check browser console (F12) for full details</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Loading Fallback
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'monospace',
      fontSize: '18px'
    }}>
      Loading Threxa Portal...
    </div>
  )
}

// App wrapper with lazy loading
const App = React.lazy(() => import('./App'))

function Root() {
  const [appError, setAppError] = useState<string | null>(null)

  useEffect(() => {
    // Log that app is initializing
    console.log('🚀 Threxa Portal initializing...')
    
    // Catch any global errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      setAppError(event.error?.toString() || 'Unknown error')
    }
    
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason)
      setAppError(event.reason?.toString() || 'Unhandled promise rejection')
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  if (appError) {
    return (
      <div style={{
        padding: '40px',
        fontFamily: 'monospace',
        backgroundColor: '#fee',
        color: '#c00',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <h1>❌ Critical Error</h1>
          <pre style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '5px',
            overflow: 'auto',
            color: '#000',
            maxWidth: '600px'
          }}>
{appError}
          </pre>
          <p>Check browser console (F12) for full details</p>
        </div>
      </div>
    )
  }

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <App />
    </React.Suspense>
  )
}

try {
  console.log('📦 Rendering React app...')
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  )
  console.log('✅ React mounted successfully')
} catch (error) {
  console.error('❌ Failed to mount React:', error)
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; fontFamily: monospace; color: red;">
        <h1>❌ FATAL ERROR</h1>
        <pre>${error instanceof Error ? error.message + '\n' + error.stack : String(error)}</pre>
        <p>Check console (F12) for details</p>
      </div>
    `
  }
}
