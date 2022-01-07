import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const PackerHomePage = (): ReactElement => {
  return (
    <>
      <h1>Packer</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      product: {
        slug: 'packer',
        name: 'Packer',
      },
    },
  }
}

PackerHomePage.layout = BaseNewLayout

export default PackerHomePage
