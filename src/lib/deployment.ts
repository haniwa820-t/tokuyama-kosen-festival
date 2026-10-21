export function deploymentConfig(env: Record<string, string | undefined>) {
  const base = env.SITE_BASE_PATH || '/'
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) {
    throw new Error('SITE_BASE_PATH must be a slash-delimited local path')
  }
  const url = new URL(
    env.SITE_URL || env.CF_PAGES_URL || `http://localhost:4173${base}`,
  )
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'SITE_URL must be an HTTP(S) URL without credentials, query or hash',
    )
  }
  url.pathname = url.pathname.replace(/\/?$/, '/')
  if (url.pathname !== base)
    throw new Error('SITE_URL path must match SITE_BASE_PATH')
  return { base, siteUrl: url.href }
}
