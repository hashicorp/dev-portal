import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import consulData from 'data/consul.json'
import installData from 'data/consul-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductDownloadsView from 'views/product-downloads-view'

const ConsulDownloadsPage = (props: GeneratedProps): ReactElement => {
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
  const product = consulData as ProductData

  return generateStaticProps(product)
}

ConsulDownloadsPage.layout = CoreDevDotLayout

export default ConsulDownloadsPage
