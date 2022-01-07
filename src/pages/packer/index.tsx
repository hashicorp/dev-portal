import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import packerData from 'data/packer.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = packerData as Product

const PackerHomePage = (): ReactElement => {
  return (
    <>
      <h1>Packer</h1>
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

PackerHomePage.layout = BaseNewLayout

export default PackerHomePage
