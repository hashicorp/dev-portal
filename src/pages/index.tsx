import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'
import ProductCardGrid from 'components/product-card-grid'
import HomepageHero from 'components/homepage-hero'
import Footer from 'components/footer'
import s from './index.module.css'

const WaypointHomePage = (): ReactElement => {
  return (
    <>
      <div className={s.root}>
        <HomepageHero className={s.hero} />
        <h2 className={s.cardGridHeading}>Explore Product Documentation</h2>
        <ProductCardGrid className={s.cardGrid} />
      </div>
      <Footer className={s.footer} />
    </>
  )
}

WaypointHomePage.layout = BaseNewLayout

export default WaypointHomePage
