import { renderToString } from 'react-dom/server'
import App from './App'
export { pages } from './lib/pages'
export function render(pageId: string) {
  return renderToString(<App pageId={pageId} />)
}
