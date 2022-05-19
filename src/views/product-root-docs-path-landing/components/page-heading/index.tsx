import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import Heading from 'components/heading'
import s from './page-heading.module.css'

const ProductRootDocsPathLandingPageHeading = () => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const currentProduct = useCurrentProduct()

  /**
   * @TODO update useCurrentProduct to determine the current rootDocsPath since
   * it's needed in multiple places. Also document well since sometimes it'll be
   * null/undefined!
   */
  const currentRootDocsPath = currentProduct.rootDocsPaths.find(({ path }) => {
    return `/${currentProduct.slug}/${path}` === currentPath
  })
  const headingText = `${currentProduct.name} ${currentRootDocsPath.shortName}`

  return (
    <Heading className={s.root} level={1} size={500} weight="bold">
      {headingText}
    </Heading>
  )
}

export default ProductRootDocsPathLandingPageHeading
