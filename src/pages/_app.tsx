import '@hashicorp/platform-util/nprogress/style.css'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import { DeviceSizeProvider } from 'contexts'
import AlertBanner from 'components/alert-banner'
import BaseLayout from 'layouts/base'
import './style.css'

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseLayout

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <DeviceSizeProvider>
        <AlertBanner type="highlight">
          <p>
            You are viewing an internal preview and work in progress version of
            this site.{' '}
            <a
              href="https://airtable.com/shrU3eYHIOXO60o23"
              rel="noopener noreferrer"
              target="_blank"
            >
              We'd love to hear your feedback
            </a>
            !
          </p>
        </AlertBanner>
        <Layout {...pageProps?.layoutProps}>
          <Component {...pageProps} />
        </Layout>
      </DeviceSizeProvider>
    </ErrorBoundary>
  )
}
