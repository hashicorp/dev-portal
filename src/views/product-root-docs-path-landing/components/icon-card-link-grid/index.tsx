import useCurrentPath from 'hooks/use-current-path'
import { useCurrentProduct } from 'contexts'
import IconCardLink from 'components/icon-card-link'
import { SUPPORTED_ICONS } from '../supported-icons'
import s from './icon-card-link-grid.module.css'

const ProductRootDocsPathLandingIconCardLinkGrid = () => {
  const currentPath = useCurrentPath()
  const currentProduct = useCurrentProduct()

  return (
    <ul className={s.root}>
      {currentProduct.rootDocsPaths.map(({ iconName, path, name }) => {
        const fullPath = `/${currentProduct.slug}/${path}`
        const matchesCurrentPath = fullPath === currentPath

        if (matchesCurrentPath) {
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
