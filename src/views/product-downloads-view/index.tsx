import { ReactElement, useMemo, useState } from 'react'
import semverRSort from 'semver/functions/rsort'
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import SidecarMarketingCard from './components/sidecar-marketing-card'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import {
  getPageSubtitle,
  initializeBackToLink,
  initializeBreadcrumbLinks,
  initializeNavData,
} from './helpers'
import { ProductDownloadsViewProps } from './types'
import FeaturedTutorialsSection from './components/featured-tutorials-section'
import OfficialReleasesSection from './components/official-releases-section'
import s from './product-downloads-view.module.css'

const ProductDownloadsView = ({
  latestVersion,
  releases,
  pageContent,
}: ProductDownloadsViewProps): ReactElement => {
  const versionSwitcherOptions = useMemo(() => {
    return semverRSort(Object.keys(releases.versions)).map((version) => {
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
    selectedVersion === latestVersion
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
      {
        <>
          <label style={{ display: 'block' }}>Version (temp switcher)</label>
          <select
            onChange={(e) => setSelectedVersion(e.target.value)}
            value={selectedVersion}
          >
            {versionSwitcherOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      }
      <p>
        This content should only show when the{' '}
        <code>enable_new_downloads_view</code> flag is on
      </p>
      <OfficialReleasesSection />
      <FeaturedTutorialsSection
        featuredTutorials={pageContent.featuredTutorials}
      />
    </SidebarSidecarLayout>
  )
}

ProductDownloadsView.layout = EmptyLayout
export default ProductDownloadsView
