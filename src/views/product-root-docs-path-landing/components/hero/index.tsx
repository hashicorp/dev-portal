import { useCurrentProduct } from 'contexts'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import {
  ProductRootDocsPathLandingPageHeading,
  ProductRootDocsPathLandingIconCardLinkGrid,
} from 'views/product-root-docs-path-landing/components'
import { ProductRootDocsPathLandingHeroProps } from './types'
import s from './hero.module.css'

const ProductRootDocsPathLandingHero = ({
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
          <ProductRootDocsPathLandingPageHeading />
          <Text className={s.pageSubtitle}>{pageSubtitle}</Text>
        </div>
      </div>
      <ProductRootDocsPathLandingIconCardLinkGrid />
    </div>
  )
}

export default ProductRootDocsPathLandingHero
