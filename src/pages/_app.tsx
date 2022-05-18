import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { SSRProvider } from '@react-aria/ssr'
import '@hashicorp/platform-util/nprogress/style.css'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import CodeTabsProvider from '@hashicorp/react-code-block/provider'
import {
  AllProductDataProvider,
  CurrentProductProvider,
  DeviceSizeProvider,
} from 'contexts'
import BaseLayout from 'layouts/base'
import { isDeployPreview, isPreview } from 'lib/env-checks'
import fetchLayoutProps from 'lib/_proxied-dot-io/fetch-layout-props'
import './style.css'
import { useRouter } from 'next/router'
import { PlatformOptionTitles } from 'components/opt-in-out/types'

const showProductSwitcher = isPreview() && !isDeployPreview()

const PreviewProductSwitcher = dynamic(
  () => import('components/_proxied-dot-io/common/preview-product-select'),
  { ssr: false }
)

if (typeof window !== 'undefined' && process.env.AXE_ENABLED) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactDOM = require('react-dom')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000)
}

export default function App({ Component, pageProps, layoutProps }) {
  useAnchorLinkAnalytics()
  const { query } = useRouter()
  const Layout = Component.layout ?? BaseLayout
  const currentProduct = pageProps.product || null

  /**
   * TODO: refactor this so that pageProps.layoutProps is the only place where
   * layoutProps come from.
   */
  const allLayoutProps = {
    ...pageProps.layoutProps,
    ...layoutProps,
  }

  /**
   * Fires beta opt in analytics event if the `optInFrom`
   * query param is present.
   */
  useEffect(() => {
    const optInPlatform = query['optInFrom'] as string

    if (optInPlatform) {
      // @TODO use zach's helper function for this from the video embed
      // Ensures we don't send analytics data if the user hasn't consented
      const hasConsentedAnalyticsTracking =
        window &&
        window.analytics &&
        typeof window.analytics.track == 'function'
      const isValidPlatformOption =
        Object.keys(PlatformOptionTitles).indexOf(optInPlatform) !== -1

      if (isValidPlatformOption && hasConsentedAnalyticsTracking) {
        analytics.track('Beta Opted In', {
          bucket: optInPlatform,
        })
      }
    }
  }, [query])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SSRProvider>
        <ErrorBoundary FallbackComponent={Error}>
          <DeviceSizeProvider>
            <AllProductDataProvider>
              <CurrentProductProvider currentProduct={currentProduct}>
                <CodeTabsProvider>
                  <Layout {...allLayoutProps} data={allLayoutProps}>
                    <Component {...pageProps} />
                  </Layout>
                  {showProductSwitcher ? <PreviewProductSwitcher /> : null}
                </CodeTabsProvider>
              </CurrentProductProvider>
            </AllProductDataProvider>
          </DeviceSizeProvider>
        </ErrorBoundary>
      </SSRProvider>
    </>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  // Determine the product being served through our rewrites so we can fetch the correct layout data
  let proxiedProduct
  if (ctx.pathname.includes('_proxied-dot-io/vault')) {
    proxiedProduct = 'vault'
  } else if (ctx.pathname.includes('_proxied-dot-io/consul')) {
    proxiedProduct = 'consul'
  } else if (ctx.pathname.includes('_proxied-dot-io/nomad')) {
    proxiedProduct = 'nomad'
  }
  const layoutProps = await fetchLayoutProps(Component.layout, proxiedProduct)

  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return {
    pageProps,
    layoutProps,
  }
}
