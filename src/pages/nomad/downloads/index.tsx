import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import nomadData from 'data/nomad.json'
import installData from 'data/nomad-install.json'
import { Product } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import EmptyLayout from 'layouts/empty'
import ProductDownloadsView from 'views/product-downloads-view'
import PlaceholderDownloadsView from 'views/placeholder-product-downloads-view'

const NomadDownloadsPage = (props: GeneratedProps): ReactElement => {
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
  const product = nomadData as Product

  return generateStaticProps(product)
}

NomadDownloadsPage.layout = EmptyLayout

export default NomadDownloadsPage
