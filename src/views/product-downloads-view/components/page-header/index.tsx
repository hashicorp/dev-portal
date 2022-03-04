import { ReactElement } from 'react'
import { useCurrentProduct } from 'contexts'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import { useCurrentVersion } from 'views/product-downloads-view/contexts'
import { getPageSubtitle } from 'views/product-downloads-view/helpers'
import s from './page-header.module.css'

const PageHeader = (): ReactElement => {
  const currentProduct = useCurrentProduct()
  const { currentVersion, isLatestVersion } = useCurrentVersion()
  const pageTitle = `Install ${currentProduct.name}`
  const pageSubtitle = getPageSubtitle({
    productName: currentProduct.name,
    version: currentVersion,
    isLatestVersion,
  })

  return (
    <div className={s.root}>
      <IconTileLogo
        product={
          currentProduct.slug === 'sentinel' ? 'hcp' : currentProduct.slug
        }
      />
      <div className={s.pageHeaderText}>
        <Heading
          className={s.pageHeaderTitle}
          level={1}
          size={500}
          slug={`install-${currentProduct.slug}`}
          weight="bold"
        >
          {pageTitle}
        </Heading>
        <Text className={s.pageHeaderSubtitle} size={300} weight="regular">
          {pageSubtitle}
        </Text>
      </div>
    </div>
  )
}

export default PageHeader
