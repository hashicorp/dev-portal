import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const HCPHomePage = (): ReactElement => {
  return (
    <>
      <h1>HCP</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      product: {
        slug: 'hcp',
        name: 'HashiCorp Cloud Platform',
      },
    },
  }
}

HCPHomePage.layout = BaseNewLayout

export default HCPHomePage
