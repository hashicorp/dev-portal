import React, { ReactElement } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import ProductIcon from 'components/product-icon'
import s from './style.module.css'
import CONTENT from './content.json'

function ProductCardGrid({ className }: { className?: string }): ReactElement {
  return (
    <div className={classNames(s.root, className)}>
      {CONTENT.cardGridSections.map((section) => {
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
        {products.map(({ slug, hasLogo, headingIcon, heading, subheading }) => {
          return (
            <Link key={slug} href={`/${slug}`}>
              <a className={s.sectionBodyCardWrapper}>
                <span className={s.sectionBodyCard}>
                  {hasLogo && (
                    <ProductIcon
                      className={s.sectionBodyCardLogo}
                      product={slug}
                    />
                  )}
                  <span className={s.sectionBodyCardHeading}>
                    {headingIcon && (
                      <ProductIcon
                        className={s.sectionBodyCardHeadingIcon}
                        product={slug}
                      />
                    )}
                    {heading}
                  </span>
                  <span
                    className={s.sectionBodyCardSubheading}
                    dangerouslySetInnerHTML={{ __html: subheading }}
                  />
                </span>
              </a>
            </Link>
          )
        })}
      </span>
    </div>
  )
}

export default ProductCardGrid
