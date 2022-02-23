import { ReactElement, useMemo, useState } from 'react'
import semverRSort from 'semver/functions/rsort'
import { Product } from 'types/products'
import { useCurrentProduct } from 'contexts'
import { ReleasesAPIResponse } from 'lib/fetch-release-data'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Text from 'components/text'
import s from './product-downloads-view.module.css'
import { MenuItem } from 'components/sidebar'

interface ProductDownloadsViewProps {
  latestVersion: string
  releases: ReleasesAPIResponse
}

const initializeBackToLink = (currentProduct: Product) => {
  return {
    text: `Back to ${currentProduct.name}`,
    url: `/${currentProduct.slug}`,
  }
}

const initializeBreadcrumbLinks = (
  currentProduct: Product,
  selectedVersion: string
): BreadcrumbLink[] => {
  return [
    {
      title: 'Developer',
      url: '/',
    },
    {
      title: currentProduct.name,
      url: `/${currentProduct.slug}`,
    },
    {
      isCurrentPage: true,
      title: `Install v${selectedVersion}`,
      url: `/${currentProduct.slug}/downloads/${currentProduct.slug}`,
    },
  ]
}

const initializeNavData = (currentProduct: Product): MenuItem[] => {
  return [
    ...currentProduct.sidebar.landingPageNavData,
    { divider: true },
    ...currentProduct.sidebar.resourcesNavData,
  ]
}

const getPageSubtitle = (
  currentProduct: Product,
  selectedVersion: string,
  isLatestVersion: boolean
): string => {
  const versionText = `v${selectedVersion}${
    isLatestVersion ? ' (latest version)' : ''
  }`
  return `Install or update to ${versionText} of ${currentProduct.name} to get started.`
}

const ProductDownloadsView = ({
  latestVersion,
  releases,
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
      sidecarChildren={<></>}
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
    </SidebarSidecarLayout>
  )
}

ProductDownloadsView.layout = EmptyLayout
export default ProductDownloadsView
