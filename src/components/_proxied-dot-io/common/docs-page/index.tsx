import useProductMeta from '@hashicorp/platform-product-meta'
import ReactDocsPage, { DocsPageProps } from '@hashicorp/react-docs-page'
import ImageConfigBase from 'components/image-config'
import { ImageConfigProps } from 'components/image-config/types'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { ProductSlug } from 'types/products'
import DevDotOptIn from '../dev-dot-opt-in'

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
    getIsBetaProduct(productSlug as ProductSlug) &&
    __config.flags.enable_io_beta_cta

  return (
    <ReactDocsPage
      additionalComponents={{ ...ioComponents, ...additionalComponents }}
      optInBanner={shouldRenderOptInCTA ? <DevDotOptIn /> : null}
      {...props}
    />
  )
}
