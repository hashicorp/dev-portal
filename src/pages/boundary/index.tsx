import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const BoundaryHomePage = (): ReactElement => {
  return (
    <>
      <h1>Boundary</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      product: {
        slug: 'boundary',
        name: 'Boundary',
      },
    },
  }
}

BoundaryHomePage.layout = BaseNewLayout

export default BoundaryHomePage
