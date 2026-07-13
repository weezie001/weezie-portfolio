import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import './index.css'
import App from './App.jsx'

// Vercel Web Analytics — no-op on localhost, tracks page views once deployed.
inject()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
