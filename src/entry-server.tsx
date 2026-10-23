import { renderToString } from 'react-dom/server'
import App from './App'
export { pages } from './lib/pages'
export {
  canonicalSiteUrl,
  pageMetadata,
  structuredData,
  serializeJsonLd,
} from './lib/seo'
export function render(pageId: string) {
  return renderToString(<App pageId={pageId} />)
}
