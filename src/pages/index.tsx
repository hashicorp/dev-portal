import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'
import ProductCardGrid from 'components/product-card-grid'
import HomepageHero from 'components/homepage-hero'

function Homepage(): ReactElement {
  return (
    <div className="g-grid-container">
      <br />
      <br />
      <HomepageHero />
      <br />
      <br />
      <ProductCardGrid />
    </div>
  )
}

Homepage.layout = BaseNewLayout
export default Homepage
