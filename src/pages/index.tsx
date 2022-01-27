import { ReactElement } from 'react'
import Heading from 'components/heading'
import HomepageHero from 'components/homepage-hero'
import ProductCardGrid from 'components/product-card-grid'
import s from './index.module.css'

function Homepage(): ReactElement {
  return (
    <div className={s.root}>
      <HomepageHero className={s.hero} />
      <Heading
        className={s.cardGridHeading}
        level={2}
        size={400}
        slug="explore-product-documentation"
        weight="bold"
      >
        Explore Product Documentation
      </Heading>
      <ProductCardGrid className={s.cardGrid} />
    </div>
  )
}

export default Homepage
