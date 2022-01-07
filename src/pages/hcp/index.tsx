import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import hcpData from 'data/hcp.json'
import BaseNewLayout from 'layouts/base-new'
import { Product } from 'types/products'

const product = hcpData as Product

const HCPHomePage = (): ReactElement => {
  return (
    <>
      <h1>HCP</h1>
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

HCPHomePage.layout = BaseNewLayout

export default HCPHomePage
