import { GetStaticProps } from 'next'
import vaultData from 'data/vault.json'
import installData from 'data/vault-install.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateStaticProps } from 'views/product-downloads-view/server'
import { RawProductDownloadsViewContent } from 'views/product-downloads-view/types'

export const getStaticProps: GetStaticProps = async () => {
  return await generateStaticProps(
    vaultData as ProductData,
    installData as RawProductDownloadsViewContent
  )
}

export default ProductDownloadsView
