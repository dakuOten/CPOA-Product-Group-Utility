import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ZohoProvider } from '@/providers/ZohoProviderModern'
import { ErrorBoundary } from '@/components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ZohoProvider>
        <App />
      </ZohoProvider>
    </ErrorBoundary>
  </StrictMode>,
)
