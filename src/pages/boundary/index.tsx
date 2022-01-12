import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import boundaryData from 'data/boundary.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = boundaryData as Product

const BoundaryHomePage = (): ReactElement => {
  return (
    <>
      <h1>Boundary</h1>
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

BoundaryHomePage.layout = BaseNewLayout

export default BoundaryHomePage
