// Third-party imports
import { ReactElement, useMemo } from 'react'

// Global imports
import { useCurrentProduct } from 'contexts'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DevDotContent from 'components/dev-dot-content'
import {
  generateProductLandingSidebarNavData,
  generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'

// Local imports
import {
  ProductDownloadsViewContentProps,
  ProductDownloadsViewProps,
} from './types'
import {
  generateDefaultPackageManagers,
  generatePackageManagers,
  initializeBreadcrumbLinks,
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
  const breadcrumbLinks = useMemo(
    () => initializeBreadcrumbLinks(currentProduct, currentVersion),
    [currentProduct, currentVersion]
  )
  const sidebarNavDataLevels = [
    generateTopLevelSidebarNavData(currentProduct.name),
    generateProductLandingSidebarNavData(currentProduct),
  ]
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
      /**
       * @TODO remove casting to `any`. Will require refactoring both
       * `generateTopLevelSidebarNavData` and
       * `generateProductLandingSidebarNavData` to set up `menuItems` with the
       * correct types. This will require chaning many files, so deferring for
       * a follow-up PR since this is functional for the time being.
       */
      sidebarNavDataLevels={sidebarNavDataLevels as any}
      breadcrumbLinks={breadcrumbLinks}
      sidecarSlot={<SidecarMarketingCard {...sidecarMarketingCard} />}
    >
      <DevDotContent>
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
      </DevDotContent>
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
