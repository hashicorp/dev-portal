import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import boundaryData from 'data/boundary.json'
import installData from 'data/boundary-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductDownloadsView from 'views/product-downloads-view'

const BoundaryDownloadsPage = (props: GeneratedProps): ReactElement => {
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
  const product = boundaryData as ProductData

  return generateStaticProps(product)
}

BoundaryDownloadsPage.layout = CoreDevDotLayout

export default BoundaryDownloadsPage
