import React, { ReactElement } from 'react'
import classNames from 'classnames'
import CardLink from 'components/card-link'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import CONTENT from './content.json'
import s from './product-card-grid.module.css'

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

function CardGridSection({ title, products }: $TSFixMe): ReactElement {
  return (
    <div className={s.cardGridSection}>
      <Text
        asElement="span"
        className={s.sectionHeading}
        size={200}
        weight="semibold"
      >
        {title}
      </Text>
      <span className={s.sectionBody}>
        {products.map(
          ({ slug, hasLogo, headingIcon, heading, subheading }: $TSFixMe) => {
            return (
              <div className={s.sectionBodyCardWrapper} key={slug}>
                <CardLink className={s.sectionBodyCard} href={`/${slug}`}>
                  {hasLogo && (
                    <ProductIcon
                      className={s.sectionBodyCardLogo}
                      productSlug={slug}
                    />
                  )}
                  <span className={s.sectionBodyCardHeading}>
                    {headingIcon && (
                      <ProductIcon
                        className={s.sectionBodyCardHeadingIcon}
                        productSlug={slug}
                      />
                    )}
                    {heading}
                  </span>
                  <Text
                    asElement="span"
                    className={s.sectionBodyCardSubheading}
                    dangerouslySetInnerHTML={{ __html: subheading }}
                    size={200}
                  />
                </CardLink>
              </div>
            )
          }
        )}
      </span>
    </div>
  )
}

export default ProductCardGrid
