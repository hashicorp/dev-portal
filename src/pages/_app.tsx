import '@hashicorp/platform-util/nprogress/style.css'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import BaseLayout from 'layouts/base'
import './style.css'

const isPreview = process.env.HASHI_ENV === 'preview'

const PreviewProductSwitcher = dynamic(
  () => import('components/_proxied-dot-io/common/preview-product-select'),
  { ssr: false }
)

export default function App({ Component, pageProps, layoutProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseLayout

  return (
    <ErrorBoundary>
      <Layout {...(layoutProps && { data: layoutProps })}>
        <Component {...pageProps} />
      </Layout>
      {isPreview ? <PreviewProductSwitcher /> : null}
    </ErrorBoundary>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  const layoutQuery = Component.layout
    ? Component.layout?.rivetParams ?? null
    : null

  const { default: rivetQuery, proxiedRivetClient } = await import('lib/cms')
  let query = rivetQuery
  if (ctx.pathname.includes('_proxied-dot-io/vault')) {
    query = proxiedRivetClient('vault')
  }

  const layoutProps = layoutQuery ? await query(layoutQuery) : null

  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  return { pageProps, layoutProps }
}
