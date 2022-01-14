import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import vaultData from 'data/waypoint.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = vaultData as Product

const VaultDownloadsPage = (): ReactElement => {
  return (
    <div className="g-grid-container">
      <h1>Vault Downloads</h1>
      <ul>
        <li>This page is a work in progress</li>
      </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { product },
    revalidate: 10,
  }
}

VaultDownloadsPage.layout = BaseNewLayout
export default VaultDownloadsPage
