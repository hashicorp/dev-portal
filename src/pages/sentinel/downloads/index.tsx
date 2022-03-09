import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import sentinelData from 'data/sentinel.json'
import installData from 'data/sentinel-install.json'
import { Product } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import EmptyLayout from 'layouts/empty'
import ProductDownloadsView from 'views/product-downloads-view'
import PlaceholderDownloadsView from 'views/placeholder-product-downloads-view'

const SentienlDownloadsPage = (props: GeneratedProps): ReactElement => {
  if (__config.flags.enable_new_downloads_view) {
    const { latestVersion, releases } = props
    return (
      <ProductDownloadsView
        latestVersion={latestVersion}
        pageContent={installData}
        releases={releases}
      />
    )
  } else {
    return <PlaceholderDownloadsView />
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const product = sentinelData as Product

  return generateStaticProps(product)
}

SentienlDownloadsPage.layout = EmptyLayout

export default SentienlDownloadsPage
