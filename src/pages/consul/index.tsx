import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const ConsulHomePage = (): ReactElement => {
  return (
    <>
      <h1>Consul</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      product: {
        slug: 'consul',
        name: 'Consul',
      },
    },
  }
}

ConsulHomePage.layout = BaseNewLayout

export default ConsulHomePage
