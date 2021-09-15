import latestVersion from 'data/version'
import productMetadata from 'data/metadata.json'
import downloadPageProps from 'data/download-page-props'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from '@hashicorp/react-product-downloads-page/server'

function DownloadsPage({ releases, product }) {
  return (
    <ProductDownloadsPage
      releases={releases}
      latestVersion={latestVersion}
      productName={product.name}
      productId={product.slug}
      product={product.slug}
      {...downloadPageProps}
    />
  )
}

export async function getStaticProps() {
  const { product } = productMetadata
  const staticProps = await generateStaticProps({
    product: product.slug,
    latestVersion,
  })
  const releases = staticProps.props.releases
  return {
    props: {
      releases,
      product,
      latestVersion,
    },
  }
}

export default DownloadsPage
