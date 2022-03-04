// Third-party imports
import { ReactElement, useMemo } from 'react'

// Global imports
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { VersionContextSwitcherProps } from 'components/version-context-switcher'

// Local imports
import {
  generateDefaultPackageManagers,
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
  PageHeader,
  SidecarMarketingCard,
} from './components'

const ProductDownloadsViewContent = ({
  latestVersion,
  pageContent,
  releases,
  versionSwitcherOptions,
}: ProductDownloadsViewProps & {
  versionSwitcherOptions: VersionContextSwitcherProps['options']
}) => {
  const currentProduct = useCurrentProduct()
  const { currentVersion } = useCurrentVersion()
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

  return (
    <SidebarSidecarLayout
      backToLink={backToLink}
      breadcrumbLinks={breadcrumbLinks}
      navData={navData}
      productName={currentProduct.name}
      showFilterInput={false}
      sidecarChildren={
        <SidecarMarketingCard {...pageContent.sidecarMarketingCard} />
      }
    >
      <PageHeader latestVersion={latestVersion} />
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
    <CurrentVersionProvider
      initialValue={versionSwitcherOptions[0].value}
      latestVersion={latestVersion}
    >
      <ProductDownloadsViewContent
        {...props}
        versionSwitcherOptions={versionSwitcherOptions}
      />
    </CurrentVersionProvider>
  )
}

ProductDownloadsView.layout = EmptyLayout
export default ProductDownloadsView
