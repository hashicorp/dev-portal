import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const NomadHomePage = (): ReactElement => {
  return (
    <>
      <h1>Nomad</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      product: {
        slug: 'nomad',
        name: 'Nomad',
      },
    },
  }
}

NomadHomePage.layout = BaseNewLayout

export default NomadHomePage
