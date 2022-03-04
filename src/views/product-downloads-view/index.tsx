// Third-party imports
import { ReactElement, useMemo } from 'react'

// Global imports
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import { VersionContextSwitcherProps } from 'components/version-context-switcher'

// Local imports
import {
  generateDefaultPackageManagers,
  getPageSubtitle,
  initializeBackToLink,
  initializeBreadcrumbLinks,
  initializeNavData,
  initializeVersionSwitcherOptions,
} from './helpers'
import { ProductDownloadsViewProps } from './types'
import { CurrentVersionProvider, useCurrentVersion } from './contexts'
import {
  DownloadsSection,
  FeaturedTutorialsSection,
  OfficialReleasesSection,
  SidecarMarketingCard,
} from './components'
import s from './product-downloads-view.module.css'

const ProductDownloadsViewContent = ({
  latestVersion,
  pageContent,
  releases,
  versionSwitcherOptions,
}: ProductDownloadsViewProps & {
  versionSwitcherOptions: VersionContextSwitcherProps['options']
}) => {
  const currentProduct = useCurrentProduct()
  const [currentVersion] = useCurrentVersion()
  const latestVersionIsSelected = currentVersion === latestVersion
  const backToLink = useMemo(() => initializeBackToLink(currentProduct), [
    currentProduct,
  ])
  const breadcrumbLinks = useMemo(
    () => initializeBreadcrumbLinks(currentProduct, currentVersion),
    [currentProduct, currentVersion]
  )
  const navData = useMemo(() => initializeNavData(currentProduct), [
    currentProduct,
  ])

  const pageTitle = `Install ${currentProduct.name}`
  const pageSubtitle = getPageSubtitle({
    productName: currentProduct.name,
    version: currentVersion,
    isLatestVersion: latestVersionIsSelected,
  })
  return (
    <SidebarSidecarLayout
      backToLink={backToLink}
      breadcrumbLinks={breadcrumbLinks}
      navData={navData}
      productName="Waypoint"
      showFilterInput={false}
      sidecarChildren={
        <SidecarMarketingCard {...pageContent.sidecarMarketingCard} />
      }
    >
      <div className={s.pageHeader}>
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
      <DownloadsSection
        latestVersionIsSelected={latestVersionIsSelected}
        packageManagers={generateDefaultPackageManagers(currentProduct)}
        selectedRelease={releases.versions[currentVersion]}
        versionSwitcherOptions={versionSwitcherOptions}
      />
      <OfficialReleasesSection />
      <FeaturedTutorialsSection
        featuredTutorials={pageContent.featuredTutorials}
      />
    </SidebarSidecarLayout>
  )
}

const ProductDownloadsView = (
  props: ProductDownloadsViewProps
): ReactElement => {
  const { latestVersion, releases } = props
  const versionSwitcherOptions = useMemo(
    () => initializeVersionSwitcherOptions({ latestVersion, releases }),
    [latestVersion, releases]
  )

  return (
    <CurrentVersionProvider initialValue={versionSwitcherOptions[0].value}>
      <ProductDownloadsViewContent
        {...props}
        versionSwitcherOptions={versionSwitcherOptions}
      />
    </CurrentVersionProvider>
  )
}

ProductDownloadsView.layout = EmptyLayout
export default ProductDownloadsView
