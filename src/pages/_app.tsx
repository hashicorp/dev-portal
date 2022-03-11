import '@hashicorp/platform-util/nprogress/style.css'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import BaseLayout from 'layouts/base'
import './style.css'

const isPreview = process.env.HASHI_ENV === 'preview'

const PreviewProductSwitcher = dynamic(
  () => import('components/_proxied-dot-io/common/preview-product-select'),
  { ssr: false }
)

export default function App({ Component, pageProps, layoutProps }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseLayout

  return (
    <ErrorBoundary>
      <Layout {...(layoutProps && { data: layoutProps })}>
        <Component {...pageProps} />
      </Layout>
      {isPreview ? <PreviewProductSwitcher /> : null}
    </ErrorBoundary>
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
  return { pageProps, layoutProps }
}

/**
 * TODO: this is the file from assembly-ui-v1, commenting out to resolve in a
 * follow-up commit
 */
// import React from 'react'
// import { SSRProvider } from '@react-aria/ssr'
// import '@hashicorp/platform-util/nprogress/style.css'
// import createConsentManager from '@hashicorp/react-consent-manager/loader'
// import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
// import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
// import CodeTabsProvider from '@hashicorp/react-code-block/provider'
// import { CurrentProductProvider, DeviceSizeProvider } from 'contexts'
// import BaseNewLayout from 'layouts/base-new'
// import './style.css'

// if (typeof window !== 'undefined' && process.env.AXE_ENABLED) {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const ReactDOM = require('react-dom')
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const axe = require('@axe-core/react')
//   axe(React, ReactDOM, 1000)
// }

// const { ConsentManager, openConsentManager } = createConsentManager({
//   preset: 'oss',
// })

// export default function App({ Component, pageProps }) {
//   useAnchorLinkAnalytics()

//   const Layout = Component.layout ?? BaseNewLayout
//   const currentProduct = pageProps.product || null

//   return (
//     <SSRProvider>
//       <ErrorBoundary FallbackComponent={Error}>
//         <DeviceSizeProvider>
//           <CurrentProductProvider currentProduct={currentProduct}>
//             <CodeTabsProvider>
//               <Layout
//                 {...pageProps?.layoutProps}
//                 openConsentManager={openConsentManager}
//               >
//                 <Component {...pageProps} />
//               </Layout>
//             </CodeTabsProvider>
//           </CurrentProductProvider>
//         </DeviceSizeProvider>
//         <ConsentManager />
//       </ErrorBoundary>
//     </SSRProvider>
//   )
// }
