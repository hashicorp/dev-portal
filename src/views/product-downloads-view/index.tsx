// Third-party imports
import { ReactElement, useMemo } from 'react'

// Global imports
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

// Local imports
import {
  ProductDownloadsViewContentProps,
  ProductDownloadsViewProps,
} from './types'
import {
  generateDefaultPackageManagers,
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
  const currentProduct = useCurrentProduct()
  const { currentVersion } = useCurrentVersion()
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
      <PageHeader />
      <DownloadsSection
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

ProductDownloadsView.layout = EmptyLayout
export default ProductDownloadsView
