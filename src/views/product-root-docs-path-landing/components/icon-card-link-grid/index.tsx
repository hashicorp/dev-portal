import { ProductData, RootDocsPath } from 'types/products'
import { useCurrentProduct } from 'contexts'
import IconCardLink from 'components/icon-card-link'
import { SUPPORTED_ICONS } from '../supported-icons'
import s from './icon-card-link-grid.module.css'

interface ProductRootDocsPathLandingPageProduct extends ProductData {
  currentRootDocsPath: RootDocsPath
}

const ProductRootDocsPathLandingIconCardLinkGrid = () => {
  const currentProduct =
    useCurrentProduct() as ProductRootDocsPathLandingPageProduct

  return (
    <ul className={s.root}>
      {currentProduct.rootDocsPaths.map(({ iconName, path, name }) => {
        if (currentProduct.currentRootDocsPath.path === path) {
          return null
        }

        return (
          <li key={path}>
            <IconCardLink
              icon={SUPPORTED_ICONS[iconName]}
              productSlug={currentProduct.slug}
              text={name}
              url={path}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default ProductRootDocsPathLandingIconCardLinkGrid
