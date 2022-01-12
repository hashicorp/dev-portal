import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import vagrantData from 'data/vagrant.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = vagrantData as Product

const VagrantHomePage = (): ReactElement => {
  return (
    <>
      <h1>Vagrant</h1>
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

VagrantHomePage.layout = BaseNewLayout

export default VagrantHomePage
