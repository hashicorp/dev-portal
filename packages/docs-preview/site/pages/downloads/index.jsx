import latestVersion from 'data/version'
import { productName, productSlug } from 'data/metadata'
import downloadPageProps from 'data/download-page-props'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from '@hashicorp/react-product-downloads-page/server'

function DownloadsPage({ releases }) {
  return (
    <ProductDownloadsPage
      releases={releases}
      latestVersion={latestVersion}
      productName={productName}
      productId={productSlug}
      product={productSlug}
      {...downloadPageProps}
    />
  )
}

export async function getStaticProps() {
  const staticProps = await generateStaticProps({
    product: productSlug,
    latestVersion,
  })
  const releases = staticProps.props.releases
  return {
    props: {
      releases,
    },
  }
}

export default DownloadsPage
