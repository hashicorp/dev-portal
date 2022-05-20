import { useCurrentProduct } from 'contexts'
import IconTileLogo from 'components/icon-tile-logo'
import Heading from 'components/heading'
import Text from 'components/text'
import { ProductRootDocsPathLandingIconCardLinkGrid } from 'views/product-root-docs-path-landing/components'
import { ProductRootDocsPathLandingHeroProps } from './types'
import s from './hero.module.css'

const ProductRootDocsPathLandingHero = ({
  pageHeading,
  pageSubtitle,
}: ProductRootDocsPathLandingHeroProps) => {
  const currentProduct = useCurrentProduct()

  return (
    <div className={s.root}>
      <div className={s.iconAndTextWrapper}>
        <IconTileLogo
          productSlug={
            currentProduct.slug === 'sentinel' ? 'hcp' : currentProduct.slug
          }
        />
        <div>
          <Heading
            className={s.pageTitle}
            id={pageHeading.id}
            level={1}
            size={500}
            weight="bold"
          >
            {pageHeading.title}
          </Heading>
          <Text className={s.pageSubtitle}>{pageSubtitle}</Text>
        </div>
      </div>
      <ProductRootDocsPathLandingIconCardLinkGrid />
    </div>
  )
}

export default ProductRootDocsPathLandingHero
