import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import nomadData from 'data/nomad.json'
import installData from 'data/nomad-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductDownloadsView from 'views/product-downloads-view'

const NomadDownloadsPage = (props: GeneratedProps): ReactElement => {
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
  const product = nomadData as ProductData

  return generateStaticProps(product)
}

NomadDownloadsPage.layout = CoreDevDotLayout

export default NomadDownloadsPage
