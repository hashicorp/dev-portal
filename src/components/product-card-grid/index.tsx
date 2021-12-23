import React, { ReactElement } from 'react'
import Link from 'next/link'
import s from './style.module.css'

const cardGridSections = [
  {
    title: 'Infrastructure',
    products: ['terraform', 'packer'],
  },
  {
    title: 'Networking',
    products: ['consul'],
  },
  {
    title: 'Security',
    products: ['vault', 'boundary'],
  },
  {
    title: 'Application',
    products: ['nomad', 'waypoint', 'vagrant'],
  },
  {
    title: 'Cloud',
    products: ['hcp'],
  },
  {
    title: 'Policy',
    products: ['sentinel'],
  },
]
function ProductCardGrid(): ReactElement {
  return (
    <div className={s.root}>
      {cardGridSections.map((section) => {
        const { title, products } = section
        return <CardGridSection key={title} title={title} products={products} />
      })}
    </div>
  )
}

function CardGridSection({ title, products }): ReactElement {
  return (
    <div className={s.cardGridSection}>
      <span className={s.sectionHeading}>{title}</span>
      <span className={s.sectionBody}>
        {products.map((slug) => {
          return (
            <Link key={slug} href={`/${slug}`}>
              <a className={s.sectionBodyCardWrapper}>
                <span className={s.sectionBodyCard}>{slug}</span>
              </a>
            </Link>
          )
        })}
      </span>
    </div>
  )
}

export default ProductCardGrid
