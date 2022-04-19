import React from 'react'
import dynamic from 'next/dynamic'
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

  return (
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
