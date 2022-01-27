import '@hashicorp/platform-util/nprogress/style.css'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import BaseLayout from 'layouts/base'
import PreviewProductSwitcher from 'components/_proxied-dot-io/common/preview-product-select'
import './style.css'

const isPreview = process.env.HASHI_ENV === 'preview'

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseLayout

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {isPreview ? <PreviewProductSwitcher /> : null}
    </ErrorBoundary>
  )
}
