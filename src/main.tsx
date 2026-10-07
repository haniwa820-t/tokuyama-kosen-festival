import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { getPage, sectionUrl } from './lib/pages'
import './styles/global.css'
const root = document.getElementById('root')!
const legacy = window.location.hash.slice(1)
if (
  getPage(window.location.pathname).id === 'home' &&
  [
    'schedule',
    'main-events',
    'departments',
    'related-events',
    'stamp-rally',
    'booths',
    'campus-map',
    'access',
    'parking',
    'pamphlet',
  ].includes(legacy)
)
  window.location.replace(sectionUrl(legacy))
const app = (
  <App pageId={root.dataset.page ?? getPage(window.location.pathname).id} />
)
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
