import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Heading from 'components/heading'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductCollectionsSidebar, {
  ProductCollectionsSidebarProps,
} from 'components/tutorials-sidebar/compositions/product-collections-sidebar'
import Button from 'components/button'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { ProductTutorialsSitemap } from './components'
import { ProductTutorialsViewProps } from './server'
import ProductViewContent from './components/product-view-content'
import { getOverviewHeading } from './helpers/heading-helpers'
import s from './product-tutorials-view.module.css'
import { useRouter } from 'next/router'

function ProductTutorialsView({
  layoutProps,
  data,
  product,
}: ProductTutorialsViewProps): React.ReactElement {
  const { inlineCollections, inlineTutorials, pageData, allCollections } = data
  const { showProductSitemap, blocks } = pageData
  const sidebarProduct = {
    name: product.name,
    slug: product.slug,
  } as ProductCollectionsSidebarProps['product']

  const PageHeading = () => {
    const { title, level, slug } = getOverviewHeading()
    return (
      <Heading
        id={slug}
        level={level}
        size={500}
        weight="bold"
        className={s.heading}
      >
        {title}
      </Heading>
    )
  }

  return (
    <SidebarSidecarLayout
      breadcrumbLinks={layoutProps.breadcrumbLinks}
      headings={layoutProps.headings}
      sidebarSlot={
        <ProductCollectionsSidebar
          isOverview={true}
          product={sidebarProduct}
          sections={layoutProps.sidebarSections}
        />
      }
    >
      <PageHeading />
      <OptOutButton />
      <ProductViewContent
        blocks={blocks}
        inlineCollections={inlineCollections}
        inlineTutorials={inlineTutorials}
      />
      {showProductSitemap ? (
        <div className={s.sitemap}>
          <ProductTutorialsSitemap
            collections={allCollections}
            product={product.slug}
          />
        </div>
      ) : null}
    </SidebarSidecarLayout>
  )
}

ProductTutorialsView.layout = CoreDevDotLayout
export default ProductTutorialsView

const LEARN_BASE_URL = 'https://learn.hashicorp.com/'

function OptOutButton() {
  const router = useRouter()
  // handle the remapping, we have all the data needed here to construct the right path
  // currently this will only work for product tutorial landing pages
  const learnPath = router.pathname.split('/')[0]
  const url = new URL(learnPath + '?betaOptOut=true', LEARN_BASE_URL)
  return (
    <Button
      color="tertiary"
      text="Opt out"
      icon={<IconExternalLink16 />}
      iconPosition="trailing"
      onClick={() => window.location.assign(url)}
    />
  )
}
