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

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseLayout

  return (
    <ErrorBoundary>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {isPreview ? <PreviewProductSwitcher /> : null}
    </ErrorBoundary>
  )
}
