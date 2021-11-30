import '@hashicorp/platform-util/nprogress/style.css'
import '@hashicorp/platform-util/nprogress/style.css'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import { WindowSizeProvider } from 'contexts'
import BaseLayout from 'layouts/base'
import './style.css'

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseLayout

  return (
    <WindowSizeProvider>
      <ErrorBoundary FallbackComponent={Error}>
        <Layout {...pageProps?.layoutProps}>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    </WindowSizeProvider>
  )
}
