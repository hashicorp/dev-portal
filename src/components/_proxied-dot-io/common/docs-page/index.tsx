import Head from 'next/head'
import useProductMeta from '@hashicorp/platform-product-meta'
import ReactDocsPage, { DocsPageProps } from '@hashicorp/react-docs-page'
import ImageConfigBase from 'components/image-config'
import { ImageConfigProps } from 'components/image-config/types'
import { isContentDeployPreview } from 'lib/env-checks'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { ProductSlug } from 'types/products'
import DevDotOptIn from '../dev-dot-opt-in'
import { getCanonicalUrlForDocsPage } from './lib/get-canonical-url'

const ioComponents = {
  ImageConfig: (props: ImageConfigProps) => (
    <ImageConfigBase hideBorder {...props} />
  ),
}

/**
 * A shared wrapper around react-docs-page to inject common authoring components for our .io docs pages.
 */
export default function DocsPage({
  additionalComponents,
  ...props
}: DocsPageProps) {
  const { slug: productSlug } = useProductMeta()

  // Based on our config values, decide whether or not we should render the dev portal beta CTA.
  const shouldRenderOptInCTA =
    !isContentDeployPreview(productSlug) &&
    getIsBetaProduct(productSlug as ProductSlug) &&
    __config.flags.enable_io_beta_cta

  // Generate a canonical URL for a given .io site docs page
  const canonicalUrl = getCanonicalUrlForDocsPage({
    baseRoute: props.baseRoute,
    currentPath: props.staticProps.currentPath,
    productSlug,
  })

  return (
    <>
      {canonicalUrl && (
        <Head>
          <link rel="canonical" key="canonical" href={canonicalUrl} />
        </Head>
      )}
      <ReactDocsPage
        additionalComponents={{ ...ioComponents, ...additionalComponents }}
        optInBanner={shouldRenderOptInCTA ? <DevDotOptIn /> : null}
        {...props}
      />
    </>
  )
}
