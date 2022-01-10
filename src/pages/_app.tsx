import '@hashicorp/platform-util/nprogress/style.css'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import { DeviceSizeProvider } from 'contexts'
import BaseLayout from 'layouts/base-new'
import './style.css'

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseLayout

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <DeviceSizeProvider>
        <Layout
          {...pageProps?.layoutProps}
          openConsentManager={openConsentManager}
        >
          <Component {...pageProps} />
        </Layout>
      </DeviceSizeProvider>
      <ConsentManager />
    </ErrorBoundary>
  )
}
