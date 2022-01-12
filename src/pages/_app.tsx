import '@hashicorp/platform-util/nprogress/style.css'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import { CurrentProductProvider, DeviceSizeProvider } from 'contexts'
import BaseLayout from 'layouts/base'
import './style.css'

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseLayout
  const currentProduct = pageProps.product || null

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <DeviceSizeProvider>
        <CurrentProductProvider currentProduct={currentProduct}>
          <Layout {...pageProps?.layoutProps}>
            <Component {...pageProps} />
          </Layout>
        </CurrentProductProvider>
      </DeviceSizeProvider>
    </ErrorBoundary>
  )
}
