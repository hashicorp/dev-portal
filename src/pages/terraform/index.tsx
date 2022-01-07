import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const TerraformHomePage = (): ReactElement => {
  return (
    <>
      <h1>Terraform</h1>
      <p>This page is a placeholder</p>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      product: {
        slug: 'terraform',
        name: 'Terraform',
      },
    },
  }
}

TerraformHomePage.layout = BaseNewLayout

export default TerraformHomePage
