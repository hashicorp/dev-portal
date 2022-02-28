import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import vaultData from 'data/vault.json'
import installData from 'data/vault-install.json'
import { Product } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import EmptyLayout from 'layouts/empty'
import ProductDownloadsView from 'views/product-downloads-view'
import PlaceholderDownloadsView from 'views/placeholder-product-downloads-view'

const VaultDownloadsPage = (props: GeneratedProps): ReactElement => {
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
  const product = vaultData as Product

  return generateStaticProps(product)
}

VaultDownloadsPage.layout = EmptyLayout
export default VaultDownloadsPage
