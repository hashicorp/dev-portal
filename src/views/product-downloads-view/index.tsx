// Third-party imports
import { ReactElement, useMemo } from 'react'
import semverRSort from 'semver/functions/rsort'

// Global imports
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'

// Local imports
import {
  generateDefaultPackageManagers,
  getPageSubtitle,
  initializeBackToLink,
  initializeBreadcrumbLinks,
  initializeNavData,
} from './helpers'
import { ProductDownloadsViewProps } from './types'
import {
  CurrentVersionProvider,
  useCurrentVersion,
} from './current-version-context'
import DownloadsSection from './components/downloads-section'
import FeaturedTutorialsSection from './components/featured-tutorials-section'
import OfficialReleasesSection from './components/official-releases-section'
import SidecarMarketingCard from './components/sidecar-marketing-card'
import s from './product-downloads-view.module.css'
import { VersionContextSwitcherProps } from 'components/version-context-switcher'

// exclude pre-releases and such
const VALID_SEMVER_REGEX = /^\d+\.\d+\.\d+$/

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
  const pageSubtitle = getPageSubtitle(
    currentProduct,
    currentVersion,
    latestVersionIsSelected
  )
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
  const versionSwitcherOptions = useMemo(() => {
    return semverRSort(
      Object.keys(releases.versions).filter((version) => {
        const isValidRegex = !!version.match(VALID_SEMVER_REGEX)
        return isValidRegex
      })
    ).map((version) => {
      const isLatest = version === latestVersion
      return {
        label: `${version}${isLatest ? ' (latest)' : ''}`,
        value: version,
      }
    })
  }, [latestVersion, releases.versions])

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
