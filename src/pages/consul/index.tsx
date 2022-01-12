import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import consulData from 'data/consul.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = consulData as Product

const ConsulHomePage = (): ReactElement => {
  return (
    <>
      <h1>Consul</h1>
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

ConsulHomePage.layout = BaseNewLayout

export default ConsulHomePage
