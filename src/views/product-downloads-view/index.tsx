// Third-party imports
import { ReactElement, useMemo } from 'react'

// Global imports
import { useCurrentProduct } from 'contexts'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

// Local imports
import {
  ProductDownloadsViewContentProps,
  ProductDownloadsViewProps,
} from './types'
import {
  generateDefaultPackageManagers,
  generatePackageManagers,
  initializeBackToLink,
  initializeBreadcrumbLinks,
  initializeNavData,
  initializeVersionSwitcherOptions,
} from './helpers'
import { CurrentVersionProvider, useCurrentVersion } from './contexts'
import {
  DownloadsSection,
  FeaturedTutorialsSection,
  OfficialReleasesSection,
  PageHeader,
  SidecarMarketingCard,
} from './components'

/**
 * This component is used to make it possible to consume the `useCurrentVersion`
 * hook in this view. `ProductDownloadsView` renders `CurrentVersionProvider`
 * and passes this component as the child.
 */
const ProductDownloadsViewContent = ({
  pageContent,
  releases,
  versionSwitcherOptions,
}: ProductDownloadsViewContentProps) => {
  const {
    doesNotHavePackageManagers,
    featuredTutorials,
    packageManagerOverrides,
    sidecarMarketingCard,
  } = pageContent
  const currentProduct = useCurrentProduct()
  const { currentVersion } = useCurrentVersion()
  const backToLinkProps = useMemo(() => initializeBackToLink(currentProduct), [
    currentProduct,
  ])
  const breadcrumbLinks = useMemo(
    () => initializeBreadcrumbLinks(currentProduct, currentVersion),
    [currentProduct, currentVersion]
  )
  const navData = useMemo(() => initializeNavData(currentProduct), [
    currentProduct,
  ])
  const packageManagers = useMemo(() => {
    if (doesNotHavePackageManagers) {
      return []
    }

    return generatePackageManagers({
      defaultPackageManagers: generateDefaultPackageManagers(currentProduct),
      packageManagerOverrides: packageManagerOverrides,
    })
  }, [currentProduct, doesNotHavePackageManagers, packageManagerOverrides])

  return (
    <SidebarSidecarLayout
      sidebarProps={{
        backToLinkProps,
        menuItems: navData,
        showFilterInput: false,
        title: currentProduct.name,
      }}
      breadcrumbLinks={breadcrumbLinks}
      sidecarSlot={<SidecarMarketingCard {...sidecarMarketingCard} />}
    >
      <PageHeader />
      <DownloadsSection
        packageManagers={packageManagers}
        selectedRelease={releases.versions[currentVersion]}
        versionSwitcherOptions={versionSwitcherOptions}
      />
      <OfficialReleasesSection />
      {featuredTutorials && (
        <FeaturedTutorialsSection featuredTutorials={featuredTutorials} />
      )}
    </SidebarSidecarLayout>
  )
}

/**
 * Handles rendering and initializing `CurrentVersionProvider`.
 */
const ProductDownloadsView = ({
  latestVersion,
  pageContent,
  releases,
}: ProductDownloadsViewProps): ReactElement => {
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
        pageContent={pageContent}
        releases={releases}
        versionSwitcherOptions={versionSwitcherOptions}
      />
    </CurrentVersionProvider>
  )
}

ProductDownloadsView.layout = CoreDevDotLayout
export default ProductDownloadsView
