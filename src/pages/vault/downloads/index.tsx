import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import vaultData from 'data/vault.json'
import installData from 'data/vault-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductDownloadsView from 'views/product-downloads-view'

const VaultDownloadsPage = (props: GeneratedProps): ReactElement => {
  const { latestVersion, releases } = props
  return (
    <ProductDownloadsView
      latestVersion={latestVersion}
      pageContent={installData}
      releases={releases}
    />
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const product = vaultData as ProductData

  return generateStaticProps(product)
}

VaultDownloadsPage.layout = CoreDevDotLayout
export default VaultDownloadsPage
