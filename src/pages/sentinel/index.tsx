import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import sentinelData from 'data/sentinel.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = sentinelData as Product

const SentinelHomePage = (): ReactElement => {
  return (
    <>
      <h1>Sentinel</h1>
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

SentinelHomePage.layout = BaseNewLayout

export default SentinelHomePage
