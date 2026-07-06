import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SiteDataProvider } from './data/SiteData.jsx'
import CursorTrail from './components/CursorTrail.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="galaxy-bg" aria-hidden="true">
      <div className="stars" />
      <div className="stars stars2" />
    </div>
    <SiteDataProvider>
      <App />
    </SiteDataProvider>
    <CursorTrail />
  </StrictMode>,
)
