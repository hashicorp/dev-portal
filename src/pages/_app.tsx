import React from 'react'
import dynamic from 'next/dynamic'
import { SSRProvider } from '@react-aria/ssr'
import '@hashicorp/platform-util/nprogress/style.css'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import CodeTabsProvider from '@hashicorp/react-code-block/provider'
import { CurrentProductProvider, DeviceSizeProvider } from 'contexts'
import BaseLayout from 'layouts/base'
import { isDeployPreview, isPreview } from 'lib/env-checks'
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
          <CurrentProductProvider currentProduct={currentProduct}>
            <CodeTabsProvider>
              <Layout {...allLayoutProps} data={allLayoutProps}>
                <Component {...pageProps} />
              </Layout>
              {showProductSwitcher ? <PreviewProductSwitcher /> : null}
            </CodeTabsProvider>
          </CurrentProductProvider>
        </DeviceSizeProvider>
      </ErrorBoundary>
    </SSRProvider>
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
  } else if (ctx.pathname.includes('_proxied-dot-io/consul')) {
    query = proxiedRivetClient('consul')
  }

  const layoutProps = layoutQuery ? await query(layoutQuery) : null

  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return {
    pageProps,
    layoutProps,
  }
}
