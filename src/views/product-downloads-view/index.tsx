import { ReactElement, useMemo, useState } from 'react'
import CodeBlock from '@hashicorp/react-code-block'
import semverRSort from 'semver/functions/rsort'
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Card from 'components/card'
import Heading from 'components/heading'
import IconTileLogo from 'components/icon-tile-logo'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import {
  getPageSubtitle,
  initializeBackToLink,
  initializeBreadcrumbLinks,
  initializeNavData,
  sortPlatforms,
  prettyOs,
} from './helpers'
import { ProductDownloadsViewProps } from './types'
import s from './product-downloads-view.module.css'

const ProductDownloadsView = ({
  latestVersion,
  pageContent,
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

  const downloadsByOS = useMemo(
    () => sortPlatforms(releases.versions[selectedVersion]),
    [releases.versions, selectedVersion]
  )
  const packageManagersByOS = useMemo(() => {
    const result = {}

    pageContent.packageManagers.forEach((packageManager) => {
      const { os } = packageManager
      if (result[os]) {
        result[os].push(packageManager)
      } else {
        result[os] = [packageManager]
      }
    })

    return result
  }, [pageContent.packageManagers])

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
      <div style={{ marginBottom: 48 }}>
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
      </div>
      <Card elevation="base">
        <Heading
          className={s.operatingSystemTitle}
          level={2}
          size={300}
          slug="operating-system"
          weight="bold"
        >
          Operating System
        </Heading>
        <Tabs showAnchorLine>
          {Object.keys(downloadsByOS).map((os) => {
            const packageManagers = packageManagersByOS[os]
            const hasOnePackageManager = packageManagers?.length === 1
            const hasManyPackageManagers = packageManagers?.length > 1

            const prettyOSName = prettyOs(os)
            return (
              <Tab heading={prettyOSName} key={os}>
                <div className={s.tabContent}>
                  {hasOnePackageManager && (
                    <>
                      <Heading
                        level={3}
                        size={200}
                        slug={`package-manager-for-${prettyOSName}`}
                        weight="semibold"
                      >
                        Package manager for {prettyOSName}
                      </Heading>
                      <CodeBlock
                        code={packageManagers[0].commands
                          .map((command) => `$ ${command}`)
                          .join('\n')}
                        options={{ showClipboard: true }}
                      />
                    </>
                  )}
                  {hasManyPackageManagers && <>{/* TODO: Tabs */}</>}
                </div>
              </Tab>
            )
          })}
        </Tabs>
      </Card>
    </SidebarSidecarLayout>
  )
}

ProductDownloadsView.layout = EmptyLayout
export default ProductDownloadsView
