import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const VaultHomePage = (): ReactElement => {
  return (
    <>
      <h1>Vault</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      product: {
        slug: 'vault',
        name: 'Vault',
      },
    },
  }
}

VaultHomePage.layout = BaseNewLayout

export default VaultHomePage
