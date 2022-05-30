import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import vaultData from 'data/vault.json'
import installData from 'data/vault-install.json'
import { ProductData } from 'types/products'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'
import {
  ProductDownloadsViewStaticProps,
  RawProductDownloadsViewContent,
} from 'views/product-downloads-view/types'

const VaultDownloadsPage = ({
  latestVersion,
  releases,
  pageContent,
}: ProductDownloadsViewStaticProps): ReactElement => {
  return (
    <ProductDownloadsView
      latestVersion={latestVersion}
      pageContent={pageContent}
      releases={releases}
    />
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return await generateStaticProps(
    vaultData as ProductData,
    installData as unknown as RawProductDownloadsViewContent
  )
}

VaultDownloadsPage.layout = CoreDevDotLayout
export default VaultDownloadsPage
