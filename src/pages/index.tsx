import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'
import ProductCardGrid from 'components/product-card-grid'
import HomepageHero from 'components/homepage-hero'
import Footer from 'components/footer'
import s from './index.module.css'

function Homepage(): ReactElement {
  return (
    <>
      <div className={s.root}>
        <br />
        <br />
        <HomepageHero />
        <br />
        <br />
        <ProductCardGrid />
      </div>
      <Footer className={s.footer} />
    </>
  )
}

Homepage.layout = BaseNewLayout
export default Homepage
