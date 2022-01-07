import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const SentinelHomePage = (): ReactElement => {
  return (
    <>
      <h1>Sentinel</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      product: {
        slug: 'sentinel',
        name: 'Sentinel',
      },
    },
  }
}

SentinelHomePage.layout = BaseNewLayout

export default SentinelHomePage
