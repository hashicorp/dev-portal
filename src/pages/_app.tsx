import React from 'react'
import '@hashicorp/platform-util/nprogress/style.css'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import { DeviceSizeProvider } from 'contexts'
import BaseLayout from 'layouts/base'
import './style.css'

export default function App({ Component, pageProps }) {
  useAnchorLinkAnalytics()

  if (typeof window !== 'undefined' && process.env.AXE_ENABLED) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ReactDOM = require('react-dom')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const axe = require('@axe-core/react')
    axe(React, ReactDOM, 1000)
  }

  const Layout = Component.layout ?? BaseLayout

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <DeviceSizeProvider>
        <Layout {...pageProps?.layoutProps}>
          <Component {...pageProps} />
        </Layout>
      </DeviceSizeProvider>
    </ErrorBoundary>
  )
}
