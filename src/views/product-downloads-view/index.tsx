import { ReactElement, useMemo, useState } from 'react'
import semverRSort from 'semver/functions/rsort'
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import SidecarMarketingCard from './components/sidecar-marketing-card'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import VersionContextSwitcher from 'components/version-context-switcher'
import {
  generateDefaultPackageManagers,
  getPageSubtitle,
  initializeBackToLink,
  initializeBreadcrumbLinks,
  initializeNavData,
} from './helpers'
import { ProductDownloadsViewProps } from './types'
import DownloadsSection from './components/downloads-section'
import FeaturedTutorialsSection from './components/featured-tutorials-section'
import OfficialReleasesSection from './components/official-releases-section'
import s from './product-downloads-view.module.css'
import ProductIcon from 'components/product-icon'

// exclude pre-releases and such
const VALID_SEMVER_REGEX = /^\d+\.\d+\.\d+$/

const ProductDownloadsView = ({
  latestVersion,
  pageContent,
  releases,
}: ProductDownloadsViewProps): ReactElement => {
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
  const [selectedVersion, setSelectedVersion] = useState<string>(
    versionSwitcherOptions[0].value
  )
  const latestVersionIsSelected = selectedVersion === latestVersion
  const currentProduct = useCurrentProduct()
  const backToLink = useMemo(() => initializeBackToLink(currentProduct), [
    currentProduct,
  ])
  const breadcrumbLinks = useMemo(
    () => initializeBreadcrumbLinks(currentProduct, selectedVersion),
    [currentProduct, selectedVersion]
  )
  const navData = useMemo(() => initializeNavData(currentProduct), [
    currentProduct,
  ])

  const pageTitle = `Install ${currentProduct.name}`
  const pageSubtitle = getPageSubtitle(
    currentProduct,
    selectedVersion,
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
      <div style={{ margin: '48px 0' }}>
        <VersionContextSwitcher
          leadingIcon={<ProductIcon product={currentProduct.slug} />}
          onChange={(e) => setSelectedVersion(e.target.value)}
          options={versionSwitcherOptions}
        />
      </div>
      <DownloadsSection
        latestVersionIsSelected={latestVersionIsSelected}
        packageManagers={
          pageContent.packageManagers ||
          generateDefaultPackageManagers(currentProduct)
        }
        selectedRelease={releases.versions[selectedVersion]}
      />
      <OfficialReleasesSection />
      <FeaturedTutorialsSection
        featuredTutorials={pageContent.featuredTutorials}
      />
    </SidebarSidecarLayout>
  )
}

ProductDownloadsView.layout = EmptyLayout
export default ProductDownloadsView
