import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import nomadData from 'data/nomad.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = nomadData as Product

const NomadHomePage = (): ReactElement => {
  return (
    <>
      <h1>Nomad</h1>
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

NomadHomePage.layout = BaseNewLayout

export default NomadHomePage
