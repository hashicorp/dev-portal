import { ReactElement, useMemo, useState } from 'react'
import semverRSort from 'semver/functions/rsort'
import { Product } from 'types/products'
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { ReleasesAPIResponse } from 'lib/fetch-release-data'

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
) => {
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
      title: 'Install',
    },
    {
      title: selectedVersion,
    },
  ]
}

const initializeNavData = (currentProduct: Product) => {
  return [
    ...currentProduct.sidebar.landingPageNavData,
    { divider: true },
    ...currentProduct.sidebar.resourcesNavData,
  ]
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

  // TODO: currently shows placeholder content for testing purposes
  return (
    <SidebarSidecarLayout
      backToLink={backToLink}
      breadcrumbLinks={breadcrumbLinks}
      navData={navData}
      productName="Waypoint"
      showFilterInput={false}
      sidecarChildren={<></>}
    >
      <h1>Install {currentProduct.name}</h1>
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
