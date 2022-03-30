import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import vagrantData from 'data/vagrant.json'
import installData from 'data/vagrant-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductDownloadsView from 'views/product-downloads-view'
import PlaceholderDownloadsView from 'views/placeholder-product-downloads-view'

const VagrantDownloadsPage = (props: GeneratedProps): ReactElement => {
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
  const product = vagrantData as ProductData

  return generateStaticProps(product)
}

VagrantDownloadsPage.layout = CoreDevDotLayout

export default VagrantDownloadsPage
