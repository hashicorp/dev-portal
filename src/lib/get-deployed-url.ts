export default function getDeployedUrl() {
  // preview deployments should derive the url from Vercel's env var
  if (process.env.HASHI_ENV === 'preview') {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }

  if (process.env.HASHI_ENV === 'development') {
    return ''
  }

  // use our canonical URL for production
  return __config.dev_dot.canonical_url
}
