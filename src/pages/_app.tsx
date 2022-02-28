import React from 'react'
import { SSRProvider } from '@react-aria/ssr'
import '@hashicorp/platform-util/nprogress/style.css'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import CodeTabsProvider from '@hashicorp/react-code-block/provider'
import { CurrentProductProvider, DeviceSizeProvider } from 'contexts'
import BaseNewLayout from 'layouts/base-new'
import './style.css'

if (typeof window !== 'undefined' && process.env.AXE_ENABLED) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactDOM = require('react-dom')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000)
}

const { ConsentManager, openConsentManager } = createConsentManager({
  preset: 'oss',
})

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseNewLayout
  const currentProduct = pageProps.product || null

  return (
    <SSRProvider>
      <ErrorBoundary FallbackComponent={Error}>
        <DeviceSizeProvider>
          <CurrentProductProvider currentProduct={currentProduct}>
            <CodeTabsProvider>
              <Layout
                {...pageProps?.layoutProps}
                openConsentManager={openConsentManager}
              >
                <Component {...pageProps} />
              </Layout>
            </CodeTabsProvider>
          </CurrentProductProvider>
        </DeviceSizeProvider>
        <ConsentManager />
      </ErrorBoundary>
    </SSRProvider>
  )
}
