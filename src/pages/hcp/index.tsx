import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import hcpData from 'data/hcp.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

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
