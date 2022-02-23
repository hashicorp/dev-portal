import { ReactElement, useMemo, useState } from 'react'
import semverRSort from 'semver/functions/rsort'
import { ReleasesAPIResponse } from 'lib/fetch-release-data'
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import SidecarMarketingCard, {
  SidecarMarketingCardProps,
} from './components/sidecar-marketing-card'

interface ProductDownloadsViewProps {
  latestVersion: string
  releases: ReleasesAPIResponse
  pageContent: {
    sidecarMarketingCard: SidecarMarketingCardProps
  }
}

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
  const currentProduct = useCurrentProduct()
  const [selectedVersion, setSelectedVersion] = useState<string>(
    versionSwitcherOptions[0].value
  )
  const backToLink = {
    text: 'Back to Waypoint',
    url: '/waypoint',
  }
  const navData = [
    ...currentProduct.sidebar.landingPageNavData,
    { divider: true },
    ...currentProduct.sidebar.resourcesNavData,
  ]

  // TODO: currently shows placeholder content for testing purposes
  return (
    <SidebarSidecarLayout
      backToLink={backToLink}
      navData={navData}
      productName="Waypoint"
      showFilterInput={false}
      sidecarChildren={
        <SidecarMarketingCard {...pageContent.sidecarMarketingCard} />
      }
    >
      <h1>Install Waypoint v{selectedVersion}</h1>
      {
        <>
          <label style={{ display: 'block' }}>Version (temp switcher)</label>
          <select onChange={(e) => setSelectedVersion(e.target.value)}>
            {versionSwitcherOptions.map((option) => (
              <option
                key={option.value}
                selected={option.value === selectedVersion}
                value={option.value}
              >
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
