import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import vaultData from 'data/vault.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = vaultData as Product

const VaultHomePage = (): ReactElement => {
  return (
    <>
      <h1>Vault</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      product,
    },
  }
}

VaultHomePage.layout = BaseNewLayout

export default VaultHomePage
