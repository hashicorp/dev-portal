import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import terraformData from 'data/terraform.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = terraformData as Product

const TerraformHomePage = (): ReactElement => {
  return (
    <>
      <h1>Terraform</h1>
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

TerraformHomePage.layout = BaseNewLayout

export default TerraformHomePage
