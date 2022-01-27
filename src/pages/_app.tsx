import '@hashicorp/platform-util/nprogress/style.css'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import { CurrentProductProvider, DeviceSizeProvider } from 'contexts'
import BaseNewLayout from 'layouts/base-new'
import './style.css'

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseNewLayout
  const currentProduct = pageProps.product || null

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <DeviceSizeProvider>
        <CurrentProductProvider currentProduct={currentProduct}>
          <Layout
            {...pageProps?.layoutProps}
            openConsentManager={openConsentManager}
          >
            <Component {...pageProps} />
          </Layout>
        </CurrentProductProvider>
      </DeviceSizeProvider>
      <ConsentManager />
    </ErrorBoundary>
  )
}
