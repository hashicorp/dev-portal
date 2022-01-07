import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const VagrantHomePage = (): ReactElement => {
  return (
    <>
      <h1>Vagrant</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      product: {
        slug: 'vagrant',
        name: 'Vagrant',
      },
    },
  }
}

VagrantHomePage.layout = BaseNewLayout

export default VagrantHomePage
