import '@hashicorp/platform-util/nprogress/style.css'
import dynamic from 'next/dynamic'
import rivetQuery, { client as rivetClient } from '@hashicorp/platform-cms'
import { headers } from '@hashicorp/platform-cms/config'
import { ErrorBoundary } from '@hashicorp/platform-runtime-error-monitoring'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import BaseLayout from 'layouts/base'
import './style.css'

const isPreview = process.env.HASHI_ENV === 'preview'

const PreviewProductSwitcher = dynamic(
  () => import('components/_proxied-dot-io/common/preview-product-select'),
  { ssr: false }
)

export default function App({ Component, pageProps, layoutData }) {
  useAnchorLinkAnalytics()

  const Layout = Component.layout ?? BaseLayout

  return (
    <ErrorBoundary>
      <Layout {...(layoutData && { data: layoutData })}>
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

  if (ctx.pathname.includes('_proxied-dot-io/vault')) {
    rivetClient.setHeader('Authorization', '88b4984480dad56295a8aadae6caad')
  } else {
    rivetClient.setHeader('Authorization', headers.Authorization)
  }

  const layoutData = layoutQuery ? await rivetQuery(layoutQuery) : null

  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  return { pageProps, layoutData }
}
